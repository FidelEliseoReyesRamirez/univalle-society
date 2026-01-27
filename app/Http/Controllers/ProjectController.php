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
    public function index()
    {
        return Inertia::render('projects/index', [
            'projects' => Event::with('category')
                ->where('esta_eliminado', false)
                ->latest()
                ->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('projects/create', [
            // Ahora cargamos TODAS las categorías disponibles
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
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

        $validated['user_id'] = Auth::id();
        $validated['slug'] = Str::slug($request->titulo);
        $validated['nombre_plantilla'] = 'ProjectCard';

        Event::create($validated);

        return redirect()->route('proyectos.index');
    }
}
