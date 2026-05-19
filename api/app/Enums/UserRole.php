<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'ADMIN';
    case ONG = 'ONG';
    case TEMPORARY_HOME = 'TEMPORARY_HOME';
    case USER = 'USER';
    case VETERINARIAN = 'VETERINARIAN';
}
