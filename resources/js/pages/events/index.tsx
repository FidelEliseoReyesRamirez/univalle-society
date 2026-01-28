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
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Edit,
    FilterX,
    MapPin,
    Plus,
    RotateCcw,
    Search,
    Tag,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Index({ events, categories, filters }: any) {
    const { errors }: any = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || 'all');
    const [trashed, setTrashed] = useState(filters.trashed === 'true');
    const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
    const [dateTo, setDateTo] = useState(filters.dateTo || '');
    const [catSearch, setCatSearch] = useState('');

    const [isDelOpen, setIsDelOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const hasFilters = useMemo(() => {
        return (
            search !== '' ||
            categoryId !== 'all' ||
            dateFrom !== '' ||
            dateTo !== ''
        );
    }, [search, categoryId, dateFrom, dateTo]);

    const filteredCategories = useMemo(() => {
        return categories
            .filter((c: any) =>
                c.nombre.toLowerCase().includes(catSearch.toLowerCase()),
            )
            .sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
    }, [categories, catSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                '/eventos',
                {
                    search,
                    trashed: trashed.toString(),
                    dateFrom,
                    dateTo,
                    category_id: categoryId,
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, trashed, dateFrom, dateTo, categoryId]);

    const handleDelete = () => {
        if (selectedEvent) {
            router.delete(`/eventos/${selectedEvent.id}`, {
                onSuccess: () => setIsDelOpen(false),
            });
        }
    };

    const handleRestore = (id: string) => {
        router.put(`/eventos/${id}/restore`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Eventos', href: '/eventos' }]}>
            <Head title="Gestión de Eventos" />
            <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
                {/* Alertas de Error (Ej: Categoría eliminada al restaurar) */}
                {errors.error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive">
                        <AlertTriangle size={16} /> {errors.error}
                    </div>
                )}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">
                            Eventos
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Administra las noticias y publicaciones sociales.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={trashed ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => setTrashed(!trashed)}
                        >
                            <Archive className="mr-2 h-4 w-4" />
                            {trashed ? 'Ver Activos' : 'Ver Papelera'}
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/eventos/crear">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo evento
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="mb-2 grid grid-cols-1 gap-6 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <Label>Buscar por título</Label>
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Título..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Filtrar Categoría</Label>
                        <div className="relative space-y-1">
                            <Input
                                placeholder="Buscar..."
                                className="h-7 border-dashed text-[10px]"
                                value={catSearch}
                                onChange={(e) => setCatSearch(e.target.value)}
                            />
                            <div className="relative">
                                <Tag className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <select
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(e.target.value)
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background py-2 pr-3 pl-8 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                >
                                    <option value="all">Todas</option>
                                    {filteredCategories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Desde</Label>
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Hasta</Label>
                        <Input
                            type="date"
                            value={dateTo}
                            min={dateFrom}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4 flex h-8 items-center">
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive"
                            onClick={() => {
                                setSearch('');
                                setCategoryId('all');
                                setDateFrom('');
                                setDateTo('');
                            }}
                        >
                            <FilterX className="mr-2 h-3.5 w-3.5" /> Limpiar
                            filtros
                        </Button>
                    )}
                </div>

                {/* Tabla */}
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
                            {events.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center"
                                    >
                                        No hay eventos.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.data.map((event: any) => (
                                    <TableRow
                                        key={event.id}
                                        className={
                                            event.esta_eliminado
                                                ? 'bg-destructive/5'
                                                : ''
                                        }
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{event.titulo}</span>
                                                {event.esta_eliminado && (
                                                    <span className="text-[9px] font-black text-destructive uppercase">
                                                        Eliminado
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`w-fit rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                                        event.category
                                                            ?.esta_eliminado
                                                            ? 'border-destructive/20 bg-destructive/10 text-destructive'
                                                            : 'bg-secondary text-foreground'
                                                    }`}
                                                >
                                                    {event.category?.nombre ||
                                                        'Sin categoría'}
                                                </span>
                                                {event.category
                                                    ?.esta_eliminado && (
                                                    <span className="flex items-center gap-1 text-[9px] font-medium text-destructive">
                                                        <AlertTriangle
                                                            size={10}
                                                        />{' '}
                                                        Categoría borrada
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-[11px] text-muted-foreground">
                                                <div className="flex items-center gap-1 font-semibold text-foreground">
                                                    <Calendar
                                                        size={12}
                                                        className="text-primary"
                                                    />{' '}
                                                    {event.fecha_evento
                                                        ? new Date(
                                                              event.fecha_evento,
                                                          ).toLocaleDateString()
                                                        : 'Sin fecha'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin
                                                        size={12}
                                                        className="text-primary"
                                                    />{' '}
                                                    {event.ubicacion ||
                                                        'Virtual'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {!event.esta_eliminado ? (
                                                    <>
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
                                                                setSelectedEvent(
                                                                    event,
                                                                );
                                                                setIsDelOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-green-200 text-green-600 hover:bg-green-50"
                                                        onClick={() =>
                                                            handleRestore(
                                                                event.id,
                                                            )
                                                        }
                                                    >
                                                        <RotateCcw className="mr-1 h-3.5 w-3.5" />{' '}
                                                        Restaurar
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3 sm:px-6">
                        <div className="text-sm text-muted-foreground">
                            Mostrando{' '}
                            <span className="font-medium">
                                {events.from || 0}
                            </span>{' '}
                            a{' '}
                            <span className="font-medium">
                                {events.to || 0}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium">{events.total}</span>{' '}
                            resultados
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!events.prev_page_url}
                                onClick={() => router.get(events.prev_page_url)}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />{' '}
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!events.next_page_url}
                                onClick={() => router.get(events.next_page_url)}
                            >
                                Siguiente{' '}
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* MODAL ELIMINAR */}
                <Dialog open={isDelOpen} onOpenChange={setIsDelOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" /> ¿Mover a
                                la papelera?
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                El evento{' '}
                                <strong>{selectedEvent?.titulo}</strong> dejará
                                de ser visible.
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
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
