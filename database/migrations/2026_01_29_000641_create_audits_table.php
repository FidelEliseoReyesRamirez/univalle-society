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
        Schema::create('audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained(); // Quién lo hizo
            $table->string('accion');        // 'crear', 'editar', 'eliminar', 'login'
            $table->string('tipo_recurso');  // 'Evento', 'Proyecto', 'Categoría', 'Usuario'
            $table->string('nombre_recurso'); // El nombre de lo que se tocó
            $table->text('detalles')->nullable(); // Opcional: cambios realizados
            $table->ipAddress('ip')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audits');
    }
};
