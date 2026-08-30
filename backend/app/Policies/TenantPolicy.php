<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Access\HandlesAuthorization;

abstract class TenantPolicy
{
    use HandlesAuthorization;

    protected function owns(Model $model, User $user): bool
    {
        if (empty($user->current_tenant_id)) {
            return false;
        }

        return (int) ($model->tenant_id ?? null) === (int) $user->current_tenant_id;
    }

    protected function viewer(User $user): bool
    {
        return \App\Support\TenantContext::can('finance:view');
    }

    protected function editor(User $user): bool
    {
        return \App\Support\TenantContext::can('finance:create');
    }

    protected function admin(User $user): bool
    {
        return \App\Support\TenantContext::can('tenant:manage');
    }
}
