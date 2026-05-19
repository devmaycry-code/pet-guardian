<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemporaryHome extends Model
{
    protected $fillable = ['user_id', 'description', 'capacity', 'available_slots', 'city', 'state', 'verified', 'trust_score'];

    protected function casts(): array
    {
        return ['verified' => 'boolean'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
