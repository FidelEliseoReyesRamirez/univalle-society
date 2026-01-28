import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Pencil,
    RotateCcw,
    Search,
    Tag,
    Trash,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CategoriesIndex({
    categories,
    filters,
}: {
    categories: any; // Ahora es un objeto de paginación
    filters: any;
}) {
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const isTrashedView = filters.trashed === 'true';

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                '/categorias',
                { search, trashed: filters.trashed },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, setData, post, patch, reset, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            patch(`/categorias/${isEditing}`, {
                onSuccess: () => {
                    reset();
                    setIsEditing(null);
                },
            });
        } else {
            post('/categorias', { onSuccess: () => reset() });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categorías', href: '/categorias' }]}>
            <Head title="Categorías" />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <h2
                        className={`text-2xl font-bold ${isTrashedView ? 'text-destructive' : 'text-primary'}`}
                    >
                        {isTrashedView
                            ? 'Papelera de Categorías'
                            : 'Categorías'}
                    </h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.get('/categorias', {
                                search,
                                trashed: isTrashedView ? 'false' : 'true',
                            })
                        }
                    >
                        {isTrashedView ? (
                            <CheckCircle className="mr-2 h-4 w-4" />
                        ) : (
                            <Trash className="mr-2 h-4 w-4" />
                        )}
                        {isTrashedView ? 'Ver Activos' : 'Ver Papelera'}
                    </Button>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background py-2 pr-3 pl-8 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        placeholder="Buscar categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {!isTrashedView && (
                        <div className="md:col-span-1">
                            <form
                                onSubmit={submit}
                                className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
                            >
                                <h3 className="text-sm font-bold tracking-wider text-primary uppercase">
                                    {isEditing
                                        ? 'Editar Categoría'
                                        : 'Nueva Categoría'}
                                </h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">
                                        Nombre
                                    </label>
                                    <input
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData('nombre', e.target.value)
                                        }
                                    />
                                    {errors.nombre && (
                                        <p className="text-[10px] text-red-500">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">
                                        Descripción
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        rows={3}
                                        value={data.descripcion}
                                        onChange={(e) =>
                                            setData(
                                                'descripcion',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        className="flex-1"
                                        size="sm"
                                        disabled={processing}
                                    >
                                        {isEditing
                                            ? 'Guardar Cambios'
                                            : 'Crear Categoría'}
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditing(null);
                                                reset();
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    <div
                        className={`overflow-hidden rounded-xl border bg-card shadow-sm ${isTrashedView ? 'md:col-span-3' : 'md:col-span-2'}`}
                    >
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        Categoría
                                    </TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No se encontraron categorías.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.data.map((cat: any) => (
                                        <TableRow key={cat.id}>
                                            <TableCell className="font-semibold">
                                                <div className="flex items-center gap-2 text-left">
                                                    <Tag
                                                        size={14}
                                                        className="text-primary/60"
                                                    />
                                                    {cat.nombre}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-left text-xs text-muted-foreground">
                                                {cat.descripcion || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    {isTrashedView ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-600"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/categorias/${cat.id}/restore`,
                                                                )
                                                            }
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-blue-500"
                                                                onClick={() => {
                                                                    setIsEditing(
                                                                        cat.id,
                                                                    );
                                                                    setData({
                                                                        nombre: cat.nombre,
                                                                        descripcion:
                                                                            cat.descripcion ||
                                                                            '',
                                                                    });
                                                                }}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive"
                                                                onClick={() =>
                                                                    router.delete(
                                                                        `/categorias/${cat.id}`,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* PAGINACIÓN */}
                        <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
                            <div className="text-xs text-muted-foreground">
                                Mostrando{' '}
                                <span className="font-medium">
                                    {categories.from || 0}
                                </span>{' '}
                                a{' '}
                                <span className="font-medium">
                                    {categories.to || 0}
                                </span>{' '}
                                de{' '}
                                <span className="font-medium">
                                    {categories.total}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    disabled={!categories.prev_page_url}
                                    onClick={() =>
                                        router.get(
                                            categories.prev_page_url,
                                            {
                                                search,
                                                trashed: filters.trashed,
                                            },
                                            { preserveState: true },
                                        )
                                    }
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    disabled={!categories.next_page_url}
                                    onClick={() =>
                                        router.get(
                                            categories.next_page_url,
                                            {
                                                search,
                                                trashed: filters.trashed,
                                            },
                                            { preserveState: true },
                                        )
                                    }
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
