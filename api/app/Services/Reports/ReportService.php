<?php

namespace App\Services\Reports;

use App\Enums\ReportStatus;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ReportService
{
    public function create(User $user, array $data): Report
    {
        return Report::create($data + [
            'reporter_user_id' => $user->id,
            'status' => ReportStatus::OPEN->value,
        ]);
    }

    public function my(User $user): Collection
    {
        return Report::query()
            ->where('reporter_user_id', $user->id)
            ->latest()
            ->get();
    }
}
