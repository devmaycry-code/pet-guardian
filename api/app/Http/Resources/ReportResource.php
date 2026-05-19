<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reporter_user_id' => $this->reporter_user_id,
            'target_type' => $this->target_type,
            'target_id' => $this->target_id,
            'reason' => $this->reason,
            'description' => $this->description,
            'status' => $this->status?->value ?? $this->status,
            'resolved_at' => $this->resolved_at,
        ];
    }
}
