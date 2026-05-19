<?php

namespace App\Services\Sponsorship;

use App\Enums\SponsorshipStatus;
use App\Enums\DonationStatus;
use App\Models\Donation;
use App\Models\Sponsorship;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class SponsorshipService
{
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
                'status' => SponsorshipStatus::ACTIVE->value,
                'started_at' => now(),
                'next_billing_at' => now()->addMonth(),
                'last_billed_at' => now(),
                'paused_at' => null,
                'canceled_at' => null,
            ]
        );

        if ($sponsorship->wasRecentlyCreated) {
            $this->recordCharge($sponsorship, $user);
        }

        return $this->show($sponsorship);
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
            'canceled_at' => now(),
        ]);

        return $this->show($sponsorship);
    }

    public function processDueCharges(): int
    {
        $processed = 0;

        Sponsorship::query()
            ->where('status', SponsorshipStatus::ACTIVE->value)
            ->whereNotNull('next_billing_at')
            ->where('next_billing_at', '<=', now())
            ->chunkById(50, function ($sponsorships) use (&$processed): void {
                foreach ($sponsorships as $sponsorship) {
                    $this->recordCharge($sponsorship, $sponsorship->user);
                    $sponsorship->update([
                        'last_billed_at' => now(),
                        'next_billing_at' => now()->addMonth(),
                    ]);
                    $processed++;
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
}
