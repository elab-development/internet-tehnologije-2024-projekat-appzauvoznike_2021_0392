<?php

namespace Database\Factories;

use App\Models\ContainerItem;
use App\Models\Container;
use App\Models\OfferItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContainerItemFactory extends Factory
{
    protected $model = ContainerItem::class;

    public function definition(): array
    {
        return [
            'container_id' => Container::factory(),
            'offer_item_id'=> OfferItem::factory(),
            'quantity'     => $this->faker->numberBetween(1,500),
            'item_length_mm' => $this->faker->numberBetween(50,200),
            'item_width_mm'  => $this->faker->numberBetween(50,200),
            'item_height_mm' => $this->faker->numberBetween(50,200),
            'item_weight_g'  => $this->faker->numberBetween(100,10000),
            'unit_price'     => $this->faker->randomFloat(2,5,500),
            'import_cost_per_unit' => $this->faker->randomFloat(2,1,30),
            'currency'      => 'EUR',
        ];
    }
}
