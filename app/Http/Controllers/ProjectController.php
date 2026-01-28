<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // Añadimos la restricción de plantilla para que SOLO traiga proyectos
        $query = Event::with('category')
            ->where('nombre_plantilla', 'ProjectCard');

        if ($request->trashed == 'true') {
            $query->where('esta_eliminado', true);
        } else {
            $query->where('esta_eliminado', false);
        }

        // ... resto de tus filtros (search, date)
        if ($request->search) {
            $query->where('titulo', 'LIKE', '%' . $request->search . '%');
        }

        return Inertia::render('projects/index', [
            'projects' => $query->latest()->get(),
            'filters' => $request->only(['search', 'date', 'trashed'])
        ]);
    }

    public function create()
    {
        return Inertia::render('projects/create', [
            // Solo mostramos categorías NO eliminadas para nuevos proyectos
            'categories' => Category::where('esta_eliminado', false)->get()
        ]);
    }

    public function edit(Event $proyecto)
    {
        return Inertia::render('projects/edit', [
            'proyecto' => $proyecto,
            // Mostramos categorías activas O la que ya tiene asignada el proyecto (aunque esté eliminada)
            'categories' => Category::where('esta_eliminado', false)
                ->orWhere('id', $proyecto->category_id)
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'extracto' => 'required|string|max:500',
            'contenido' => 'required|string',
            'category_id' => 'required|exists:categories,id', // Laravel valida que el ID exista
            'ubicacion' => 'nullable|string',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('projects', 'public');
            $validated['imagen_ruta'] = '/storage/' . $path;
        }

        $validated['user_id'] = Auth::id();
        $validated['slug'] = Str::slug($request->titulo);
        $validated['nombre_plantilla'] = 'ProjectCard';

        Event::create($validated);

        return redirect()->route('proyectos.index');
    }

    public function update(Request $request, Event $proyecto)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'extracto' => 'required|string|max:500',
            'contenido' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'ubicacion' => 'nullable|string',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('projects', 'public');
            $validated['imagen_ruta'] = '/storage/' . $path;
        }

        $validated['slug'] = Str::slug($request->titulo);
        $proyecto->update($validated);

        return redirect()->route('proyectos.index');
    }

    public function restore(Event $proyecto)
    {
        $proyecto->update(['esta_eliminado' => false]);
        return redirect()->route('proyectos.index', ['trashed' => 'true']);
    }

    public function destroy(Event $proyecto)
    {
        $proyecto->update(['esta_eliminado' => true]);
        return redirect()->route('proyectos.index');
    }
}
