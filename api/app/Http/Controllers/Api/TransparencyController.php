<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransparencyRecordResource;
use App\Models\Pet;
use App\Services\Transparency\TransparencyService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class TransparencyController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly TransparencyService $transparencyService) {}

    public function index(): JsonResponse
    {
        return $this->success(TransparencyRecordResource::collection($this->transparencyService->list()));
    }

    public function byPet(Pet $pet): JsonResponse
    {
        return $this->success(TransparencyRecordResource::collection($this->transparencyService->byPet($pet)));
    }
}
