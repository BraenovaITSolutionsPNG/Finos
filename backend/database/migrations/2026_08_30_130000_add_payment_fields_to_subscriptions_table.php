<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('plan_id');
            $table->string('payment_reference')->nullable()->after('payment_method');
            $table->string('payment_receipt_url')->nullable()->after('payment_reference');
            $table->text('payment_notes')->nullable()->after('payment_receipt_url');
        });

        // Update status column to varchar to accommodate pending/suspended/rejected statuses
        DB::statement("ALTER TABLE subscriptions ALTER COLUMN status TYPE VARCHAR(255);");
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_reference',
                'payment_receipt_url',
                'payment_notes',
            ]);
        });
    }
};
