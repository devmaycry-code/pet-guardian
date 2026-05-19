<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransparencyRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'pet_need_id' => $this->pet_need_id,
            'pet_id' => $this->petNeed?->pet_id,
            'title' => $this->title,
            'description' => $this->description,
            'amount' => $this->amount,
            'proof_file' => $this->proof_file,
            'created_at' => $this->created_at,
        ];
    }
}
