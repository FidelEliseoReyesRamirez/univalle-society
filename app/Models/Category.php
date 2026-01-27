<?php

namespace App\Models; // <--- Asegúrate de que esta línea sea idéntica

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['nombre', 'slug', 'descripcion', 'esta_eliminado'];

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
