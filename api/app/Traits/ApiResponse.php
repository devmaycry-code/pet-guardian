<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success(mixed $result = null, int $status = 200, string $title = 'Success'): JsonResponse
    {
        return response()->json([
            'title' => $title,
            'status' => $status,
            'result' => $result,
        ], $status);
    }

    protected function problem(string $title, int $status, string $detail, array $errors = []): JsonResponse
    {
        return response()->json([
            'type' => 'about:blank',
            'title' => $title,
            'status' => $status,
            'detail' => $detail,
            'errors' => (object) $errors,
        ], $status);
    }
}
