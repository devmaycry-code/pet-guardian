<?php

namespace App\Models;

use App\Enums\NeedStatus;
use App\Enums\UrgencyLevel;
use Illuminate\Database\Eloquent\Model;

class PetNeed extends Model
{
    protected $fillable = ['pet_id', 'title', 'description', 'type', 'goal_amount', 'current_amount', 'urgency_level', 'status', 'proof_required'];

    protected function casts(): array
    {
        return [
            'goal_amount' => 'decimal:2',
            'current_amount' => 'decimal:2',
            'urgency_level' => UrgencyLevel::class,
            'status' => NeedStatus::class,
            'proof_required' => 'boolean',
        ];
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }
}
