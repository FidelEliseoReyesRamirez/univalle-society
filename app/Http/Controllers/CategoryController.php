<?php

namespace App\Http\Controllers;

use App\Models\Category;
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

        // Cambiamos latest() por orderBy para orden alfabético
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
        $validated['esta_eliminado'] = false; // Por defecto activa

        Category::create($validated);

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

        return redirect()->back();
    }

    /**
     * "Eliminado" lógico: Cambia el booleano a true.
     */
    public function destroy(Category $category)
    {
        $category->update(['esta_eliminado' => true]);

        return redirect()->back();
    }

    /**
     * "Restaurar": Cambia el booleano a false.
     */
    public function restore($id)
    {
        $category = Category::findOrFail($id);
        $category->update(['esta_eliminado' => false]);

        return redirect()->back();
    }
}
