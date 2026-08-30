<?php

namespace Database\Factories;

use App\Models\Bill;
use Illuminate\Database\Eloquent\Factories\Factory;

class BillFactory extends Factory
{
    protected $model = Bill::class;

    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 100, 5000);

        return [
            'number' => 'BILL-'.strtoupper($this->faker->unique()->bothify('####')),
            'issue_date' => $this->faker->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'status' => $this->faker->randomElement(['draft', 'received', 'paid', 'partially_paid']),
            'currency' => 'PGK',
            'subtotal' => $subtotal,
            'tax' => round($subtotal * 0.1, 2),
            'total' => round($subtotal * 1.1, 2),
            'amount_paid' => 0,
        ];
    }
}
