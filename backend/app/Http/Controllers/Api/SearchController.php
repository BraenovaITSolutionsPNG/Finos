<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Bill;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Vendor;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function global(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        if (strlen($q) < 2) {
            return response()->json([
                'customers' => [], 'vendors' => [], 'accounts' => [],
                'invoices' => [], 'bills' => [], 'employees' => [], 'projects' => [],
            ]);
        }
        $tenant = TenantContext::requireTenant();
        $driver = \Illuminate\Support\Facades\DB::connection()->getDriverName();
        $op = $driver === 'pgsql' ? 'ilike' : 'like';
        $term = "%{$q}%";

        $customers = Customer::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($term, $op) {
                $query->whereRaw("name $op ?", [$term])
                      ->orWhereRaw("email $op ?", [$term]);
            })
            ->limit(10)
            ->get(['id', 'name', 'email'])->map(fn ($r) => ['id' => $r->id, 'label' => $r->name . ' ' . ($r->email ? '('.$r->email.')' : '')]);
        $vendors = Vendor::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($term, $op) {
                $query->whereRaw("name $op ?", [$term])
                      ->orWhereRaw("email $op ?", [$term]);
            })
            ->limit(10)
            ->get(['id', 'name', 'email'])->map(fn ($r) => ['id' => $r->id, 'label' => $r->name . ' ' . ($r->email ? '('.$r->email.')' : '')]);
        $accounts = Account::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($term, $op) {
                $query->whereRaw("name $op ?", [$term])
                      ->orWhereRaw("code $op ?", [$term]);
            })
            ->limit(10)
            ->get(['id', 'code', 'name'])->map(fn ($r) => ['id' => $r->id, 'label' => $r->code.' '.$r->name]);
        $invoices = Invoice::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($term, $op) {
                $query->whereRaw("number $op ?", [$term])
                      ->orWhereRaw("customer_id $op ?", [$term]);
            })
            ->limit(10)
            ->get(['id', 'number', 'customer_id'])->map(fn ($r) => ['id' => $r->id, 'label' => $r->number . ' – ' . ($r->customer ? $r->customer->name : 'customer')]);
        $bills = Bill::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($term, $op) {
                $query->whereRaw("number $op ?", [$term])
                      ->orWhereRaw("vendor_id $op ?", [$term]);
            })
            ->limit(10)
            ->get(['id', 'number', 'vendor_id'])->map(fn ($r) => ['id' => $r->id, 'label' => $r->number . ' – ' . ($r->vendor ? $r->vendor->name : 'vendor')]);
        $employees = Employee::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($term, $op) {
                $query->whereRaw("name $op ?", [$term])
                      ->orWhereRaw("position $op ?", [$term]);
            })
            ->limit(10)
            ->get(['id', 'name', 'position'])->map(fn ($r) => ['id' => $r->id, 'label' => $r->name . ' – ' . ($r->position ?? '' )]);
        $projects = Project::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($term, $op) {
                $query->whereRaw("name $op ?", [$term])
                      ->orWhereRaw("description $op ?", [$term]);
            })
            ->limit(10)
            ->get(['id', 'name', 'description'])->map(fn ($r) => ['id' => $r->id, 'label' => $r->name . ' – ' . substr($r->description ?? '', 0, 30)]);

        return response()->json([
            'customers' => $customers,
            'vendors' => $vendors,
            'accounts' => $accounts,
            'invoices' => $invoices,
            'bills' => $bills,
            'employees' => $employees,
            'projects' => $projects,
        ]);
    }
}