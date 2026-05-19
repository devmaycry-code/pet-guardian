<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PetNeedResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pet_id' => $this->pet_id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'goal_amount' => $this->goal_amount,
            'current_amount' => $this->current_amount,
            'urgency_level' => $this->urgency_level?->value ?? $this->urgency_level,
            'status' => $this->status?->value ?? $this->status,
            'proof_required' => $this->proof_required,
        ];
    }
}
