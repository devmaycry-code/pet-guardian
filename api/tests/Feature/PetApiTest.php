<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PetApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_list_and_view_pets(): void
    {
        $user = User::factory()->create(['role' => UserRole::ONG]);
        $organization = Organization::create([
            'user_id' => $user->id,
            'name' => 'ONG Teste',
            'slug' => 'ong-teste',
            'description' => 'Teste',
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified' => true,
        ]);

        Pet::create([
            'organization_id' => $organization->id,
            'name' => 'Thor',
            'slug' => 'thor',
            'species' => 'dog',
            'gender' => 'male',
            'age' => '3 anos',
            'size' => 'medio',
            'story' => 'Historia do Thor',
            'city' => 'Curitiba',
            'state' => 'PR',
        ]);

        $this->getJson('/api/pets')->assertOk();
        $this->getJson('/api/pets/thor')->assertOk()->assertJsonPath('result.slug', 'thor');
    }

    public function test_ong_can_create_pet_and_regular_user_cannot(): void
    {
        Storage::fake('public');

        $ongUser = User::factory()->create(['role' => UserRole::ONG]);
        $regularUser = User::factory()->create(['role' => UserRole::USER]);
        $organization = Organization::create([
            'user_id' => $ongUser->id,
            'name' => 'ONG Teste',
            'slug' => 'ong-teste',
            'description' => 'Teste',
            'city' => 'Curitiba',
            'state' => 'PR',
            'verified' => true,
        ]);

        $payload = [
            'organization_id' => $organization->id,
            'name' => 'Luna',
            'slug' => 'luna',
            'species' => 'cat',
            'gender' => 'female',
            'age' => '1 ano',
            'size' => 'pequeno',
            'story' => 'Historia da Luna',
            'city' => 'Curitiba',
            'state' => 'PR',
        ];

        $response = $this->actingAs($ongUser, 'api')->post('/api/pets', $payload + [
            'avatar_file' => UploadedFile::fake()->create('luna.jpg', 24, 'image/jpeg'),
        ]);

        $response->assertCreated()->assertJsonPath('result.slug', 'luna');
        $avatarUrl = $response->json('result.avatar');

        $this->assertIsString($avatarUrl);
        $this->assertStringContainsString('/storage/pets/', $avatarUrl);
        $this->assertNotEmpty(Storage::disk('public')->allFiles('pets/1/avatars'));

        $this->actingAs($regularUser, 'api')->postJson('/api/pets', $payload + ['slug' => 'luna-2'])->assertForbidden();
    }
}
