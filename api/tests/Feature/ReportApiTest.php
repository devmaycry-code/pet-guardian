<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_report(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);

        $this->actingAs($user, 'api')->postJson('/api/reports', [
            'target_type' => 'pet',
            'target_id' => 1,
            'reason' => 'Suspeita de fraude',
            'description' => 'Descricao objetiva da denuncia.',
        ])->assertCreated()->assertJsonPath('result.status', 'OPEN');
    }

    public function test_authenticated_user_can_list_their_reports(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);

        $this->actingAs($user, 'api')->postJson('/api/reports', [
            'target_type' => 'pet',
            'target_id' => 1,
            'reason' => 'Suspeita de fraude',
            'description' => 'Descricao objetiva da denuncia.',
        ])->assertCreated();

        $this->actingAs($user, 'api')
            ->getJson('/api/reports/my')
            ->assertOk()
            ->assertJsonPath('result.0.reason', 'Suspeita de fraude')
            ->assertJsonPath('result.0.status', 'OPEN');
    }
}
