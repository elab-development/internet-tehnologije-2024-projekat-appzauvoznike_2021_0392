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
      Schema::table('companies', function (Blueprint $table) {
            $table->string('zip')->nullable()->change();
            $table->string('website')->nullable()->change();
            $table->string('contact_email')->nullable()->change();
            $table->string('contact_phone')->nullable()->change();
            $table->json('capabilities')->nullable()->change();
            $table->string('countries_served')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
         Schema::table('companies', function (Blueprint $table) {
            $table->string('zip')->nullable(false)->change();
            $table->string('website')->nullable(false)->change();
            $table->string('contact_email')->nullable(false)->change();
            $table->string('contact_phone')->nullable(false)->change();
            $table->json('capabilities')->nullable(false)->change();
            $table->string('countries_served')->nullable(false)->change();
        });
    }
};
