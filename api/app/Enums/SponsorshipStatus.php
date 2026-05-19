<?php

namespace App\Enums;

enum SponsorshipStatus: string
{
    case ACTIVE = 'ACTIVE';
    case PAUSED = 'PAUSED';
    case CANCELED = 'CANCELED';
}
