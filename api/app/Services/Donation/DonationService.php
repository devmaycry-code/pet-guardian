<?php

namespace App\Services\Donation;

use App\Enums\DonationStatus;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class DonationService
{
    public function create(User $user, array $data): Donation
    {
        return Donation::create($data + [
            'user_id' => $user->id,
            'target_type' => 'pet',
            'target_identifier' => (string) $data['pet_id'],
            'pet_id' => $data['pet_id'],
            'status' => DonationStatus::PENDING->value,
        ]);
    }

    public function simulate(User $user, array $data): Donation
    {
        abort_unless($this->simulationEnabled(), 403, 'Payment simulation is disabled.');

        return Donation::create($data + [
            'user_id' => $user->id,
            'target_type' => 'pet',
            'target_identifier' => (string) $data['pet_id'],
            'pet_id' => $data['pet_id'],
            'payment_method' => 'simulation_card',
            'status' => DonationStatus::PAID->value,
            'external_id' => 'sim_'.Str::uuid(),
            'gateway_event_id' => 'sim_evt_'.Str::uuid(),
        ]);
    }

    public function my(User $user): Collection
    {
        return Donation::query()->where('user_id', $user->id)->latest()->get();
    }

    public function simulationEnabled(): bool
    {
        return (bool) config('services.payments.simulation_enabled')
            && app()->environment(['local', 'development', 'testing']);
    }
}
