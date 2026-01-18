<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear Usuario Administrador Principal
        User::create([
            'name' => 'Fidel Eliseo Reyes Ramirez',
            'email' => 'fideleliseoreyesramirez@gmail.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'codigo_sis' => 'rrf2027460', // Ejemplo de código
            'esta_eliminado' => false,
        ]);
    }
}
