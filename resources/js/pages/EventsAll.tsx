import EventContainer from '@/components/event-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HomeLayout from '@/layouts/HomeLayout';
import { Head } from '@inertiajs/react';
import { FilterX, Search, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function EventsAll({ events = [] }: { events: any[] }) {
    // Estados para los filtros
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // 1. Obtener categorías ÚNICAS de los eventos presentes (excluyendo noticias)
    const availableCategories = useMemo(() => {
        const cats = events
            .map((e) => e.category)
            .filter((cat) => {
                if (!cat) return false;
                const name = cat.nombre.toLowerCase();
                // Excluir categorías que sean noticia
                return !name.includes('noticia') && !name.includes('news');
            });

        // Quitar duplicados por ID
        const uniqueCats = Array.from(
            new Map(cats.map((c) => [c.id, c])).values(),
        );
        return uniqueCats.sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre),
        );
    }, [events]);

    // 2. Lógica de filtrado combinada
    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const catName = event.category?.nombre?.toLowerCase() || '';

            // Filtro de seguridad: No mostrar noticias nunca en esta vista
            if (catName.includes('noticia') || catName.includes('news'))
                return false;

            // Filtro por texto (título o extracto)
            const matchesSearch =
                event.titulo.toLowerCase().includes(search.toLowerCase()) ||
                event.extracto?.toLowerCase().includes(search.toLowerCase());

            // Filtro por Categoría
            const matchesCategory =
                categoryId === 'all' ||
                event.category_id?.toString() === categoryId;

            // Filtro por Fechas
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
                matchesDate = false; // Si hay filtro de fecha pero el evento no tiene fecha
            }

            return matchesSearch && matchesCategory && matchesDate;
        });
    }, [events, search, categoryId, dateFrom, dateTo]);

    const hasFilters =
        search !== '' ||
        categoryId !== 'all' ||
        dateFrom !== '' ||
        dateTo !== '';

    return (
        <HomeLayout>
            <Head title="Explorar Eventos" />

            <div className="mx-auto max-w-7xl px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-black uppercase italic dark:text-white">
                        Explorar Eventos
                    </h1>
                    <p className="mt-2 text-sm font-bold text-zinc-500 uppercase">
                        Encuentra actividades, talleres y conferencias
                    </p>
                </header>

                {/* Barra de Filtros Estilo Glassmorphism */}
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

                {/* Resultados */}
                {filteredEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
                            <Search size={48} className="text-zinc-400" />
                        </div>
                        <h3 className="mt-4 text-xl font-bold dark:text-white">
                            No se encontraron eventos
                        </h3>
                        <p className="text-zinc-500">
                            Prueba ajustando los filtros de búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((e) => (
                            <div key={e.id} className="animate-fade-in">
                                <EventContainer eventData={e} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}
