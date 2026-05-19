<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Services\Reports\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ReportService $reportService) {}

    public function store(StoreReportRequest $request): JsonResponse
    {
        return $this->success(new ReportResource($this->reportService->create($request->user('api'), $request->validated())), 201, 'Report created');
    }
}
