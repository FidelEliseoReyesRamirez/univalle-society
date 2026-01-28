<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['nombre', 'slug', 'descripcion', 'esta_eliminado'];

    // Forzamos que Laravel trate esta columna como booleano
    protected $casts = [
        'esta_eliminado' => 'boolean',
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
