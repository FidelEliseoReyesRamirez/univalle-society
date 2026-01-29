<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Helpers\AuditHelper; // <--- El infaltable para el registro
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Lista las categorías filtrando por búsqueda y estado (activo/eliminado).
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $isTrashedView = $request->query('trashed') === 'true';

        $query = Category::query();

        // Filtro por estado
        $query->where('esta_eliminado', $isTrashedView);

        if ($search) {
            $query->where('nombre', 'like', "%{$search}%");
        }

        return Inertia::render('categories/index', [
            'categories' => $query->orderBy('nombre', 'asc')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
                'trashed' => $request->query('trashed'),
            ],
        ]);
    }

    /**
     * Guarda una nueva categoría.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:categories,nombre',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = Str::slug($request->nombre);
        $validated['esta_eliminado'] = false;

        $category = Category::create($validated);

        // --- AUDITORÍA ---
        AuditHelper::log('crear', 'Categoría', $category->nombre, "Descripción: " . ($category->descripcion ?? 'Sin descripción'));

        return redirect()->back();
    }

    /**
     * Actualiza una categoría existente.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'nombre' => "required|string|max:50|unique:categories,nombre,{$category->id}",
            'descripcion' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = Str::slug($request->nombre);

        $category->update($validated);

        // --- AUDITORÍA ---
        AuditHelper::log('editar', 'Categoría', $category->nombre, "Actualización de datos generales");

        return redirect()->back();
    }

    /**
     * "Eliminado" lógico.
     */
    public function destroy(Category $category)
    {
        $category->update(['esta_eliminado' => true]);

        // --- AUDITORÍA ---
        AuditHelper::log('eliminar', 'Categoría', $category->nombre);

        return redirect()->back();
    }

    /**
     * "Restaurar": Cambia el booleano a false.
     */
    public function restore($id)
    {
        $category = Category::findOrFail($id);
        $category->update(['esta_eliminado' => false]);

        // --- AUDITORÍA ---
        AuditHelper::log('restaurar', 'Categoría', $category->nombre);

        return redirect()->back();
    }
}
