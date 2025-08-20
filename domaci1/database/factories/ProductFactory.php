<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Company;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'supplier_company_id' => Company::factory(['type'=>'supplier']),
            'category_id'         => Category::factory(),
            'code'        => strtoupper($this->faker->unique()->bothify('PRD-####')),
            'name'        => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'image_url'   => $this->faker->imageUrl(400, 400, 'products'),
            'length_mm'   => $this->faker->numberBetween(50,200),
            'width_mm'    => $this->faker->numberBetween(50,200),
            'height_mm'   => $this->faker->numberBetween(50,200),
            'weight_g'    => $this->faker->numberBetween(100,10000),
            'base_price'  => $this->faker->randomFloat(2,5,500),
            'currency'    => 'EUR',
            'characteristics' => ['color'=>'red','material'=>'plastic'],
            'is_active'   => true,
        ];
    }
}
