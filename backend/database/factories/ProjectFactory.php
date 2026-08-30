<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'code' => strtoupper($this->faker->unique()->bothify('PRJ###')),
            'status' => $this->faker->randomElement(['planned', 'active', 'completed']),
            'start_date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'end_date' => $this->faker->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
            'budget' => $this->faker->randomFloat(2, 5000, 100000),
            'description' => $this->faker->sentence(),
        ];
    }
}
