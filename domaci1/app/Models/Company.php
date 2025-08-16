<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',               // 'importer' | 'supplier'
        'tax_id',
        'country',
        'city',
        'address',
        'zip',
        'website',
        'contact_email',
        'contact_phone',
        'capabilities',       // JSON - asortiman/usluge za pretragu
        'countries_served',   // tekst ili CSV
        'is_active',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'is_active'    => 'boolean',
    ];
}
