<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'code' => (string) $this->faker->unique()->numberBetween(1000, 9999),
            'name' => $this->faker->word(),
            'type' => $this->faker->randomElement(['asset', 'liability', 'income', 'expense', 'equity']),
            'subtype' => null,
            'opening_balance' => 0,
            'is_active' => true,
        ];
    }
}
