<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'cnpj',
        'phone',
        'email',
        'website',
        'city',
        'state',
        'verified',
        'trust_score',
        'transparency_score',
    ];

    protected function casts(): array
    {
        return ['verified' => 'boolean'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pets()
    {
        return $this->hasMany(Pet::class);
    }
}
