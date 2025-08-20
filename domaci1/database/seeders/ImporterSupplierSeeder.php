<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ImporterSupplier;
use App\Models\Company;

class ImporterSupplierSeeder extends Seeder
{
    public function run(): void
    {
        ImporterSupplier::factory()->count(10)->create([
            'importer_company_id' => Company::factory(['type'=>'importer']),
            'supplier_company_id' => Company::factory(['type'=>'supplier']),
        ]);
    }
}
