<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Tenant;

class Subscription extends Model
{
    protected $fillable = [
        'plan_id',
        'tenant_id',
        'status',
        'payment_method',
        'payment_reference',
        'payment_receipt_url',
        'payment_notes',
        'trial_ends_at',
        'current_period_start',
        'current_period_end',
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}