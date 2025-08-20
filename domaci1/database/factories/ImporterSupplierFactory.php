<?php

namespace Database\Factories;

use App\Models\ImporterSupplier;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class ImporterSupplierFactory extends Factory
{
    protected $model = ImporterSupplier::class;

    public function definition(): array
    {
        return [
            'importer_company_id' => Company::factory(['type'=>'importer']),
            'supplier_company_id' => Company::factory(['type'=>'supplier']),
            'status' => $this->faker->randomElement(['pending','active','blocked']),
            'started_at' => $this->faker->dateTimeBetween('-6 months','now'),
            'ended_at'   => null,
            'notes'      => $this->faker->sentence(),
        ];
    }
}
