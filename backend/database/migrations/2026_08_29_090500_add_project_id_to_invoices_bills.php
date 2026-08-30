<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('customer_id')->constrained('projects')->nullOnDelete();
        });
        Schema::table('bills', function (Blueprint $table) {
            $table->foreignId('project_id')->nullable()->after('vendor_id')->constrained('projects')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropConstrainedForeignId('project_id');
        });
        Schema::table('bills', function (Blueprint $table) {
            $table->dropConstrainedForeignId('project_id');
        });
    }
};
