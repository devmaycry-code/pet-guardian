<?php

namespace App\Console\Commands;

use App\Services\Sponsorship\SponsorshipService;
use Illuminate\Console\Command;

class ProcessRecurringSupportChargesCommand extends Command
{
    protected $signature = 'support:process-recurring-charges';
    protected $description = 'Process due recurring support charges and create donation records.';

    public function __construct(private readonly SponsorshipService $sponsorshipService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $processed = $this->sponsorshipService->processDueCharges();

        $this->info(sprintf('Processed %d recurring support charge(s).', $processed));

        return self::SUCCESS;
    }
}
