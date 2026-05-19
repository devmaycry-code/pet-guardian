<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PetLetter extends Model
{
    protected $fillable = ['pet_id', 'title', 'content', 'generated_by_ai'];

    protected function casts(): array
    {
        return ['generated_by_ai' => 'boolean'];
    }
}
