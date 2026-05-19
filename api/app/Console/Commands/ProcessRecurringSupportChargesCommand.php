<?php

namespace App\Console\Commands;

use App\Services\Sponsorship\SponsorshipService;
use Illuminate\Console\Command;

class ProcessRecurringSupportChargesCommand extends Command
{
    protected $signature = 'support:process-recurring-charges';
    protected $description = 'Reconcile recurring support states with Stripe and refresh local records.';

    public function __construct(private readonly SponsorshipService $sponsorshipService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $processed = $this->sponsorshipService->processDueCharges();

        $this->info(sprintf('Reconciled %d recurring support record(s).', $processed));

        return self::SUCCESS;
    }
}
