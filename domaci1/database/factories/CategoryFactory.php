<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'parent_id'   => null,
            'name'        => $this->faker->word(),
            'slug'        => Str::slug($this->faker->unique()->word()),
            'description' => $this->faker->sentence(),
        ];
    }
}
