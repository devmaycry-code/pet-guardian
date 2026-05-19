<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RecalculateTrustScoreJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly string $targetType, public readonly int $targetId) {}

    public function handle(): void
    {
        // Trust scoring pipeline is intentionally isolated for future antifraud signals.
    }
}
