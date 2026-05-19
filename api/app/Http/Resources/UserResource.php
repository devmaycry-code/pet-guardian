<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role?->value ?? $this->role,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'city' => $this->city,
            'state' => $this->state,
            'verified_at' => $this->verified_at,
            'trust_score' => $this->trust_score,
            'organization_id' => $this->organization?->id,
            'temporary_home_id' => $this->temporaryHome?->id,
            'followed_pet_ids' => $this->followedPets()->pluck('pet_follows.pet_id')->map(fn ($id) => (string) $id)->values(),
            'sponsored_pet_ids' => $this->sponsorships()->pluck('pet_id')->map(fn ($id) => (string) $id)->values(),
        ];
    }
}
