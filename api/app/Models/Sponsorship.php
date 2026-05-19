<?php

namespace App\Models;

use App\Enums\SponsorshipStatus;
use Illuminate\Database\Eloquent\Model;

class Sponsorship extends Model
{
    protected $fillable = [
        'user_id',
        'pet_id',
        'target_type',
        'target_identifier',
        'monthly_amount',
        'status',
        'gateway',
        'gateway_status',
        'checkout_session_id',
        'stripe_customer_id',
        'stripe_subscription_id',
        'started_at',
        'next_billing_at',
        'last_billed_at',
        'paused_at',
        'canceled_at',
        'last_gateway_event_at',
    ];

    protected function casts(): array
    {
        return [
            'monthly_amount' => 'decimal:2',
            'status' => SponsorshipStatus::class,
            'last_gateway_event_at' => 'datetime',
            'started_at' => 'datetime',
            'next_billing_at' => 'datetime',
            'last_billed_at' => 'datetime',
            'paused_at' => 'datetime',
            'canceled_at' => 'datetime',
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

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'target_identifier');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
