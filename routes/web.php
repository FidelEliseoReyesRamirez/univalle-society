<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProjectController;
use App\Models\Event;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Http\Request;
/*
|--------------------------------------------------------------------------
| Rutas Públicas
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),

        'recentEvents' => Event::with(['category'])
            ->where('nombre_plantilla', '!=', 'ProjectCard')
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->whereHas('category', function ($q) {
                $q->where('esta_eliminado', false)
                    ->where('nombre', 'not like', '%noticia%')
                    ->where('nombre', 'not like', '%news%');
            })
            ->latest()->take(4)->get(),

        'recentProjects' => Event::with(['category'])
            ->where('nombre_plantilla', 'ProjectCard')
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->latest()->take(3)->get(),

        'recentNews' => Event::with(['category'])
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->whereHas('category', function ($q) {
                $q->where('esta_eliminado', false)
                    ->where(function ($sub) {
                        $sub->where('nombre', 'like', '%noticia%')
                            ->orWhere('nombre', 'like', '%news%');
                    });
            })
            ->latest()->take(3)->get(),
    ]);
})->name('home');

// --- PÁGINAS "VER TODO" ---

Route::get('/eventos-all', function () {
    return Inertia::render('EventsAll', [
        'events' => Event::with(['category'])
            ->where('nombre_plantilla', '!=', 'ProjectCard')
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->whereHas('category', function ($q) {
                $q->where('esta_eliminado', false)
                    ->where('nombre', 'not like', '%noticia%');
            })
            ->latest()->get(),
    ]);
})->name('public.events');

Route::get('/proyectos-all', function () {
    return Inertia::render('ProjectsAll', [
        'projects' => Event::with(['category'])
            ->where('nombre_plantilla', 'ProjectCard')
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->whereHas('category', fn($q) => $q->where('esta_eliminado', false))
            ->latest()->get(),
    ]);
})->name('public.projects');

Route::get('/noticias-all', function () {
    return Inertia::render('NewsAll', [
        'news' => Event::with(['category'])
            ->where('esta_publicado', true)
            ->where('esta_eliminado', false)
            ->whereHas('category', function ($q) {
                $q->where('esta_eliminado', false)
                    ->where(function ($sub) {
                        $sub->where('nombre', 'like', '%noticia%')
                            ->orWhere('nombre', 'like', '%news%');
                    });
            })
            ->latest()->get(),
    ]);
})->name('public.news');


/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Auth)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        // 1. KPIs de la Sociedad Científica
        $stats = [
            'totalUsers' => User::where('esta_eliminado', false)->count(),
            'totalEvents' => Event::where('esta_publicado', true)->where('esta_eliminado', false)->where('nombre_plantilla', '!=', 'ProjectCard')->count(),
            'totalProjects' => Event::where('nombre_plantilla', 'ProjectCard')->where('esta_eliminado', false)->count(),
            'activeCategories' => Category::where('esta_eliminado', false)->count(),
        ];

        // 2. Producción Mensual (Eventos y Proyectos combinados por fecha_evento)
        $eventsRaw = Event::select(
            DB::raw('count(id) as cantidad'),
            DB::raw("DATE_FORMAT(fecha_evento, '%m') as mes_num"),
            DB::raw("DATE_FORMAT(fecha_evento, '%b') as name")
        )
            ->where('esta_eliminado', false)
            ->whereNotNull('fecha_evento')
            ->groupBy(DB::raw("DATE_FORMAT(fecha_evento, '%m')"), DB::raw("DATE_FORMAT(fecha_evento, '%b')"))
            ->orderBy('mes_num', 'asc')
            ->get();

        // 3. Distribución por Categorías (Áreas de Investigación)
        $projectsByCategory = Category::select('categories.nombre as name')
            ->selectRaw('COUNT(events.id) as value')
            ->join('events', 'categories.id', '=', 'events.category_id')
            ->where('events.esta_eliminado', false)
            ->groupBy('categories.nombre')
            ->orderBy('value', 'desc')
            ->take(5)
            ->get();

        // 4. Usuarios por Rol
        $usersByRole = [
            ['name' => 'Admin', 'value' => User::where('role', 'admin')->where('esta_eliminado', false)->count()],
            ['name' => 'Gestor', 'value' => User::where('role', 'gestor')->where('esta_eliminado', false)->count()],
            ['name' => 'Estudiante', 'value' => User::where('role', 'estudiante')->where('esta_eliminado', false)->count()],
        ];

        // 5. Actividad Semanal
        $activityData = User::select(
            DB::raw('count(id) as usuarios'),
            DB::raw("DATE_FORMAT(created_at, '%a') as date")
        )
            ->where('created_at', '>=', now()->subDays(7))
            ->where('esta_eliminado', false)
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%a')"), DB::raw("DAYOFWEEK(created_at)"))
            ->orderBy(DB::raw("DAYOFWEEK(created_at)"), 'asc')
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'eventsByMonth' => $eventsRaw,
            'usersByRole' => $usersByRole,
            'activityData' => $activityData,
            'projectsByCategory' => $projectsByCategory,
        ]);
    })->middleware('role:admin,gestor')->name('dashboard');

    Route::middleware(['role:admin,gestor'])->group(function () {
        Route::prefix('eventos')->name('eventos.')->group(function () {
            Route::get('/', [EventController::class, 'index'])->name('index');
            Route::get('/crear', [EventController::class, 'create'])->name('create');
            Route::post('/', [EventController::class, 'store'])->name('store');
            Route::get('/{evento}/edit', [EventController::class, 'edit'])->name('edit');
            Route::post('/{id}', [EventController::class, 'update'])->name('update');
            Route::delete('/{evento}', [EventController::class, 'destroy'])->name('destroy');
            Route::put('/{id}/restore', [EventController::class, 'restore'])->name('restore');
        });

        Route::prefix('proyectos')->name('proyectos.')->group(function () {
            Route::get('/', [ProjectController::class, 'index'])->name('index');
            Route::get('/crear', [ProjectController::class, 'create'])->name('create');
            Route::post('/', [ProjectController::class, 'store'])->name('store');
            Route::get('/{proyecto}/editar', [ProjectController::class, 'edit'])->name('edit');
            Route::post('/{proyecto}', [ProjectController::class, 'update'])->name('update');
            Route::delete('/{proyecto}', [ProjectController::class, 'destroy'])->name('destroy');
            Route::patch('/{proyecto}/restaurar', [ProjectController::class, 'restore'])->name('restore');
        });

        Route::prefix('categorias')->name('categories.')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->name('index');
            Route::post('/', [CategoryController::class, 'store'])->name('store');
            Route::patch('/{category}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
            Route::post('/{id}/restore', [CategoryController::class, 'restore'])->name('restore');
        });
    });

    Route::middleware(['role:admin'])->group(function () {
        Route::get('/auditoria', function (Request $request) {
            $query = DB::table('audits')
                ->join('users', 'audits.user_id', '=', 'users.id')
                ->select('audits.*', 'users.name as user_name', 'users.role as user_role');

            // FILTROS
            if ($request->search) {
                $query->where('audits.nombre_recurso', 'like', "%{$request->search}%")
                    ->orWhere('users.name', 'like', "%{$request->search}%");
            }
            if ($request->accion && $request->accion !== 'all') {
                $query->where('audits.accion', $request->accion);
            }
            if ($request->tipo && $request->tipo !== 'all') {
                $query->where('audits.tipo_recurso', $request->tipo);
            }
            if ($request->desde) {
                $query->whereDate('audits.created_at', '>=', $request->desde);
            }
            if ($request->hasta) {
                $query->whereDate('audits.created_at', '<=', $request->hasta);
            }

            $logs = $query->orderBy('audits.created_at', 'desc')->paginate(15)->withQueryString();

            return Inertia::render('Audit/Index', [
                'logs' => $logs,
                'filters' => $request->only(['search', 'accion', 'tipo', 'desde', 'hasta'])
            ]);
        })->name('audit.index');
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
