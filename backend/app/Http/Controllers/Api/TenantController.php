<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\InviteMemberRequest;
use App\Http\Requests\TenantStoreRequest;
use App\Http\Requests\UpdateMemberRoleRequest;
use App\Http\Resources\MemberResource;
use App\Http\Resources\TenantResource;
use App\Models\Invitation;
use App\Models\Tenant;
use App\Models\User;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    public function index(): JsonResponse
    {
        $tenants = auth()->user()->tenants()->get();

        return response()->json(TenantResource::collection($tenants));
    }

    public function store(TenantStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = auth()->user();

        $tenant = Tenant::create([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']).'-'.Str::random(6),
            'country' => $data['country'] ?? 'PG',
            'currency' => $data['currency'] ?? 'PGK',
            'locale' => $data['locale'] ?? 'en_PG',
        ]);

        $tenant->users()->attach($user->id, [
            'role' => Role::OWNER->value,
            'joined_at' => now(),
        ]);

        $user->update(['current_tenant_id' => $tenant->id]);

        (new \App\Services\Ledger)->ensureAccounts($tenant);

        return response()->json(new TenantResource($tenant), 201);
    }

    public function show(Tenant $tenant): JsonResponse
    {
        abort_unless(TenantContext::tenant()?->id === $tenant->id, 403);

        return response()->json(new TenantResource($tenant));
    }

    public function update(TenantStoreRequest $request, Tenant $tenant): JsonResponse
    {
        abort_unless(TenantContext::tenant()?->id === $tenant->id, 403);
        abort_unless(TenantContext::can('tenant:update'), 403);

        $tenant->update($request->validated());

        return response()->json(new TenantResource($tenant));
    }

    public function switch(Tenant $tenant): JsonResponse
    {
        abort_unless(auth()->user()->tenants()->where('tenant_id', $tenant->id)->exists(), 403);

        auth()->user()->update(['current_tenant_id' => $tenant->id]);

        return response()->json([
            'message' => 'Tenant context switched.',
            'tenant' => new TenantResource($tenant),
        ]);
    }

    public function members(Tenant $tenant): JsonResponse
    {
        abort_unless(TenantContext::tenant()?->id === $tenant->id, 403);
        abort_unless(TenantContext::can('member:view'), 403);

        $members = $tenant->users()->get();

        return response()->json(MemberResource::collection($members));
    }

    public function invite(InviteMemberRequest $request, Tenant $tenant): JsonResponse
    {
        abort_unless(TenantContext::tenant()?->id === $tenant->id, 403);
        abort_unless(TenantContext::can('member:invite'), 403);

        $data = $request->validated();

        $invitation = Invitation::create([
            'tenant_id' => $tenant->id,
            'email' => $data['email'],
            'role' => $data['role'],
            'token' => Str::random(64),
            'invited_by' => auth()->id(),
            'expires_at' => now()->addDays(7),
        ]);

        // Notification dispatch hook (queueable) would be wired here.
        // Mail::to($data['email'])->send(new TenantInvitation($invitation));

        return response()->json([
            'message' => 'Invitation created.',
            'invitation_id' => $invitation->id,
        ], 201);
    }

    public function updateRole(UpdateMemberRoleRequest $request, Tenant $tenant, User $user): JsonResponse
    {
        abort_unless(TenantContext::tenant()?->id === $tenant->id, 403);
        abort_unless(TenantContext::can('member:update'), 403);

        $tenant->users()->updateExistingPivot($user->id, [
            'role' => $request->validated()['role'],
        ]);

        return response()->json(['message' => 'Member role updated.']);
    }

    public function remove(Tenant $tenant, User $user): JsonResponse
    {
        abort_unless(TenantContext::tenant()?->id === $tenant->id, 403);
        abort_unless(TenantContext::can('member:remove'), 403);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot remove yourself.'], 422);
        }

        $tenant->users()->detach($user->id);

        return response()->json(['message' => 'Member removed.']);
    }
}
