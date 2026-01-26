import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    auth?: any;
    canRegister?: boolean;
};

export default function MobileMenu({ isOpen, onClose, auth, canRegister = true }: Props) {
    useEffect(() => {
        // lock body scroll while menu is open
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
                className={`relative w-full max-w-full h-full flex flex-col p-6 text-white transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">Menu</div>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-2 rounded hover:bg-white/10"
                    >
                        ✕
                    </button>
                </div>

                <nav className="mt-8 flex flex-col gap-8 text-xl">
                    <Link href="#Noticias" className="block">EVENTOS</Link>
                    <Link href="#Noticias" className="block">PROMOCIONES</Link>
                    <Link href="#Noticias" className="block">PROYECTOS</Link>
                    <Link href="#Noticias" className="block font-bold">CONTÁCTANOS</Link>
                </nav>

                <div className="mt-5 pt-6 border-t border-white/10">
                    {auth?.user ? (
                        <Link href={dashboard()} className="block py-3">
                            DASHBOARD
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link href={login()} className="block py-3">
                                LOGIN
                            </Link>
                            {canRegister && (
                                <Link href={register()} className="block py-3">
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
