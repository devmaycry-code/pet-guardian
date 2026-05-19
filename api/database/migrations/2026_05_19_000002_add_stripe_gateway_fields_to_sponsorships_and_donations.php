<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sponsorships', function (Blueprint $table): void {
            $table->string('gateway')->nullable()->after('target_identifier');
            $table->string('gateway_status')->nullable()->after('status');
            $table->string('checkout_session_id')->nullable()->unique()->after('gateway_status');
            $table->string('stripe_customer_id')->nullable()->index()->after('checkout_session_id');
            $table->string('stripe_subscription_id')->nullable()->index()->after('stripe_customer_id');
            $table->timestamp('last_gateway_event_at')->nullable()->after('canceled_at');
        });

        Schema::table('donations', function (Blueprint $table): void {
            $table->string('gateway_event_id')->nullable()->index()->after('external_id');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table): void {
            $table->dropColumn('gateway_event_id');
        });

        Schema::table('sponsorships', function (Blueprint $table): void {
            $table->dropColumn([
                'gateway',
                'gateway_status',
                'checkout_session_id',
                'stripe_customer_id',
                'stripe_subscription_id',
                'last_gateway_event_at',
            ]);
        });
    }
};
