<?php

namespace Database\Factories;

use App\Models\OfferItem;
use App\Models\Offer;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OfferItemFactory extends Factory
{
    protected $model = OfferItem::class;

    public function definition(): array
    {
        return [
            'offer_id'   => Offer::factory(),
            'product_id' => Product::factory(),
            'unit_price' => $this->faker->randomFloat(2,10,500),
            'currency'   => 'EUR',
            'min_order_qty' => $this->faker->numberBetween(1,50),
            'pack_qty'   => $this->faker->numberBetween(1,10),
            'import_cost_per_unit' => $this->faker->randomFloat(2,1,50),
            'discount_percent'     => $this->faker->randomFloat(2,0,20),
            'notes' => $this->faker->sentence(),
        ];
    }
}
