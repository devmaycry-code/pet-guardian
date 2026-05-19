<?php

namespace App\Models;

use App\Enums\ReportStatus;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['reporter_user_id', 'target_type', 'target_id', 'reason', 'description', 'status', 'resolved_at'];

    protected function casts(): array
    {
        return [
            'status' => ReportStatus::class,
            'resolved_at' => 'datetime',
        ];
    }
}
