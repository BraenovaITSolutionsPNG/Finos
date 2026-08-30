<?php

namespace App\Support;

use App\Enums\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TenantContext
{
    public static function tenant(): ?Tenant
    {
        $user = Auth::user();

        if (! $user) {
            return null;
        }

        return $user->currentTenant ?? $user->tenants()->first();
    }

    public static function role(): ?Role
    {
        $user = Auth::user();
        $tenant = self::tenant();

        if (! $user || ! $tenant) {
            return null;
        }

        $role = $user->roleIn($tenant);

        return $role ? Role::from($role) : null;
    }

    public static function can(string $ability): bool
    {
        return self::role()?->can($ability) ?? false;
    }

    public static function requireTenant(): Tenant
    {
        $tenant = self::tenant();

        if (! $tenant) {
            abort(403, 'No tenant context selected.');
        }

        return $tenant;
    }
}
