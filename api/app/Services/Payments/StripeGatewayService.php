<?php

namespace App\Services\Payments;

use App\Models\Sponsorship;
use App\Models\User;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;

class StripeGatewayService
{
    public function hasSecret(): bool
    {
        return filled(config('services.stripe.secret'));
    }

    public function checkoutConfigured(): bool
    {
        return $this->hasSecret()
            && filled(config('services.stripe.checkout_success_url'))
            && filled(config('services.stripe.checkout_cancel_url'));
    }

    public function webhookConfigured(): bool
    {
        return $this->hasSecret()
            && filled(config('services.stripe.webhook_secret'));
    }

    public function createCheckoutSession(Sponsorship $sponsorship, User $user): array
    {
        if (! $this->checkoutConfigured()) {
            throw new RuntimeException('Stripe is not configured.');
        }

        $sponsorship->loadMissing(['pet.organization', 'organization']);

        $response = $this->request()->post('https://api.stripe.com/v1/checkout/sessions', [
            'mode' => 'subscription',
            'customer_email' => $user->email,
            'success_url' => config('services.stripe.checkout_success_url'),
            'cancel_url' => config('services.stripe.checkout_cancel_url'),
            'client_reference_id' => (string) $sponsorship->id,
            'line_items[0][price_data][currency]' => config('services.stripe.currency', 'brl'),
            'line_items[0][price_data][unit_amount]' => (int) round(((float) $sponsorship->monthly_amount) * 100),
            'line_items[0][price_data][product_data][name]' => $this->buildProductName($sponsorship),
            'line_items[0][price_data][recurring][interval]' => 'month',
            'metadata[sponsorship_id]' => (string) $sponsorship->id,
            'metadata[target_type]' => (string) $sponsorship->target_type,
            'metadata[target_identifier]' => (string) $sponsorship->target_identifier,
            'subscription_data[metadata][sponsorship_id]' => (string) $sponsorship->id,
            'subscription_data[metadata][target_type]' => (string) $sponsorship->target_type,
            'subscription_data[metadata][target_identifier]' => (string) $sponsorship->target_identifier,
        ]);

        $data = $this->decoded($response);

        return [
            'checkout_session_id' => $data['id'] ?? null,
            'checkout_url' => $data['url'] ?? null,
            'raw' => $data,
        ];
    }

    public function retrieveSubscription(string $subscriptionId): array
    {
        if (! $this->hasSecret()) {
            throw new RuntimeException('Stripe is not configured.');
        }

        $response = $this->request()->get("https://api.stripe.com/v1/subscriptions/{$subscriptionId}");

        return $this->decoded($response);
    }

    public function verifyWebhookSignature(string $payload, ?string $signatureHeader): array
    {
        if (! $this->webhookConfigured()) {
            throw new RuntimeException('Stripe is not configured.');
        }

        if (! is_string($signatureHeader) || $signatureHeader === '') {
            throw new InvalidArgumentException('Missing Stripe signature header.');
        }

        $timestamp = null;
        $signature = null;

        foreach (explode(',', $signatureHeader) as $part) {
            [$key, $value] = array_pad(explode('=', trim($part), 2), 2, null);

            if ($key === 't') {
                $timestamp = $value;
            }

            if ($key === 'v1') {
                $signature = $value;
            }
        }

        if (! is_string($timestamp) || ! is_string($signature)) {
            throw new InvalidArgumentException('Invalid Stripe signature header.');
        }

        $expected = hash_hmac('sha256', $timestamp.'.'.$payload, (string) config('services.stripe.webhook_secret'));

        if (! hash_equals($expected, $signature)) {
            throw new InvalidArgumentException('Invalid Stripe signature.');
        }

        $decoded = json_decode($payload, true, flags: JSON_THROW_ON_ERROR);

        if (! is_array($decoded)) {
            throw new InvalidArgumentException('Invalid Stripe webhook payload.');
        }

        return $decoded;
    }

    private function request()
    {
        return Http::withToken((string) config('services.stripe.secret'))
            ->asForm()
            ->acceptJson();
    }

    private function decoded(Response $response): array
    {
        $response->throw();

        $data = $response->json();

        if (! is_array($data)) {
            throw new RuntimeException('Invalid Stripe response.');
        }

        return $data;
    }

    private function buildProductName(Sponsorship $sponsorship): string
    {
        if ($sponsorship->target_type === 'organization') {
            return sprintf('Apoio recorrente para ONG #%s', $sponsorship->target_identifier);
        }

        $petName = $sponsorship->pet?->name;

        if (is_string($petName) && $petName !== '') {
            return sprintf('Apoio recorrente para %s', $petName);
        }

        return sprintf('Apoio recorrente para pet #%s', $sponsorship->target_identifier);
    }
}
