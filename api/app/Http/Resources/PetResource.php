<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'temporary_home_id' => $this->temporary_home_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'species' => $this->species,
            'gender' => $this->gender,
            'age' => $this->age,
            'size' => $this->size,
            'status' => $this->status?->value ?? $this->status,
            'urgency_level' => $this->urgency_level?->value ?? $this->urgency_level,
            'story' => $this->story,
            'rescue_story' => $this->rescue_story,
            'avatar' => $this->avatar,
            'city' => $this->city,
            'state' => $this->state,
            'verified' => $this->verified,
            'followers_count' => $this->followers_count,
            'sponsorships_count' => $this->sponsorships_count,
            'organization' => new OrganizationResource($this->whenLoaded('organization')),
            'temporary_home' => $this->whenLoaded('temporaryHome'),
            'needs' => PetNeedResource::collection($this->whenLoaded('needs')),
            'timeline' => TimelinePostResource::collection($this->whenLoaded('timelinePosts')),
            'letters' => PetLetterResource::collection($this->whenLoaded('letters')),
        ];
    }
}
