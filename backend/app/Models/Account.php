<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use TenantScoped;
    use Auditable;
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'code',
        'name',
        'type',
        'subtype',
        'parent_id',
        'description',
        'is_active',
        'opening_balance',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'opening_balance' => 'decimal:4',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function journalLines(): HasMany
    {
        return $this->hasMany(JournalLine::class);
    }
}
