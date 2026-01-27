import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin, Plus } from 'lucide-react';

export default function Index({ events }: { events: any[] }) {
    return (
        <AppLayout>
            <Head title="Gestión de Eventos" />
            <div className="p-4 sm:p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
                            GESTIÓN DE EVENTOS
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Administra las publicaciones y noticias de la
                            sociedad.
                        </p>
                    </div>
                    <Link
                        href="/eventos/crear"
                        className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                    >
                        <Plus size={18} /> NUEVO EVENTO
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 font-display text-lg tracking-wider text-muted-foreground uppercase">
                            <tr>
                                <th className="p-4">Evento</th>
                                <th className="hidden p-4 md:table-cell">
                                    Categoría
                                </th>
                                <th className="p-4">Fecha / Ubicación</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <tr
                                        key={event.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">
                                                {event.titulo}
                                            </div>
                                            <div className="text-xs text-muted-foreground md:hidden">
                                                {event.category?.nombre}
                                            </div>
                                        </td>
                                        <td className="hidden p-4 md:table-cell">
                                            <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                                                {event.category?.nombre}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Calendar
                                                        size={12}
                                                        className="text-primary"
                                                    />
                                                    {event.fecha_evento ||
                                                        'Sin fecha'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin
                                                        size={12}
                                                        className="text-primary"
                                                    />
                                                    {event.ubicacion ||
                                                        'Virtual'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/eventos/${event.id}/edit`}
                                                className="font-bold text-primary hover:underline"
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-8 text-center text-muted-foreground italic"
                                    >
                                        No se encontraron eventos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
