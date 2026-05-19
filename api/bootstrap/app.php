<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $exception) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Validation Error',
                'status' => 422,
                'detail' => 'The given data was invalid.',
                'errors' => $exception->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $exception) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Unauthenticated',
                'status' => 401,
                'detail' => 'Token ausente, invalido ou expirado.',
                'errors' => (object) ['code' => 'token_expired'],
            ], 401);
        });

        $exceptions->render(function (TokenExpiredException $exception) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Token expired',
                'status' => 401,
                'detail' => 'Token expirado. Use /api/auth/refresh dentro da janela de refresh.',
                'errors' => (object) ['code' => 'token_expired'],
            ], 401);
        });

        $exceptions->render(function (JWTException $exception) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Invalid token',
                'status' => 401,
                'detail' => 'Token ausente, invalido ou fora da janela de refresh.',
                'errors' => (object) ['code' => 'invalid_token'],
            ], 401);
        });

        $exceptions->render(function (AuthorizationException $exception) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'Forbidden',
                'status' => 403,
                'detail' => 'Voce nao tem permissao para executar esta acao.',
                'errors' => (object) [],
            ], 403);
        });
    })->create();
