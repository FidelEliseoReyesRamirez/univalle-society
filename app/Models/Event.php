<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'titulo',
        'slug',
        'extracto',
        'contenido',
        'user_id',
        'category_id',
        'fecha_evento',
        'ubicacion',
        'nombre_plantilla',
        'imagen_ruta',
        'esta_eliminado'
    ];

    protected $casts = [
        'fecha_evento' => 'datetime',
        'esta_publicado' => 'boolean',
        'es_destacado' => 'boolean',
        'esta_eliminado' => 'boolean',
    ];

    // Relación con el Usuario (Autor)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relación con la Categoría
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->titulo);
            }
        });
    }
}
