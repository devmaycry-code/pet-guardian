<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\NeedController;
use App\Http\Controllers\Api\PetFollowController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SponsorshipController;
use App\Http\Controllers\Api\TimelineController;
use App\Http\Controllers\Api\TransparencyController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:auth');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:auth');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('throttle:auth');

    Route::middleware('auth:api')->group(function (): void {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::get('pets', [PetController::class, 'index']);
Route::get('pets/{pet:slug}', [PetController::class, 'show']);
Route::get('pets/{pet:slug}/timeline', [TimelineController::class, 'index']);
Route::get('pets/{pet:slug}/needs', [NeedController::class, 'index']);
Route::get('pets/{pet:slug}/transparency', [TransparencyController::class, 'byPet']);
Route::get('organizations', [OrganizationController::class, 'index']);
Route::get('organizations/{organization:slug}', [OrganizationController::class, 'show']);
Route::get('transparency', [TransparencyController::class, 'index']);
Route::get('docs/openapi.yaml', fn () => response()->file(base_path('docs/openapi.yaml')));

Route::middleware('auth:api')->group(function (): void {
    Route::post('pets', [PetController::class, 'store']);
    Route::put('pets/{pet:slug}', [PetController::class, 'update']);
    Route::delete('pets/{pet:slug}', [PetController::class, 'destroy']);
    Route::post('pets/{pet:slug}/follow', [PetFollowController::class, 'store']);
    Route::delete('pets/{pet:slug}/follow', [PetFollowController::class, 'destroy']);
    Route::post('pets/{pet:slug}/timeline', [TimelineController::class, 'store']);
    Route::post('pets/{pet:slug}/needs', [NeedController::class, 'store']);
    Route::post('donations', [DonationController::class, 'store']);
    Route::get('donations/my', [DonationController::class, 'my']);
    Route::post('sponsorships', [SponsorshipController::class, 'store']);
    Route::get('sponsorships/my', [SponsorshipController::class, 'my']);
    Route::patch('sponsorships/{sponsorship}/pause', [SponsorshipController::class, 'pause']);
    Route::patch('sponsorships/{sponsorship}/resume', [SponsorshipController::class, 'resume']);
    Route::patch('sponsorships/{sponsorship}/cancel', [SponsorshipController::class, 'cancel']);
    Route::post('reports', [ReportController::class, 'store']);
});
