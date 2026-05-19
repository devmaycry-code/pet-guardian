<?php

namespace App\Services\Pet;

use App\Models\Pet;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PetService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        return Pet::query()
            ->with(['organization', 'needs', 'letters'])
            ->withCount(['followers', 'sponsorships'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['urgency_level'] ?? null, fn ($query, $urgency) => $query->where('urgency_level', $urgency))
            ->latest()
            ->paginate($filters['per_page'] ?? 12);
    }

    public function show(Pet $pet): Pet
    {
        return $pet->load(['organization', 'temporaryHome', 'needs', 'timelinePosts', 'letters'])
            ->loadCount(['followers', 'sponsorships']);
    }

    public function create(array $data): Pet
    {
        return Pet::create($data)->load('organization')->loadCount(['followers', 'sponsorships']);
    }

    public function update(Pet $pet, array $data): Pet
    {
        $pet->update($data);

        return $this->show($pet);
    }

    public function delete(Pet $pet): void
    {
        if ($pet->memorial_at) {
            return;
        }

        $pet->delete();
    }
}
