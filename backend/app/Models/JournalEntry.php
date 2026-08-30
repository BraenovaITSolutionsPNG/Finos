<?php

namespace App\Models;

use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalEntry extends Model
{
    use TenantScoped;

    protected $fillable = [
        'tenant_id',
        'reference',
        'date',
        'description',
        'status',
        'created_by',
        'document_type',
        'document_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function lines(): HasMany
    {
        return $this->hasMany(JournalLine::class);
    }

    public function document(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }

    public function isBalanced(): bool
    {
        $debit = $this->lines->sum('debit');
        $credit = $this->lines->sum('credit');

        return abs($debit - $credit) < 0.0001;
    }
}
