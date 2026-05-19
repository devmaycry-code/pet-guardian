<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimelinePost extends Model
{
    protected $fillable = ['pet_id', 'user_id', 'title', 'content', 'type', 'image'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
