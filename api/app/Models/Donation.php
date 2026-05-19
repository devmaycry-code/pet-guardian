<?php

namespace App\Models;

use App\Enums\DonationStatus;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'user_id',
        'pet_id',
        'pet_need_id',
        'sponsorship_id',
        'target_type',
        'target_identifier',
        'amount',
        'payment_method',
        'status',
        'external_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status' => DonationStatus::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function sponsorship()
    {
        return $this->belongsTo(Sponsorship::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'target_identifier');
    }
}
