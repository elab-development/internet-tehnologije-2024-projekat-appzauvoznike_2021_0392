<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OfferItem;
use App\Models\Offer;
use App\Models\Product;

class OfferItemSeeder extends Seeder
{
    public function run(): void
    {
        OfferItem::factory()->count(30)->create([
            'offer_id'   => Offer::factory(),
            'product_id' => Product::factory(),
        ]);
    }
}
