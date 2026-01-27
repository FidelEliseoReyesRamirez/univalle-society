import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, Save } from 'lucide-react';

export default function Create({ categories }: { categories: any[] }) {
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
        <AppLayout>
            <Head title="Crear Evento" />
            <div className="mx-auto max-w-4xl p-4 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/eventos"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Link>
                    <h1 className="font-display text-2xl text-foreground uppercase">
                        Crear nueva publicación
                    </h1>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-8"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-bold text-foreground">
                                TÍTULO DEL EVENTO
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Ej: Hackathon Univalle 2026"
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

                        <div>
                            <label className="mb-1 block text-sm font-bold text-foreground">
                                CATEGORÍA
                            </label>
                            <select
                                className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData('category_id', e.target.value)
                                }
                            >
                                <option value="">
                                    Seleccionar categoría...
                                </option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-xs text-destructive">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-foreground">
                                PLANTILLA VISUAL
                            </label>
                            <select
                                className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                value={data.nombre_plantilla}
                                onChange={(e) =>
                                    setData('nombre_plantilla', e.target.value)
                                }
                            >
                                <option value="PostFacebook">
                                    Post Facebook (Estándar)
                                </option>
                                <option value="EventoCard">
                                    Tarjeta Académica
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-foreground">
                                FECHA DEL EVENTO
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                value={data.fecha_evento}
                                onChange={(e) =>
                                    setData('fecha_evento', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-foreground">
                                UBICACIÓN / LINK
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Ej: Auditorio Central o Zoom link"
                                value={data.ubicacion}
                                onChange={(e) =>
                                    setData('ubicacion', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-foreground">
                            RESUMEN CORTO (EXTRACTO)
                        </label>
                        <textarea
                            className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                            rows={2}
                            placeholder="Una breve descripción para la tarjeta de inicio..."
                            value={data.extracto}
                            onChange={(e) =>
                                setData('extracto', e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-bold text-foreground">
                            CONTENIDO DETALLADO
                        </label>
                        <textarea
                            className="w-full rounded-md border-input bg-background px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                            rows={6}
                            placeholder="Escribe todo el cuerpo de la noticia o evento aquí..."
                            value={data.contenido}
                            onChange={(e) =>
                                setData('contenido', e.target.value)
                            }
                        />
                    </div>

                    <div className="rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50">
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ImageIcon size={32} />
                            <span className="text-sm font-medium">
                                Subir imagen de portada
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e: any) =>
                                    setData('imagen', e.target.files[0])
                                }
                            />
                            {data.imagen && (
                                <span className="text-xs font-bold text-primary">
                                    {data.imagen.name}
                                </span>
                            )}
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 font-display text-xl tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
                        >
                            <Save size={20} /> GUARDAR PUBLICACIÓN
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
