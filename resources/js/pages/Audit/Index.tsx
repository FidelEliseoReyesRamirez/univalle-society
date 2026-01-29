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
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    ChevronLeft,
    ChevronRight,
    Clock,
    Cpu,
    Eye,
    FilterX,
    Globe,
    Info,
    Search,
    ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface AuditLog {
    id: number;
    user_name: string;
    user_role: string;
    accion: string;
    tipo_recurso: string;
    nombre_recurso: string;
    ip: string;
    detalles: string;
    created_at: string;
}

interface Props {
    logs: {
        data: AuditLog[];
        links: any[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: any;
}

export default function AuditIndex({ logs, filters }: Props) {
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados de filtros locales
    const [search, setSearch] = useState(filters.search || '');
    const [accion, setAccion] = useState(filters.accion || 'all');
    const [tipo, setTipo] = useState(filters.tipo || 'all');
    const [desde, setDesde] = useState(filters.desde || '');
    const [hasta, setHasta] = useState(filters.hasta || '');

    const hasFilters = useMemo(() => {
        return (
            search !== '' ||
            accion !== 'all' ||
            tipo !== 'all' ||
            desde !== '' ||
            hasta !== ''
        );
    }, [search, accion, tipo, desde, hasta]);

    const applyFilters = () => {
        router.get(
            '/auditoria',
            { search, accion, tipo, desde, hasta },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setAccion('all');
        setTipo('all');
        setDesde('');
        setHasta('');
        router.get('/auditoria', {}, { replace: true });
    };

    const openDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Auditoría', href: '/auditoria' }]}>
            <Head title="SICI | Auditoría de Sistema" />

            <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold tracking-tighter text-primary uppercase italic">
                                Logs_De_Seguridad
                            </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Trazabilidad inmutable de operaciones del sistema
                        </p>
                    </div>
                </div>

                {/* Filtros Estilo Proyectos */}
                <div className="mb-2 grid grid-cols-1 gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="space-y-2 lg:col-span-2">
                        <Label>Búsqueda</Label>
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Usuario o recurso..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && applyFilters()
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Acción</Label>
                        <select
                            value={accion}
                            onChange={(e) => setAccion(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="all">Todas</option>
                            <option value="crear">Crear</option>
                            <option value="editar">Editar</option>
                            <option value="eliminar">Eliminar</option>
                            <option value="restaurar">Restaurar</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Desde</Label>
                        <Input
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                        />
                    </div>

                    <div className="flex items-end space-y-2">
                        <Button className="w-full" onClick={applyFilters}>
                            Filtrar
                        </Button>
                    </div>
                </div>

                <div className="mb-4 flex h-8 items-center justify-between">
                    <div>
                        {hasFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-destructive hover:bg-destructive/10"
                                onClick={clearFilters}
                            >
                                <FilterX className="mr-2 h-3.5 w-3.5" /> Limpiar
                                filtros
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border bg-amber-50 px-3 py-1 dark:bg-amber-900/10">
                        <Activity className="h-3 w-3 text-amber-600" />
                        <span className="text-[10px] font-bold text-amber-700 uppercase">
                            Datos Inmutables
                        </span>
                    </div>
                </div>

                {/* Tabla Estilo Proyectos */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase">
                                    Usuario
                                </TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase">
                                    Acción
                                </TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase">
                                    Recurso
                                </TableHead>
                                <TableHead className="text-[10px] font-black tracking-widest uppercase">
                                    Fecha
                                </TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Info className="h-8 w-8 opacity-20" />
                                            <p>
                                                No se encontraron registros de
                                                auditoría
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.data.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold">
                                                        {log.user_name}
                                                    </span>
                                                    <span className="text-[9px] leading-none font-bold text-red-600 uppercase italic">
                                                        {log.user_role}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                                                    log.accion === 'eliminar'
                                                        ? 'bg-red-500 text-white'
                                                        : log.accion === 'crear'
                                                          ? 'bg-emerald-500 text-white'
                                                          : 'bg-blue-500 text-white'
                                                }`}
                                            >
                                                {log.accion}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium">
                                                    {log.tipo_recurso}
                                                </span>
                                                <span className="line-clamp-1 text-[10px] text-muted-foreground italic">
                                                    "{log.nombre_recurso}"
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[10px] font-medium text-muted-foreground">
                                            {new Date(
                                                log.created_at,
                                            ).toLocaleString('es-ES', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => openDetails(log)}
                                            >
                                                <Eye className="h-4 w-4 text-primary" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Paginación Estilo Shadcn */}
                    <div className="flex items-center justify-between bg-muted/30 px-6 py-4">
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Página {logs.current_page} de {logs.last_page}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    logs.prev_page_url &&
                                    router.get(logs.prev_page_url)
                                }
                                disabled={!logs.prev_page_url}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    logs.next_page_url &&
                                    router.get(logs.next_page_url)
                                }
                                disabled={!logs.next_page_url}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DETALLES (Shadcn Dialog) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="rounded-[2rem] sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 tracking-tighter uppercase italic">
                            <Activity className="h-5 w-5 text-red-600" />{' '}
                            Registro_Técnico
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            ID de Auditoría: #
                            {selectedLog?.id.toString().padStart(6, '0')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 rounded-xl border bg-muted/30 p-4 text-xs">
                                <div>
                                    <Label className="text-[9px] uppercase opacity-50">
                                        Usuario Operador
                                    </Label>
                                    <p className="font-bold">
                                        {selectedLog.user_name}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-[9px] uppercase opacity-50">
                                        IP de Origen
                                    </Label>
                                    <p className="font-mono font-bold text-red-600">
                                        {selectedLog.ip}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                                    <Globe className="h-3 w-3" /> User Agent
                                    (Navegador/SO)
                                </Label>
                                <div className="rounded-xl border bg-background p-4 font-mono text-[10px] leading-relaxed break-words text-muted-foreground">
                                    {selectedLog.detalles}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />{' '}
                                    {new Date(
                                        selectedLog.created_at,
                                    ).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Cpu className="h-3 w-3" /> Recurso:{' '}
                                    {selectedLog.tipo_recurso}
                                </span>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            className="w-full rounded-xl font-bold tracking-widest uppercase"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cerrar Terminal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
