<?php

namespace Database\Factories;

use App\Models\Container;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContainerFactory extends Factory
{
    protected $model = Container::class;

    public function definition(): array
    {
        return [
            'importer_company_id' => Company::factory(['type'=>'importer']),
            'container_type' => $this->faker->randomElement(['20ft','40ft','40HC']),
            'inner_length_mm' => 12000,
            'inner_width_mm'  => 2300,
            'inner_height_mm' => 2400,
            'max_weight_kg'   => 28000,
            'max_volume_m3'   => 67.5,
            'estimated_freight_cost' => $this->faker->randomFloat(2,1000,5000),
            'currency' => 'EUR',
            'status'   => $this->faker->randomElement(['draft','planned','shipped']),
        ];
    }
}
