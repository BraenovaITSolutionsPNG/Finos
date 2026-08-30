<?php

namespace App\Models;

use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollRun extends Model
{
    use TenantScoped;

    protected $fillable = [
        'tenant_id',
        'created_by',
        'period_start',
        'period_end',
        'status',
        'employee_count',
        'total_gross',
        'total_deductions',
        'total_net',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'employee_count' => 'integer',
        'total_gross' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'total_net' => 'decimal:2',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class);
    }
}
