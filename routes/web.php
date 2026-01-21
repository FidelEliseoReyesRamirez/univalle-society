<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// --- RUTAS PÚBLICAS ---
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/**
 * NOTA: Las rutas de /login, /two-factor-challenge y /logout 
 * ahora son manejadas automáticamente por Laravel Fortify.
 * Esto permite que el Pipeline de 2FA funcione correctamente.
 */

// --- RUTAS PROTEGIDAS ---
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // GRUPO DE ADMINISTRADORES
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
        Route::post('/usuarios/{user}/block', [UserController::class, 'block'])->name('users.block');
        Route::post('/usuarios/{user}/unlock', [UserController::class, 'unlock'])->name('users.unlock');
        Route::patch('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
        Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::post('/usuarios', [UserController::class, 'store'])->name('users.store');
        Route::get('/usuarios/papelera', [UserController::class, 'trashed'])->name('users.trashed');
        Route::post('/usuarios/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
        Route::patch('/usuarios/{user}', [UserController::class, 'update'])->name('users.update');
    });
});

require __DIR__ . '/settings.php';
