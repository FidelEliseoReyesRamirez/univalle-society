<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // AÑADE ESTO AQUÍ
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function ($response, $exception, $request) {
            // Lista de errores que queremos capturar
            $codes = [
                400, // Bad Request
                401, // Unauthorized
                403, // Forbidden (Acceso denegado)
                404, // Not Found (No encontrado)
                405, // Method Not Allowed (El que te dio error ahora)
                419, // Page Expired (Sesión expirada)
                429, // Too Many Requests (Muchos intentos)
                500, // Internal Server Error
                503, // Service Unavailable (Mantenimiento)
            ];

            if (in_array($response->getStatusCode(), $codes)) {
                return Inertia::render('error', [
                    'status' => $response->getStatusCode(),
                ])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            return $response;
        });
    })->create();
