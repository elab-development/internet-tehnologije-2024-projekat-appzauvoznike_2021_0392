<?php

namespace Database\Factories;

use App\Models\Offer;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferFactory extends Factory
{
    protected $model = Offer::class;

    public function definition(): array
    {
        return [
            'supplier_company_id' => Company::factory(['type'=>'supplier']),
            'title'       => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'valid_from'  => $this->faker->dateTimeBetween('-1 month','now'),
            'valid_to'    => $this->faker->dateTimeBetween('now','+3 months'),
            'incoterm'    => $this->faker->randomElement(['CIF','FOB','DAP']),
            'payment_terms' => 'Net 30',
            'lead_time_days' => $this->faker->numberBetween(7,60),
            'status'      => $this->faker->randomElement(['draft','published','archived']),
        ];
    }
}
