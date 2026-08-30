<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\TenantResource;
use App\Http\Resources\UserResource;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $tenant = Tenant::create([
            'name' => $data['tenant_name'],
            'slug' => $data['slug'] ?? Str::slug($data['tenant_name']).'-'.Str::random(6),
            'country' => $data['country'] ?? 'PG',
            'currency' => $data['currency'] ?? 'PGK',
            'locale' => 'en_PG',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'current_tenant_id' => $tenant->id,
        ]);

        $tenant->users()->attach($user->id, [
            'role' => Role::OWNER->value,
            'joined_at' => now(),
        ]);

        $token = $user->createToken($data['device_name'] ?? 'finos-web')->plainTextToken;

        (new \App\Services\Ledger)->ensureAccounts($tenant);

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
            'tenant' => new TenantResource($tenant),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! \Illuminate\Support\Facades\Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Account is disabled.'], 403);
        }

        if (! $user->current_tenant_id) {
            $first = $user->tenants()->first();
            $user->update(['current_tenant_id' => $first?->id]);
        }

        $token = $user->createToken($data['device_name'] ?? 'finos-web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
            'tenant' => $user->currentTenant ? new TenantResource($user->currentTenant) : null,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'user' => new UserResource($user),
            'tenant' => $user->currentTenant ? new TenantResource($user->currentTenant) : null,
            'tenants' => TenantResource::collection($user->tenants),
        ]);
    }
}
