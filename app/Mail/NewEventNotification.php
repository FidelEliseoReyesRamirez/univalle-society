<?php

namespace App\Mail;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewEventNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $event;
    public $tipoAccion; // 'nuevo' o 'actualizacion'

    public function __construct(Event $event, $tipoAccion = 'nuevo')
    {
        $this->event = $event;
        $this->tipoAccion = $tipoAccion;
    }

    public function envelope(): Envelope
    {
        $prefijo = $this->tipoAccion === 'actualizacion' ? '¡ACTUALIZACIÓN!' : 'NUEVO';
        $categoria = str_contains(strtolower($this->event->category->nombre), 'noticia') ? 'Noticia' : 'Evento';

        return new Envelope(
            subject: "[$prefijo $categoria]: " . $this->event->titulo,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.event-notification',
        );
    }
}
