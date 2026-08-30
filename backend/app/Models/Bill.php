<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    use TenantScoped;
    use Auditable;
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'vendor_id',
        'project_id',
        'number',
        'issue_date',
        'due_date',
        'status',
        'currency',
        'subtotal',
        'tax',
        'total',
        'amount_paid',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:4',
        'tax' => 'decimal:4',
        'total' => 'decimal:4',
        'amount_paid' => 'decimal:4',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function journalEntries(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(JournalEntry::class, 'document');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BillItem::class);
    }

    public function recalculate(): void
    {
        $subtotal = 0;
        $tax = 0;
        foreach ($this->items as $item) {
            $subtotal += $item->amount;
            $tax += $item->amount * ($item->tax_rate / 100);
        }
        $this->subtotal = $subtotal;
        $this->tax = $tax;
        $this->total = $subtotal + $tax;
        if ($this->total <= $this->amount_paid) {
            $this->status = 'paid';
        } elseif ($this->amount_paid > 0) {
            $this->status = 'partially_paid';
        }
    }

    public function amountDue(): float
    {
        return max(0, $this->total - $this->amount_paid);
    }
}
