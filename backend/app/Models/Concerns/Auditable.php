<?php

namespace App\Models\Concerns;

use App\Models\AuditLog;
use App\Support\TenantContext;
use Illuminate\Database\Eloquent\Model;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            self::log($model, 'created');
        });

        static::updated(function (Model $model) {
            $changed = $model->getChanges();
            unset($changed['updated_at']);
            if (empty($changed)) {
                return;
            }
            self::log($model, 'updated', $model->getOriginal(), $changed);
        });

        static::deleted(function (Model $model) {
            self::log($model, $model->isForceDeleting() ? 'force_deleted' : 'deleted');
        });
    }

    protected static function log(Model $model, string $event, ?array $old = null, ?array $new = null): void
    {
        if (! auth()->check()) {
            return;
        }
        AuditLog::create([
            'tenant_id' => TenantContext::tenant()?->id,
            'user_id' => auth()->id(),
            'event' => $event,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'old_values' => $old ? array_intersect_key($old, $new ?? $model->getChanges()) : null,
            'new_values' => $new,
            'ip_address' => function_exists('request') && request() ? request()->ip() : null,
        ]);
    }
}
