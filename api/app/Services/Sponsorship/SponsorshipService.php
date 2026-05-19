<?php

namespace App\Services\Sponsorship;

use App\Enums\SponsorshipStatus;
use App\Enums\DonationStatus;
use App\Models\Donation;
use App\Models\Sponsorship;
use App\Models\User;
use App\Services\Payments\StripeGatewayService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class SponsorshipService
{
    public function __construct(private readonly StripeGatewayService $stripeGatewayService) {}

    public function create(User $user, array $data): Sponsorship
    {
        $targetType = isset($data['organization_id']) ? 'organization' : 'pet';
        $targetIdentifier = (string) ($data['organization_id'] ?? $data['pet_id']);

        $sponsorship = Sponsorship::updateOrCreate(
            [
                'user_id' => $user->id,
                'target_type' => $targetType,
                'target_identifier' => $targetIdentifier,
            ],
            [
                'pet_id' => $targetType === 'pet' ? (int) $targetIdentifier : null,
                'monthly_amount' => $data['monthly_amount'],
                'gateway' => null,
                'gateway_status' => null,
                'checkout_session_id' => null,
                'stripe_customer_id' => null,
                'stripe_subscription_id' => null,
                'status' => SponsorshipStatus::ACTIVE->value,
                'started_at' => now(),
                'next_billing_at' => now()->addMonth(),
                'last_billed_at' => now(),
                'paused_at' => null,
                'canceled_at' => null,
                'last_gateway_event_at' => null,
            ]
        );

        if ($sponsorship->wasRecentlyCreated) {
            $this->recordCharge($sponsorship, $user);
        }

        return $this->show($sponsorship);
    }

    public function createCheckout(User $user, array $data): array
    {
        if (! $this->stripeGatewayService->checkoutConfigured()) {
            return [
                'sponsorship' => $this->create($user, $data),
                'checkout_url' => null,
            ];
        }

        $targetType = isset($data['organization_id']) ? 'organization' : 'pet';
        $targetIdentifier = (string) ($data['organization_id'] ?? $data['pet_id']);

        $sponsorship = Sponsorship::updateOrCreate(
            [
                'user_id' => $user->id,
                'target_type' => $targetType,
                'target_identifier' => $targetIdentifier,
            ],
            [
                'pet_id' => $targetType === 'pet' ? (int) $targetIdentifier : null,
                'gateway' => 'stripe',
                'gateway_status' => 'pending_checkout',
                'monthly_amount' => $data['monthly_amount'],
                'status' => SponsorshipStatus::PENDING_CHECKOUT->value,
                'started_at' => now(),
                'next_billing_at' => null,
                'last_billed_at' => null,
                'paused_at' => null,
                'canceled_at' => null,
                'last_gateway_event_at' => now(),
            ]
        );

        try {
            $checkout = $this->stripeGatewayService->createCheckoutSession($sponsorship, $user);
        } catch (\Throwable) {
            return [
                'sponsorship' => $this->create($user, $data),
                'checkout_url' => null,
            ];
        }

        $sponsorship->forceFill([
            'gateway' => 'stripe',
            'gateway_status' => 'pending_checkout',
            'checkout_session_id' => $checkout['checkout_session_id'] ?? null,
            'last_gateway_event_at' => now(),
        ])->save();

        return [
            'sponsorship' => $this->show($sponsorship),
            'checkout_url' => $checkout['checkout_url'] ?? null,
        ];
    }

    public function my(User $user): Collection
    {
        return Sponsorship::query()
            ->where('user_id', $user->id)
            ->with(['pet.organization', 'organization', 'donations'])
            ->latest()
            ->get();
    }

    public function show(Sponsorship $sponsorship): Sponsorship
    {
        return $sponsorship->load(['pet.organization', 'organization', 'donations']);
    }

    public function pause(Sponsorship $sponsorship): Sponsorship
    {
        $sponsorship->update([
            'status' => SponsorshipStatus::PAUSED->value,
            'paused_at' => now(),
        ]);

        return $this->show($sponsorship);
    }

    public function resume(Sponsorship $sponsorship): Sponsorship
    {
        $sponsorship->update([
            'status' => SponsorshipStatus::ACTIVE->value,
            'paused_at' => null,
            'next_billing_at' => now()->addMonth(),
        ]);

        return $this->show($sponsorship);
    }

    public function cancel(Sponsorship $sponsorship): Sponsorship
    {
        $sponsorship->update([
            'status' => SponsorshipStatus::CANCELED->value,
            'gateway_status' => 'canceled',
            'canceled_at' => now(),
            'last_gateway_event_at' => now(),
        ]);

        return $this->show($sponsorship);
    }

    public function processDueCharges(): int
    {
        return $this->reconcileGatewayStates();
    }

    public function handleCheckoutCompleted(array $session): ?Sponsorship
    {
        $sponsorship = $this->findSponsorshipFromPayload($session);

        if (! $sponsorship) {
            return null;
        }

        $subscriptionId = $session['subscription'] ?? null;
        $customerId = $session['customer'] ?? null;
        $subscription = null;

        if (is_string($subscriptionId) && $subscriptionId !== '') {
            try {
                $subscription = $this->stripeGatewayService->retrieveSubscription($subscriptionId);
            } catch (\Throwable) {
                $subscription = null;
            }
        }

        $this->markSponsorshipAsActive($sponsorship, $session, $subscription, $customerId);
        $this->recordGatewayDonation($sponsorship, $session, 'card');

        return $this->show($sponsorship->refresh());
    }

    public function handleInvoicePaid(array $invoice): ?Donation
    {
        $sponsorship = $this->findSponsorshipFromPayload($invoice);

        if (! $sponsorship) {
            return null;
        }

        $subscriptionId = $invoice['subscription'] ?? null;
        $subscription = null;

        if (is_string($subscriptionId) && $subscriptionId !== '') {
            try {
                $subscription = $this->stripeGatewayService->retrieveSubscription($subscriptionId);
            } catch (\Throwable) {
                $subscription = null;
            }
        }

        $this->markSponsorshipAsActive($sponsorship, $invoice, $subscription, $invoice['customer'] ?? null);

        return $this->recordGatewayDonation($sponsorship, $invoice, 'card');
    }

    public function handleInvoiceFailed(array $invoice): ?Sponsorship
    {
        $sponsorship = $this->findSponsorshipFromPayload($invoice);

        if (! $sponsorship) {
            return null;
        }

        $sponsorship->update([
            'status' => SponsorshipStatus::PAYMENT_FAILED->value,
            'gateway_status' => 'payment_failed',
            'last_gateway_event_at' => now(),
        ]);

        return $this->show($sponsorship);
    }

    public function handleSubscriptionDeleted(array $subscription): ?Sponsorship
    {
        $sponsorship = $this->findSponsorshipFromPayload($subscription);

        if (! $sponsorship) {
            return null;
        }

        $sponsorship->update([
            'status' => SponsorshipStatus::CANCELED->value,
            'gateway_status' => 'canceled',
            'canceled_at' => now(),
            'last_gateway_event_at' => now(),
        ]);

        return $this->show($sponsorship);
    }

    public function reconcileGatewayStates(): int
    {
        if (! $this->stripeGatewayService->hasSecret()) {
            return 0;
        }

        $processed = 0;

        Sponsorship::query()
            ->whereNotNull('stripe_subscription_id')
            ->chunkById(50, function ($sponsorships) use (&$processed): void {
                foreach ($sponsorships as $sponsorship) {
                    try {
                        $subscription = $this->stripeGatewayService->retrieveSubscription((string) $sponsorship->stripe_subscription_id);
                        $this->syncFromSubscription($sponsorship, $subscription);
                        $processed++;
                    } catch (\Throwable) {
                        continue;
                    }
                }
            });

        return $processed;
    }

    private function recordCharge(Sponsorship $sponsorship, User $user): Donation
    {
        return Donation::create([
            'user_id' => $user->id,
            'pet_id' => $sponsorship->target_type === 'pet' ? $sponsorship->pet_id : null,
            'sponsorship_id' => $sponsorship->id,
            'target_type' => $sponsorship->target_type,
            'target_identifier' => $sponsorship->target_identifier,
            'amount' => $sponsorship->monthly_amount,
            'payment_method' => 'card',
            'status' => DonationStatus::PAID->value,
            'external_id' => 'card_'.Str::uuid(),
        ]);
    }

    private function recordGatewayDonation(Sponsorship $sponsorship, array $payload, string $paymentMethod): Donation
    {
        $externalId = (string) (
            $payload['payment_intent']
            ?? $payload['id']
            ?? Str::uuid()
        );

        return Donation::firstOrCreate(
            [
                'external_id' => $externalId,
            ],
            [
                'user_id' => $sponsorship->user_id,
                'pet_id' => $sponsorship->target_type === 'pet' ? $sponsorship->pet_id : null,
                'sponsorship_id' => $sponsorship->id,
                'target_type' => $sponsorship->target_type,
                'target_identifier' => $sponsorship->target_identifier,
                'amount' => $sponsorship->monthly_amount,
                'payment_method' => $paymentMethod,
                'status' => DonationStatus::PAID->value,
                'gateway_event_id' => $payload['id'] ?? null,
            ]
        );
    }

    private function markSponsorshipAsActive(
        Sponsorship $sponsorship,
        array $payload,
        ?array $subscription,
        mixed $customerId
    ): void {
        $nextBillingAt = now()->addMonth();

        if (is_array($subscription) && isset($subscription['current_period_end'])) {
            $nextBillingAt = Carbon::createFromTimestamp((int) $subscription['current_period_end']);
        }

        $sponsorship->update([
            'status' => SponsorshipStatus::ACTIVE->value,
            'gateway_status' => 'active',
            'checkout_session_id' => $payload['id'] ?? $sponsorship->checkout_session_id,
            'stripe_customer_id' => is_scalar($customerId) ? (string) $customerId : $sponsorship->stripe_customer_id,
            'stripe_subscription_id' => is_string($payload['subscription'] ?? null)
                ? $payload['subscription']
                : $sponsorship->stripe_subscription_id,
            'started_at' => $sponsorship->started_at ?? now(),
            'next_billing_at' => $nextBillingAt,
            'last_billed_at' => now(),
            'paused_at' => null,
            'canceled_at' => null,
            'last_gateway_event_at' => now(),
        ]);
    }

    private function syncFromSubscription(Sponsorship $sponsorship, array $subscription): void
    {
        $status = $subscription['status'] ?? 'active';

        if ($status === 'canceled' || $status === 'incomplete_expired') {
            $sponsorship->update([
                'status' => SponsorshipStatus::CANCELED->value,
                'gateway_status' => 'canceled',
                'canceled_at' => now(),
                'last_gateway_event_at' => now(),
            ]);

            return;
        }

        if ($status === 'past_due' || $status === 'unpaid') {
            $sponsorship->update([
                'status' => SponsorshipStatus::PAYMENT_FAILED->value,
                'gateway_status' => 'payment_failed',
                'last_gateway_event_at' => now(),
            ]);

            return;
        }

        $nextBillingAt = isset($subscription['current_period_end'])
            ? Carbon::createFromTimestamp((int) $subscription['current_period_end'])
            : now()->addMonth();

        $sponsorship->update([
            'status' => SponsorshipStatus::ACTIVE->value,
            'gateway_status' => 'active',
            'next_billing_at' => $nextBillingAt,
            'last_gateway_event_at' => now(),
        ]);
    }

    private function findSponsorshipFromPayload(array $payload): ?Sponsorship
    {
        $sponsorshipId = $payload['metadata']['sponsorship_id']
            ?? $payload['subscription_data']['metadata']['sponsorship_id']
            ?? null;

        if (is_numeric($sponsorshipId)) {
            return Sponsorship::query()->find((int) $sponsorshipId);
        }

        $subscriptionId = $payload['subscription']
            ?? $payload['id']
            ?? null;

        if (is_string($subscriptionId) && $subscriptionId !== '') {
            return Sponsorship::query()
                ->where('stripe_subscription_id', $subscriptionId)
                ->orWhere('checkout_session_id', $subscriptionId)
                ->first();
        }

        return null;
    }
}
