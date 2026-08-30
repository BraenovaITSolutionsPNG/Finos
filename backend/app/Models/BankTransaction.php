<?php

namespace App\Models;

use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankTransaction extends Model
{
    use TenantScoped;

    protected $fillable = [
        'tenant_id',
        'bank_account_id',
        'date',
        'description',
        'reference',
        'type',
        'amount',
        'matched_journal_line_id',
        'is_reconciled',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
        'is_reconciled' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    public function matchedLine(): BelongsTo
    {
        return $this->belongsTo(JournalLine::class, 'matched_journal_line_id');
    }
}
