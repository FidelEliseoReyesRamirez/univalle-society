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
        const prev = document.body.style.overflow;
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    if (typeof document === 'undefined') return null;

    return (
        <div
            aria-hidden={!isOpen}
            className={`fixed inset-0 z-50 flex items-start justify-center transition-all duration-300 ${
                isOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
        >
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isOpen ? 'opacity-95' : 'opacity-0'
                }`}
            />

            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className={`relative flex h-full w-full max-w-full transform flex-col p-8 text-white transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="flex items-center justify-between">
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

                <nav className="mt-12 flex flex-col gap-10 text-3xl font-black tracking-tight uppercase italic">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="hover:text-[#f02a34]"
                    >
                        INICIO
                    </Link>
                    <Link
                        href="/eventos-all"
                        onClick={onClose}
                        className="hover:text-[#f02a34]"
                    >
                        EVENTOS
                    </Link>
                    <Link
                        href="/noticias-all"
                        onClick={onClose}
                        className="hover:text-[#f02a34]"
                    >
                        NOTICIAS
                    </Link>
                    <Link
                        href="/proyectos-all"
                        onClick={onClose}
                        className="hover:text-[#f02a34]"
                    >
                        PROYECTOS
                    </Link>
                </nav>

                <div className="mt-auto mb-10 border-t border-white/10 pt-6">
                    {auth?.user ? (
                        <Link
                            href={dashboard()}
                            onClick={onClose}
                            className="block py-4 text-xl font-bold tracking-widest text-[#f02a34] uppercase"
                        >
                            DASHBOARD
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link
                                href={login()}
                                onClick={onClose}
                                className="block py-4 text-xl font-bold tracking-widest uppercase hover:text-[#f02a34]"
                            >
                                LOGIN
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    onClick={onClose}
                                    className="block py-4 text-xl font-bold tracking-widest uppercase opacity-60 hover:opacity-100"
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
