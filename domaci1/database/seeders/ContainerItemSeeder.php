<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContainerItem;
use App\Models\Container;
use App\Models\OfferItem;

class ContainerItemSeeder extends Seeder
{
    public function run(): void
    {
        ContainerItem::factory()->count(20)->create([
            'container_id' => Container::factory(),
            'offer_item_id'=> OfferItem::factory(),
        ]);
    }
}
