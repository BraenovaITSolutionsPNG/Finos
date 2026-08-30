<?php

namespace App\Providers;

use App\Models\Bill;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'invoice' => Invoice::class,
            'bill' => Bill::class,
        ]);
    }
}
