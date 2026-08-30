<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\BankAccount;
use App\Models\Bill;
use App\Models\Invoice;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function kpis(): JsonResponse
    {
        abort_unless(TenantContext::can('finance:view'), 403);
        $tenant = TenantContext::requireTenant();

        $cash = Account::where('type', 'asset')
            ->whereIn('subtype', ['bank', 'cash'])
            ->select(DB::raw('COALESCE(SUM(opening_balance),0) as ob'))
            ->value('ob');

        $receivables = Invoice::whereNotIn('status', ['paid', 'void'])
            ->select(DB::raw('COALESCE(SUM(total - amount_paid),0) as due'))
            ->value('due');

        $payables = Bill::whereNotIn('status', ['paid', 'void'])
            ->select(DB::raw('COALESCE(SUM(total - amount_paid),0) as due'))
            ->value('due');

        $income = Account::where('type', 'income')->sum('opening_balance');
        $expense = Account::where('type', 'expense')->sum('opening_balance');
        $netProfit = $income - $expense;

        $trend = Invoice::where('status', '!=', 'void')
            ->where('issue_date', '>=', now()->subMonths(6))
            ->get()
            ->groupBy(fn ($i) => $i->issue_date->format('Y-m'))
            ->map(fn ($group, $month) => [
                'month' => $month,
                'revenue' => (float) $group->sum('total'),
            ])
            ->values();

        $cashPosition = BankAccount::select('id', 'name', 'current_balance')
            ->get()
            ->map(fn ($a) => ['id' => $a->id, 'name' => $a->name, 'balance' => (float) $a->current_balance])
            ->all();

        $arAging = $this->aging(Invoice::whereNotIn('status', ['paid', 'void'])->get());
        $apAging = $this->aging(Bill::whereNotIn('status', ['paid', 'void'])->get());

        return response()->json([
            'cash' => (float) $cash,
            'receivables' => (float) $receivables,
            'payables' => (float) $payables,
            'net_profit' => (float) $netProfit,
            'currency' => $tenant->currency,
            'revenue_trend' => $trend,
            'cash_position' => $cashPosition,
            'ar_aging' => $arAging,
            'ap_aging' => $apAging,
        ]);
    }

    private function aging(Collection $items): array
    {
        $buckets = ['0-30' => 0.0, '31-60' => 0.0, '61-90' => 0.0, '90+' => 0.0];

        foreach ($items as $item) {
            $outstanding = (float) $item->amountDue();
            if ($outstanding <= 0) {
                continue;
            }

            $days = $item->issue_date ? now()->diffInDays($item->issue_date) : 0;

            if ($days <= 30) {
                $buckets['0-30'] += $outstanding;
            } elseif ($days <= 60) {
                $buckets['31-60'] += $outstanding;
            } elseif ($days <= 90) {
                $buckets['61-90'] += $outstanding;
            } else {
                $buckets['90+'] += $outstanding;
            }
        }

        return collect($buckets)
            ->map(fn ($amount, $label) => ['label' => $label, 'amount' => (float) $amount])
            ->values()
            ->all();
    }
}
