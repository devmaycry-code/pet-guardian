<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Need\StorePetNeedRequest;
use App\Http\Resources\PetNeedResource;
use App\Models\Pet;
use App\Services\Pet\NeedService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class NeedController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly NeedService $needService) {}

    public function index(Pet $pet): JsonResponse
    {
        return $this->success(PetNeedResource::collection($this->needService->list($pet)));
    }

    public function store(StorePetNeedRequest $request, Pet $pet): JsonResponse
    {
        return $this->success(new PetNeedResource($this->needService->create($pet, $request->validated())), 201, 'Need created');
    }
}
