import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ChevronsUpDown,
    Code,
    Github,
    Save,
} from 'lucide-react';
import { useState } from 'react';

export default function Edit({
    proyecto,
    categories,
}: {
    proyecto: any;
    categories: any[];
}) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        titulo: proyecto.titulo || '',
        extracto: proyecto.extracto || '',
        contenido: proyecto.contenido || '',
        category_id: proyecto.category_id?.toString() || '',
        ubicacion: proyecto.ubicacion || '',
        imagen: null as any,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cambiado a URL manual para evitar el error "route is not defined"
        post(`/proyectos/${proyecto.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Proyectos', href: '/proyectos' },
                { title: 'Editar', href: '#' },
            ]}
        >
            <Head title={`Editar - ${proyecto.titulo}`} />
            <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/proyectos"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase italic">
                        Editar Proyecto
                    </h1>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-xl border border-border bg-card p-6 shadow-md md:p-10"
                >
                    <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
                        {/* Título */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Nombre del Proyecto
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={data.titulo}
                                onChange={(e) =>
                                    setData('titulo', e.target.value)
                                }
                                placeholder="Ej. Sistema de Control de Inventarios"
                            />
                            {errors.titulo && (
                                <p className="text-xs font-bold text-destructive">
                                    {errors.titulo}
                                </p>
                            )}
                        </div>

                        {/* Categoría */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Categoría
                            </label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="h-12 w-full justify-between px-4 font-normal"
                                    >
                                        {data.category_id
                                            ? categories.find(
                                                  (c) =>
                                                      c.id.toString() ===
                                                      data.category_id,
                                              )?.nombre
                                            : 'Seleccionar categoría...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[--radix-popover-trigger-width] p-0"
                                    align="start"
                                >
                                    <Command>
                                        <CommandInput placeholder="Buscar categoría..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                No se encontraron resultados.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {categories.map((c) => (
                                                    <CommandItem
                                                        key={c.id}
                                                        value={c.nombre}
                                                        onSelect={() => {
                                                            setData(
                                                                'category_id',
                                                                c.id.toString(),
                                                            );
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                data.category_id ===
                                                                    c.id.toString()
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {c.nombre}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.category_id && (
                                <p className="text-xs font-bold text-destructive">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        {/* Link del Repositorio */}
                        <div className="space-y-2 text-left">
                            <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#f02a34] uppercase">
                                <Github size={14} /> Link del Repositorio /
                                Ubicación
                            </label>
                            <input
                                type="text"
                                className="h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={data.ubicacion}
                                onChange={(e) =>
                                    setData('ubicacion', e.target.value)
                                }
                                placeholder="https://github.com/..."
                            />
                        </div>

                        {/* Resumen */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Resumen Corto (Extracto)
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={2}
                                value={data.extracto}
                                onChange={(e) =>
                                    setData('extracto', e.target.value)
                                }
                                placeholder="Breve descripción del proyecto..."
                            />
                            {errors.extracto && (
                                <p className="text-xs font-bold text-destructive">
                                    {errors.extracto}
                                </p>
                            )}
                        </div>

                        {/* Contenido Completo */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Documentación o Descripción Detallada
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={8}
                                value={data.contenido}
                                onChange={(e) =>
                                    setData('contenido', e.target.value)
                                }
                                placeholder="Escribe aquí toda la información relevante..."
                            />
                            {errors.contenido && (
                                <p className="text-xs font-bold text-destructive">
                                    {errors.contenido}
                                </p>
                            )}
                        </div>

                        {/* Subida de Imagen */}
                        <div className="md:col-span-2">
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 py-10 transition-colors hover:bg-muted/10">
                                <Code
                                    size={40}
                                    className="mb-3 text-muted-foreground/40"
                                />
                                <label className="cursor-pointer text-center text-xs font-bold text-[#f02a34] uppercase hover:underline">
                                    [ Cambiar imagen de portada ]
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e: any) =>
                                            setData('imagen', e.target.files[0])
                                        }
                                    />
                                </label>

                                <div className="mt-4 flex flex-col items-center gap-2">
                                    {proyecto.imagen_ruta && !data.imagen && (
                                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-600 uppercase">
                                            ✓ Imagen actual conservada
                                        </span>
                                    )}
                                    {data.imagen && (
                                        <span className="rounded-full bg-[#f02a34]/10 px-3 py-1 text-[10px] font-bold text-[#f02a34] uppercase">
                                            Nueva: {data.imagen.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {errors.imagen && (
                                <p className="mt-2 text-center text-xs font-bold text-destructive">
                                    {errors.imagen}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="flex justify-end border-t border-border/50 pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            size="lg"
                            className="h-12 w-full bg-[#f02a34] px-12 font-black tracking-widest text-white uppercase hover:bg-[#d0252d] sm:w-auto"
                        >
                            {processing ? (
                                'Procesando...'
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" /> Guardar
                                    Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
