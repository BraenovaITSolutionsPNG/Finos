<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id');
            $table->foreignId('vendor_id');
            $table->string('number')->nullable();
            $table->date('issue_date');
            $table->date('due_date')->nullable();
            $table->string('status')->default('draft'); // draft, received, partially_paid, paid, void
            $table->string('currency', 3)->nullable();
            $table->decimal('subtotal', 20, 4)->default(0);
            $table->decimal('tax', 20, 4)->default(0);
            $table->decimal('total', 20, 4)->default(0);
            $table->decimal('amount_paid', 20, 4)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('vendor_id')->references('id')->on('vendors')->cascadeOnDelete();
            $table->index(['tenant_id', 'status']);
        });

        Schema::create('bill_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id');
            $table->foreignId('bill_id');
            $table->string('description')->nullable();
            $table->decimal('quantity', 20, 4)->default(1);
            $table->decimal('unit_price', 20, 4)->default(0);
            $table->decimal('tax_rate', 8, 4)->default(0);
            $table->decimal('amount', 20, 4)->default(0);
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('bill_id')->references('id')->on('bills')->cascadeOnDelete();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id');
            $table->string('payable_type'); // invoice, bill
            $table->foreignId('payable_id');
            $table->foreignId('account_id')->nullable(); // bank/cash account
            $table->date('date');
            $table->decimal('amount', 20, 4)->default(0);
            $table->string('method')->nullable(); // cash, bank, card
            $table->string('reference')->nullable();
            $table->foreignId('created_by')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('account_id')->references('id')->on('accounts')->nullOnDelete();
            $table->index(['tenant_id', 'payable_type', 'payable_id']);
        });

        Schema::create('opening_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id');
            $table->foreignId('account_id');
            $table->date('as_of_date');
            $table->decimal('debit', 20, 4)->default(0);
            $table->decimal('credit', 20, 4)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->foreign('account_id')->references('id')->on('accounts')->cascadeOnDelete();
            $table->unique(['tenant_id', 'account_id', 'as_of_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opening_balances');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bill_items');
        Schema::dropIfExists('bills');
    }
};
