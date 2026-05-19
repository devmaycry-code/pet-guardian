<?php

namespace App\Services\Transparency;

use App\Models\Pet;
use App\Models\TransparencyRecord;
use Illuminate\Database\Eloquent\Collection;

class TransparencyService
{
    public function list(): Collection
    {
        return TransparencyRecord::query()->with('petNeed')->latest()->get();
    }

    public function byPet(Pet $pet): Collection
    {
        $needIds = $pet->needs()->pluck('id');

        return TransparencyRecord::query()
            ->with('petNeed')
            ->whereIn('pet_need_id', $needIds)
            ->latest()
            ->get();
    }
}
