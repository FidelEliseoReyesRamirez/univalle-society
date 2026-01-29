import EventContainer from '@/components/event-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HomeLayout from '@/layouts/HomeLayout';
import { Head } from '@inertiajs/react';
import { FilterX, Newspaper, Search, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function NewsAll({ news = [] }: { news: any[] }) {
    // Estados para los filtros
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // 1. Obtener categorías presentes SOLO en las noticias
    const availableCategories = useMemo(() => {
        const cats = news.map((n) => n.category).filter((cat) => cat !== null);

        const uniqueCats = Array.from(
            new Map(cats.map((c) => [c.id, c])).values(),
        );
        return uniqueCats.sort((a: any, b: any) =>
            a.nombre.localeCompare(b.nombre),
        );
    }, [news]);

    // 2. Lógica de filtrado
    const filteredNews = useMemo(() => {
        return news.filter((item) => {
            // Filtro por texto
            const matchesSearch =
                item.titulo.toLowerCase().includes(search.toLowerCase()) ||
                item.extracto?.toLowerCase().includes(search.toLowerCase());

            // Filtro por Categoría
            const matchesCategory =
                categoryId === 'all' ||
                item.category_id?.toString() === categoryId;

            // Filtro por Fechas
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

            return matchesSearch && matchesCategory && matchesDate;
        });
    }, [news, search, categoryId, dateFrom, dateTo]);

    const hasFilters =
        search !== '' ||
        categoryId !== 'all' ||
        dateFrom !== '' ||
        dateTo !== '';

    return (
        <HomeLayout>
            <Head title="Todas las Noticias" />

            <div className="mx-auto max-w-7xl px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-black uppercase italic dark:text-white">
                        Archivo de Noticias
                    </h1>
                    <p className="mt-2 text-sm font-bold text-zinc-500 uppercase">
                        Mantente al día con las novedades del SICI e ISI
                    </p>
                </header>

                {/* Barra de Filtros */}
                <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="space-y-2">
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
                            Tipo de Noticia
                        </Label>
                        <div className="relative">
                            <Tag className="absolute top-2.5 left-2.5 h-4 w-4 text-zinc-400" />
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-9 text-sm focus:ring-2 focus:ring-[#f02a34] focus:outline-none dark:bg-zinc-950"
                            >
                                <option value="all">Todas las etiquetas</option>
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
                            Publicado desde
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
                                setCategoryId('all');
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
                {filteredNews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="rounded-full bg-zinc-100 p-8 dark:bg-zinc-800">
                            <Newspaper size={48} className="text-zinc-400" />
                        </div>
                        <h3 className="mt-6 text-2xl font-bold dark:text-white">
                            Sin resultados
                        </h3>
                        <p className="max-w-xs text-zinc-500">
                            No encontramos noticias que coincidan con los
                            filtros seleccionados.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {filteredNews.map((n) => (
                            <div key={n.id} className="animate-fade-in">
                                <EventContainer eventData={n} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}
