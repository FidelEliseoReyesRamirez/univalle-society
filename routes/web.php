<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProjectController;
use App\Models\Event;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// --- RUTAS PÚBLICAS ---
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'recentEvents' => Event::with(['category'])
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->latest()
            ->take(3)
            ->get(),
    ]);
})->name('home');

// --- RUTAS PROTEGIDAS (Requieren Login) ---
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // --- GRUPO PARA ADMIN Y GESTORES (Contenido) ---
    Route::middleware(['role:admin,gestor'])->group(function () {

        // Gestión de Eventos
        Route::get('/eventos', [EventController::class, 'index'])->name('eventos.index');
        Route::get('/eventos/crear', [EventController::class, 'create'])->name('eventos.create');
        Route::post('/eventos', [EventController::class, 'store'])->name('eventos.store');

        // Gestión de Proyectos
        Route::get('/proyectos', [ProjectController::class, 'index'])->name('proyectos.index');
        Route::get('/proyectos/crear', [ProjectController::class, 'create'])->name('proyectos.create');
        Route::post('/proyectos', [ProjectController::class, 'store'])->name('proyectos.store');

        // Gestión de Categorías
        Route::get('/categorias', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categorias', [CategoryController::class, 'store'])->name('categories.store');
        Route::patch('/categorias/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categorias/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        Route::post('/categorias/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
    });

    // --- GRUPO EXCLUSIVO PARA ADMINISTRADORES (Usuarios) ---
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
        Route::post('/usuarios', [UserController::class, 'store'])->name('users.store');
        Route::patch('/usuarios/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Acciones de Usuario
        Route::post('/usuarios/{user}/block', [UserController::class, 'block'])->name('users.block');
        Route::post('/usuarios/{user}/unlock', [UserController::class, 'unlock'])->name('users.unlock');
        Route::patch('/usuarios/{user}/role', [UserController::class, 'updateRole'])->name('users.role');

        // Papelera de Usuarios
        Route::get('/usuarios/papelera', [UserController::class, 'trashed'])->name('users.trashed');
        Route::post('/usuarios/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
    });
});

require __DIR__ . '/settings.php';
