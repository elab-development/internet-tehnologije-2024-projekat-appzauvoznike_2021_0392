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
        Schema::create('importer_supplier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('importer_company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('supplier_company_id')->constrained('companies')->onDelete('cascade');
            $table->enum('status',['pending','active','blocked'])->default('pending');
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['importer_company_id','supplier_company_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('importer_supplier');
    }
};
