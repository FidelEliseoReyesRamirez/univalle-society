<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nombre' => 'Investigación Científica', 'descripcion' => 'Publicaciones y avances de proyectos de investigación.'],
            ['nombre' => 'Desarrollo de Software', 'descripcion' => 'Proyectos de programación, web, móvil y sistemas.'],
            ['nombre' => 'Inteligencia Artificial', 'descripcion' => 'Eventos y proyectos sobre IA, Machine Learning y Datos.'],
            ['nombre' => 'Ciberseguridad', 'descripcion' => 'Talleres de hacking ético y seguridad informática.'],
            ['nombre' => 'Socialización y Comunidad', 'descripcion' => 'Eventos de integración, reuniones y actividades sociales.'],
            ['nombre' => 'Talleres y Capacitación', 'descripcion' => 'Cursos cortos y workshops técnicos.'],
            ['nombre' => 'Proyectos de Grado', 'descripcion' => 'Exhibición de defensas y perfiles de tesis.'],
            ['nombre' => 'Competencias y Hackathons', 'descripcion' => 'Retos de programación y concursos tecnológicos.'],
            ['nombre' => 'Noticias SICI', 'descripcion' => 'Novedades institucionales y avisos importantes de la sociedad.'],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'nombre' => $cat['nombre'],
                'slug' => Str::slug($cat['nombre']),
                'descripcion' => $cat['descripcion'],
                'esta_eliminado' => false
            ]);
        }
    }
}
