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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Ban,
    FilterX,
    LockKeyholeOpen,
    Pencil,
    Search,
    ShieldAlert,
    Trash,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    esta_bloqueado: boolean;
    created_at: string;
}

export default function Index({ users }: { users: User[] }) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('todos');
    const [statusFilter, setStatusFilter] = useState('todos');

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Lógica de filtrado combinada
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'todos' || u.role === roleFilter;
        const matchesStatus =
            statusFilter === 'todos' ||
            (statusFilter === 'bloqueado'
                ? u.esta_bloqueado
                : !u.esta_bloqueado);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const resetFilters = () => {
        setSearch('');
        setRoleFilter('todos');
        setStatusFilter('todos');
    };

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={[{ title: 'Usuarios', href: '/usuarios' }]}>
                <Head title="Gestión de Usuarios" />

                <div className="flex flex-col gap-6 p-4 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">
                                Usuarios Univalle
                            </h2>
                            <p className="text-sm text-muted-foreground italic">
                                Panel de Administración SICI-ISI
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild size="sm">
                                <Link href="/usuarios/papelera">
                                    <Trash className="mr-2 h-4 w-4" /> Papelera
                                </Link>
                            </Button>
                            <Button
                                size="sm"
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                <UserPlus className="mr-2 h-4 w-4" /> Nuevo
                                Usuario
                            </Button>
                        </div>
                    </div>

                    {/* BARRA DE FILTROS */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o correo..."
                                className="bg-background pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-[160px] bg-background">
                                <SelectValue placeholder="Filtrar Rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">
                                    Todos los Roles
                                </SelectItem>
                                <SelectItem value="admin">
                                    Administrador
                                </SelectItem>
                                <SelectItem value="gestor">Gestor</SelectItem>
                                <SelectItem value="estudiante">
                                    Estudiante
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[160px] bg-background">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">
                                    Todos los Estados
                                </SelectItem>
                                <SelectItem value="activo">
                                    Solo Activos
                                </SelectItem>
                                <SelectItem value="bloqueado">
                                    Solo Bloqueados
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetFilters}
                            className="text-muted-foreground"
                        >
                            <FilterX className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50 dark:bg-muted/10">
                                    <TableRow>
                                        <TableHead className="font-bold">
                                            Usuario
                                        </TableHead>
                                        <TableHead className="w-[180px]">
                                            Rol
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Estado
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="border-b transition-colors last:border-0 hover:bg-muted/40 dark:hover:bg-accent/5"
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    defaultValue={user.role}
                                                    onValueChange={(role) =>
                                                        router.patch(
                                                            `/usuarios/${user.id}/role`,
                                                            { role },
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 border-muted bg-background">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">
                                                            Administrador
                                                        </SelectItem>
                                                        <SelectItem value="gestor">
                                                            Gestor
                                                        </SelectItem>
                                                        <SelectItem value="estudiante">
                                                            Estudiante
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${user.esta_bloqueado ? 'border-destructive/20 bg-destructive/10 text-destructive' : 'border-green-500/20 bg-green-500/10 text-green-600'}`}
                                                >
                                                    {user.esta_bloqueado
                                                        ? 'Bloqueado'
                                                        : 'Activo'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        user,
                                                                    );
                                                                    setIsEditOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Editar Usuario
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`h-8 w-8 ${user.esta_bloqueado ? 'text-green-600 hover:bg-green-600/10' : 'pointer-events-none text-muted-foreground/30'}`}
                                                                onClick={() =>
                                                                    router.post(
                                                                        `/usuarios/${user.id}/unlock`,
                                                                    )
                                                                }
                                                            >
                                                                <LockKeyholeOpen className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Desbloquear Acceso
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`h-8 w-8 ${!user.esta_bloqueado ? 'text-amber-500 hover:text-amber-500/10' : 'pointer-events-none text-muted-foreground/30'}`}
                                                                onClick={() =>
                                                                    router.post(
                                                                        `/usuarios/${user.id}/block`,
                                                                    )
                                                                }
                                                            >
                                                                <Ban className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Bloquear Usuario
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        user,
                                                                    );
                                                                    setIsDeleteDialogOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Enviar a Papelera
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* MODAL EDITAR (PROVISIONAL) */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 font-bold text-primary">
                                <Pencil className="h-5 w-5" /> Editar Usuario
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Nombre Completo
                                </label>
                                <Input defaultValue={selectedUser?.name} />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Correo Electrónico
                                </label>
                                <Input defaultValue={selectedUser?.email} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button className="bg-primary">
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* MODAL ELIMINAR */}
                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 font-bold text-destructive">
                                <ShieldAlert /> Confirmar Eliminación
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                ¿Estás seguro de enviar a{' '}
                                <b>{selectedUser?.name}</b> a la papelera? No
                                podrá iniciar sesión hasta que sea restaurado.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (selectedUser) {
                                        router.delete(
                                            `/usuarios/${selectedUser.id}`,
                                        );
                                        setIsDeleteDialogOpen(false);
                                    }
                                }}
                            >
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </TooltipProvider>
    );
}
