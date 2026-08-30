<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlansSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            ['name' => 'Free', 'slug' => 'free', 'price' => 0, 'interval' => 'monthly', 'trial_days' => 0, 'features' => ['1 user', 'Basic accounting'], 'is_active' => true],
            ['name' => 'Starter', 'slug' => 'starter', 'price' => 19, 'interval' => 'monthly', 'trial_days' => 14, 'features' => ['5 users', 'Invoicing', 'Reports'], 'is_active' => true],
            ['name' => 'Pro', 'slug' => 'pro', 'price' => 49, 'interval' => 'monthly', 'trial_days' => 14, 'features' => ['Unlimited users', 'Projects', 'Payroll', 'Multi-currency'], 'is_active' => true],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
