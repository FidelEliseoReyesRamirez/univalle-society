<?php

namespace App\Traits;

use Vinkla\Hashids\Facades\Hashids;

trait Hashidable
{
    /**
     * Reemplaza el ID por el Hash en las URLs generadas.
     */
    public function getRouteKey()
    {
        return Hashids::encode($this->getKey());
    }

    /**
     * Decodifica el Hash para encontrar el registro en la base de datos.
     */
    public function resolveRouteBinding($value, $field = null)
    {
        $decoded = Hashids::decode($value);
        if (empty($decoded)) return null;
        
        return parent::resolveRouteBinding($decoded[0], $field);
    }
}