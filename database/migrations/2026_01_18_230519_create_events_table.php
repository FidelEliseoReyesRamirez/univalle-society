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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('slug')->unique(); // Para URLs amigables: /eventos/conferencias-isi
            $table->text('extracto')->nullable(); // Resumen corto para la vista previa en el Welcome
            $table->longText('contenido');
            $table->string('imagen_ruta')->nullable();

            // Nombre de la plantilla React (ej: PostFacebook, EventoCard, BannerHero)
            $table->string('nombre_plantilla')->default('PostFacebook');

            // Campos específicos para Eventos
            $table->dateTime('fecha_evento')->nullable();
            $table->string('ubicacion')->nullable(); // Ej: Auditorio, Zoom, Lab 1

            // Relaciones
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            // Control de visibilidad
            $table->boolean('esta_publicado')->default(true);
            $table->boolean('es_destacado')->default(false); // Para mostrarlo en el banner principal
            $table->boolean('esta_eliminado')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
