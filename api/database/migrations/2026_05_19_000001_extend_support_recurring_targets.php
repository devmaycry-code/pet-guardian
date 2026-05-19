<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sponsorships', function (Blueprint $table): void {
            $table->string('target_type')->default('pet')->after('user_id');
            $table->string('target_identifier')->after('target_type');
            $table->timestamp('next_billing_at')->nullable()->after('started_at');
            $table->timestamp('last_billed_at')->nullable()->after('next_billing_at');
            $table->timestamp('paused_at')->nullable()->after('last_billed_at');
            $table->timestamp('canceled_at')->nullable()->after('paused_at');
            $table->unique(['user_id', 'target_type', 'target_identifier'], 'sponsorships_target_unique');
        });

        Schema::table('donations', function (Blueprint $table): void {
            $table->foreignId('sponsorship_id')->nullable()->after('user_id')->constrained('sponsorships')->nullOnDelete();
            $table->string('target_type')->default('pet')->after('sponsorship_id');
            $table->string('target_identifier')->after('target_type');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('sponsorship_id');
            $table->dropColumn(['target_type', 'target_identifier']);
        });

        Schema::table('sponsorships', function (Blueprint $table): void {
            $table->dropUnique('sponsorships_target_unique');
            $table->dropColumn([
                'target_type',
                'target_identifier',
                'next_billing_at',
                'last_billed_at',
                'paused_at',
                'canceled_at',
            ]);
        });
    }
};
