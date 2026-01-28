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
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    ChevronLeft,
    ChevronRight,
    Edit,
    FilterX,
    Github,
    Info,
    Plus,
    RotateCcw,
    Search,
    Tag,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Index({ projects, categories, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || 'all');
    const [dateFrom, setDateFrom] = useState(filters.dateFrom || '');
    const [dateTo, setDateTo] = useState(filters.dateTo || '');
    const [showDeleted, setShowDeleted] = useState(filters.trashed === 'true');
    const [catSearch, setCatSearch] = useState('');

    const [isDelOpen, setIsDelOpen] = useState(false);
    const [isRestoreOpen, setIsRestoreOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

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
                '/proyectos',
                {
                    search,
                    category_id: categoryId,
                    dateFrom,
                    dateTo,
                    trashed: showDeleted.toString(),
                },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryId, dateFrom, dateTo, showDeleted]);

    const clearFilters = () => {
        setSearch('');
        setCategoryId('all');
        setDateFrom('');
        setDateTo('');
        setCatSearch('');
    };

    const confirmDelete = () => {
        if (selectedProject) {
            router.delete(`/proyectos/${selectedProject.id}`, {
                onSuccess: () => setIsDelOpen(false),
            });
        }
    };

    const confirmRestore = () => {
        if (selectedProject) {
            router.patch(
                `/proyectos/${selectedProject.id}/restaurar`,
                {},
                {
                    onSuccess: () => setIsRestoreOpen(false),
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Proyectos', href: '/proyectos' }]}>
            <Head title="Repositorio de Proyectos" />
            <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">
                            {showDeleted
                                ? 'Papelera de Proyectos'
                                : 'Proyectos'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Listado general de proyectos de investigación
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={showDeleted ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => setShowDeleted(!showDeleted)}
                        >
                            <Archive className="mr-2 h-4 w-4" />
                            {showDeleted ? 'Ver Activos' : 'Ver Papelera'}
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/proyectos/crear">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo proyecto
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mb-2 grid grid-cols-1 gap-6 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <Label>Título</Label>
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Categoría</Label>
                        <div className="relative space-y-1">
                            <Input
                                placeholder="Buscar cat..."
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
                            className="text-xs text-destructive hover:bg-destructive/10"
                            onClick={clearFilters}
                        >
                            <FilterX className="mr-2 h-3.5 w-3.5" /> Limpiar
                            filtros
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Proyecto</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Info className="h-8 w-8 opacity-20" />
                                            <p>No se encontraron registros</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.data.map((pro: any) => (
                                    <TableRow key={pro.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {pro.titulo}
                                                </span>
                                                {pro.ubicacion && (
                                                    <span className="flex cursor-pointer items-center gap-1 text-[10px] text-primary hover:underline">
                                                        <Github size={10} />{' '}
                                                        {pro.ubicacion}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                                {pro.category?.nombre ||
                                                    'Sin categoría'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(
                                                pro.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {!showDeleted ? (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-blue-500"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/proyectos/${pro.id}/editar`}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive"
                                                            onClick={() => {
                                                                setSelectedProject(
                                                                    pro,
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
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600"
                                                        onClick={() => {
                                                            setSelectedProject(
                                                                pro,
                                                            );
                                                            setIsRestoreOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
                        <div className="text-xs font-medium text-muted-foreground">
                            Mostrando{' '}
                            <span className="text-foreground">
                                {projects.from || 0}
                            </span>{' '}
                            -{' '}
                            <span className="text-foreground">
                                {projects.to || 0}
                            </span>{' '}
                            de{' '}
                            <span className="text-foreground">
                                {projects.total}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={!projects.prev_page_url}
                                onClick={() =>
                                    router.get(projects.prev_page_url)
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={!projects.next_page_url}
                                onClick={() =>
                                    router.get(projects.next_page_url)
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Dialog open={isDelOpen} onOpenChange={setIsDelOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" /> ¿Mover a
                                papelera?
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-left">
                                El proyecto{' '}
                                <strong>{selectedProject?.titulo}</strong>{' '}
                                dejará de ser visible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setIsDelOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Mover a papelera
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-green-600">
                                <RotateCcw className="h-5 w-5" /> Restaurar
                                Proyecto
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-left">
                                ¿Deseas volver a publicar{' '}
                                <strong>{selectedProject?.titulo}</strong>?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setIsRestoreOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="bg-green-600 text-white hover:bg-green-700"
                                onClick={confirmRestore}
                            >
                                Restaurar ahora
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
