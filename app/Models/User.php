<?php

namespace App\Models;

use App\Traits\Hashidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable, Hashidable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'codigo_sis',
        'role',
        'intentos_fallidos',
        'esta_bloqueado',
        'bloqueado_hasta',
        'esta_eliminado',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'bloqueado_hasta' => 'datetime',
            'esta_bloqueado' => 'boolean',
            'esta_eliminado' => 'boolean',
        ];
    }
}
