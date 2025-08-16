<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;
      protected $fillable = [
        'supplier_company_id', // FK -> companies.id (supplier)
        'title',
        'description',
        'valid_from',
        'valid_to',
        'incoterm',        // npr. CIF/FOB
        'payment_terms',   // tekst
        'lead_time_days',  // prosečan rok
        'status',          // 'draft' | 'published' | 'archived'
    ];

    protected $casts = [
        'valid_from'    => 'date',
        'valid_to'      => 'date',
        'lead_time_days'=> 'integer',
    ];
    public function supplier()            { return $this->belongsTo(Company::class, 'supplier_company_id'); }
    public function items()               { return $this->hasMany(OfferItem::class); }
}
