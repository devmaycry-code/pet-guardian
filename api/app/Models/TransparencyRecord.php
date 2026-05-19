<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransparencyRecord extends Model
{
    protected $fillable = ['organization_id', 'pet_need_id', 'title', 'description', 'amount', 'proof_file'];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2'];
    }

    public function petNeed()
    {
        return $this->belongsTo(PetNeed::class);
    }
}
