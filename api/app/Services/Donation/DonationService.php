<?php

namespace App\Services\Donation;

use App\Enums\DonationStatus;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

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

    public function my(User $user): Collection
    {
        return Donation::query()->where('user_id', $user->id)->latest()->get();
    }
}
