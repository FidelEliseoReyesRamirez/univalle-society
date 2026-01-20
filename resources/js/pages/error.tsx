import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Ban,
    FileQuestion,
    Home,
    Settings,
    ShieldAlert,
} from 'lucide-react';

export default function ErrorPage({ status }: { status: number }) {
    const title =
        {
            503: 'Servicio en Mantenimiento',
            500: 'Error Interno del Servidor',
            405: 'Acceso no permitido',
            404: 'Página no encontrada',
            403: 'Acceso denegado',
            401: 'No autorizado',
            419: 'Sesión expirada',
            400: 'Solicitud incorrecta',
        }[status] || 'Error inesperado';

    const description =
        {
            503: 'Estamos trabajando para mejorar el sistema. Vuelve pronto.',
            500: 'Ha ocurrido un error inesperado en nuestro servidor.',
            405: 'El método solicitado no es válido para esta dirección.',
            404: 'La página que buscas no existe o ha sido movida.',
            403: 'No cuentas con los privilegios suficientes para acceder aquí.',
            401: 'Tu sesión no es válida. Por favor, ingresa de nuevo.',
            419: 'Tu sesión ha expirado. Refresca la página e intenta de nuevo.',
            400: 'La solicitud no pudo ser procesada correctamente.',
        }[status] || 'Algo salió mal. Por favor intenta de nuevo.';

    const Icon = () => {
        const className =
            'h-12 w-12 md:h-16 md:w-16 transition-all duration-700 hover:rotate-12';
        switch (status) {
            case 404:
                return (
                    <FileQuestion className={`${className} text-blue-500`} />
                );
            case 403:
            case 401:
                return (
                    <ShieldAlert className={`${className} text-orange-500`} />
                );
            case 405:
            case 400:
                return <Ban className={`${className} text-destructive`} />;
            case 500:
            case 503:
                return (
                    <Settings
                        className={`${className} animate-spin-slow text-primary`}
                    />
                );
            default:
                return <AlertCircle className={`${className} text-primary`} />;
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-12 transition-colors duration-300">
            <Head title={`${status} - ${title}`} />

            {/* Fondo decorativo con variables de CSS */}
            <div className="absolute inset-0 z-0 [background-image:linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:40px_40px] opacity-[0.05] dark:opacity-[0.03]" />

            <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
                {/* Contenedor del Icono Responsivo */}
                <div className="group relative mb-6 md:mb-10">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl transition-all group-hover:bg-primary/30" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-border bg-card shadow-2xl md:h-32 md:w-32">
                        <Icon />
                    </div>
                </div>

                {/* Status Code Gigante (Text-Stroke effect sutil) */}
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                    <span className="text-[12rem] leading-none font-black text-foreground/[0.03] md:text-[20rem] dark:text-foreground/[0.02]">
                        {status}
                    </span>
                </div>

                {/* Textos */}
                <div className="text-center">
                    <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        {title}
                    </h1>
                    <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted-foreground md:text-xl">
                        {description}
                    </p>
                </div>

                {/* Botones Adaptables (Columna en móvil, fila en desktop) */}
                <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="h-12 w-full px-8 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 sm:w-auto"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Ir al Inicio
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 w-full border-border bg-background px-8 text-base font-semibold transition-all hover:bg-accent sm:w-auto"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Regresar
                    </Button>
                </div>

                {/* Footer de Marca */}
                <div className="mt-16 md:mt-24">
                    <div className="flex items-center gap-4 opacity-40">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-foreground" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-foreground uppercase">
                            SICI-ISI Univalle
                        </span>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-foreground" />
                    </div>
                </div>
            </div>

            {/* Luces de ambiente responsivas */}
            <div className="absolute -bottom-48 -left-48 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/5" />
            <div className="absolute -top-48 -right-48 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-500/5" />
        </div>
    );
}
