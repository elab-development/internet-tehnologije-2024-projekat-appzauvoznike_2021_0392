<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferItem extends Model
{
    use HasFactory;
     protected $fillable = [
        'offer_id',
        'product_id',
        'unit_price',
        'currency',
        'min_order_qty',       // MOQ
        'pack_qty',            // količina u paketu/kartonu
        'import_cost_per_unit',// procenjeni trošak uvoza po jedinici
        'discount_percent',
        'notes',
    ];

    protected $casts = [
        'unit_price'          => 'decimal:2',
        'import_cost_per_unit'=> 'decimal:2',
        'discount_percent'    => 'decimal:2',
        'min_order_qty'       => 'integer',
        'pack_qty'            => 'integer',
    ];
}
