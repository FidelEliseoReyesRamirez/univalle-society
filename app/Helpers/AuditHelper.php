<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AuditHelper
{
    public static function log($accion, $tipo, $nombre, $detalles = null)
    {
        // Capturamos el User Agent (Navegador y SO)
        $userAgent = request()->header('User-Agent');

        DB::table('audits')->insert([
            'user_id'       => Auth::id(),
            'accion'        => $accion,
            'tipo_recurso'  => $tipo,
            'nombre_recurso' => $nombre,
            'detalles'      => $detalles ?? $userAgent, // Guardamos el navegador aquí
            'ip'            => request()->ip(),
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
    }
}
