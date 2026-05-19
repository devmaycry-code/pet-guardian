<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimelinePostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pet_id' => $this->pet_id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'content' => $this->content,
            'type' => $this->type,
            'image' => $this->image,
            'created_at' => $this->created_at,
        ];
    }
}
