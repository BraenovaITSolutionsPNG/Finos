<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class TenantUser extends Pivot
{
    use HasFactory;

    protected $table = 'tenant_user';

    protected $fillable = [
        'tenant_id',
        'user_id',
        'role',
        'invited_by',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];
}
