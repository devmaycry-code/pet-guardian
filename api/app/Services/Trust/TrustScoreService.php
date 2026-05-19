<?php

namespace App\Services\Trust;

class TrustScoreService
{
    public function calculate(bool $verified, int $transparencyScore = 0): int
    {
        return min(100, ($verified ? 50 : 0) + $transparencyScore);
    }
}
