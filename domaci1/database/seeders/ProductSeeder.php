<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Company;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()->count(20)->create([
            'supplier_company_id' => Company::factory(['type'=>'supplier']),
            'category_id'         => Category::factory(),
        ]);
    }
}
