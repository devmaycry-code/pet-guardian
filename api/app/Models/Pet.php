<?php

namespace App\Models;

use App\Enums\PetStatus;
use App\Enums\UrgencyLevel;
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $fillable = [
        'organization_id',
        'temporary_home_id',
        'name',
        'slug',
        'species',
        'gender',
        'age',
        'size',
        'status',
        'urgency_level',
        'story',
        'rescue_story',
        'avatar',
        'city',
        'state',
        'adopted_at',
        'memorial_at',
        'verified',
    ];

    protected function casts(): array
    {
        return [
            'status' => PetStatus::class,
            'urgency_level' => UrgencyLevel::class,
            'adopted_at' => 'datetime',
            'memorial_at' => 'datetime',
            'verified' => 'boolean',
        ];
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function temporaryHome()
    {
        return $this->belongsTo(TemporaryHome::class);
    }

    public function needs()
    {
        return $this->hasMany(PetNeed::class);
    }

    public function timelinePosts()
    {
        return $this->hasMany(TimelinePost::class);
    }

    public function letters()
    {
        return $this->hasMany(PetLetter::class);
    }

    public function sponsorships()
    {
        return $this->hasMany(Sponsorship::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'pet_follows')->withTimestamps();
    }
}
