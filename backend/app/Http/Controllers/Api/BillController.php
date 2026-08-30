<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BillStoreRequest;
use App\Http\Resources\BillResource;
use App\Models\Bill;
use App\Services\Ledger;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class BillController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);
        $bills = Bill::with('vendor')->orderByDesc('issue_date')->paginate(25);

        return response()->json(BillResource::collection($bills));
    }

    public function store(BillStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $data = $request->validated();

        $bill = Bill::create([
            'vendor_id' => $data['vendor_id'],
            'number' => $data['number'] ?? null,
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'] ?? 'draft',
            'currency' => $data['currency'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            $bill->items()->create($item);
        }

        $bill->load('items')->recalculate();
        $bill->save();

        if ($bill->status !== 'draft') {
            (new Ledger)->postBill($bill);
        }

        return response()->json(new BillResource($bill->load('items', 'vendor')), 201);
    }

    public function show(Bill $bill): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(new BillResource($bill->load('items', 'vendor')));
    }

    public function update(BillStoreRequest $request, Bill $bill): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $data = $request->validated();

        $bill->update([
            'vendor_id' => $data['vendor_id'],
            'number' => $data['number'] ?? null,
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'] ?? $bill->status,
            'currency' => $data['currency'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        $bill->items()->delete();
        foreach ($data['items'] as $item) {
            $bill->items()->create($item);
        }

        $bill->load('items')->recalculate();
        $bill->save();

        if ($bill->status !== 'draft') {
            (new Ledger)->postBill($bill);
        }

        return response()->json(new BillResource($bill->load('items', 'vendor')));
    }

    public function destroy(Bill $bill): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        (new Ledger)->deleteFor($bill);
        $bill->delete();

        return response()->json(['message' => 'Bill deleted.']);
    }
}
