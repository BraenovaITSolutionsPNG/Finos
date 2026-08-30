<?php

namespace Tests\Feature\Api;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanceModulesTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Tenant $tenant;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->tenant = Tenant::create([
            'name' => 'Biz',
            'slug' => 'biz-'.uniqid(),
            'currency' => 'PGK',
        ]);
        $this->tenant->users()->attach($this->user->id, ['role' => 'owner', 'joined_at' => now()]);
        $this->user->update(['current_tenant_id' => $this->tenant->id]);
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    private function auth()
    {
        return $this->withHeader('Authorization', "Bearer {$this->token}");
    }

    public function test_can_create_account_and_balanced_journal(): void
    {
        $cash = Account::create([
            'code' => '1000', 'name' => 'Cash', 'type' => 'asset',
            'subtype' => 'cash', 'tenant_id' => $this->tenant->id, 'opening_balance' => 0,
        ]);
        $revenue = Account::create([
            'code' => '4000', 'name' => 'Revenue', 'type' => 'income', 'tenant_id' => $this->tenant->id,
        ]);

        $this->auth()->postJson('/api/accounts', [
            'code' => '1200', 'name' => 'Bank', 'type' => 'asset', 'subtype' => 'bank',
        ])->assertCreated();

        $this->auth()->postJson('/api/journals', [
            'date' => '2026-08-01',
            'description' => 'Sale',
            'lines' => [
                ['account_id' => $cash->id, 'debit' => 100, 'credit' => 0],
                ['account_id' => $revenue->id, 'debit' => 0, 'credit' => 100],
            ],
        ])->assertCreated();

        $this->auth()->postJson('/api/journals', [
            'date' => '2026-08-01',
            'lines' => [
                ['account_id' => $cash->id, 'debit' => 100, 'credit' => 0],
                ['account_id' => $revenue->id, 'debit' => 0, 'credit' => 50],
            ],
        ])->assertStatus(422);

        $ledger = $this->auth()->getJson('/api/ledger')->assertOk()->json();
        $cashRow = collect($ledger)->firstWhere('code', '1000');
        $this->assertEquals(100.0, $cashRow['balance']);
    }

    public function test_can_create_invoice_apply_payment_and_see_kpis(): void
    {
        $customer = Customer::create(['name' => 'Acme', 'tenant_id' => $this->tenant->id]);

        $resp = $this->auth()->postJson('/api/invoices', [
            'customer_id' => $customer->id,
            'number' => 'INV-001',
            'issue_date' => '2026-08-10',
            'status' => 'sent',
            'items' => [
                ['description' => 'Service', 'quantity' => 2, 'unit_price' => 50, 'tax_rate' => 0],
            ],
        ])->assertCreated()->json();

        $this->assertEquals(100.0, $resp['total']);

        $invoice = Invoice::find($resp['id']);
        $this->assertEquals('sent', $invoice->status);

        $this->auth()->postJson('/api/payments', [
            'payable_type' => 'invoice',
            'payable_id' => $invoice->id,
            'date' => '2026-08-12',
            'amount' => 100,
            'method' => 'bank',
        ])->assertCreated();

        $invoice->refresh();
        $this->assertEquals(100.0, $invoice->amount_paid);
        $this->assertEquals('paid', $invoice->status);

        $kpis = $this->auth()->getJson('/api/dashboard/kpis')->assertOk()->json();
        $this->assertEquals('PGK', $kpis['currency']);
        $this->assertEquals(0.0, $kpis['receivables']);
    }
}
