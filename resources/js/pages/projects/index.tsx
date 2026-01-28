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
    Archive,
    Calendar,
    Edit,
    Github,
    Info,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Index({ projects, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [showDeleted, setShowDeleted] = useState(filters.trashed === 'true');

    // Estados para Modales
    const [isDelOpen, setIsDelOpen] = useState(false);
    const [isRestoreOpen, setIsRestoreOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                '/proyectos',
                { search, date, trashed: showDeleted },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search, date, showDeleted]);

    const confirmDelete = () => {
        if (selectedProject) {
            router.delete(`/proyectos/${selectedProject.id}`, {
                preserveScroll: true,
                preserveState: false, // Esto fuerza la actualización de la lista
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
                    preserveScroll: true,
                    preserveState: false, // Esto fuerza la actualización de la lista
                    onSuccess: () => setIsRestoreOpen(false),
                },
            );
        }
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Proyectos', href: '/proyectos' }]}>
            <Head title="Repositorio de Proyectos" />
            <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
                {/* Cabecera Limpia */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">
                            {showDeleted
                                ? 'Papelera de proyectos'
                                : 'Proyectos'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {showDeleted
                                ? 'Gestiona los elementos eliminados temporalmente'
                                : 'Listado general de proyectos de investigación'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleted(!showDeleted)}
                            className={
                                showDeleted
                                    ? 'border-primary/20 bg-primary/10 text-primary'
                                    : ''
                            }
                        >
                            <Archive className="mr-2 h-4 w-4" />
                            {showDeleted ? 'Ver activos' : 'Ver papelera'}
                        </Button>
                        <Button asChild size="sm" className="shadow-sm">
                            <Link href="/proyectos/crear">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo proyecto
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar proyecto..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative max-w-[200px]">
                        <Calendar className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="date"
                            className="pl-8"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabla */}
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
                            {projects.length === 0 && (
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
                            )}
                            {projects.map((pro: any) => (
                                <TableRow key={pro.id}>
                                    <TableCell>
                                        <div className="flex flex-col text-left">
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
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                        onClick={() => {
                                                            setSelectedProject(
                                                                pro,
                                                            );
                                                            setIsDelOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                                                    onClick={() => {
                                                        setSelectedProject(pro);
                                                        setIsRestoreOpen(true);
                                                    }}
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* MODAL ELIMINAR (LÓGICO) */}
                <Dialog open={isDelOpen} onOpenChange={setIsDelOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" /> ¿Enviar a
                                papelera?
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-left">
                                El proyecto{' '}
                                <strong>{selectedProject?.titulo}</strong>{' '}
                                dejará de ser visible en la plataforma, pero
                                podrás restaurarlo más tarde desde la papelera.
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

                {/* MODAL RESTAURAR */}
                <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-green-600">
                                <RotateCcw className="h-5 w-5" /> Restaurar
                                Proyecto
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-left">
                                ¿Deseas volver a publicar el proyecto{' '}
                                <strong>{selectedProject?.titulo}</strong>?
                                Volverá a ser visible para todos los usuarios.
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
                                className="bg-green-600 hover:bg-green-700"
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
