<?php

namespace App\Models;

use App\Models\Concerns\TenantScoped;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payslip extends Model
{
    use TenantScoped;

    protected $fillable = [
        'tenant_id',
        'payroll_run_id',
        'employee_id',
        'gross',
        'deductions',
        'net',
        'details',
    ];

    protected $casts = [
        'gross' => 'decimal:2',
        'deductions' => 'decimal:2',
        'net' => 'decimal:2',
        'details' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function payrollRun(): BelongsTo
    {
        return $this->belongsTo(PayrollRun::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
