<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
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

// Autenticación
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// --- RUTAS PROTEGIDAS ---
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // GRUPO DE ADMINISTRADORES
    // Importante: Verifica que tu usuario en la DB tenga role = 'admin'
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
        Route::post('/usuarios/{user}/block', [UserController::class, 'block'])->name('users.block');
        Route::post('/usuarios/{user}/unlock', [UserController::class, 'unlock'])->name('users.unlock');
        Route::patch('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
        Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__ . '/settings.php';
