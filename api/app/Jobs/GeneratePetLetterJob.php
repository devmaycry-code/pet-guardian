<?php

namespace App\Jobs;

use App\Models\Pet;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GeneratePetLetterJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly Pet $pet) {}

    public function handle(): void
    {
        // Placeholder for future AI-assisted emotional letters.
    }
}
