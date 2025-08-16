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
        Schema::create('container_items', function (Blueprint $table) {
           $table->id();
            $table->foreignId('container_id')->constrained('containers')->onDelete('cascade');
            $table->foreignId('offer_item_id')->constrained('offer_items')->onDelete('cascade');
            $table->integer('quantity');

            // snapshot vrednosti iz proizvoda/ponude
            $table->integer('item_length_mm')->nullable();
            $table->integer('item_width_mm')->nullable();
            $table->integer('item_height_mm')->nullable();
            $table->integer('item_weight_g')->nullable();

            $table->decimal('unit_price',10,2)->nullable();
            $table->decimal('import_cost_per_unit',10,2)->nullable();
            $table->string('currency',3)->default('EUR');

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
        Schema::dropIfExists('container_items');
    }
};
