<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class RuntimeController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success([
            'environment' => app()->environment(),
            'payment_simulation_enabled' => $this->paymentSimulationEnabled(),
            'stripe_test_mode' => $this->stripeTestMode(),
        ]);
    }

    private function paymentSimulationEnabled(): bool
    {
        return (bool) config('services.payments.simulation_enabled')
            && app()->environment(['local', 'development', 'testing']);
    }

    private function stripeTestMode(): bool
    {
        $secret = (string) config('services.stripe.secret', '');

        return str_starts_with($secret, 'sk_test_');
    }
}
