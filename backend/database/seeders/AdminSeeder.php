<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\TenantUser;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('is_admin', true)->exists()) {
            return;
        }

        $tenant = Tenant::create([
            'name' => 'FinOS Platform',
            'slug' => 'finos-platform',
            'country' => 'PG',
            'currency' => 'PGK',
            'status' => 'active',
        ]);

        $admin = User::create([
            'name' => 'FinOS Administrator',
            'email' => 'admin@finos.app',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'current_tenant_id' => $tenant->id,
        ]);

        TenantUser::create([
            'tenant_id' => $tenant->id,
            'user_id' => $admin->id,
            'role' => 'owner',
            'joined_at' => now(),
        ]);
    }
}
