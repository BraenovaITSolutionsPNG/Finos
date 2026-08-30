<?php

namespace Database\Seeders;

use App\Models\BankAccount;
use App\Models\Budget;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\Project;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\TenantUser;
use App\Models\User;
use App\Models\Vendor;
use App\Services\Ledger;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::create([
            'name' => 'Demo Company Ltd',
            'slug' => 'demo-company',
            'country' => 'PG',
            'currency' => 'PGK',
        ]);

        $user = User::create([
            'name' => 'Demo Owner',
            'email' => 'demo@finos.pg',
            'password' => Hash::make('password'),
            'current_tenant_id' => $tenant->id,
        ]);

        TenantUser::create([
            'tenant_id' => $tenant->id,
            'user_id' => $user->id,
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        Auth::login($user);

        (new Ledger)->ensureAccounts();

        \App\Models\TaxRate::create(['name' => 'GST', 'rate' => 10, 'type' => 'both', 'is_default' => true, 'is_active' => true]);

        $customers = Customer::factory(6)->create();
        $vendors = Vendor::factory(4)->create();
        Employee::factory(4)->create();
        $projects = Project::factory(3)->create();

        $invoices = Invoice::factory(12)->create(['customer_id' => fn () => $customers->random()->id]);
        foreach ($invoices as $inv) {
            if ($inv->status !== 'draft') {
                (new Ledger)->postInvoice($inv);
            }
        }

        $bills = \App\Models\Bill::factory(8)->create(['vendor_id' => fn () => $vendors->random()->id]);
        foreach ($bills as $bill) {
            if ($bill->status !== 'draft') {
                (new Ledger)->postBill($bill);
            }
        }

        $cash = \App\Models\Account::where('subtype', 'accounts_receivable')->first();
        BankAccount::create([
            'name' => 'Operating Bank Account',
            'bank_name' => 'PNG Bank',
            'account_number' => '12345678',
            'currency' => 'PGK',
            'opening_balance' => 50000,
            'current_balance' => 50000,
        ]);

        Budget::create(['account_id' => $cash->id ?? 1, 'year' => (int) date('Y'), 'month' => 0, 'amount' => 60000]);
        Budget::create(['account_id' => 1, 'year' => (int) date('Y'), 'month' => 0, 'amount' => 30000]);

        Notification::create([
            'title' => 'Welcome to FinOS',
            'body' => 'Your demo workspace is ready. Explore invoicing, banking and reports.',
            'type' => 'system',
        ]);

        $pro = \App\Models\Plan::where('slug', 'pro')->first();
        if ($pro) {
            Subscription::create([
                'plan_id' => $pro->id,
                'tenant_id' => $tenant->id,
                'status' => 'trialing',
                'trial_ends_at' => now()->addDays(14),
                'current_period_start' => now(),
                'current_period_end' => now()->addMonth(),
            ]);
        }

        Auth::logout();
    }
}
