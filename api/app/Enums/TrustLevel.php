<?php

namespace App\Enums;

enum TrustLevel: string
{
    case UNVERIFIED = 'UNVERIFIED';
    case BASIC = 'BASIC';
    case VERIFIED = 'VERIFIED';
    case AUDITED = 'AUDITED';
}
