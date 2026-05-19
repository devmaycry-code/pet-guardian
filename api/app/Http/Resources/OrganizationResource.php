<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'city' => $this->city,
            'state' => $this->state,
            'verified' => $this->verified,
            'trust_score' => $this->trust_score,
            'transparency_score' => $this->transparency_score,
            'pets_count' => $this->pets_count,
            'pets' => PetResource::collection($this->whenLoaded('pets')),
        ];
    }
}
