<?php

namespace App\Services\Organization;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Collection;

class OrganizationService
{
    public function list(): Collection
    {
        return Organization::query()->latest()->get();
    }

    public function show(Organization $organization): Organization
    {
        return $organization->load(['pets.organization', 'user'])->loadCount('pets');
    }
}
