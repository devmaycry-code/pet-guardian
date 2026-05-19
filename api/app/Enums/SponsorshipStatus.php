<?php

namespace App\Enums;

enum SponsorshipStatus: string
{
    case PENDING_CHECKOUT = 'PENDING_CHECKOUT';
    case ACTIVE = 'ACTIVE';
    case PAUSED = 'PAUSED';
    case PAYMENT_FAILED = 'PAYMENT_FAILED';
    case CANCELED = 'CANCELED';
}
