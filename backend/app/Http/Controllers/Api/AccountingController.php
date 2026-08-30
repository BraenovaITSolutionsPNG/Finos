<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AccountStoreRequest;
use App\Http\Requests\JournalEntryStoreRequest;
use App\Http\Requests\OpeningBalanceStoreRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\JournalEntryResource;
use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\OpeningBalance;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;

class AccountingController extends Controller
{
    public function accounts(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);
        $accounts = Account::orderBy('code')->get();

        return response()->json(AccountResource::collection($accounts));
    }

    public function storeAccount(AccountStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $account = Account::create($request->validated());

        return response()->json(new AccountResource($account), 201);
    }

    public function showAccount(Account $account): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(new AccountResource($account));
    }

    public function updateAccount(AccountStoreRequest $request, Account $account): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $account->update($request->validated());

        return response()->json(new AccountResource($account));
    }

    public function destroyAccount(Account $account): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $account->delete();

        return response()->json(['message' => 'Account deleted.']);
    }

    public function journals(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);
        $entries = JournalEntry::with('lines.account')->orderByDesc('date')->paginate(25);

        return response()->json(JournalEntryResource::collection($entries));
    }

    public function storeJournal(JournalEntryStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $data = $request->validated();

        $entry = JournalEntry::create([
            'reference' => $data['reference'] ?? null,
            'date' => $data['date'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'posted',
            'created_by' => auth()->id(),
        ]);

        foreach ($data['lines'] as $line) {
            $entry->lines()->create([
                'account_id' => $line['account_id'],
                'debit' => $line['debit'] ?? 0,
                'credit' => $line['credit'] ?? 0,
                'description' => $line['description'] ?? null,
            ]);
        }

        if (! $entry->isBalanced()) {
            $entry->forceDelete();

            return response()->json(['message' => 'Journal entry is not balanced (debits must equal credits).'], 422);
        }

        return response()->json(new JournalEntryResource($entry->load('lines.account')), 201);
    }

    public function showJournal(JournalEntry $entry): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        return response()->json(new JournalEntryResource($entry->load('lines.account')));
    }

    public function ledger(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);

        $accounts = Account::orderBy('code')->get();
        $creditTypes = ['liability', 'equity', 'income'];

        $rows = $accounts->map(function (Account $account) use ($creditTypes) {
            $opening = $account->opening_balance ?? 0;
            $debit = $account->journalLines()->sum('debit');
            $credit = $account->journalLines()->sum('credit');

            $balance = in_array($account->type, $creditTypes)
                ? $opening + $credit - $debit
                : $opening + $debit - $credit;

            return [
                'id' => $account->id,
                'code' => $account->code,
                'name' => $account->name,
                'type' => $account->type,
                'opening' => (float) $opening,
                'debit' => (float) $debit,
                'credit' => (float) $credit,
                'balance' => (float) $balance,
            ];
        });

        return response()->json($rows);
    }

    public function storeOpeningBalance(OpeningBalanceStoreRequest $request): JsonResponse
    {
        abort_unless(TenantContext::can('finance:create'), 403);
        $ob = OpeningBalance::updateOrCreate(
            [
                'tenant_id' => TenantContext::requireTenant()->id,
                'account_id' => $request->validated()['account_id'],
                'as_of_date' => $request->validated()['as_of_date'],
            ],
            [
                'debit' => $request->validated()['debit'] ?? 0,
                'credit' => $request->validated()['credit'] ?? 0,
                'notes' => $request->validated()['notes'] ?? null,
            ]
        );

        return response()->json($ob, 201);
    }
}
