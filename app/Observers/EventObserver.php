<?php

namespace App\Observers;

use App\Models\Event;
use App\Models\User;
use App\Mail\NewEventNotification;
use Illuminate\Support\Facades\Mail;

class EventObserver
{
    // Se dispara al crear
    public function created(Event $event)
    {
        $this->sendEmails($event, 'nuevo');
    }

    // Se dispara al actualizar
    public function updated(Event $event)
    {
        // Solo enviamos correo si el evento está publicado y no está eliminado
        if ($event->esta_publicado && !$event->esta_eliminado) {
            $this->sendEmails($event, 'actualizacion');
        }
    }

    protected function sendEmails(Event $event, $tipo)
    {
        $emails = User::pluck('email');

        if ($emails->count() > 0) {
            // Usamos send() porque estás en modo SYNC (sin colas)
            Mail::to($emails)->send(new NewEventNotification($event, $tipo));
        }
    }
}
