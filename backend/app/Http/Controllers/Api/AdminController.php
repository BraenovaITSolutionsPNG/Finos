<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    protected function guard(): void
    {
        abort_unless((bool) auth()->user()?->is_admin, 403, 'Admin access required.');
    }

    public function stats(): JsonResponse
    {
        $this->guard();
        $tenants = Tenant::withTrashed()->count();
        $active = Tenant::count();
        $users = User::count();
        $subs = DB::table('subscriptions')->count();

        return response()->json([
            'tenants_total' => $tenants,
            'tenants_active' => $active,
            'users_total' => $users,
            'subscriptions_total' => $subs,
        ]);
    }

    public function tenants(): JsonResponse
    {
        $this->guard();
        $tenants = Tenant::withTrashed()
            ->with('members')
            ->orderByDesc('created_at')
            ->paginate(25)
            ->through(fn (Tenant $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'status' => $t->deleted_at ? 'suspended' : $t->status,
                'members' => $t->members->count(),
                'created_at' => $t->created_at,
            ]);

        return response()->json($tenants);
    }

    public function users(): JsonResponse
    {
        $this->guard();
        $users = User::orderByDesc('created_at')->paginate(25, ['id', 'name', 'email', 'is_admin', 'created_at']);

        return response()->json($users);
    }

    public function subscriptions(): JsonResponse
    {
        $this->guard();
        $subs = Subscription::with(['tenant', 'plan'])
            ->orderByDesc('created_at')
            ->paginate(25)
            ->through(fn (Subscription $s) => [
                'id' => $s->id,
                'tenant_id' => $s->tenant_id,
                'tenant_name' => $s->tenant?->name ?? '—',
                'plan_id' => $s->plan_id,
                'plan_name' => $s->plan?->name ?? '—',
                'plan_price' => $s->plan?->price ?? 0,
                'payment_method' => $s->payment_method ?? '—',
                'payment_reference' => $s->payment_reference ?? '—',
                'payment_receipt_url' => $s->payment_receipt_url,
                'payment_notes' => $s->payment_notes,
                'status' => $s->status,
                'created_at' => $s->created_at,
            ]);

        return response()->json($subs);
    }

    public function approveSubscription(Subscription $subscription): JsonResponse
    {
        $this->guard();
        $subscription->update([
            'status' => 'active',
            'current_period_start' => now(),
            'current_period_end' => now()->addMonth(),
        ]);

        return response()->json(['message' => 'Subscription approved & activated.']);
    }

    public function suspendSubscription(Subscription $subscription): JsonResponse
    {
        $this->guard();
        $subscription->update(['status' => 'suspended']);

        return response()->json(['message' => 'Subscription suspended.']);
    }

    public function rejectSubscription(Subscription $subscription): JsonResponse
    {
        $this->guard();
        $subscription->update(['status' => 'rejected']);

        return response()->json(['message' => 'Subscription rejected.']);
    }

    public function suspend(Tenant $tenant): JsonResponse
    {
        $this->guard();
        $tenant->delete();

        return response()->json(['message' => 'Tenant suspended.']);
    }

    public function activate(Tenant $tenant): JsonResponse
    {
        $this->guard();
        $tenant->restore();

        return response()->json(['message' => 'Tenant activated.']);
    }
}
