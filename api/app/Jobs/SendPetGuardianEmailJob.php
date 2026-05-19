<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendPetGuardianEmailJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly int $userId, public readonly string $template) {}

    public function handle(): void
    {
        // Email transport will be wired when notification templates are defined.
    }
}
