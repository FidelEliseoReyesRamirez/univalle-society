import { dashboard, login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    auth?: any;
    canRegister?: boolean;
};

export default function MobileMenu({
    isOpen,
    onClose,
    auth,
    canRegister = true,
}: Props) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (typeof document === 'undefined') return null;

    const isAdminOrGestor =
        auth?.user?.role === 'admin' || auth?.user?.role === 'gestor';

    return (
        <div
            aria-hidden={!isOpen}
            className={`fixed inset-0 z-[100] flex transition-all duration-300 ${
                isOpen ? 'visible' : 'invisible'
            }`}
        >
            {/* Overlay con opacidad */}
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/95 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
            />

            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className={`relative flex w-full flex-col p-8 text-white transition-transform duration-500 ease-in-out ${
                    // Usamos h-[100dvh] para ajustar al alto real del móvil (evita recortes en Firefox/Safari)
                    isOpen ? 'translate-y-0' : '-translate-y-full'
                } h-[100dvh] overflow-y-auto`} 
            >
                {/* Cabecera del Menú */}
                <div className="flex shrink-0 items-center justify-between">
                    <div className="text-2xl font-black tracking-tighter uppercase italic">
                        SICI<span className="text-[#f02a34]">.</span>MENU
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-2 text-3xl leading-none text-white hover:text-[#f02a34]"
                    >
                        ✕
                    </button>
                </div>

                {/* Navegación Principal */}
                <nav className="mt-12 flex flex-col gap-8 text-3xl font-black tracking-tight uppercase italic">
                    <Link href="/" onClick={onClose} className="hover:text-[#f02a34]">
                        INICIO
                    </Link>
                    <Link href="/eventos-all" onClick={onClose} className="hover:text-[#f02a34]">
                        EVENTOS
                    </Link>
                    <Link href="/noticias-all" onClick={onClose} className="hover:text-[#f02a34]">
                        NOTICIAS
                    </Link>
                    <Link href="/proyectos-all" onClick={onClose} className="hover:text-[#f02a34]">
                        PROYECTOS
                    </Link>
                </nav>

                {/* Sección Inferior (Auth) - Con margen superior auto para empujar hacia abajo */}
                <div className="mt-auto pt-10 pb-8 border-t border-white/10">
                    {auth?.user ? (
                        <div className="flex flex-col gap-4">
                            <Link
                                href={isAdminOrGestor ? dashboard() : '/settings/profile'}
                                onClick={onClose}
                                className="block text-xl font-bold tracking-widest text-[#f02a34] uppercase"
                            >
                                {isAdminOrGestor ? 'DASHBOARD' : `HOLA, ${auth.user.name}`}
                            </Link>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="block text-left text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase hover:text-white"
                            >
                                CERRAR SESIÓN
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <Link
                                href={login()}
                                onClick={onClose}
                                className="block text-2xl font-black tracking-widest uppercase hover:text-[#f02a34]"
                            >
                                LOGIN
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    onClick={onClose}
                                    className="block text-2xl font-black tracking-widest uppercase opacity-60 hover:opacity-100"
                                >
                                    REGISTER
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}