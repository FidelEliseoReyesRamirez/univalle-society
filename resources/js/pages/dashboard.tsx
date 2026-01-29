import { Head } from '@inertiajs/react';
import {
    Activity,
    Binary,
    Calendar,
    ChevronRight,
    FolderCode,
    Microscope,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalEvents: number;
        totalProjects: number;
        activeCategories: number;
    };
    eventsByMonth: any[];
    usersByRole: any[];
    activityData: any[];
    projectsByCategory: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Terminal de Control', href: '/dashboard' },
];

const COLORS = ['#f02a34', '#18181b', '#3f3f46', '#71717a', '#a1a1aa'];

export default function Dashboard({
    stats,
    eventsByMonth,
    usersByRole,
    activityData,
    projectsByCategory,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SICI | Analytics Terminal" />

            <div className="flex flex-1 flex-col gap-8 bg-[#fcfcfc] p-6 dark:bg-[#050505]">
                {/* --- HEADER --- */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white">
                                System_Overview
                            </h1>
                        </div>
                        <p className="mt-1 text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase">
                            Sociedad de Investigación, Ciencia e Innovación
                        </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <Activity size={16} className="text-red-600" />
                        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                            Estado: Operativo
                        </span>
                    </div>
                </div>

                {/* --- KPI CARDS --- */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Investigadores"
                        value={stats.totalUsers}
                        icon={<Users size={22} />}
                        trend="Comunidad"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Divulgación"
                        value={stats.totalEvents}
                        icon={<Calendar size={22} />}
                        trend="Eventos"
                        color="bg-red-600"
                    />
                    <StatCard
                        title="Innovación"
                        value={stats.totalProjects}
                        icon={<FolderCode size={22} />}
                        trend="Proyectos"
                        color="bg-zinc-500"
                    />
                    <StatCard
                        title="Líneas INV"
                        value={stats.activeCategories}
                        icon={<Microscope size={22} />}
                        trend="Áreas"
                        color="bg-amber-500"
                    />
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* --- PRODUCCIÓN CIENTÍFICA --- */}
                    <div className="group relative col-span-full overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-xl lg:col-span-8 dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="relative mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-red-600 p-2 text-white shadow-lg shadow-red-500/20">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="text-sm font-black tracking-widest text-zinc-800 uppercase dark:text-zinc-200">
                                    Producción Mensual de Conocimiento
                                </h3>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={eventsByMonth}>
                                    <defs>
                                        <linearGradient
                                            id="colorProd"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#f02a34"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#f02a34"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        strokeOpacity={0.05}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="#888"
                                    />
                                    <YAxis
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="#888"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#18181b',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: '#fff',
                                        }}
                                        itemStyle={{
                                            color: '#f02a34',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="cantidad"
                                        stroke="#f02a34"
                                        fill="url(#colorProd)"
                                        strokeWidth={4}
                                        dot={{
                                            r: 4,
                                            fill: '#f02a34',
                                            strokeWidth: 2,
                                            stroke: '#fff',
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* --- ESPECIALIZACIÓN (PIE) --- */}
                    <div className="col-span-full rounded-[2.5rem] border border-zinc-200 bg-zinc-900 p-8 shadow-xl lg:col-span-4 dark:border-zinc-800 dark:bg-[#0a0a0a]">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="rounded-xl bg-white/10 p-2 text-white">
                                <Binary size={20} />
                            </div>
                            <h3 className="text-sm font-black tracking-widest text-white uppercase">
                                Especialización
                            </h3>
                        </div>

                        <div className="flex h-[280px] items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={projectsByCategory}
                                        innerRadius={75}
                                        outerRadius={95}
                                        paddingAngle={10}
                                        dataKey="value"
                                    >
                                        {projectsByCategory.map((_, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                                stroke="none"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-6 space-y-3">
                            {projectsByCategory.slice(0, 3).map((cat, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-xl bg-white/5 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-2 w-2 rounded-full"
                                            style={{
                                                backgroundColor: COLORS[i],
                                            }}
                                        />
                                        <span className="text-[10px] font-black tracking-tighter text-zinc-400 uppercase">
                                            {cat.name}
                                        </span>
                                    </div>
                                    <span className="text-xs font-black text-white">
                                        {cat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- ACTIVIDAD SEMANAL (BARRAS SIN HOVER EFFECT) --- */}
                    <div className="col-span-full rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-sm font-black tracking-widest uppercase opacity-60">
                                Flujo de Investigadores Recientes
                            </h3>
                            <Zap size={16} className="text-amber-500" />
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activityData}>
                                    <XAxis
                                        dataKey="date"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="#888"
                                    />
                                    <Tooltip
                                        cursor={false} // Se eliminó el fondo gris al pasar el mouse
                                        contentStyle={{
                                            backgroundColor: '#18181b',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Bar
                                        dataKey="usuarios"
                                        fill="#f02a34" // Cambiado a rojo para mayor contraste científico
                                        radius={[12, 12, 12, 12]}
                                        barSize={45}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    icon,
    trend,
    color,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend: string;
    color: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div
                className={`absolute -top-4 -right-4 h-24 w-24 rounded-full ${color} opacity-[0.03] transition-all group-hover:scale-150 group-hover:opacity-[0.08]`}
            />

            <div className="relative flex items-center justify-between">
                <div
                    className={`rounded-2xl ${color} p-3 text-white shadow-lg transition-transform group-hover:rotate-12`}
                >
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                        {trend}
                    </span>
                    <ChevronRight size={14} className="text-zinc-300" />
                </div>
            </div>

            <div className="relative mt-8">
                <h2 className="text-5xl leading-none font-black tracking-tighter text-zinc-900 italic dark:text-white">
                    {value}
                </h2>
                <p className="mt-2 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
                    {title}
                </p>
            </div>
        </div>
    );
}
