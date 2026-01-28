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
    Calendar,
    Check,
    ChevronsUpDown,
    Image as ImageIcon,
    Layout,
    MapPin,
    Save,
} from 'lucide-react';
import { useState } from 'react';

export default function Create({ categories }: { categories: any[] }) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        titulo: '',
        extracto: '',
        contenido: '',
        category_id: '',
        fecha_evento: '',
        ubicacion: '',
        nombre_plantilla: 'PostFacebook',
        imagen: null as any,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/eventos');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Eventos', href: '/eventos' },
                { title: 'Nuevo', href: '/eventos/crear' },
            ]}
        >
            <Head title="Nuevo Evento" />
            <div className="mx-auto w-full max-w-5xl p-4 text-left md:p-8">
                {/* Cabecera */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/eventos"
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft size={16} /> Volver al listado
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Registrar nuevo evento
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
                                Título del evento o noticia
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                placeholder="Ej: Simposio Internacional de Ingeniería"
                                value={data.titulo}
                                onChange={(e) =>
                                    setData('titulo', e.target.value)
                                }
                            />
                            {errors.titulo && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.titulo}
                                </p>
                            )}
                        </div>

                        {/* Combobox de Categorías */}
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
                                        <CommandList className="max-h-[250px]">
                                            <CommandEmpty>
                                                No se encontró la categoría.
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

                        {/* Plantilla Visual */}
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
                                className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={data.fecha_evento}
                                onChange={(e) =>
                                    setData('fecha_evento', e.target.value)
                                }
                            />
                        </div>

                        {/* Ubicación */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                <MapPin size={14} /> Ubicación o Enlace
                            </label>
                            <input
                                type="text"
                                className="h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-foreground transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                placeholder="Ej: Auditorio Central o Link de Zoom"
                                value={data.ubicacion}
                                onChange={(e) =>
                                    setData('ubicacion', e.target.value)
                                }
                            />
                        </div>

                        {/* Resumen */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Resumen corto (Extracto)
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={2}
                                placeholder="Breve descripción para la vista previa..."
                                value={data.extracto}
                                onChange={(e) =>
                                    setData('extracto', e.target.value)
                                }
                            />
                        </div>

                        {/* Contenido */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                                Cuerpo de la publicación
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                rows={8}
                                placeholder="Escribe todo el detalle de la noticia aquí..."
                                value={data.contenido}
                                onChange={(e) =>
                                    setData('contenido', e.target.value)
                                }
                            />
                        </div>

                        {/* Dropzone Imagen */}
                        <div className="md:col-span-2">
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 py-10 transition-colors hover:border-primary/40 hover:bg-muted/10">
                                <ImageIcon
                                    size={40}
                                    className="mb-3 text-muted-foreground/40"
                                />
                                <label className="cursor-pointer text-center">
                                    <span className="mb-1 block text-sm font-semibold text-primary hover:underline">
                                        Haz clic para subir imagen de portada
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Formatos soportados: JPG, PNG, WEBP
                                        (Máx. 2MB)
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
                                    <div className="mt-4 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[10px] font-bold text-primary">
                                        SELECCIONADO: {data.imagen.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="flex justify-end border-t border-border/50 pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            size="lg"
                            className="h-12 w-full px-12 text-lg font-bold tracking-widest uppercase shadow-lg shadow-primary/20 transition-all active:scale-95 sm:w-auto"
                        >
                            <Save className="mr-2 h-5 w-5" /> Guardar
                            publicación
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
