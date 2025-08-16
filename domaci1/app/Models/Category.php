<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
     protected $fillable = [
        'parent_id',   // nullable
        'name',
        'slug',
        'description',
    ];
    public function parent()              { return $this->belongsTo(Category::class, 'parent_id'); }
    public function children()            { return $this->hasMany(Category::class, 'parent_id'); }
    public function products()            { return $this->hasMany(Product::class); } // jer Product ima category_id
}
