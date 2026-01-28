import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

import AppLogoIconHor from '@/components/app-logo-hor-icon';
import EventContainer from '@/components/event-container';
import Footer from '@/components/footer';
import MenuIcon from '@/components/menu-icon';
import MobileMenu from '@/components/mobile-menu';
import ThemeToggle from '@/components/theme-toggle';

import aboutImg from '@/../images/ilustration_1.png';

import '@/../css/home-page.css';
import '@/../css/special-button.css';

interface WelcomeProps {
    canRegister?: boolean;
    recentEvents?: any[];
}

export default function Welcome({
    canRegister = true,
    recentEvents = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [isSideOpen, setIsSideOpen] = useState(false);

    return (
        <>
            <Head title="Bienvenido">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            {/* Contenedor Principal */}
            <div className="min-h-screen overflow-x-hidden bg-white transition-colors duration-500 dark:bg-[#0a0a0a]">
                <header className="w-full text-sm">
                    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a0a]/95 px-4 backdrop-blur-md">
                        <div className="flex items-center">
                            <AppLogoIconHor />
                            <div className="ml-8 hidden gap-6 md:flex">
                                <Link
                                    href="#Eventos"
                                    className="text-xs font-bold text-white uppercase transition-colors hover:text-[#f02a34]"
                                >
                                    Eventos
                                </Link>
                                <Link
                                    href="#Proyectos"
                                    className="text-xs font-bold text-white uppercase transition-colors hover:text-[#f02a34]"
                                >
                                    Proyectos
                                </Link>
                                <Link
                                    href="#Contacto"
                                    className="text-xs font-bold text-white uppercase transition-colors hover:text-[#f02a34]"
                                >
                                    Contáctanos
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsSideOpen(true)}
                                    className="text-white"
                                >
                                    <MenuIcon />
                                </button>
                            </div>

                            <div className="hidden gap-2 md:flex">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded border border-white/30 px-4 py-1.5 text-xs font-bold text-white uppercase hover:bg-white/10"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="px-4 py-1.5 text-xs font-bold text-white uppercase hover:underline"
                                        >
                                            Ingresar
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                id="special-button"
                                                className="btn-11 rounded px-4 py-1.5 text-xs font-bold text-white uppercase"
                                            >
                                                Regístrate
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <div className="hero-section flex h-[80vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-20">
                    <div className="text-center">
                        <h1 className="title font-display text-6xl text-white drop-shadow-lg md:text-8xl">
                            SICI - ISI
                        </h1>
                        <p className="title-sub mx-auto mb-10 max-w-3xl font-display text-lg text-white opacity-90 md:text-xl">
                            SOCIEDAD DE INVESTIGACIÓN, CIENCIA E INNOVACIÓN DE
                            INGENIERÍA EN SISTEMAS INFORMÁTICOS
                        </p>
                        <Link
                            href={auth.user ? dashboard() : login()}
                            className="btn-primary"
                        >
                            {auth.user ? 'IR AL DASHBOARD' : 'EMPEZAR AHORA'}
                        </Link>
                    </div>
                </div>

                {/* Sección de Eventos */}
                <div
                    id="Eventos"
                    className="mx-auto max-w-7xl bg-white px-6 py-24 transition-colors duration-500 dark:bg-[#0a0a0a]"
                >
                    <div className="mb-12 border-b border-gray-200 pb-4 dark:border-zinc-800">
                        <h1 className="heading1 font-display text-4xl font-black text-zinc-900 uppercase italic dark:text-white">
                            Eventos más recientes
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 justify-items-center gap-12 md:grid-cols-2 lg:grid-cols-3">
                        {recentEvents.length > 0 ? (
                            recentEvents.map((event) => (
                                <EventContainer
                                    key={event.id}
                                    eventData={event}
                                />
                            ))
                        ) : (
                            <p className="col-span-full py-10 text-center text-gray-500 italic dark:text-gray-400">
                                No hay publicaciones recientes disponibles.
                            </p>
                        )}
                    </div>
                </div>

                {/* About Section - CORREGIDA PARA LLENAR TODO EL ANCHO */}
                <div className="flex w-full justify-center border-y border-black/5 bg-[#f02a34] py-24 text-white transition-colors duration-500 dark:border-white/5 dark:bg-[#1a0505]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 md:flex-row">
                        <div className="flex w-full justify-center md:w-1/2">
                            <img
                                src={aboutImg}
                                alt="SICI Sobre Nosotros"
                                className="h-auto w-full max-w-md drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                            />
                        </div>
                        <div className="w-full text-left md:w-1/2">
                            <h1 className="headingBig font-display text-6xl leading-tight font-black uppercase md:text-8xl">
                                ¿QUÉ HACEMOS?
                            </h1>
                            <p className="mt-6 text-xl font-bold tracking-widest text-white/90 uppercase dark:text-red-500">
                                LA CREATIVIDAD ES LA MEJOR ARMA.
                            </p>
                            <p className="mt-4 mb-10 text-lg leading-relaxed text-white/80 dark:text-gray-300">
                                Promovemos la investigación y la innovación
                                tecnológica a través del trabajo colaborativo.
                                Somos un espacio para aprender, desarrollar
                                habilidades y crear proyectos con impacto real.
                            </p>
                            <button className="inline-block bg-zinc-900 px-10 py-4 font-black tracking-tighter text-white uppercase shadow-xl transition-all hover:scale-105 active:scale-95 dark:bg-red-600">
                                CONTÁCTATE
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <MobileMenu
                isOpen={isSideOpen}
                onClose={() => setIsSideOpen(false)}
                auth={auth}
                canRegister={canRegister}
            />
        </>
    );
}
