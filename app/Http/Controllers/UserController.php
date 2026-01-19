<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('esta_eliminado', false)
            ->get(['id', 'name', 'email', 'role', 'esta_bloqueado', 'created_at'])
            ->map(function ($user) {
                // Forzamos a que el ID sea el Hashid para el Frontend
                return [
                    'id' => $user->getRouteKey(),
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'esta_bloqueado' => (bool)$user->esta_bloqueado,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }

    public function block(User $user)
    {
        $user->update(['esta_bloqueado' => true]);
        return back();
    }

    public function unlock(User $user)
    {
        $user->update([
            'esta_bloqueado' => false,
            'intentos_fallidos' => 0,
            'bloqueado_hasta' => null
        ]);
        return back();
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,gestor,estudiante']);
        $user->update(['role' => $request->role]);
        return back();
    }

    public function destroy(User $user)
    {
        $user->update(['esta_eliminado' => true]);
        return back();
    }
}
