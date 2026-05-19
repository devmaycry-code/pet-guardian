<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cnpj')->nullable()->unique();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('city');
            $table->string('state', 2);
            $table->boolean('verified')->default(false);
            $table->unsignedSmallInteger('trust_score')->default(0);
            $table->unsignedSmallInteger('transparency_score')->default(0);
            $table->timestamps();
        });

        Schema::create('temporary_homes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('description');
            $table->unsignedSmallInteger('capacity')->default(1);
            $table->unsignedSmallInteger('available_slots')->default(0);
            $table->string('city');
            $table->string('state', 2);
            $table->boolean('verified')->default(false);
            $table->unsignedSmallInteger('trust_score')->default(0);
            $table->timestamps();
        });

        Schema::create('pets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('temporary_home_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('species');
            $table->string('gender');
            $table->string('age');
            $table->string('size');
            $table->string('status')->default('AVAILABLE');
            $table->string('urgency_level')->default('MEDIUM');
            $table->text('story');
            $table->text('rescue_story')->nullable();
            $table->string('avatar')->nullable();
            $table->string('city');
            $table->string('state', 2);
            $table->timestamp('adopted_at')->nullable();
            $table->timestamp('memorial_at')->nullable();
            $table->boolean('verified')->default(false);
            $table->timestamps();
        });

        Schema::create('pet_images', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->boolean('is_main')->default(false);
            $table->timestamps();
        });

        Schema::create('pet_videos', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->boolean('verified')->default(false);
            $table->timestamps();
        });

        Schema::create('pet_needs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('type');
            $table->decimal('goal_amount', 10, 2);
            $table->decimal('current_amount', 10, 2)->default(0);
            $table->string('urgency_level')->default('MEDIUM');
            $table->string('status')->default('OPEN');
            $table->boolean('proof_required')->default(true);
            $table->timestamps();
        });

        Schema::create('donations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pet_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('pet_need_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method');
            $table->string('status')->default('PENDING');
            $table->string('external_id')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('sponsorships', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pet_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('monthly_amount', 10, 2);
            $table->string('status')->default('ACTIVE');
            $table->timestamp('started_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'pet_id']);
        });

        Schema::create('timeline_posts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->string('type')->default('UPDATE');
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('pet_letters', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->boolean('generated_by_ai')->default(false);
            $table->timestamps();
        });

        Schema::create('reports', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('reporter_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('target_type');
            $table->unsignedBigInteger('target_id');
            $table->string('reason');
            $table->text('description');
            $table->string('status')->default('OPEN');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->index(['target_type', 'target_id']);
        });

        Schema::create('transparency_records', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pet_need_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->decimal('amount', 10, 2);
            $table->string('proof_file')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transparency_records');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('pet_letters');
        Schema::dropIfExists('timeline_posts');
        Schema::dropIfExists('sponsorships');
        Schema::dropIfExists('donations');
        Schema::dropIfExists('pet_needs');
        Schema::dropIfExists('pet_videos');
        Schema::dropIfExists('pet_images');
        Schema::dropIfExists('pets');
        Schema::dropIfExists('temporary_homes');
        Schema::dropIfExists('organizations');
    }
};
