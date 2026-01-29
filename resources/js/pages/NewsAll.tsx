import EventContainer from '@/components/event-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HomeLayout from '@/layouts/HomeLayout';
import { Head } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    FilterX,
    Newspaper,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function NewsAll({ news = [] }: { news: any[] }) {
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 9;

    // 1. Lógica de filtrado
    const filteredNews = useMemo(() => {
        const filtered = news.filter((item) => {
            const matchesSearch =
                item.titulo.toLowerCase().includes(search.toLowerCase()) ||
                item.extracto?.toLowerCase().includes(search.toLowerCase());

            const newsDate = item.fecha_evento
                ? new Date(item.fecha_evento).getTime()
                : null;
            const from = dateFrom ? new Date(dateFrom).getTime() : null;
            const to = dateTo ? new Date(dateTo).getTime() : null;

            let matchesDate = true;
            if (newsDate) {
                if (from && newsDate < from) matchesDate = false;
                if (to && newsDate > to) matchesDate = false;
            } else if (from || to) {
                matchesDate = false;
            }

            return matchesSearch && matchesDate;
        });

        // Resetear a página 1 cuando se filtra
        setCurrentPage(1);
        return filtered;
    }, [news, search, dateFrom, dateTo]);

    // 2. Lógica de Paginación
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedNews = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredNews.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredNews, currentPage]);

    const hasFilters = search !== '' || dateFrom !== '' || dateTo !== '';

    return (
        <HomeLayout>
            <Head title="Archivo de Noticias" />

            <div className="mx-auto max-w-7xl px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-black uppercase italic dark:text-white">
                        Archivo de Noticias
                    </h1>
                    <p className="mt-2 text-sm font-bold text-zinc-500 uppercase">
                        Explora todas las novedades y publicaciones
                    </p>
                </header>

                {/* Barra de Filtros Simplificada */}
                <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 lg:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="space-y-2 lg:col-span-1">
                        <Label className="text-xs font-black uppercase opacity-60">
                            Buscar noticia
                        </Label>
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Título o contenido..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
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

                {/* Limpiar Filtros */}
                <div className="mb-6 flex h-6 items-center">
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold text-[#f02a34] uppercase hover:bg-red-50"
                            onClick={() => {
                                setSearch('');
                                setDateFrom('');
                                setDateTo('');
                            }}
                        >
                            <FilterX className="mr-2 h-4 w-4" /> Restaurar
                            búsqueda
                        </Button>
                    )}
                </div>

                {/* Grid de Noticias */}
                {paginatedNews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="rounded-full bg-zinc-100 p-8 dark:bg-zinc-800">
                            <Newspaper size={48} className="text-zinc-400" />
                        </div>
                        <h3 className="mt-6 text-2xl font-bold dark:text-white">
                            Sin resultados
                        </h3>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                            {paginatedNews.map((n) => (
                                <div key={n.id} className="animate-fade-in">
                                    <EventContainer eventData={n} />
                                </div>
                            ))}
                        </div>

                        {/* Paginación Visual */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                    className="rounded-full"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />{' '}
                                    Anterior
                                </Button>

                                <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase">
                                    Página {currentPage} de {totalPages}
                                </span>

                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    className="rounded-full"
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
