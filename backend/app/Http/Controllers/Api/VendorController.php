<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VendorStoreRequest;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class VendorController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(VendorResource::collection(Vendor::orderBy('name')->get()));
    }

    public function store(VendorStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);

        return response()->json(new VendorResource(Vendor::create($request->validated())), 201);
    }

    public function show(Vendor $vendor): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(new VendorResource($vendor));
    }

    public function update(VendorStoreRequest $request, Vendor $vendor): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $vendor->update($request->validated());

        return response()->json(new VendorResource($vendor));
    }

    public function destroy(Vendor $vendor): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $vendor->delete();

        return response()->json(['message' => 'Vendor deleted.']);
    }
}
