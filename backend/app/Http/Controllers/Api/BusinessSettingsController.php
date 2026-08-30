<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessSettingsStoreRequest;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class BusinessSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $tenant = TenantContext::requireTenant();
        $defaults = [
            'company_name' => $tenant->name,
            'tax_id' => null,
            'address' => null,
            'phone' => null,
            'email' => null,
            'fiscal_year_start_month' => 1,
            'default_currency' => $tenant->currency,
            'logo_url' => null,
        ];

        return response()->json(array_merge($defaults, $tenant->settings ?? []));
    }

    public function update(BusinessSettingsStoreRequest $request): JsonResponse
    {
        $tenant = TenantContext::requireTenant();
        $tenant->update([
            'settings' => array_merge($tenant->settings ?? [], $request->validated()),
        ]);

        return response()->json($tenant->settings);
    }
}
