<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Timeline\StoreTimelinePostRequest;
use App\Http\Resources\TimelinePostResource;
use App\Models\Pet;
use App\Services\Timeline\TimelineService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class TimelineController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly TimelineService $timelineService) {}

    public function index(Pet $pet): JsonResponse
    {
        return $this->success(TimelinePostResource::collection($this->timelineService->list($pet)));
    }

    public function store(StoreTimelinePostRequest $request, Pet $pet): JsonResponse
    {
        return $this->success(
            new TimelinePostResource($this->timelineService->create($pet, $request->user('api'), $request->validated())),
            201,
            'Timeline post created'
        );
    }
}
