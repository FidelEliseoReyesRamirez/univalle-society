<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Vinkla\Hashids\Facades\Hashids;

class EventController extends Controller
{
    /**
     * Helper privado para decodificar IDs consistentemente
     */
    private function getRealId($hashedId)
    {
        $decoded = Hashids::decode($hashedId);
        return !empty($decoded) ? $decoded[0] : $hashedId;
    }

    public function index(Request $request)
    {
        $query = Event::with('category')->where('nombre_plantilla', '!=', 'ProjectCard');

        if ($request->trashed === 'true') {
            $query->where('esta_eliminado', true);
        } else {
            $query->where('esta_eliminado', false);
        }

        if ($request->search) {
            $query->where('titulo', 'LIKE', '%' . $request->search . '%');
        }

        return Inertia::render('events/index', [
            'events' => $query->latest()->get(),
            'filters' => $request->only(['search', 'trashed'])
        ]);
    }

    public function create()
    {
        return Inertia::render('events/create', [
            'categories' => Category::where('esta_eliminado', false)->get()
        ]);
    }

    public function edit($id) // Cambiado: Recibimos el ID string
    {
        $realId = $this->getRealId($id);
        $evento = Event::findOrFail($realId);

        return Inertia::render('events/edit', [
            'event' => $evento,
            'categories' => Category::where('esta_eliminado', false)
                ->orWhere('id', $evento->category_id)
                ->get()
        ]);
    }

    public function update(Request $request, $id)
    {
        Log::info('Iniciando actualización', ['id' => $id]);

        try {
            $realId = $this->getRealId($id);
            $evento = Event::findOrFail($realId);

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
                // Eliminar imagen anterior si existe
                if ($evento->imagen_ruta) {
                    $oldPath = str_replace('/storage/', '', $evento->imagen_ruta);
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file('imagen')->store('events', 'public');
                $validated['imagen_ruta'] = '/storage/' . $path;
            }

            $validated['slug'] = Str::slug($request->titulo);

            // Actualizamos solo los campos necesarios
            $evento->update(collect($validated)->except(['imagen'])->toArray());

            return redirect()->to('/eventos')->with('success', 'Evento actualizado');
        } catch (\Exception $e) {
            Log::error('Error en Update Evento: ' . $e->getMessage());
            return back()->withErrors(['error' => 'No se pudo actualizar el evento.']);
        }
    }

    public function destroy($id) // Cambiado a ID string
    {
        $realId = $this->getRealId($id);
        $evento = Event::findOrFail($realId);
        $evento->update(['esta_eliminado' => true]);

        return redirect()->route('eventos.index');
    }

    public function restore($id) // Cambiado a ID string
    {
        $realId = $this->getRealId($id);
        $evento = Event::findOrFail($realId);
        $evento->update(['esta_eliminado' => false]);

        return redirect()->route('eventos.index', ['trashed' => 'true']);
    }
}
