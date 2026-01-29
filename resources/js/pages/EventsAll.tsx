import EventContainer from '@/components/event-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HomeLayout from '@/layouts/HomeLayout';
import { Head } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, FilterX, Search, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function EventsAll({ events = [] }: { events: any[] }) {
    // Estados para los filtros
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // 1. Obtener categorías ÚNICAS de los eventos presentes (excluyendo noticias)
    const availableCategories = useMemo(() => {
        const cats = events
            .map((e) => e.category)
            .filter((cat) => {
                if (!cat) return false;
                const name = cat.nombre.toLowerCase();
                return !name.includes('noticia') && !name.includes('news');
            });

        const uniqueCats = Array.from(
            new Map(cats.map((c) => [c.id, c])).values(),
        );
        return uniqueCats.sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre),
        );
    }, [events]);

    // 2. Lógica de filtrado
    const filteredEvents = useMemo(() => {
        const filtered = events.filter((event) => {
            const catName = event.category?.nombre?.toLowerCase() || '';

            if (catName.includes('noticia') || catName.includes('news'))
                return false;

            const matchesSearch =
                event.titulo.toLowerCase().includes(search.toLowerCase()) ||
                event.extracto?.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                categoryId === 'all' ||
                event.category_id?.toString() === categoryId;

            const eventDate = event.fecha_evento
                ? new Date(event.fecha_evento).getTime()
                : null;
            const from = dateFrom ? new Date(dateFrom).getTime() : null;
            const to = dateTo ? new Date(dateTo).getTime() : null;

            let matchesDate = true;
            if (eventDate) {
                if (from && eventDate < from) matchesDate = false;
                if (to && eventDate > to) matchesDate = false;
            } else if (from || to) {
                matchesDate = false;
            }

            return matchesSearch && matchesCategory && matchesDate;
        });

        setCurrentPage(1); // Resetear a pág 1 al filtrar
        return filtered;
    }, [events, search, categoryId, dateFrom, dateTo]);

    // 3. Lógica de Paginación Local
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const paginatedEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredEvents, currentPage]);

    const hasFilters =
        search !== '' ||
        categoryId !== 'all' ||
        dateFrom !== '' ||
        dateTo !== '';

    return (
        <HomeLayout>
            <Head title="Explorar Eventos" />

            <div className="mx-auto max-w-7xl px-6 py-12 text-left">
                <header className="mb-12">
                    <h1 className="text-5xl font-black uppercase italic dark:text-white">
                        Explorar Eventos
                    </h1>
                    <p className="mt-2 text-sm font-bold text-zinc-500 uppercase">
                        Encuentra actividades, talleres y conferencias
                    </p>
                </header>

                {/* Barra de Filtros */}
                <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase opacity-60">
                            Buscar
                        </Label>
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Nombre del evento..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase opacity-60">
                            Categoría
                        </Label>
                        <div className="relative">
                            <Tag className="absolute top-2.5 left-2.5 h-4 w-4 text-zinc-400" />
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-9 text-sm focus:ring-2 focus:ring-[#f02a34] focus:outline-none dark:bg-zinc-950"
                            >
                                <option value="all">
                                    Todas las categorías
                                </option>
                                {availableCategories.map((cat: any) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id.toString()}
                                    >
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase opacity-60">
                            Desde
                        </Label>
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="dark:bg-zinc-950"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase opacity-60">
                            Hasta
                        </Label>
                        <Input
                            type="date"
                            value={dateTo}
                            min={dateFrom}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="dark:bg-zinc-950"
                        />
                    </div>
                </div>

                {/* Botón Limpiar */}
                <div className="mb-6 flex h-6 items-center">
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold text-[#f02a34] uppercase hover:bg-red-50"
                            onClick={() => {
                                setSearch('');
                                setCategoryId('all');
                                setDateFrom('');
                                setDateTo('');
                            }}
                        >
                            <FilterX className="mr-2 h-4 w-4" /> Limpiar filtros
                        </Button>
                    )}
                </div>

                {/* Resultados con Paginación */}
                {paginatedEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
                            <Search size={48} className="text-zinc-400" />
                        </div>
                        <h3 className="mt-4 text-xl font-bold dark:text-white">
                            No se encontraron eventos
                        </h3>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {paginatedEvents.map((e) => (
                                <div key={e.id} className="animate-fade-in">
                                    <EventContainer eventData={e} />
                                </div>
                            ))}
                        </div>

                        {/* Paginador */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-6">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                    className="rounded-full border-zinc-300 hover:text-[#f02a34]"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />{' '}
                                    Anterior
                                </Button>

                                <span className="text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">
                                    Página{' '}
                                    <span className="text-zinc-900 dark:text-white">
                                        {currentPage}
                                    </span>{' '}
                                    de {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    className="rounded-full border-zinc-300 hover:text-[#f02a34]"
                                >
                                    Siguiente{' '}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </HomeLayout>
    );
}
