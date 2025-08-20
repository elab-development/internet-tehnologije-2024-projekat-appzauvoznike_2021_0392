<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name'       => $this->faker->name(),
            'email'      => $this->faker->unique()->safeEmail(),
            'password'   => bcrypt('password'),
            'phone'      => $this->faker->phoneNumber(),
            'role'       => $this->faker->randomElement(['admin','importer','supplier']),
            'company_id' => Company::factory(),
            'remember_token' => Str::random(10),
        ];
    }
}
