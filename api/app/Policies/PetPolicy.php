<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Pet;
use App\Models\User;

class PetPolicy
{
    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::ONG, UserRole::TEMPORARY_HOME], true);
    }

    public function update(User $user, Pet $pet): bool
    {
        if ($user->role === UserRole::ADMIN) {
            return true;
        }

        return $pet->organization?->user_id === $user->id || $pet->temporaryHome?->user_id === $user->id;
    }

    public function delete(User $user, Pet $pet): bool
    {
        return $this->update($user, $pet);
    }
}
