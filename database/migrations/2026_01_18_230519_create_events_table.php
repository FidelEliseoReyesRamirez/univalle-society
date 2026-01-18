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
            $table->text('contenido');
            $table->string('imagen_ruta')->nullable();
            
            // Aquí guardamos el nombre de la plantilla React (ej: PostFacebook, CardAcademica)
            $table->string('nombre_plantilla')->default('PostFacebook'); 
            
            // Relaciones
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            
            // Control de estado y eliminación lógica
            $table->boolean('esta_publicado')->default(true);
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