<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Bill;
use App\Models\Invoice;
use App\Models\JournalEntry;
use App\Models\JournalLine;
use App\Models\Payment;
use App\Support\TenantContext;
use Illuminate\Support\Facades\DB;

class Ledger
{
    public function ensureAccounts(?\App\Models\Tenant $tenant = null): void
    {
        $tenant ??= TenantContext::requireTenant();
        $has = fn (string $subtype) => Account::where('tenant_id', $tenant->id)
            ->where('subtype', $subtype)
            ->exists();

        $defaults = [
            ['code' => '1000', 'name' => 'Cash', 'type' => 'asset', 'subtype' => 'cash'],
            ['code' => '1100', 'name' => 'Bank Account', 'type' => 'asset', 'subtype' => 'bank'],
            ['code' => '1200', 'name' => 'Accounts Receivable', 'type' => 'asset', 'subtype' => 'accounts_receivable'],
            ['code' => '2100', 'name' => 'Accounts Payable', 'type' => 'liability', 'subtype' => 'accounts_payable'],
            ['code' => '2200', 'name' => 'Tax Payable', 'type' => 'liability', 'subtype' => 'tax_payable'],
            ['code' => '3000', 'name' => "Owner's Equity", 'type' => 'equity', 'subtype' => 'equity'],
            ['code' => '4000', 'name' => 'Sales Revenue', 'type' => 'income', 'subtype' => 'sales'],
            ['code' => '5000', 'name' => 'Operating Expenses', 'type' => 'expense', 'subtype' => 'expense'],
        ];

        foreach ($defaults as $def) {
            if (! $has($def['subtype'])) {
                Account::create(array_merge(['tenant_id' => $tenant->id, 'opening_balance' => 0, 'is_active' => true], $def));
            }
        }
    }

    protected function accountId(string $subtype, ?string $type = null): ?int
    {
        $tenant = TenantContext::requireTenant();
        $query = Account::where('tenant_id', $tenant->id)->where('subtype', $subtype);
        if ($id = $query->value('id')) {
            return $id;
        }
        if ($type) {
            return Account::where('tenant_id', $tenant->id)->where('type', $type)->value('id');
        }

        return null;
    }

    public function postInvoice(Invoice $invoice): ?JournalEntry
    {
        $this->ensureAccounts();
        if ($invoice->total <= 0) {
            return null;
        }
        $ar = $this->accountId('accounts_receivable', 'asset');
        $sales = $this->accountId('sales', 'income');
        $tax = $this->accountId('tax_payable', 'liability');

        if (! $ar || ! $sales) {
            return null;
        }

        $this->deleteFor($invoice);

        return DB::transaction(function () use ($invoice, $ar, $sales, $tax) {
            $entry = JournalEntry::create([
                'tenant_id' => $invoice->tenant_id,
                'date' => $invoice->issue_date ?? now(),
                'reference' => $invoice->number,
                'description' => 'Invoice '.$invoice->number,
                'status' => 'posted',
                'document_type' => Invoice::class,
                'document_id' => $invoice->id,
                'created_by' => auth()->id(),
            ]);
            $entry->lines()->create(['account_id' => $ar, 'debit' => $invoice->total, 'credit' => 0]);
            $entry->lines()->create(['account_id' => $sales, 'debit' => 0, 'credit' => $invoice->subtotal]);
            if ($invoice->tax > 0 && $tax) {
                $entry->lines()->create(['account_id' => $tax, 'debit' => 0, 'credit' => $invoice->tax]);
            }

            return $entry;
        });
    }

    public function postBill(Bill $bill): ?JournalEntry
    {
        $this->ensureAccounts();
        if ($bill->total <= 0) {
            return null;
        }
        $ap = $this->accountId('accounts_payable', 'liability');
        $expense = $this->accountId('expense', 'expense');
        $tax = $this->accountId('tax_payable', 'liability');

        if (! $ap || ! $expense) {
            return null;
        }

        $this->deleteFor($bill);

        return DB::transaction(function () use ($bill, $ap, $expense, $tax) {
            $entry = JournalEntry::create([
                'tenant_id' => $bill->tenant_id,
                'date' => $bill->issue_date ?? now(),
                'reference' => $bill->number,
                'description' => 'Bill '.$bill->number,
                'status' => 'posted',
                'document_type' => Bill::class,
                'document_id' => $bill->id,
                'created_by' => auth()->id(),
            ]);
            $entry->lines()->create(['account_id' => $expense, 'debit' => $bill->subtotal, 'credit' => 0]);
            if ($bill->tax > 0 && $tax) {
                $entry->lines()->create(['account_id' => $tax, 'debit' => $bill->tax, 'credit' => 0]);
            }
            $entry->lines()->create(['account_id' => $ap, 'debit' => 0, 'credit' => $bill->total]);

            return $entry;
        });
    }

    public function postPayment(Payment $payment): ?JournalEntry
    {
        $this->ensureAccounts();
        if ($payment->amount <= 0 || ! $payment->account_id) {
            return null;
        }
        $cash = $payment->account_id;
        $ar = $this->accountId('accounts_receivable', 'asset');
        $ap = $this->accountId('accounts_payable', 'liability');

        $doc = $payment->payable;
        $isBill = $doc instanceof Bill;

        $contra = $isBill ? $ap : $ar;
        if (! $contra) {
            return null;
        }

        $this->deleteFor($payment);

        return DB::transaction(function () use ($payment, $cash, $contra, $isBill) {
            $label = $isBill ? 'Bill payment' : 'Invoice payment';
            $ref = optional($payment->payable)->number ?? $payment->reference;
            $entry = JournalEntry::create([
                'tenant_id' => $payment->tenant_id,
                'date' => $payment->date,
                'reference' => $ref,
                'description' => $label.' '.$ref,
                'status' => 'posted',
                'document_type' => Payment::class,
                'document_id' => $payment->id,
                'created_by' => auth()->id(),
            ]);
            if ($isBill) {
                $entry->lines()->create(['account_id' => $contra, 'debit' => $payment->amount, 'credit' => 0]);
                $entry->lines()->create(['account_id' => $cash, 'debit' => 0, 'credit' => $payment->amount]);
            } else {
                $entry->lines()->create(['account_id' => $cash, 'debit' => $payment->amount, 'credit' => 0]);
                $entry->lines()->create(['account_id' => $contra, 'debit' => 0, 'credit' => $payment->amount]);
            }

            return $entry;
        });
    }

    public function deleteFor($document): void
    {
        JournalEntry::where('document_type', get_class($document))
            ->where('document_id', $document->id)
            ->get()
            ->each(function (JournalEntry $entry) {
                $entry->lines()->delete();
                $entry->delete();
            });
    }
}
