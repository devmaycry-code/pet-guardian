<?php

namespace App\Services\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? UserRole::USER->value,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
        ]);

        return $this->tokenPayload(Auth::guard('api')->login($user));
    }

    public function login(array $credentials): array
    {
        $token = Auth::guard('api')->attempt($credentials);

        if (! $token) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais invalidas.'],
            ]);
        }

        return $this->tokenPayload($token);
    }

    public function refresh(): array
    {
        return $this->tokenPayload(Auth::guard('api')->refresh());
    }

    public function logout(): void
    {
        Auth::guard('api')->logout();
    }

    private function tokenPayload(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'refresh_ttl' => config('jwt.refresh_ttl') * 60,
            'user' => Auth::guard('api')->user(),
        ];
    }
}
