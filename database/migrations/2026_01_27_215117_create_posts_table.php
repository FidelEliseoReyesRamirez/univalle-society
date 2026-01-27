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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('slug')->unique();
            $table->text('extracto')->nullable(); // Resumen corto para el inicio
            $table->longText('contenido');
            $table->string('imagen_ruta')->nullable();

            // Campos para cuando el Post es un Evento
            $table->dateTime('fecha_evento')->nullable();
            $table->string('ubicacion')->nullable();

            // Relaciones
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            // Estados
            $table->boolean('esta_publicado')->default(true);
            $table->boolean('es_destacado')->default(false);
            $table->boolean('esta_eliminado')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
