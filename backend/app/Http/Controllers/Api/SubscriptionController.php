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
        $request->validate(['plan_id' => 'required|exists:plans,id']);

        $tenant = TenantContext::requireTenant();
        $plan = Plan::findOrFail($request->input('plan_id'));

        // Begin DB transaction to ensure atomicity
        DB::transaction(function () use ($tenant, $plan) {
            // Cancel any existing subscription for this tenant
            Subscription::where('tenant_id', $tenant->id)->delete();

            // Create new subscription
            $subscription = Subscription::create([
                'plan_id' => $plan->id,
                'tenant_id' => $tenant->id,
                'status' => 'active',
                'trial_ends_at' => $plan->trial_days > 0 ? now()->addDays($plan->trial_days) : null,
                'current_period_start' => now(),
                'current_period_end' => now()->add($plan->interval),
            ]);

            // If trial days exist, set status to trialing until trial_ends_at
            if ($plan->trial_days > 0) {
                $subscription->status = 'trialing';
                $subscription->save();
            }
        });

        return response()->json(new SubscriptionResource($subscription->load('plan')), 201);
    }
}