<?php

namespace App\Models;

use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillItem extends Model
{
    use TenantScoped;

    public $timestamps = false;

    protected $fillable = [
        'tenant_id',
        'bill_id',
        'description',
        'quantity',
        'unit_price',
        'tax_rate',
        'amount',
    ];

    protected $casts = [
        'quantity' => 'decimal:4',
        'unit_price' => 'decimal:4',
        'tax_rate' => 'decimal:4',
        'amount' => 'decimal:4',
    ];

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function (self $item) {
            $item->amount = ($item->quantity ?: 0) * ($item->unit_price ?: 0);
        });
    }
}
