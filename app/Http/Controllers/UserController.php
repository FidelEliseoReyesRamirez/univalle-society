<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Helpers\AuditHelper; // <--- Importamos el motor de auditoría
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
                'deleted_at' => $user->updated_at,
            ]);

        return Inertia::render('users/trash', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|in:admin,gestor,estudiante',
        ]);

        $nuevoUsuario = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => bcrypt('Univalle2026*'),
            'esta_bloqueado' => false,
            'esta_eliminado' => false,
        ]);

        // AUDITORÍA
        AuditHelper::log('crear', 'Usuario', $nuevoUsuario->name, "Rol asignado: {$nuevoUsuario->role}");

        return back()->with('success', 'Usuario creado exitosamente.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        // AUDITORÍA
        AuditHelper::log('editar', 'Usuario', $user->name, "Actualización de datos básicos");

        return back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,gestor,estudiante']);

        if ($user->role === 'admin' && $request->role !== 'admin' && $this->isLastAdmin($user)) {
            return back()->with('error', 'El sistema debe tener al menos un administrador.');
        }

        $antiguoRol = $user->role;
        $user->update(['role' => $request->role]);

        // AUDITORÍA
        AuditHelper::log('editar', 'Usuario', $user->name, "Cambio de rol: {$antiguoRol} -> {$user->role}");

        return back()->with('success', 'Rol actualizado correctamente.');
    }

    public function block(User $user)
    {
        if ($this->isLastAdmin($user)) {
            return back()->with('error', 'No puedes bloquear al último administrador del sistema.');
        }

        $user->update(['esta_bloqueado' => true]);

        // AUDITORÍA
        AuditHelper::log('bloquear', 'Usuario', $user->name);

        return back()->with('success', 'Usuario bloqueado.');
    }

    public function unlock(User $user)
    {
        $user->update([
            'esta_bloqueado' => false,
            'intentos_fallidos' => 0,
            'bloqueado_hasta' => null
        ]);

        // AUDITORÍA
        AuditHelper::log('desbloquear', 'Usuario', $user->name);

        return back()->with('success', 'Usuario desbloqueado.');
    }

    public function destroy(User $user)
    {
        if ($this->isLastAdmin($user)) {
            return back()->with('error', 'No puedes eliminar al último administrador.');
        }

        $user->update(['esta_eliminado' => true]);

        // AUDITORÍA
        AuditHelper::log('eliminar', 'Usuario', $user->name);

        return back()->with('success', 'Usuario enviado a la papelera.');
    }

    public function restore(User $user)
    {
        $user->update(['esta_eliminado' => false]);

        // AUDITORÍA
        AuditHelper::log('restaurar', 'Usuario', $user->name);

        return back()->with('success', 'Usuario restaurado correctamente.');
    }

    private function isLastAdmin(User $user)
    {
        if ($user->role !== 'admin') return false;

        $adminsCount = User::where('role', 'admin')
            ->where('esta_eliminado', false)
            ->where('esta_bloqueado', false)
            ->count();

        return $adminsCount <= 1;
    }
}
