<?php

namespace App\Models;

use App\Traits\Hashidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;

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

    /**
     * Personalización de la notificación de restablecimiento de contraseña.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new class($token) extends ResetPasswordNotification {
            public function toMail($notifiable): MailMessage
            {
                return (new MailMessage)
                    ->subject('SICI-ISI: Solicitud de Restablecimiento de Contraseña')
                    ->greeting('¡Hola, ' . $notifiable->name . '!')
                    ->line('Has recibido este correo porque se solicitó un cambio de contraseña para tu cuenta en el Sistema de Control SICI.')
                    ->action('RESTABLECER CONTRASEÑA', url(config('app.url') . route('password.reset', [
                        'token' => $this->token,
                        'email' => $notifiable->getEmailForPasswordReset(),
                    ], false)))
                    ->line('Este enlace de seguridad expirará en 60 minutos.')
                    ->line('Si tú no realizaste esta solicitud, puedes ignorar este mensaje de forma segura.')
                    ->salutation('Atentamente, Equipo de Investigación Univalle');
            }
        });
    }

    // Relación con Eventos
    public function events(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Event::class);
    }

    // Relación con Proyectos
    public function projects(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Project::class);
    }
}
