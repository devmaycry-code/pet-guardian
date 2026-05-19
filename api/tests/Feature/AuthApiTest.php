<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_login_me_and_refresh(): void
    {
        $register = $this->postJson('/api/auth/register', [
            'name' => 'Pawdrinho Teste',
            'email' => 'paw@test.local',
            'password' => 'password',
        ]);

        $register->assertCreated()->assertJsonPath('title', 'Registered');

        $login = $this->postJson('/api/auth/login', [
            'email' => 'paw@test.local',
            'password' => 'password',
        ]);

        $token = $login->assertOk()->json('result.access_token');

        $this->withToken($token)->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('result.email', 'paw@test.local');

        $this->withToken($token)->postJson('/api/auth/refresh')
            ->assertOk()
            ->assertJsonPath('title', 'Token refreshed');
    }

    public function test_invalid_login_returns_validation_error(): void
    {
        $this->postJson('/api/auth/login', [
            'email' => 'missing@test.local',
            'password' => 'password',
        ])->assertStatus(422);
    }
}
