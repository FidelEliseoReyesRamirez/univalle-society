<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Category;
use App\Helpers\AuditHelper; // <--- Helper de auditoría importado
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('category')
            ->where('nombre_plantilla', 'ProjectCard');

        $isTrashedView = $request->query('trashed') === 'true';
        $query->where('esta_eliminado', $isTrashedView);

        if ($request->search) {
            $query->where('titulo', 'LIKE', '%' . $request->search . '%');
        }

        if ($request->category_id && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->dateFrom) {
            $query->whereDate('created_at', '>=', $request->dateFrom);
        }

        if ($request->dateTo) {
            $query->whereDate('created_at', '<=', $request->dateTo);
        }

        return Inertia::render('projects/index', [
            'projects' => $query->orderBy('titulo', 'asc')->paginate(10)->withQueryString(),
            'categories' => Category::where('esta_eliminado', false)->orderBy('nombre', 'asc')->get(),
            'filters' => $request->only(['search', 'dateFrom', 'dateTo', 'trashed', 'category_id'])
        ]);
    }

    public function create()
    {
        return Inertia::render('projects/create', [
            'categories' => Category::where('esta_eliminado', false)->get()
        ]);
    }

    public function edit(Event $proyecto)
    {
        return Inertia::render('projects/edit', [
            'proyecto' => $proyecto,
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
            'category_id' => 'required|exists:categories,id',
            'ubicacion' => 'nullable|string',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('projects', 'public');
            $validated['imagen_ruta'] = '/storage/' . $path;
        }

        $validated['user_id'] = Auth::id();
        $validated['slug'] = Str::slug($request->titulo);
        $validated['nombre_plantilla'] = 'ProjectCard';
        $validated['esta_publicado'] = true;

        $proyecto = Event::create($validated);

        // --- AUDITORÍA ---
        AuditHelper::log('crear', 'Proyecto', $proyecto->titulo);

        return redirect()->route('proyectos.index')->with('success', 'Proyecto creado correctamente');
    }

    public function update(Request $request, Event $proyecto)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'extracto' => 'required|string|max:500',
            'contenido' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'ubicacion' => 'nullable|string',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('imagen')) {
            if ($proyecto->imagen_ruta) {
                $oldPath = str_replace('/storage/', '', $proyecto->imagen_ruta);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('imagen')->store('projects', 'public');
            $validated['imagen_ruta'] = '/storage/' . $path;
        }

        $validated['slug'] = Str::slug($request->titulo);
        $proyecto->update($validated);

        // --- AUDITORÍA ---
        AuditHelper::log('editar', 'Proyecto', $proyecto->titulo);

        return redirect()->route('proyectos.index');
    }

    public function restore(Event $proyecto)
    {
        $proyecto->update(['esta_eliminado' => false]);

        // --- AUDITORÍA ---
        AuditHelper::log('restaurar', 'Proyecto', $proyecto->titulo);

        return redirect()->route('proyectos.index', ['trashed' => 'true']);
    }

    public function destroy(Event $proyecto)
    {
        $proyecto->update(['esta_eliminado' => true]);

        // --- AUDITORÍA ---
        AuditHelper::log('eliminar', 'Proyecto', $proyecto->titulo);

        return redirect()->route('proyectos.index');
    }
}
