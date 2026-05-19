<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Pet;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PetFollowController extends Controller
{
    use ApiResponse;

    public function store(Request $request, Pet $pet): JsonResponse
    {
        $user = $request->user('api');
        $user->followedPets()->syncWithoutDetaching([$pet->id]);
        $user->loadMissing(['organization', 'temporaryHome']);

        return $this->success(new UserResource($user), 200, 'Pet followed');
    }

    public function destroy(Request $request, Pet $pet): JsonResponse
    {
        $user = $request->user('api');
        $user->followedPets()->detach($pet->id);
        $user->loadMissing(['organization', 'temporaryHome']);

        return $this->success(new UserResource($user), 200, 'Pet unfollowed');
    }
}
