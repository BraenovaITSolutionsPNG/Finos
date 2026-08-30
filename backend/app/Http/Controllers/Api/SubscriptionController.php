<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Http\Resources\SubscriptionResource;
use App\Models\Plan;
use App\Models\Subscription;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function plans(): JsonResponse
    {
        return response()->json(PlanResource::collection(Plan::where('is_active', true)->get()));
    }

    public function current(): JsonResponse
    {
        $tenant = TenantContext::requireTenant();
        $sub = Subscription::with('plan')->where('tenant_id', $tenant->id)->first();

        return response()->json($sub ? new SubscriptionResource($sub) : null);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'payment_method' => 'nullable|string|max:100',
            'payment_reference' => 'nullable|string|max:255',
            'payment_receipt_url' => 'nullable|string|max:1000',
            'payment_notes' => 'nullable|string|max:1000',
        ]);

        $tenant = TenantContext::requireTenant();
        $plan = Plan::findOrFail($validated['plan_id']);
        $subscription = null;

        DB::transaction(function () use ($tenant, $plan, $validated, &$subscription) {
            Subscription::where('tenant_id', $tenant->id)->delete();

            // Set status to 'pending' for paid plans awaiting admin approval, or 'active' for free plan
            $status = ($plan->price > 0) ? 'pending' : 'active';

            $subscription = Subscription::create([
                'plan_id' => $plan->id,
                'tenant_id' => $tenant->id,
                'status' => $status,
                'payment_method' => $validated['payment_method'] ?? ($plan->price > 0 ? 'bank_transfer' : 'free'),
                'payment_reference' => $validated['payment_reference'] ?? null,
                'payment_receipt_url' => $validated['payment_receipt_url'] ?? null,
                'payment_notes' => $validated['payment_notes'] ?? null,
                'trial_ends_at' => $plan->trial_days > 0 ? now()->addDays($plan->trial_days) : null,
                'current_period_start' => now(),
                'current_period_end' => now()->addMonth(),
            ]);
        });

        return response()->json(new SubscriptionResource($subscription->load('plan')), 201);
    }
}