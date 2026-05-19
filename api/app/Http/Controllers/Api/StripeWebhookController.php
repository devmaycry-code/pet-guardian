<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Payments\StripeGatewayService;
use App\Services\Sponsorship\SponsorshipService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;
use JsonException;
use RuntimeException;

class StripeWebhookController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StripeGatewayService $stripeGatewayService,
        private readonly SponsorshipService $sponsorshipService,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        try {
            $event = $this->stripeGatewayService->verifyWebhookSignature(
                $request->getContent(),
                $request->header('Stripe-Signature')
            );
        } catch (InvalidArgumentException|JsonException|RuntimeException $exception) {
            return $this->problem('Invalid webhook', 400, $exception->getMessage());
        }

        $type = $event['type'] ?? 'unknown';
        $payload = $event['data']['object'] ?? [];

        $result = match ($type) {
            'checkout.session.completed' => $this->sponsorshipService->handleCheckoutCompleted($payload),
            'invoice.payment_succeeded' => $this->sponsorshipService->handleInvoicePaid($payload),
            'invoice.payment_failed' => $this->sponsorshipService->handleInvoiceFailed($payload),
            'customer.subscription.deleted' => $this->sponsorshipService->handleSubscriptionDeleted($payload),
            default => null,
        };

        return $this->success([
            'handled' => true,
            'type' => $type,
            'result' => $result,
        ]);
    }
}
