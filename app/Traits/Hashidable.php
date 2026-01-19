<?php

namespace App\Traits;

use Vinkla\Hashids\Facades\Hashids;

trait Hashidable
{
    /**
     * Esta función hace que $user->id devuelva el Hash automáticamente en las rutas
     */
    public function getRouteKey()
    {
        return Hashids::encode($this->getKey());
    }

    /**
     * Esta función recibe el Hash (ej: jR8v0y) y lo convierte en el ID real (ej: 2)
     */
    public function resolveRouteBinding($value, $field = null)
    {
        // Intentamos decodificar
        $decoded = Hashids::decode($value);

        // Si no se puede decodificar, Laravel devolverá 404 automáticamente al retornar null
        if (empty($decoded)) {
            return null;
        }

        return parent::resolveRouteBinding($decoded[0], $field);
    }
}
