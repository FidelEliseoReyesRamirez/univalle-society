import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    ExternalLink,
    FolderCode,
    LayoutGrid,
    Tags,
    Users,
} from 'lucide-react';

import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as any;

    const mainNavItems: NavItem[] = [
        // OPCIÓN PARA VOLVER AL INICIO (WELCOME)
        {
            title: 'Ver Sitio Web',
            href: '/',
            icon: ExternalLink,
        },
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Acceso para Admin y Gestor
    if (['admin', 'gestor'].includes(auth?.user?.role)) {
        mainNavItems.push({
            title: 'Gestión Eventos',
            href: '/eventos',
            icon: CalendarDays,
        });
        mainNavItems.push({
            title: 'Gestión Proyectos',
            href: '/proyectos',
            icon: FolderCode,
        });
        mainNavItems.push({
            title: 'Categorías',
            href: '/categorias',
            icon: Tags,
        });
    }

    // Solo Admin ve usuarios
    if (auth?.user?.role === 'admin') {
        mainNavItems.push({
            title: 'Gestión Usuarios',
            href: '/usuarios',
            icon: Users,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
