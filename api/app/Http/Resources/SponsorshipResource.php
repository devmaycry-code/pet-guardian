<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SponsorshipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'pet_id' => $this->pet_id,
            'target_type' => $this->target_type,
            'target_identifier' => $this->target_identifier,
            'monthly_amount' => $this->monthly_amount,
            'status' => $this->status?->value ?? $this->status,
            'gateway' => $this->gateway,
            'gateway_status' => $this->gateway_status,
            'checkout_session_id' => $this->checkout_session_id,
            'stripe_customer_id' => $this->stripe_customer_id,
            'stripe_subscription_id' => $this->stripe_subscription_id,
            'started_at' => $this->started_at,
            'next_billing_at' => $this->next_billing_at,
            'last_billed_at' => $this->last_billed_at,
            'paused_at' => $this->paused_at,
            'canceled_at' => $this->canceled_at,
            'last_gateway_event_at' => $this->last_gateway_event_at,
            'pet' => new PetResource($this->whenLoaded('pet')),
            'organization' => new OrganizationResource($this->whenLoaded('organization')),
            'donations' => DonationResource::collection($this->whenLoaded('donations')),
        ];
    }
}
