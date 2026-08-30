<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentStoreRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Bill;
use App\Models\Invoice;
use App\Models\Payment;
use App\Services\Ledger;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);
        $payments = Payment::orderByDesc('date')->paginate(25);

        return response()->json(PaymentResource::collection($payments));
    }

    public function store(PaymentStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $data = $request->validated();

        $payable = match ($data['payable_type']) {
            'invoice' => Invoice::findOrFail($data['payable_id']),
            'bill' => Bill::findOrFail($data['payable_id']),
            default => abort(422, 'Invalid payable type'),
        };

        $applied = min($data['amount'], $payable->amountDue());
        if ($applied <= 0) {
            return response()->json(['message' => 'This document is already fully paid.'], 422);
        }

        $payment = Payment::create([
            'payable_type' => $data['payable_type'],
            'payable_id' => $data['payable_id'],
            'account_id' => $data['account_id'] ?? null,
            'date' => $data['date'],
            'amount' => $applied,
            'method' => $data['method'] ?? null,
            'reference' => $data['reference'] ?? null,
            'created_by' => auth()->id(),
        ]);

        $payable->amount_paid = ($payable->amount_paid ?? 0) + $applied;
        $payable->recalculate();
        $payable->save();

        (new Ledger)->postPayment($payment);

        return response()->json(new PaymentResource($payment), 201);
    }
}
