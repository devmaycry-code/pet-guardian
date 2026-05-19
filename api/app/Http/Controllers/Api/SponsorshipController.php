<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sponsorship\StoreSponsorshipRequest;
use App\Http\Resources\SponsorshipResource;
use App\Models\Sponsorship;
use App\Services\Sponsorship\SponsorshipService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SponsorshipController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly SponsorshipService $sponsorshipService) {}

    public function store(StoreSponsorshipRequest $request): JsonResponse
    {
        return $this->success(new SponsorshipResource($this->sponsorshipService->create($request->user('api'), $request->validated())), 201, 'Sponsorship created');
    }

    public function checkout(StoreSponsorshipRequest $request): JsonResponse
    {
        $result = $this->sponsorshipService->createCheckout($request->user('api'), $request->validated());

        return $this->success([
            'sponsorship' => new SponsorshipResource($result['sponsorship']),
            'checkout_url' => $result['checkout_url'],
        ], 201, 'Checkout session created');
    }

    public function my(Request $request): JsonResponse
    {
        return $this->success(SponsorshipResource::collection($this->sponsorshipService->my($request->user('api'))));
    }

    public function pause(Request $request, Sponsorship $sponsorship): JsonResponse
    {
        $this->authorizeSupportOwner($request, $sponsorship);

        return $this->success(new SponsorshipResource($this->sponsorshipService->pause($sponsorship)));
    }

    public function resume(Request $request, Sponsorship $sponsorship): JsonResponse
    {
        $this->authorizeSupportOwner($request, $sponsorship);

        return $this->success(new SponsorshipResource($this->sponsorshipService->resume($sponsorship)));
    }

    public function cancel(Request $request, Sponsorship $sponsorship): JsonResponse
    {
        $this->authorizeSupportOwner($request, $sponsorship);

        return $this->success(new SponsorshipResource($this->sponsorshipService->cancel($sponsorship)));
    }

    private function authorizeSupportOwner(Request $request, Sponsorship $sponsorship): void
    {
        abort_unless($request->user('api')?->id === $sponsorship->user_id, 403);
    }
}
