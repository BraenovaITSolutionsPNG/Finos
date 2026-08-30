<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BankAccountStoreRequest;
use App\Http\Requests\BankTransactionStoreRequest;
use App\Http\Resources\BankAccountResource;
use App\Http\Resources\BankTransactionResource;
use App\Models\BankAccount;
use App\Models\BankTransaction;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class BankController extends Controller
{
    public function accounts(): JsonResponse
    {
        $this->authorize('viewAny', BankAccount::class);

        return response()->json(BankAccountResource::collection(BankAccount::with('glAccount')->orderBy('name')->get()));
    }

    public function storeAccount(BankAccountStoreRequest $request): JsonResponse
    {
        $this->authorize('create', BankAccount::class);
        $account = BankAccount::create($request->validated());

        return response()->json(new BankAccountResource($account->load('glAccount')), 201);
    }

    public function showAccount(BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('view', $bankAccount);

        return response()->json(new BankAccountResource($bankAccount->load('glAccount')));
    }

    public function updateAccount(BankAccountStoreRequest $request, BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('update', $bankAccount);
        $bankAccount->update($request->validated());

        return response()->json(new BankAccountResource($bankAccount->load('glAccount')));
    }

    public function destroyAccount(BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('delete', $bankAccount);
        $bankAccount->delete();

        return response()->json(['message' => 'Bank account deleted.']);
    }

    public function transactions(BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('view', $bankAccount);
        $txns = $bankAccount->transactions()->orderByDesc('date')->paginate(50);

        return response()->json(BankTransactionResource::collection($txns));
    }

    public function storeTransaction(BankTransactionStoreRequest $request, BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('update', $bankAccount);
        $txn = $bankAccount->transactions()->create(array_merge($request->validated(), ['bank_account_id' => $bankAccount->id]));

        $bankAccount->current_balance += $txn->type === 'credit' ? $txn->amount : -$txn->amount;
        $bankAccount->save();

        return response()->json(new BankTransactionResource($txn), 201);
    }

    public function reconcile(BankTransaction $bankTransaction): JsonResponse
    {
        $this->authorize('update', $bankTransaction->bankAccount);
        $bankTransaction->update(['is_reconciled' => true]);

        return response()->json(new BankTransactionResource($bankTransaction));
    }

    public function unreconcile(BankTransaction $bankTransaction): JsonResponse
    {
        $this->authorize('update', $bankTransaction->bankAccount);
        $bankTransaction->update(['is_reconciled' => false]);

        return response()->json(new BankTransactionResource($bankTransaction));
    }

    public function reconciliationSummary(): JsonResponse
    {
        $this->authorize('viewAny', BankAccount::class);
        $accounts = BankAccount::with(['transactions' => fn ($q) => $q->where('is_reconciled', false)])->get();

        return response()->json($accounts->map(fn (BankAccount $a) => [
            'id' => $a->id,
            'name' => $a->name,
            'current_balance' => (float) $a->current_balance,
            'unreconciled_count' => $a->transactions->count(),
            'unreconciled_total' => (float) $a->transactions->sum('amount'),
        ]));
    }

    public function summary(BankAccount $bankAccount): JsonResponse
    {
        $this->authorize('view', $bankAccount);
        $reconciled = $bankAccount->transactions()->where('is_reconciled', true)->sum('amount');
        $unreconciled = $bankAccount->transactions()->where('is_reconciled', false)->sum('amount');

        return response()->json([
            'id' => $bankAccount->id,
            'current_balance' => (float) $bankAccount->current_balance,
            'reconciled' => (float) $reconciled,
            'unreconciled' => (float) $unreconciled,
        ]);
    }
}
