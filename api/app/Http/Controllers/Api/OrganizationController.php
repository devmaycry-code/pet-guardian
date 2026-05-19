<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Services\Organization\OrganizationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class OrganizationController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly OrganizationService $organizationService) {}

    public function index(): JsonResponse
    {
        return $this->success(OrganizationResource::collection($this->organizationService->list()));
    }

    public function show(Organization $organization): JsonResponse
    {
        return $this->success(new OrganizationResource($this->organizationService->show($organization)));
    }
}
