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
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Ban,
    LockKeyholeOpen,
    Pencil,
    Search,
    ShieldAlert,
    Trash,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    esta_bloqueado: boolean;
    created_at: string;
}

interface PaginationProps {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Index({ users }: { users: PaginationProps }) {
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isLastAdminModal, setIsLastAdminModal] = useState(false);

    const editForm = useForm({ name: '', email: '' });
    const createForm = useForm({ name: '', email: '', role: 'estudiante' });

    useEffect(() => {
        if (selectedUser) {
            editForm.setData({
                name: selectedUser.name,
                email: selectedUser.email,
            });
        }
    }, [selectedUser]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/usuarios', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        editForm.patch(`/usuarios/${selectedUser.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                editForm.reset();
            },
        });
    };

    const handleCriticalAction = (
        user: User,
        actionType: 'block' | 'delete',
    ) => {
        const adminCount = users.data.filter(
            (u) => u.role === 'admin' && !u.esta_bloqueado,
        ).length;
        if (user.role === 'admin' && adminCount <= 1) {
            setSelectedUser(user);
            setIsLastAdminModal(true);
            return;
        }
        if (actionType === 'delete') {
            setSelectedUser(user);
            setIsDeleteDialogOpen(true);
        } else if (actionType === 'block') {
            router.post(`/usuarios/${user.id}/block`);
        }
    };

    // Filtrado local sobre los 25 resultados actuales
    const filteredUsers = users.data.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={[{ title: 'Usuarios', href: '/usuarios' }]}>
                <Head title="Gestión de Usuarios" />
                <div className="flex flex-col gap-6 p-4 md:p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-primary">
                            Usuarios Univalle
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild size="sm">
                                <Link href="/usuarios/papelera">
                                    <Trash className="mr-2 h-4 w-4" /> Papelera
                                </Link>
                            </Button>
                            <Button
                                size="sm"
                                className="bg-primary"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                <UserPlus className="mr-2 h-4 w-4" /> Nuevo
                                Usuario
                            </Button>
                        </div>
                    </div>

                    <div className="relative max-w-sm">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar en esta página..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Rol</TableHead>
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
                                                <SelectTrigger className="h-8 w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">
                                                        Admin
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
                                                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${user.esta_bloqueado ? 'border-destructive/20 bg-destructive/10 text-destructive' : 'border-green-500/20 bg-green-500/10 text-green-600'}`}
                                            >
                                                {user.esta_bloqueado
                                                    ? 'BLOQUEADO'
                                                    : 'ACTIVO'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-500"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsEditOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 ${user.esta_bloqueado ? 'text-green-600' : 'pointer-events-none opacity-20'}`}
                                                    onClick={() =>
                                                        router.post(
                                                            `/usuarios/${user.id}/unlock`,
                                                        )
                                                    }
                                                >
                                                    <LockKeyholeOpen className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 ${!user.esta_bloqueado ? 'text-amber-500' : 'pointer-events-none opacity-20'}`}
                                                    onClick={() =>
                                                        handleCriticalAction(
                                                            user,
                                                            'block',
                                                        )
                                                    }
                                                >
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() =>
                                                        handleCriticalAction(
                                                            user,
                                                            'delete',
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                {/* MODAL CREAR USUARIO (NUEVO) */}
                <Dialog
                    open={isCreateOpen}
                    onOpenChange={(val) => {
                        setIsCreateOpen(val);
                        if (!val) createForm.reset();
                    }}
                >
                    <DialogContent>
                        <form onSubmit={handleCreateSubmit}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 font-bold text-primary">
                                    <UserPlus className="h-5 w-5" /> Registrar
                                    Usuario
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 text-left">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Nombre Completo
                                    </label>
                                    <Input
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            createForm.errors.name
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        placeholder="Ej. Juan Perez"
                                    />
                                    {createForm.errors.name && (
                                        <span className="text-xs text-red-500">
                                            {createForm.errors.name}
                                        </span>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Correo Electrónico
                                    </label>
                                    <Input
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            createForm.errors.email
                                                ? 'border-red-500'
                                                : ''
                                        }
                                        placeholder="juan@univalle.edu"
                                    />
                                    {createForm.errors.email && (
                                        <span className="text-xs text-red-500">
                                            {createForm.errors.email}
                                        </span>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Rol Asignado
                                    </label>
                                    <Select
                                        value={createForm.data.role}
                                        onValueChange={(val) =>
                                            createForm.setData('role', val)
                                        }
                                    >
                                        <SelectTrigger>
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
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                >
                                    {createForm.processing
                                        ? 'Registrando...'
                                        : 'Crear Usuario'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL EDITAR */}
                <Dialog
                    open={isEditOpen}
                    onOpenChange={(val) => {
                        setIsEditOpen(val);
                        if (!val) editForm.reset();
                    }}
                >
                    <DialogContent>
                        <form onSubmit={handleEditSubmit}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 font-bold text-primary">
                                    <Pencil className="h-5 w-5" /> Editar
                                    Usuario
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 text-left">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Nombre
                                    </label>
                                    <Input
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            editForm.errors.name
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {editForm.errors.name && (
                                        <span className="text-xs text-red-500">
                                            {editForm.errors.name}
                                        </span>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">
                                        Correo
                                    </label>
                                    <Input
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            editForm.errors.email
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {editForm.errors.email && (
                                        <span className="text-xs text-red-500">
                                            {editForm.errors.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    Guardar
                                </Button>
                            </DialogFooter>
                        </form>
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
                                <ShieldAlert /> ¿Enviar a papelera?
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-left">
                                Esta acción marcará a{' '}
                                <b>{selectedUser?.name}</b> como eliminado.
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

                {/* MODAL ÚLTIMO ADMIN */}
                <Dialog
                    open={isLastAdminModal}
                    onOpenChange={setIsLastAdminModal}
                >
                    <DialogContent className="border-amber-500/50">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 font-bold text-amber-600">
                                <AlertTriangle className="h-6 w-6" /> Acción
                                Denegada
                            </DialogTitle>
                            <DialogDescription className="pt-4 text-left text-foreground">
                                No puedes realizar esta acción sobre el{' '}
                                <b>último administrador</b> activo.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button
                                className="w-full bg-amber-600 text-white"
                                onClick={() => setIsLastAdminModal(false)}
                            >
                                Entendido
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </TooltipProvider>
    );
}
