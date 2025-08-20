<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Company;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Offer;
use App\Models\OfferItem;
use App\Models\Container;
use App\Models\ContainerItem;
use App\Models\ImporterSupplier;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Isključi foreign key check (za MySQL)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // 2) Očisti sve relevantne tabele
        User::truncate();
        Company::truncate();
        Category::truncate();
        Product::truncate();
        ProductImage::truncate();
        Offer::truncate();
        OfferItem::truncate();
        Container::truncate();
        ContainerItem::truncate();
        ImporterSupplier::truncate();

        // 3) Ponovo uključi foreign key check
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 4) Pozovi seedere
        $this->call([
            CompanySeeder::class,
            CategorySeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            ProductImageSeeder::class,
            OfferSeeder::class,
            OfferItemSeeder::class,
            ContainerSeeder::class,
            ContainerItemSeeder::class,
            ImporterSupplierSeeder::class,
        ]);
    }
}
