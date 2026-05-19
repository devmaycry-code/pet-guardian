<?php

namespace App\Services\Pet;

use App\Models\Pet;
use App\Models\PetNeed;
use Illuminate\Database\Eloquent\Collection;

class NeedService
{
    public function list(Pet $pet): Collection
    {
        return $pet->needs()->latest()->get();
    }

    public function create(Pet $pet, array $data): PetNeed
    {
        return $pet->needs()->create($data);
    }
}
