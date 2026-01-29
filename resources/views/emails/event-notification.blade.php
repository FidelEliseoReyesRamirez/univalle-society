<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #eee;
            border-radius: 10px;
            overflow: hidden;
        }

        .header {
            background-color: #f02a34;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 30px;
        }

        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }

        .button {
            background-color: #f02a34;
            color: white !important;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }

        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>SICI-ISI</h1>
        </div>
        <div class="content">
            <h2>{{ $event->titulo }}</h2>
            <p><strong>{{ $event->extracto }}</strong></p>

            @if($event->imagen_ruta)
            <img src="{{ $message->embed(public_path($event->imagen_ruta)) }}" alt="Imagen del evento">
            @endif
            @if($tipoAccion === 'actualizacion')
            <p style="color: #f02a34; font-weight: bold; text-transform: uppercase; border: 1px solid #f02a34; padding: 5px; text-align: center;">
                Este evento ha sido actualizado con nueva información
            </p>
            @endif
            <p style="margin-top: 20px;">{{ Str::limit($event->contenido, 200) }}</p>

            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ url('/') }}" class="button">VER MÁS DETALLES</a>
            </div>
        </div>
        <div class="footer">
            <p>Este es un correo automático de la Sociedad de Investigación, Ciencia e Innovación.</p>
            <p>Recibes esto porque eres parte de nuestra comunidad.</p>
        </div>
    </div>
</body>

</html>