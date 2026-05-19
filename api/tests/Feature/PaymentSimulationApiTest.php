<?php

namespace Tests\Feature;

use App\Enums\DonationStatus;
use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentSimulationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_runtime_endpoint_exposes_payment_simulation_flag(): void
    {
        config()->set('services.payments.simulation_enabled', true);

        $this->getJson('/api/runtime')
            ->assertOk()
            ->assertJsonPath('result.payment_simulation_enabled', true);
    }

    public function test_user_can_simulate_a_donation_in_local_mode(): void
    {
        config()->set('services.payments.simulation_enabled', true);

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
            ->postJson('/api/donations/simulate', [
                'pet_id' => $pet->id,
                'amount' => 25,
                'payment_method' => 'simulation_card',
            ])
            ->assertCreated()
            ->assertJsonPath('title', 'Donation simulated')
            ->assertJsonPath('result.pet_id', $pet->id)
            ->assertJsonPath('result.status', DonationStatus::PAID->value)
            ->assertJsonPath('result.payment_method', 'simulation_card');

        $this->assertDatabaseHas('donations', [
            'user_id' => $user->id,
            'pet_id' => $pet->id,
            'amount' => 25,
            'status' => DonationStatus::PAID->value,
            'payment_method' => 'simulation_card',
        ]);
    }
}
