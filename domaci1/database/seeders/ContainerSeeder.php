<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Container;
use App\Models\Company;

class ContainerSeeder extends Seeder
{
    public function run(): void
    {
        Container::factory()->count(5)->create([
            'importer_company_id' => Company::factory(['type'=>'importer']),
        ]);
    }
}
