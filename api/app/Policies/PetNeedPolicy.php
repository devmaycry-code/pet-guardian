<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Pet;
use App\Models\User;

class PetNeedPolicy
{
    public function createForPet(User $user, Pet $pet): bool
    {
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        return $pet->organization?->user_id === $user->id || $pet->temporaryHome?->user_id === $user->id;
    }
}
