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
        Schema::create('offer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->constrained('offers')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->decimal('unit_price',10,2);
            $table->string('currency',3)->default('EUR');
            $table->integer('min_order_qty')->default(1);
            $table->integer('pack_qty')->nullable();
            $table->decimal('import_cost_per_unit',10,2)->nullable();
            $table->decimal('discount',5,2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['offer_id','product_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offer_items');
    }
};
