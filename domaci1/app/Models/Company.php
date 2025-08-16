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

    public function users()               { return $this->hasMany(User::class); }
    public function products()            { return $this->hasMany(Product::class, 'supplier_company_id'); }
    public function offers()              { return $this->hasMany(Offer::class, 'supplier_company_id'); }
    public function containers()          { return $this->hasMany(Container::class, 'importer_company_id'); }
    // partnerstva (uvoznik -> dobavljači)
    public function suppliers() {
        return $this->belongsToMany(
            Company::class, 'importer_supplier',
            'importer_company_id', 'supplier_company_id'
        )->withPivot(['status','started_at','ended_at','notes'])->withTimestamps();
    }

    // partnerstva (dobavljač -> uvoznici)
    public function importers() {
        return $this->belongsToMany(
            Company::class, 'importer_supplier',
            'supplier_company_id', 'importer_company_id'
        )->withPivot(['status','started_at','ended_at','notes'])->withTimestamps();
    }
}
