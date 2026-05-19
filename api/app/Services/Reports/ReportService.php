<?php

namespace App\Services\Reports;

use App\Enums\ReportStatus;
use App\Models\Report;
use App\Models\User;

class ReportService
{
    public function create(User $user, array $data): Report
    {
        return Report::create($data + [
            'reporter_user_id' => $user->id,
            'status' => ReportStatus::OPEN->value,
        ]);
    }
}
