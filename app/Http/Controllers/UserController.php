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
            ->paginate(25)
            ->through(fn($user) => [
                'id' => $user->getRouteKey(),
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'esta_bloqueado' => (bool)$user->esta_bloqueado,
                'created_at' => $user->created_at,
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }
    public function trashed()
    {
        $users = User::where('esta_eliminado', true)
            ->paginate(25)
            ->through(fn($user) => [
                'id' => $user->getRouteKey(),
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'deleted_at' => $user->updated_at, // Fecha de eliminación
            ]);

        return Inertia::render('users/trash', [
            'users' => $users,
        ]);
    }

    public function restore(User $user)
    {
        $user->update(['esta_eliminado' => false]);
        return back()->with('success', 'Usuario restaurado correctamente.');
    }
    public function block(User $user)
    {
        if ($this->isLastAdmin($user)) {
            return back()->with('error', 'No puedes bloquear al último administrador del sistema.');
        }

        $user->update(['esta_bloqueado' => true]);
        return back()->with('success', 'Usuario bloqueado.');
    }

    public function unlock(User $user)
    {
        $user->update([
            'esta_bloqueado' => false,
            'intentos_fallidos' => 0,
            'bloqueado_hasta' => null
        ]);
        return back()->with('success', 'Usuario desbloqueado.');
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,gestor,estudiante']);

        // Si se intenta quitar el rol de admin al último admin
        if ($user->role === 'admin' && $request->role !== 'admin' && $this->isLastAdmin($user)) {
            return back()->with('error', 'El sistema debe tener al menos un administrador.');
        }

        $user->update(['role' => $request->role]);
        return back()->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        if ($this->isLastAdmin($user)) {
            return back()->with('error', 'No puedes eliminar al último administrador.');
        }

        $user->update(['esta_eliminado' => true]);
        return back()->with('success', 'Usuario enviado a la papelera.');
    }

    /**
     * Verifica si el usuario es el último administrador activo (no bloqueado ni eliminado).
     */
    private function isLastAdmin(User $user)
    {
        if ($user->role !== 'admin') return false;

        $adminsCount = User::where('role', 'admin')
            ->where('esta_eliminado', false)
            ->where('esta_bloqueado', false)
            ->count();

        return $adminsCount <= 1;
    }
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return back()->with('success', 'Usuario actualizado correctamente.');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:admin,gestor,estudiante',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => bcrypt('Univalle2026*'), // Contraseña temporal
            'esta_bloqueado' => false,
            'esta_eliminado' => false,
        ]);

        return back()->with('success', 'Usuario creado exitosamente.');
    }
}
