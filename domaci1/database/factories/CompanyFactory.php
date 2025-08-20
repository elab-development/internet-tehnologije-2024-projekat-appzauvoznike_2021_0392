<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition(): array
    {
        return [
            'name'             => $this->faker->company(),
            'type'             => $this->faker->randomElement(['importer','supplier']),
            'tax_id'           => $this->faker->unique()->numerify('########'),
            'country'          => $this->faker->country(),
            'city'             => $this->faker->city(),
            'address'          => $this->faker->streetAddress(),
            'zip'              => $this->faker->postcode(),
            'website'          => $this->faker->url(),
            'contact_email'    => $this->faker->companyEmail(),
            'contact_phone'    => $this->faker->phoneNumber(),
            'capabilities'     => ['shipping','warehouse'],
            'countries_served' => $this->faker->country(),
            'is_active'        => true,
        ];
    }
}
