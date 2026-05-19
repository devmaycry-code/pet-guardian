<?php

namespace App\Enums;

enum ReportStatus: string
{
    case OPEN = 'OPEN';
    case REVIEWING = 'REVIEWING';
    case RESOLVED = 'RESOLVED';
    case DISMISSED = 'DISMISSED';
}
