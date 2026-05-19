<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PetImage extends Model
{
    protected $fillable = ['pet_id', 'path', 'is_main'];

    protected function casts(): array
    {
        return ['is_main' => 'boolean'];
    }
}
