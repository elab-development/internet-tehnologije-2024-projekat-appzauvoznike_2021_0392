<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Container extends Model
{
    use HasFactory;
    protected $fillable = [
        'importer_company_id', // FK -> companies.id (importer)
        'container_type',      // '20ft', '40ft', '40HC', ...
        // unutrašnje dimenzije i ograničenja
        'inner_length_mm',
        'inner_width_mm',
        'inner_height_mm',
        'max_weight_kg',
        'max_volume_m3',
        // trošak prevoza kontejnera
        'estimated_freight_cost',
        'currency',
        'status',              // 'draft' | 'planned' | 'shipped' | 'delivered' | 'canceled'
    ];

    protected $casts = [
        'max_weight_kg'          => 'decimal:2',
        'max_volume_m3'          => 'decimal:3',
        'estimated_freight_cost' => 'decimal:2',
    ];
    public function importer()            { return $this->belongsTo(Company::class, 'importer_company_id'); }
    public function items()               { return $this->hasMany(ContainerItem::class); }
}
