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
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronsUpDown,
    Image as ImageIcon,
    Layout,
    MapPin,
    Save,
} from 'lucide-react';
import React, { useState } from 'react';

export default function Edit({ event, categories }: any) {
    const [open, setOpen] = useState(false);

    const { data, setData, processing, errors } = useForm({
        titulo: event.titulo || '',
        extracto: event.extracto || '',
        contenido: event.contenido || '',
        category_id: event.category_id?.toString() || '',
        fecha_evento: event.fecha_evento ? event.fecha_evento.slice(0, 16) : '',
        ubicacion: event.ubicacion || '',
        nombre_plantilla: event.nombre_plantilla || 'PostFacebook',
        imagen: null as any,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Enviamos a la ruta definida en web.php: Route::post('/eventos/{id}', ...)
        router.post(
            `/eventos/${event.id}`,
            {
                ...data,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Evento actualizado con éxito');
                },
                onError: (err: any) => {
                    // Corregido el error de tipo implícito 'any'
                    console.error('Error en servidor:', err);
                },
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Eventos', href: '/eventos' },
                { title: 'Editar', href: '#' },
            ]}
        >
            <Head title="Editar Evento" />
            <div className="mx-auto w-full max-w-5xl p-4 text-left md:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/eventos"
                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft size={16} /> Volver al listado
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-primary uppercase">
                        Editar publicación
                    </h1>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-xl border border-border bg-card p-6 shadow-md md:p-10"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Título */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Título
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
                                        className="h-12 w-full justify-between border-input px-4 font-normal"
                                    >
                                        {data.category_id
                                            ? categories.find(
                                                  (c: any) =>
                                                      c.id.toString() ===
                                                      data.category_id,
                                              )?.nombre
                                            : 'Seleccionar categoría...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
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
                                                No encontrada.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {categories.map((c: any) => (
                                                    <CommandItem
                                                        key={c.id}
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

                        {/* Estilo Visual */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-primary uppercase">
                                <Layout size={14} /> Estilo de visualización
                            </label>
                            <select
                                className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={data.nombre_plantilla}
                                onChange={(e) =>
                                    setData('nombre_plantilla', e.target.value)
                                }
                            >
                                <option value="PostFacebook">
                                    Post estándar (Redes)
                                </option>
                                <option value="TicketStyle">
                                    Estilo Entrada/Ticket (Rojo)
                                </option>
                                <option value="GlassOverlay">
                                    Imagen de Fondo (Cristal)
                                </option>
                                <option value="Minimalist">
                                    Minimalista (Tipografía)
                                </option>
                                <option value="BentoBox">
                                    Bento Box (Bloques)
                                </option>
                            </select>
                        </div>

                        {/* Fecha */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                <Calendar size={14} /> Fecha y Hora
                            </label>
                            <input
                                type="datetime-local"
                                className="h-12 w-full rounded-md border border-input bg-background px-4 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={data.fecha_evento}
                                onChange={(e) =>
                                    setData('fecha_evento', e.target.value)
                                }
                            />
                        </div>

                        {/* Ubicación */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                <MapPin size={14} /> Ubicación
                            </label>
                            <input
                                type="text"
                                className="h-12 w-full rounded-md border border-input bg-background px-4 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={data.ubicacion}
                                onChange={(e) =>
                                    setData('ubicacion', e.target.value)
                                }
                            />
                        </div>

                        {/* Extracto */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Extracto
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={2}
                                value={data.extracto}
                                onChange={(e) =>
                                    setData('extracto', e.target.value)
                                }
                            />
                        </div>

                        {/* Contenido */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Contenido
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={8}
                                value={data.contenido}
                                onChange={(e) =>
                                    setData('contenido', e.target.value)
                                }
                            />
                        </div>

                        {/* Imagen Dropzone */}
                        <div className="md:col-span-2">
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/5 py-10 transition-colors hover:border-primary/40">
                                {event.imagen_ruta && !data.imagen && (
                                    <img
                                        src={event.imagen_ruta}
                                        className="mb-4 h-32 w-48 rounded-lg object-cover shadow-sm"
                                        alt="Actual"
                                    />
                                )}
                                <ImageIcon
                                    size={40}
                                    className="mb-3 text-muted-foreground/40"
                                />
                                <label className="cursor-pointer text-center">
                                    <span className="text-sm font-semibold text-primary hover:underline">
                                        Cambiar imagen de portada
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e: any) =>
                                            setData('imagen', e.target.files[0])
                                        }
                                    />
                                </label>
                                {data.imagen && (
                                    <p className="mt-2 text-xs font-bold text-primary italic">
                                        Seleccionada: {data.imagen.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            size="lg"
                            className="h-12 w-full px-12 text-lg font-bold tracking-widest uppercase shadow-lg shadow-primary/20 transition-all active:scale-95 sm:w-auto"
                        >
                            <Save className="mr-2 h-5 w-5" /> Guardar cambios
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
