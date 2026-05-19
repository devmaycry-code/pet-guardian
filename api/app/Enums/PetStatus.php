<?php

namespace App\Enums;

enum PetStatus: string
{
    case AVAILABLE = 'AVAILABLE';
    case SPONSORED = 'SPONSORED';
    case ADOPTED = 'ADOPTED';
    case MEMORIAL = 'MEMORIAL';
}
