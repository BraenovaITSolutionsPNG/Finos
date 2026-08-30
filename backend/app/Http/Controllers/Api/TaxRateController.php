<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaxRateStoreRequest;
use App\Http\Resources\TaxRateResource;
use App\Models\TaxRate;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class TaxRateController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', TaxRate::class);

        return response()->json(TaxRateResource::collection(TaxRate::orderBy('name')->get()));
    }

    public function store(TaxRateStoreRequest $request): JsonResponse
    {
        $this->authorize('create', TaxRate::class);
        $rate = TaxRate::create($request->validated());

        return response()->json(new TaxRateResource($rate), 201);
    }

    public function show(TaxRate $taxRate): JsonResponse
    {
        $this->authorize('view', $taxRate);

        return response()->json(new TaxRateResource($taxRate));
    }

    public function update(TaxRateStoreRequest $request, TaxRate $taxRate): JsonResponse
    {
        $this->authorize('update', $taxRate);
        $taxRate->update($request->validated());

        return response()->json(new TaxRateResource($taxRate));
    }

    public function destroy(TaxRate $taxRate): JsonResponse
    {
        $this->authorize('delete', $taxRate);
        $taxRate->delete();

        return response()->json(['message' => 'Tax rate deleted.']);
    }
}
