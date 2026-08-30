<?php

namespace App\Models;

use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use TenantScoped;
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'position',
        'salary',
        'currency',
        'pay_frequency',
        'hired_at',
        'is_active',
    ];

    protected $casts = [
        'salary' => 'decimal:2',
        'hired_at' => 'date',
        'is_active' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class);
    }
}
