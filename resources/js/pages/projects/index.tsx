import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FolderCode, Plus } from 'lucide-react';

export default function Index({ projects }: { projects: any[] }) {
    return (
        <AppLayout>
            <Head title="Gestión de Proyectos" />
            <div className="p-4 sm:p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl tracking-tight text-foreground uppercase sm:text-4xl">
                            Repositorio de Proyectos
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Proyectos de investigación e innovación SICI.
                        </p>
                    </div>
                    <Link
                        href="/proyectos/crear"
                        className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                    >
                        <Plus size={18} /> REGISTRAR PROYECTO
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                        <FolderCode size={24} />
                                    </div>
                                    <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground uppercase">
                                        {project.category?.nombre}
                                    </span>
                                </div>
                                <h3 className="mb-2 font-display text-xl leading-tight text-foreground uppercase">
                                    {project.titulo}
                                </h3>
                                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                    {project.extracto}
                                </p>
                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <span className="text-xs text-muted-foreground">
                                        Por: {project.user?.name || 'SICI-ISI'}
                                    </span>
                                    <Link
                                        href={`/proyectos/${project.id}/edit`}
                                        className="text-xs font-bold text-primary hover:underline"
                                    >
                                        EDITAR
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-dashed border-border py-20 text-center">
                            <p className="text-muted-foreground">
                                No hay proyectos registrados todavía.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
