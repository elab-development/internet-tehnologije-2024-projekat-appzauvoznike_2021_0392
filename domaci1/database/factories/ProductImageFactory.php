<?php

namespace Database\Factories;

use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    protected $model = ProductImage::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'url'        => $this->faker->imageUrl(400,400,'products'),
            'alt'        => $this->faker->word(),
            'is_primary' => $this->faker->boolean(30),
            'sort_order' => $this->faker->numberBetween(0,10),
        ];
    }
}
