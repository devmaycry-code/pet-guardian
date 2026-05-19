<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'pet_id' => $this->pet_id,
            'pet_need_id' => $this->pet_need_id,
            'sponsorship_id' => $this->sponsorship_id,
            'target_type' => $this->target_type,
            'target_identifier' => $this->target_identifier,
            'amount' => $this->amount,
            'payment_method' => $this->payment_method,
            'status' => $this->status?->value ?? $this->status,
            'external_id' => $this->external_id,
            'created_at' => $this->created_at,
            'pet' => new PetResource($this->whenLoaded('pet')),
            'organization' => new OrganizationResource($this->whenLoaded('organization')),
        ];
    }
}
