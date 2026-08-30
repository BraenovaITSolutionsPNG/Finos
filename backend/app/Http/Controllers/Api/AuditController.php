<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class AuditController extends Controller
{
    public function index(): JsonResponse
    {
        $tenant = TenantContext::requireTenant();
        $logs = AuditLog::with('user')
            ->where('tenant_id', $tenant->id)
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json(AuditLogResource::collection($logs));
    }

    public function show(AuditLog $auditLog): JsonResponse
    {
        return response()->json(new AuditLogResource($auditLog->load('user')));
    }
}
