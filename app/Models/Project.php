<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'titulo',
        'slug',
        'descripcion',
        'autores',
        'estado',
        'url_github',
        'imagen_portada',
        'user_id',
        'esta_eliminado'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->titulo);
            }
        });
    }
}
