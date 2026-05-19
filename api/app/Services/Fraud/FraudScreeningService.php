<?php

namespace App\Services\Fraud;

class FraudScreeningService
{
    public function canCollectFunds(int $trustScore): bool
    {
        return $trustScore >= 30;
    }
}
