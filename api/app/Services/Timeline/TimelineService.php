<?php

namespace App\Services\Timeline;

use App\Models\Pet;
use App\Models\TimelinePost;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class TimelineService
{
    public function list(Pet $pet): Collection
    {
        return $pet->timelinePosts()->with('user')->latest()->get();
    }

    public function create(Pet $pet, User $user, array $data): TimelinePost
    {
        return $pet->timelinePosts()->create($data + ['user_id' => $user->id]);
    }
}
