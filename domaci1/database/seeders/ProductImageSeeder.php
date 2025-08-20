<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductImage;
use App\Models\Product;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        ProductImage::factory()->count(30)->create([
            'product_id' => Product::factory(),
        ]);
    }
}
