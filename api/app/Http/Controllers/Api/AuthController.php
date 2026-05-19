<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $payload = $this->authService->register($request->validated());
        $payload['user'] = new UserResource($payload['user']);

        return $this->success($payload, 201, 'Registered');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $payload = $this->authService->login($request->validated());
        $payload['user'] = new UserResource($payload['user']);

        return $this->success($payload);
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user('api')));
    }

    public function refresh(): JsonResponse
    {
        $payload = $this->authService->refresh();
        $payload['user'] = new UserResource($payload['user']);

        return $this->success($payload, 200, 'Token refreshed');
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return $this->success(null, 200, 'Logged out');
    }
}
