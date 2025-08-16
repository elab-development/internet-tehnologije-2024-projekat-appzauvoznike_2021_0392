<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
      protected $fillable = [
        'supplier_company_id', // FK -> companies.id (supplier)
        'category_id',         // FK -> categories.id (jedna kategorija; po potrebi kasnije pivot)
        'code',                // šifra (unique po dobavljaču)
        'name',
        'description',
        'image_url',           // obavezna glavna slika
        // dimenzije/težina (po jedinici proizvoda)
        'length_mm',
        'width_mm',
        'height_mm',
        'weight_g',
        // cena i valuta (osnovna)
        'base_price',
        'currency',            // npr. 'EUR', 'USD'
        // dodatne karakteristike/specifikacije
        'characteristics',     // JSON
        'is_active',
    ];

    protected $casts = [
        'characteristics' => 'array',
        'is_active'       => 'boolean',
        'base_price'      => 'decimal:2',
    ];
}
