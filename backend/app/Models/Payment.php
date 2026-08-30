<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    use TenantScoped;
    use Auditable;

    protected $fillable = [
        'tenant_id',
        'payable_type',
        'payable_id',
        'account_id',
        'date',
        'amount',
        'method',
        'reference',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:4',
    ];

    public function payable(): MorphTo
    {
        return $this->morphTo();
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
