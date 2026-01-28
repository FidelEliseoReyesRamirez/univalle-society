import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    Edit,
    MapPin,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Index({ events, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [isDelOpen, setIsDelOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                '/eventos',
                { search },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = () => {
        if (selectedEvent) {
            router.delete(`/eventos/${selectedEvent.id}`, {
                onSuccess: () => setIsDelOpen(false),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Eventos', href: '/eventos' }]}>
            <Head title="Gestión de Eventos" />
            <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">
                            Eventos
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Administra las noticias y publicaciones sociales.
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/eventos/crear">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo evento
                        </Link>
                    </Button>
                </div>

                <div className="relative mb-6 max-w-sm">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar evento..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Evento / Noticia</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Fecha y Lugar</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event: any) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        {event.titulo}
                                    </TableCell>
                                    <TableCell>
                                        <span className="rounded-full border bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                                            {event.category?.nombre}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar
                                                    size={12}
                                                    className="text-primary"
                                                />
                                                {event.fecha_evento
                                                    ? new Date(
                                                          event.fecha_evento,
                                                      ).toLocaleDateString()
                                                    : 'Sin fecha'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin
                                                    size={12}
                                                    className="text-primary"
                                                />
                                                {event.ubicacion || 'Virtual'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-500"
                                                asChild
                                            >
                                                <Link
                                                    href={`/eventos/${event.id}/edit`}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setIsDelOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* MODAL ELIMINAR */}
                <Dialog open={isDelOpen} onOpenChange={setIsDelOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" /> ¿Eliminar
                                evento?
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-left">
                                ¿Estás seguro de que deseas eliminar{' '}
                                <strong>{selectedEvent?.titulo}</strong>? Esta
                                acción lo enviará a la papelera.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDelOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
