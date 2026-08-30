<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'position' => $this->faker->jobTitle(),
            'salary' => $this->faker->randomFloat(2, 2000, 12000),
            'currency' => 'PGK',
            'pay_frequency' => 'monthly',
            'hired_at' => $this->faker->dateTimeBetween('-2 years', '-1 month')->format('Y-m-d'),
            'is_active' => true,
        ];
    }
}
