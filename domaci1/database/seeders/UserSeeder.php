<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::factory()->create([
            'name'  => 'Admin User',
            'email' => 'admin@example.com',
            'role'  => 'admin',
            'company_id' => null,
        ]);

        // Importer users
        User::factory(5)->create([
            'role' => 'importer',
            'company_id' => Company::factory(['type'=>'importer']),
        ]);

        // Supplier users
        User::factory(5)->create([
            'role' => 'supplier',
            'company_id' => Company::factory(['type'=>'supplier']),
        ]);
    }
}
