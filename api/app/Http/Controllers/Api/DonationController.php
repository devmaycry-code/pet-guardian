<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Services\Donation\DonationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DonationService $donationService) {}

    public function store(StoreDonationRequest $request): JsonResponse
    {
        return $this->success(new DonationResource($this->donationService->create($request->user('api'), $request->validated())), 201, 'Donation created');
    }

    public function simulate(StoreDonationRequest $request): JsonResponse
    {
        return $this->success(new DonationResource($this->donationService->simulate($request->user('api'), $request->validated())), 201, 'Donation simulated');
    }

    public function my(Request $request): JsonResponse
    {
        return $this->success(DonationResource::collection($this->donationService->my($request->user('api'))));
    }
}
