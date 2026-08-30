<?php

namespace Database\Factories;

use App\Models\TaxRate;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaxRateFactory extends Factory
{
    protected $model = TaxRate::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['GST', 'VAT', 'SST']),
            'rate' => $this->faker->randomElement([10, 12.5, 15]),
            'type' => 'both',
            'is_default' => false,
            'is_active' => true,
        ];
    }
}
