<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PetLetterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pet_id' => $this->pet_id,
            'title' => $this->title,
            'content' => $this->content,
            'generated_by_ai' => $this->generated_by_ai,
            'created_at' => $this->created_at,
        ];
    }
}
