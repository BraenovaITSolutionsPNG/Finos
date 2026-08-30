<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BudgetStoreRequest;
use App\Http\Resources\BudgetResource;
use App\Mail\BudgetAlert;
use App\Models\Account;
use App\Models\Budget;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class BudgetController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Budget::class);
        $budgets = Budget::with('account')->orderByDesc('year')->orderBy('month')->get();

        return response()->json(BudgetResource::collection($budgets));
    }

    public function store(BudgetStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Budget::class);
        $budget = Budget::create($request->validated());

        return response()->json(new BudgetResource($budget->load('account')), 201);
    }

    public function show(Budget $budget): JsonResponse
    {
        $this->authorize('view', $budget);

        return response()->json(new BudgetResource($budget->load('account')));
    }

    public function update(BudgetStoreRequest $request, Budget $budget): JsonResponse
    {
        $this->authorize('update', $budget);
        $budget->update($request->validated());

        return response()->json(new BudgetResource($budget->load('account')));
    }

    public function destroy(Budget $budget): JsonResponse
    {
        $this->authorize('delete', $budget);
        $budget->delete();

        return response()->json(['message' => 'Budget deleted.']);
    }

    public function comparison(): JsonResponse
    {
        $this->authorize('viewAny', Budget::class);
        $tenantId = TenantContext::tenant()->id;
        $budgets = Budget::with('account')->get();
        $result = $budgets->map(function (Budget $b) use ($tenantId) {
            $actual = DB::table('journal_lines')
                ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.journal_entry_id')
                ->where('journal_lines.account_id', $b->account_id)
                ->where('journal_entries.tenant_id', $tenantId)
                ->whereYear('journal_entries.date', $b->year)
                ->when($b->month > 0, fn ($q) => $q->whereMonth('journal_entries.date', $b->month))
                ->sum('journal_lines.debit');

            return [
                'account_id' => $b->account_id,
                'account' => $b->account?->name,
                'budget' => (float) $b->amount,
                'actual' => (float) $actual,
                'variance' => (float) ($b->amount - $actual),
            ];
        });

        $overBudget = $result->filter(fn ($row) => $row['variance'] < 0)->values();
        if ($overBudget->isNotEmpty()) {
            $key = 'budget_alert_'.$tenantId;
            if (! Cache::has($key)) {
                $business = TenantContext::requireTenant()->settings ?? [];
                try {
                    Mail::to(auth()->user()->email)->send(new BudgetAlert($overBudget->all(), $business));
                    Cache::put($key, true, now()->addHours(24));
                } catch (\Throwable $e) {
                    report($e);
                }
            }
        }

        return response()->json($result);
    }
}
