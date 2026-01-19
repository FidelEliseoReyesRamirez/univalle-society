<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Ruta Pública (Todos la ven, no explota)
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Rutas Protegidas
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // SOLO ADMINS
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/usuarios', function () {
            return Inertia::render('users/index');
        })->name('users.index');
    });
});

use App\Http\Controllers\UserController;

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
    Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});
require __DIR__ . '/settings.php';
