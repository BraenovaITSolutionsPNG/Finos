<?php

namespace App\Models;

use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpeningBalance extends Model
{
    use TenantScoped;

    protected $fillable = [
        'tenant_id',
        'account_id',
        'as_of_date',
        'debit',
        'credit',
        'notes',
    ];

    protected $casts = [
        'as_of_date' => 'date',
        'debit' => 'decimal:4',
        'credit' => 'decimal:4',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
