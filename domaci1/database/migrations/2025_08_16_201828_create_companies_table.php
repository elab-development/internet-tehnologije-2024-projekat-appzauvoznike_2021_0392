<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['importer','supplier']);
            $table->string('tax_id')->nullable();
            $table->string('country');
              $table->string('CEO');
            $table->string('city');
            $table->string('address');
            $table->string('zip');
            $table->string('website');
            $table->string('contact_email');
            $table->string('contact_phone');
            $table->json('capabilities');
            $table->string('countries_served');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
};
