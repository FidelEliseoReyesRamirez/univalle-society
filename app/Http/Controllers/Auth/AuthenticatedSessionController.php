<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    /**
     * Muestra la vista de login.
     */
    public function create()
    {
        return Inertia::render('auth/login');
    }

    /**
     * Maneja el intento de autenticación.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. Si el usuario ni existe, error estándar por seguridad
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => 'Estas credenciales no coinciden con nuestros registros.',
            ]);
        }

        // 2. VERIFICAR BLOQUEO PERMANENTE
        if ($user->esta_bloqueado) {
            throw ValidationException::withMessages([
                'email' => 'Tu cuenta ha sido bloqueada permanentemente por seguridad. Contacta con un administrador de SOC-ISI.',
            ]);
        }

        // 3. VERIFICAR BLOQUEO TEMPORAL (15 minutos)
        if ($user->bloqueado_hasta && now()->lessThan($user->bloqueado_hasta)) {
            $minutosRestantes = now()->diffInMinutes($user->bloqueado_hasta) + 1;
            throw ValidationException::withMessages([
                'email' => "Demasiados intentos fallidos. Tu acceso está suspendido temporalmente. Inténtalo de nuevo en {$minutosRestantes} minutos.",
            ]);
        }

        // 4. INTENTO DE LOGIN
        if (Auth::attempt($request->only('email', 'password'), $request->remember)) {
            // ÉXITO: Limpiamos los rastros de fallos previos
            $user->update([
                'intentos_fallidos' => 0,
                'bloqueado_hasta' => null,
            ]);

            $request->session()->regenerate();

            return redirect()->intended(route('dashboard'));
        }

        // 5. MANEJO DE FALLOS (Contraseña incorrecta)
        $user->increment('intentos_fallidos');

        // Lógica de castigos
        if ($user->intentos_fallidos >= 5) {
            $user->update(['esta_bloqueado' => true]);
            $mensaje = 'Has superado el límite de intentos. Tu cuenta ha sido bloqueada permanentemente.';
        } elseif ($user->intentos_fallidos >= 3) {
            $user->update(['bloqueado_hasta' => now()->addMinutes(15)]);
            $mensaje = 'Contraseña incorrecta. Tu cuenta ha sido suspendida temporalmente por 15 minutos.';
        } else {
            $restantes = 5 - $user->intentos_fallidos;
            $mensaje = "Credenciales incorrectas. Te quedan {$restantes} intentos antes del bloqueo definitivo.";
        }

        throw ValidationException::withMessages([
            'email' => $mensaje,
        ]);
    }

    /**
     * Cierra la sesión.
     */
    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
