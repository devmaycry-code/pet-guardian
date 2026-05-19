<?php

namespace App\Enums;

enum NeedStatus: string
{
    case OPEN = 'OPEN';
    case FUNDED = 'FUNDED';
    case PROOF_PENDING = 'PROOF_PENDING';
    case CLOSED = 'CLOSED';
}
