<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupportFlowsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_and_list_sponsorships(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $organizationOwner = User::factory()->create(['role' => UserRole::ONG]);
        $organization = Organization::create([
            'user_id' => $organizationOwner->id,
            'name' => 'ONG Teste',
            'slug' => 'ong-teste',
            'description' => 'Teste',
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified' => true,
        ]);

        $pet = Pet::create([
            'organization_id' => $organization->id,
            'name' => 'Luna',
            'slug' => 'luna',
            'species' => 'dog',
            'gender' => 'female',
            'age' => '2 anos',
            'size' => 'medium',
            'story' => 'Historia da Luna',
            'city' => 'Curitiba',
            'state' => 'PR',
        ]);

        $this->actingAs($user, 'api')
            ->postJson('/api/sponsorships', [
                'pet_id' => $pet->id,
                'monthly_amount' => 75.50,
            ])
            ->assertCreated()
            ->assertJsonPath('title', 'Sponsorship created')
            ->assertJsonPath('result.user_id', $user->id)
            ->assertJsonPath('result.target_type', 'pet')
            ->assertJsonPath('result.target_identifier', (string) $pet->id)
            ->assertJsonPath('result.pet_id', $pet->id)
            ->assertJsonPath('result.status', 'ACTIVE');

        $this->actingAs($user, 'api')
            ->getJson('/api/sponsorships/my')
            ->assertOk()
            ->assertJsonPath('result.0.pet_id', $pet->id)
            ->assertJsonPath('result.0.donations.0.status', 'PAID');
    }

    public function test_authenticated_user_can_support_an_organization(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $organizationOwner = User::factory()->create(['role' => UserRole::ONG]);
        $organization = Organization::create([
            'user_id' => $organizationOwner->id,
            'name' => 'ONG Teste',
            'slug' => 'ong-teste',
            'description' => 'Teste',
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified' => true,
        ]);

        $this->actingAs($user, 'api')
            ->postJson('/api/sponsorships', [
                'organization_id' => $organization->id,
                'monthly_amount' => 35.00,
            ])
            ->assertCreated()
            ->assertJsonPath('result.target_type', 'organization')
            ->assertJsonPath('result.target_identifier', (string) $organization->id)
            ->assertJsonPath('result.organization.id', $organization->id)
            ->assertJsonPath('result.pet_id', null);
    }

    public function test_authenticated_user_can_pause_resume_and_cancel_sponsorships(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $organizationOwner = User::factory()->create(['role' => UserRole::ONG]);
        $organization = Organization::create([
            'user_id' => $organizationOwner->id,
            'name' => 'ONG Teste',
            'slug' => 'ong-teste',
            'description' => 'Teste',
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified' => true,
        ]);

        $pet = Pet::create([
            'organization_id' => $organization->id,
            'name' => 'Luna',
            'slug' => 'luna',
            'species' => 'dog',
            'gender' => 'female',
            'age' => '2 anos',
            'size' => 'medium',
            'story' => 'Historia da Luna',
            'city' => 'Curitiba',
            'state' => 'PR',
        ]);

        $sponsorship = $this->actingAs($user, 'api')
            ->postJson('/api/sponsorships', [
                'pet_id' => $pet->id,
                'monthly_amount' => 75.50,
            ])
            ->json('result.id');

        $this->actingAs($user, 'api')
            ->patchJson("/api/sponsorships/{$sponsorship}/pause")
            ->assertOk()
            ->assertJsonPath('result.status', 'PAUSED');

        $this->actingAs($user, 'api')
            ->patchJson("/api/sponsorships/{$sponsorship}/resume")
            ->assertOk()
            ->assertJsonPath('result.status', 'ACTIVE');

        $this->actingAs($user, 'api')
            ->patchJson("/api/sponsorships/{$sponsorship}/cancel")
            ->assertOk()
            ->assertJsonPath('result.status', 'CANCELED');
    }

    public function test_authenticated_user_can_create_and_list_donations(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $organizationOwner = User::factory()->create(['role' => UserRole::ONG]);
        $organization = Organization::create([
            'user_id' => $organizationOwner->id,
            'name' => 'ONG Teste',
            'slug' => 'ong-teste',
            'description' => 'Teste',
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified' => true,
        ]);

        $pet = Pet::create([
            'organization_id' => $organization->id,
            'name' => 'Thor',
            'slug' => 'thor',
            'species' => 'dog',
            'gender' => 'male',
            'age' => '4 anos',
            'size' => 'large',
            'story' => 'Historia do Thor',
            'city' => 'Curitiba',
            'state' => 'PR',
        ]);

        $this->actingAs($user, 'api')
            ->postJson('/api/donations', [
                'pet_id' => $pet->id,
                'amount' => 120.00,
                'payment_method' => 'pix',
            ])
            ->assertCreated()
            ->assertJsonPath('title', 'Donation created')
            ->assertJsonPath('result.user_id', $user->id)
            ->assertJsonPath('result.pet_id', $pet->id)
            ->assertJsonPath('result.status', 'PENDING');

        $this->actingAs($user, 'api')
            ->getJson('/api/donations/my')
            ->assertOk()
            ->assertJsonPath('result.0.pet_id', $pet->id);
    }
}
