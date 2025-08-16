<?php
 // (pivot model za partnerstva)
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImporterSupplier extends Model
{
    use HasFactory;

    protected $table = 'importer_supplier';

    protected $fillable = [
        'importer_company_id',
        'supplier_company_id',
        'status',      // 'pending' | 'active' | 'blocked'
        'started_at',
        'ended_at',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'date',
        'ended_at'   => 'date',
    ];
}
