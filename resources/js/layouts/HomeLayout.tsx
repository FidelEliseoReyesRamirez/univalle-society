import AppLogoIconHor from '@/components/app-logo-hor-icon';
import Footer from '@/components/footer';
import MenuIcon from '@/components/menu-icon';
import MobileMenu from '@/components/mobile-menu';
import ThemeToggle from '@/components/theme-toggle';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage<SharedData>().props;
    const [isSideOpen, setIsSideOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white transition-colors duration-500 dark:bg-[#0a0a0a]">
            <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-4 backdrop-blur-md">
                <div className="flex items-center">
                    <Link href="/">
                        <AppLogoIconHor />
                    </Link>
                    <div className="ml-8 hidden gap-6 md:flex">
                        <Link
                            href="/"
                            className="text-xs font-bold text-white uppercase hover:text-[#f02a34]"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/eventos-all"
                            className="text-xs font-bold text-white uppercase hover:text-[#f02a34]"
                        >
                            Eventos
                        </Link>
                        <Link
                            href="/noticias-all"
                            className="text-xs font-bold text-white uppercase hover:text-[#f02a34]"
                        >
                            Noticias
                        </Link>
                        <Link
                            href="/proyectos-all"
                            className="text-xs font-bold text-white uppercase hover:text-[#f02a34]"
                        >
                            Proyectos
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="hidden gap-2 md:flex">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded border border-white/30 px-4 py-1.5 text-xs font-bold text-white uppercase hover:bg-white/10"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="px-4 py-1.5 text-xs font-bold text-white uppercase hover:underline"
                            >
                                Ingresar
                            </Link>
                        )}
                    </div>
                    <button
                        onClick={() => setIsSideOpen(true)}
                        className="text-white md:hidden"
                    >
                        <MenuIcon />
                    </button>
                </div>
            </nav>

            <main className="min-h-[80vh] pt-20">{children}</main>

            <Footer />
            <MobileMenu
                isOpen={isSideOpen}
                onClose={() => setIsSideOpen(false)}
                auth={auth}
            />
        </div>
    );
}
