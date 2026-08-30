<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerStoreRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(CustomerResource::collection(Customer::orderBy('name')->get()));
    }

    public function store(CustomerStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);

        return response()->json(new CustomerResource(Customer::create($request->validated())), 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(new CustomerResource($customer));
    }

    public function update(CustomerStoreRequest $request, Customer $customer): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $customer->update($request->validated());

        return response()->json(new CustomerResource($customer));
    }

    public function destroy(Customer $customer): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted.']);
    }
}
