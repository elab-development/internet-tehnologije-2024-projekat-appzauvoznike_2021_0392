<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContainerItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'container_id',
        'offer_item_id',
        'quantity',
        // snapshot dimenzija/težine stavke u trenutku planiranja
        'item_length_mm',
        'item_width_mm',
        'item_height_mm',
        'item_weight_g',
        // snapshot cene/troška po jedinici
        'unit_price',
        'import_cost_per_unit',
        'currency',
    ];

    protected $casts = [
        'quantity'             => 'integer',
        'unit_price'           => 'decimal:2',
        'import_cost_per_unit' => 'decimal:2',
    ];
}
