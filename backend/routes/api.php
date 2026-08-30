<?php

use App\Http\Controllers\Api\AccountingController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\BillController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\BusinessSettingsController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\ImportExportController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TaxRateController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\VendorController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('tenants', [TenantController::class, 'index']);
    Route::post('tenants', [TenantController::class, 'store']);
    Route::get('tenants/{tenant}', [TenantController::class, 'show']);
    Route::put('tenants/{tenant}', [TenantController::class, 'update']);
    Route::post('tenants/{tenant}/switch', [TenantController::class, 'switch']);

    Route::get('tenants/{tenant}/members', [TenantController::class, 'members']);
    Route::post('tenants/{tenant}/members/invite', [TenantController::class, 'invite']);
    Route::put('tenants/{tenant}/members/{user}/role', [TenantController::class, 'updateRole']);
    Route::delete('tenants/{tenant}/members/{user}', [TenantController::class, 'remove']);

    Route::get('dashboard/kpis', [DashboardController::class, 'kpis']);

    Route::post('upload', [UploadController::class, 'store']);

    Route::get('accounts', [AccountingController::class, 'accounts']);
    Route::post('accounts', [AccountingController::class, 'storeAccount']);
    Route::get('accounts/{account}', [AccountingController::class, 'showAccount']);
    Route::put('accounts/{account}', [AccountingController::class, 'updateAccount']);
    Route::delete('accounts/{account}', [AccountingController::class, 'destroyAccount']);

    Route::get('journals', [AccountingController::class, 'journals']);
    Route::post('journals', [AccountingController::class, 'storeJournal']);
    Route::get('journals/{journal_entry}', [AccountingController::class, 'showJournal']);
    Route::get('ledger', [AccountingController::class, 'ledger']);
    Route::post('opening-balances', [AccountingController::class, 'storeOpeningBalance']);

    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('vendors', VendorController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::post('invoices/{invoice}/send', [InvoiceController::class, 'send']);
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'pdf']);
    Route::apiResource('bills', BillController::class);
    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('payments', [PaymentController::class, 'store']);

    Route::apiResource('tax-rates', TaxRateController::class);

    Route::get('bank-accounts', [BankController::class, 'accounts']);
    Route::post('bank-accounts', [BankController::class, 'storeAccount']);
    Route::get('bank-accounts/{bank_account}', [BankController::class, 'showAccount']);
    Route::put('bank-accounts/{bank_account}', [BankController::class, 'updateAccount']);
    Route::delete('bank-accounts/{bank_account}', [BankController::class, 'destroyAccount']);
    Route::get('bank-accounts/{bank_account}/transactions', [BankController::class, 'transactions']);
    Route::post('bank-accounts/{bank_account}/transactions', [BankController::class, 'storeTransaction']);
    Route::get('bank-accounts/{bank_account}/summary', [BankController::class, 'summary']);
    Route::post('bank-transactions/{bank_transaction}/reconcile', [BankController::class, 'reconcile']);
    Route::post('bank-transactions/{bank_transaction}/unreconcile', [BankController::class, 'unreconcile']);
    Route::get('bank/reconciliation-summary', [BankController::class, 'reconciliationSummary']);

    Route::get('budgets/comparison', [BudgetController::class, 'comparison']);
    Route::apiResource('budgets', BudgetController::class);

    Route::get('plans', [SubscriptionController::class, 'plans']);
    Route::get('subscription', [SubscriptionController::class, 'current']);
    Route::post('subscription', [SubscriptionController::class, 'subscribe']);

    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('employees', EmployeeController::class);

    Route::get('payroll', [PayrollController::class, 'index']);
    Route::post('payroll/process', [PayrollController::class, 'process']);
    Route::get('payroll/{payroll_run}', [PayrollController::class, 'show']);
    Route::post('payroll/{payroll_run}/mark-paid', [PayrollController::class, 'markPaid']);

    Route::get('audit-logs', [AuditController::class, 'index']);
    Route::get('audit-logs/{audit_log}', [AuditController::class, 'show']);

    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markRead']);

    Route::get('search', [SearchController::class, 'global']);

    Route::get('business-settings', [BusinessSettingsController::class, 'show']);
    Route::put('business-settings', [BusinessSettingsController::class, 'update']);

    

    Route::get('export/customers', [ImportExportController::class, 'exportCustomers']);
    Route::get('export/invoices', [ImportExportController::class, 'exportInvoices']);
    Route::post('import/customers', [ImportExportController::class, 'importCustomers']);
    Route::post('import/invoices', [ImportExportController::class, 'importInvoices']);

    Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
        Route::get('stats', [AdminController::class, 'stats']);
        Route::get('tenants', [AdminController::class, 'tenants']);
        Route::get('users', [AdminController::class, 'users']);
        Route::post('tenants/{tenant}/suspend', [AdminController::class, 'suspend']);
        Route::post('tenants/{tenant}/activate', [AdminController::class, 'activate']);
    });
});
