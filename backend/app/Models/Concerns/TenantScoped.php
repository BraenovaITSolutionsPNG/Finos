<?php

namespace App\Models\Concerns;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

trait TenantScoped
{
    use SoftDeletes;

    public static function bootTenantScoped(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            if ($tenantId = \App\Support\TenantContext::tenant()?->id) {
                $builder->where((new static)->getTable().'.tenant_id', $tenantId);
            }
        });

        static::creating(function (Model $model) {
            if (empty($model->tenant_id) && ($tenantId = \App\Support\TenantContext::tenant()?->id)) {
                $model->tenant_id = $tenantId;
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
