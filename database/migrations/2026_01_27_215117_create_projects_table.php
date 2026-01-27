<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('slug')->unique();
            $table->text('descripcion');
            $table->string('autores')->nullable(); // "Fidel Reyes, et al."
            $table->enum('estado', ['Idea', 'Desarrollo', 'Finalizado'])->default('Idea');
            $table->string('url_github')->nullable();
            $table->string('imagen_portada')->nullable();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('esta_eliminado')->default(false);
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
