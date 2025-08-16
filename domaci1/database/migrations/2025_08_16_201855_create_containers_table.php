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
        Schema::create('containers', function (Blueprint $table) {
             $table->id();
            $table->foreignId('importer_company_id')->constrained('companies')->onDelete('cascade');
            $table->string('container_type');
            $table->integer('inner_length_mm')->nullable();
            $table->integer('inner_width_mm')->nullable();
            $table->integer('inner_height_mm')->nullable();
            $table->decimal('max_weight_kg',10,2)->nullable();
            $table->decimal('max_volume_m3',10,3)->nullable();
            $table->decimal('estimated_freight_cost',10,2)->nullable();
            $table->string('currency',3)->default('EUR');
            $table->enum('status',['draft','planned','shipped','delivered','canceled'])->default('draft');
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
        Schema::dropIfExists('containers');
    }
};
