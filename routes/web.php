<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProjectController;
use App\Models\Event;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'recentEvents' => Event::with(['category'])
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->latest()->take(3)->get(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware(['role:admin,gestor'])->group(function () {

        // --- EVENTOS ---
        Route::prefix('eventos')->name('eventos.')->group(function () {
            Route::get('/', [EventController::class, 'index'])->name('index');
            Route::get('/crear', [EventController::class, 'create'])->name('create');
            Route::post('/', [EventController::class, 'store'])->name('store');
            Route::get('/{evento}/edit', [EventController::class, 'edit'])->name('edit');

            // Usamos POST para el update para soportar multipart/form-data (imágenes)
            Route::post('/{id}', [EventController::class, 'update'])->name('update');

            Route::delete('/{evento}', [EventController::class, 'destroy'])->name('destroy');
            Route::patch('/{evento}/restaurar', [EventController::class, 'restore'])->name('restore');
        });

        // --- PROYECTOS ---
        Route::prefix('proyectos')->name('proyectos.')->group(function () {
            Route::get('/', [ProjectController::class, 'index'])->name('index');
            Route::get('/crear', [ProjectController::class, 'create'])->name('create');
            Route::post('/', [ProjectController::class, 'store'])->name('store');
            Route::get('/{proyecto}/editar', [ProjectController::class, 'edit'])->name('edit');
            Route::post('/{proyecto}', [ProjectController::class, 'update'])->name('update');
            Route::delete('/{proyecto}', [ProjectController::class, 'destroy'])->name('destroy');
            Route::patch('/{proyecto}/restaurar', [ProjectController::class, 'restore'])->name('restore');
        });

        // --- CATEGORÍAS ---
        Route::prefix('categorias')->name('categories.')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->name('index');
            Route::post('/', [CategoryController::class, 'store'])->name('store');
            Route::patch('/{category}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
            Route::post('/{id}/restore', [CategoryController::class, 'restore'])->name('restore');
        });
    });

    Route::middleware(['role:admin'])->group(function () {
        Route::prefix('usuarios')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::patch('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
            Route::post('/{user}/block', [UserController::class, 'block'])->name('block');
            Route::post('/{user}/unlock', [UserController::class, 'unlock'])->name('unlock');
            Route::patch('/{user}/role', [UserController::class, 'updateRole'])->name('role');
            Route::get('/papelera', [UserController::class, 'trashed'])->name('trashed');
            Route::post('/{user}/restore', [UserController::class, 'restore'])->name('restore');
        });
    });
});

if (file_exists(__DIR__ . '/settings.php')) {
    require __DIR__ . '/settings.php';
}
