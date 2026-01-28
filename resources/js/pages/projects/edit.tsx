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
        _method: 'patch', // IMPORTANTE: Laravel necesita esto para procesar archivos en PATCH
        titulo: proyecto.titulo || '',
        extracto: proyecto.extracto || '',
        contenido: proyecto.contenido || '',
        category_id: proyecto.category_id?.toString() || '',
        ubicacion: proyecto.ubicacion || '',
        imagen: null as any,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Enviamos como POST por el tema de la imagen, pero Laravel lo leerá como PATCH
        post(`/proyectos/${proyecto.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Proyectos', href: '/proyectos' },
                { title: 'Editar', href: '#' },
            ]}
        >
            <Head title="Editar Proyecto" />
            <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/proyectos"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                        Editar Proyecto
                    </h1>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-xl border border-border bg-card p-6 shadow-md md:p-10"
                >
                    <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
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
                            />
                            {errors.titulo && (
                                <p className="text-xs text-destructive">
                                    {errors.titulo}
                                </p>
                            )}
                        </div>

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
                                            : 'Seleccionar...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[--radix-popover-trigger-width] p-0"
                                    align="start"
                                >
                                    <Command>
                                        <CommandInput placeholder="Buscar..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                No encontrado.
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
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-primary uppercase">
                                <Github size={14} /> Link del Repositorio
                            </label>
                            <input
                                type="text"
                                className="h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={data.ubicacion}
                                onChange={(e) =>
                                    setData('ubicacion', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Resumen
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={2}
                                value={data.extracto}
                                onChange={(e) =>
                                    setData('extracto', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Documentación
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={8}
                                value={data.contenido}
                                onChange={(e) =>
                                    setData('contenido', e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 py-10">
                                <Code
                                    size={40}
                                    className="mb-3 text-muted-foreground/40"
                                />
                                <label className="cursor-pointer text-center font-semibold text-primary hover:underline">
                                    Cambiar imagen de portada
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e: any) =>
                                            setData('imagen', e.target.files[0])
                                        }
                                    />
                                </label>
                                {proyecto.imagen_ruta && !data.imagen && (
                                    <p className="mt-2 text-[10px] text-muted-foreground">
                                        Imagen actual activa
                                    </p>
                                )}
                                {data.imagen && (
                                    <p className="mt-2 text-xs font-bold text-primary">
                                        Nuevo archivo: {data.imagen.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-border/50 pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            size="lg"
                            className="h-12 w-full px-12 font-bold tracking-widest uppercase sm:w-auto"
                        >
                            <Save className="mr-2 h-5 w-5" /> Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
