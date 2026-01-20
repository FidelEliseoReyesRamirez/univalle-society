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
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

interface TrashedUser {
    id: string;
    name: string;
    email: string;
    role: string;
    deleted_at: string;
}

interface PaginationProps {
    data: TrashedUser[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Papelera({ users }: { users: PaginationProps }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Usuarios', href: '/usuarios' },
                { title: 'Papelera', href: '#' },
            ]}
        >
            <Head title="Papelera de Usuarios" />
            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-destructive">
                            Papelera de Usuarios
                        </h2>
                        <p className="text-sm text-muted-foreground italic">
                            Usuarios eliminados recientemente
                        </p>
                    </div>
                    <Button variant="outline" asChild size="sm">
                        <Link href="/usuarios">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="py-10 text-center text-muted-foreground"
                                    >
                                        No hay usuarios en la papelera.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col text-left">
                                                <span className="font-semibold">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {user.role}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 hover:bg-green-50"
                                                onClick={() =>
                                                    router.post(
                                                        `/usuarios/${user.id}/restore`,
                                                    )
                                                }
                                            >
                                                <RefreshCcw className="mr-2 h-4 w-4" />{' '}
                                                Restaurar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* PAGINACIÓN DIRECTA */}
                <div className="mt-4 flex justify-center gap-2">
                    {users.links.map((link, i) => (
                        <Button
                            key={i}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            asChild={!!link.url}
                        >
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )}
                        </Button>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
