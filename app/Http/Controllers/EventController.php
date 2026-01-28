<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Vinkla\Hashids\Facades\Hashids;

class EventController extends Controller
{
    private function getRealId($hashedId)
    {
        $decoded = Hashids::decode($hashedId);
        return !empty($decoded) ? $decoded[0] : $hashedId;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $isTrashedView = $request->query('trashed') === 'true';

        $query = Event::with('category')->where('nombre_plantilla', '!=', 'ProjectCard');

        // Filtramos por el estado de eliminación del evento
        $query->where('esta_eliminado', $isTrashedView);

        if ($search) {
            $query->where('titulo', 'like', "%{$search}%");
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

        return Inertia::render('events/index', [
            'events' => $query->orderBy('titulo', 'asc')->paginate(10)->withQueryString(),
            'categories' => Category::where('esta_eliminado', false)->orderBy('nombre', 'asc')->get(),
            'filters' => $request->only(['search', 'trashed', 'dateFrom', 'dateTo', 'category_id'])
        ]);
    }

    public function create()
    {
        return Inertia::render('events/create', [
            'categories' => Category::where('esta_eliminado', false)->orderBy('nombre', 'asc')->get()
        ]);
    }

    public function edit($id)
    {
        $evento = Event::findOrFail($this->getRealId($id));
        return Inertia::render('events/edit', [
            'event' => $evento,
            'categories' => Category::where('esta_eliminado', false)
                ->orWhere('id', $evento->category_id)
                ->orderBy('nombre', 'asc')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'titulo' => 'required|string|max:255',
                'extracto' => 'required|string|max:500',
                'contenido' => 'required|string',
                'category_id' => 'required|exists:categories,id',
                'fecha_evento' => 'nullable|date',
                'ubicacion' => 'nullable|string',
                'nombre_plantilla' => 'required|string',
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if ($request->hasFile('imagen')) {
                $path = $request->file('imagen')->store('events', 'public');
                $validated['imagen_ruta'] = '/storage/' . $path;
            }

            $validated['slug'] = Str::slug($request->titulo);
            $validated['user_id'] = $request->user()->id;

            Event::create(collect($validated)->except(['imagen'])->toArray());
            return redirect()->to('/eventos')->with('success', 'Evento creado con éxito');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al guardar: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $evento = Event::findOrFail($this->getRealId($id));
            $validated = $request->validate([
                'titulo' => 'required|string|max:255',
                'extracto' => 'required|string|max:500',
                'contenido' => 'required|string',
                'category_id' => 'required|exists:categories,id',
                'fecha_evento' => 'nullable',
                'ubicacion' => 'nullable|string',
                'nombre_plantilla' => 'required|string',
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if ($request->hasFile('imagen')) {
                if ($evento->imagen_ruta) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $evento->imagen_ruta));
                }
                $path = $request->file('imagen')->store('events', 'public');
                $validated['imagen_ruta'] = '/storage/' . $path;
            }

            $validated['slug'] = Str::slug($request->titulo);
            $evento->update(collect($validated)->except(['imagen'])->toArray());
            return redirect()->to('/eventos');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        Event::findOrFail($this->getRealId($id))->update(['esta_eliminado' => true]);
        return redirect()->route('eventos.index');
    }

    public function restore($id)
    {
        $realId = $this->getRealId($id);
        $evento = Event::with('category')->findOrFail($realId);

        // Bloqueo si la categoría está eliminada
        if ($evento->category && $evento->category->esta_eliminado) {
            return back()->withErrors([
                'error' => "No se puede restaurar: la categoría '{$evento->category->nombre}' está eliminada. Restáurala primero."
            ]);
        }

        $evento->update(['esta_eliminado' => false]);
        return redirect()->route('eventos.index', ['trashed' => 'true']);
    }
}
