<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PetVideo extends Model
{
    protected $fillable = ['pet_id', 'path', 'verified'];

    protected function casts(): array
    {
        return ['verified' => 'boolean'];
    }
}
