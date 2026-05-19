<?php

namespace Tests\Feature;

use App\Enums\SponsorshipStatus;
use App\Enums\UserRole;
use App\Models\Organization;
use App\Models\Pet;
use App\Models\Sponsorship;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class StripeGatewayApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_stripe_checkout_for_a_pet_support(): void
    {
        $this->configureStripe();
        Http::fake([
            'https://api.stripe.com/v1/checkout/sessions' => Http::response([
                'id' => 'cs_test_checkout_123',
                'url' => 'https://checkout.stripe.test/session',
            ], 200),
        ]);

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
            ->postJson('/api/sponsorships/checkout', [
                'pet_id' => $pet->id,
                'monthly_amount' => 49.9,
            ])
            ->assertCreated()
            ->assertJsonPath('result.checkout_url', 'https://checkout.stripe.test/session')
            ->assertJsonPath('result.sponsorship.status', 'PENDING_CHECKOUT')
            ->assertJsonPath('result.sponsorship.gateway', 'stripe')
            ->assertJsonPath('result.sponsorship.checkout_session_id', 'cs_test_checkout_123');

        $this->assertDatabaseHas('sponsorships', [
            'user_id' => $user->id,
            'pet_id' => $pet->id,
            'status' => SponsorshipStatus::PENDING_CHECKOUT->value,
            'checkout_session_id' => 'cs_test_checkout_123',
            'stripe_subscription_id' => null,
        ]);
    }

    public function test_stripe_checkout_webhook_activates_support(): void
    {
        $this->configureStripe();
        Http::fake([
            'https://api.stripe.com/v1/subscriptions/sub_test_123' => Http::response([
                'id' => 'sub_test_123',
                'status' => 'active',
                'current_period_end' => now()->addMonth()->timestamp,
            ], 200),
        ]);

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

        $sponsorship = Sponsorship::create([
            'user_id' => $user->id,
            'pet_id' => $pet->id,
            'target_type' => 'pet',
            'target_identifier' => (string) $pet->id,
            'gateway' => 'stripe',
            'gateway_status' => 'pending_checkout',
            'checkout_session_id' => 'cs_test_checkout_123',
            'monthly_amount' => 49.90,
            'status' => SponsorshipStatus::PENDING_CHECKOUT->value,
            'started_at' => now(),
        ]);

        $payload = json_encode([
            'id' => 'evt_test_checkout_completed',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_checkout_123',
                    'subscription' => 'sub_test_123',
                    'customer' => 'cus_test_123',
                    'payment_intent' => 'pi_test_123',
                    'metadata' => [
                        'sponsorship_id' => $sponsorship->id,
                        'target_type' => 'pet',
                        'target_identifier' => (string) $pet->id,
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR);

        $signature = $this->stripeSignature($payload);

        $this->withHeader('Stripe-Signature', $signature)
            ->call(
                'POST',
                '/api/webhooks/stripe',
                [],
                [],
                [],
                [
                    'CONTENT_TYPE' => 'application/json',
                    'HTTP_STRIPE_SIGNATURE' => $signature,
                ],
                $payload
            )
            ->assertOk()
            ->assertJsonPath('result.handled', true)
            ->assertJsonPath('result.type', 'checkout.session.completed');

        $this->assertDatabaseHas('sponsorships', [
            'id' => $sponsorship->id,
            'status' => SponsorshipStatus::ACTIVE->value,
            'stripe_subscription_id' => 'sub_test_123',
            'stripe_customer_id' => 'cus_test_123',
            'checkout_session_id' => 'cs_test_checkout_123',
        ]);

        $this->assertDatabaseHas('donations', [
            'sponsorship_id' => $sponsorship->id,
            'external_id' => 'pi_test_123',
            'status' => 'PAID',
            'payment_method' => 'card',
        ]);
    }

    public function test_stripe_invoice_failed_marks_support_payment_failed(): void
    {
        $this->configureStripe();

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

        $sponsorship = Sponsorship::create([
            'user_id' => $user->id,
            'pet_id' => $pet->id,
            'target_type' => 'pet',
            'target_identifier' => (string) $pet->id,
            'gateway' => 'stripe',
            'gateway_status' => 'active',
            'stripe_subscription_id' => 'sub_test_123',
            'monthly_amount' => 49.90,
            'status' => SponsorshipStatus::ACTIVE->value,
            'started_at' => now(),
            'next_billing_at' => now()->addMonth(),
            'last_billed_at' => now(),
        ]);

        $payload = json_encode([
            'id' => 'evt_test_invoice_failed',
            'type' => 'invoice.payment_failed',
            'data' => [
                'object' => [
                    'id' => 'in_test_123',
                    'subscription' => 'sub_test_123',
                    'metadata' => [
                        'sponsorship_id' => $sponsorship->id,
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR);

        $signature = $this->stripeSignature($payload);

        $this->withHeader('Stripe-Signature', $signature)
            ->call(
                'POST',
                '/api/webhooks/stripe',
                [],
                [],
                [],
                [
                    'CONTENT_TYPE' => 'application/json',
                    'HTTP_STRIPE_SIGNATURE' => $signature,
                ],
                $payload
            )
            ->assertOk()
            ->assertJsonPath('result.type', 'invoice.payment_failed');

        $this->assertDatabaseHas('sponsorships', [
            'id' => $sponsorship->id,
            'status' => SponsorshipStatus::PAYMENT_FAILED->value,
            'gateway_status' => 'payment_failed',
        ]);
    }

    private function configureStripe(): void
    {
        config()->set('services.stripe.secret', 'sk_test_123');
        config()->set('services.stripe.webhook_secret', 'whsec_test_123');
        config()->set('services.stripe.currency', 'brl');
        config()->set('services.stripe.checkout_success_url', 'http://localhost:5173/apoios?checkout=success');
        config()->set('services.stripe.checkout_cancel_url', 'http://localhost:5173/apoios?checkout=cancelled');
    }

    private function stripeSignature(string $payload): string
    {
        $timestamp = (string) now()->timestamp;
        $signature = hash_hmac('sha256', $timestamp.'.'.$payload, 'whsec_test_123');

        return "t={$timestamp},v1={$signature}";
    }
}
