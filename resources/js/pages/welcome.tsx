import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
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
    recentProjects?: any[];
    recentNews?: any[]; // <--- IMPORTANTE: Agregado para recibir lo de Laravel
}

export default function Welcome({
    canRegister = true,
    recentEvents = [],
    recentProjects = [],
    recentNews = [], // <--- IMPORTANTE: Recibimos la variable de web.php
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [isSideOpen, setIsSideOpen] = useState(false);

    // --- LÓGICA DE ASIGNACIÓN DIRECTA ---
    // Ya no filtramos aquí porque Laravel ya nos envía los grupos limpios.

    const featuredEvent = recentEvents.length > 0 ? recentEvents[0] : null;
    const otherEvents = recentEvents.length > 1 ? recentEvents.slice(1, 4) : [];

    // Usamos directamente lo que viene de la ruta
    const newsToShow = recentNews;
    const projectsToShow = recentProjects;

    return (
        <>
            <Head title="Bienvenido">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
                <style>{`
                    @keyframes soft-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-soft-float { animation: soft-float 8s ease-in-out infinite; }
                    .animate-fade-in { animation: fade-in-up 1s ease-out forwards; }
                `}</style>
            </Head>

            <div className="min-h-screen overflow-x-hidden bg-white transition-colors duration-500 dark:bg-[#0a0a0a]">
                <header className="w-full text-sm">
                    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a0a]/95 px-4 backdrop-blur-md">
                        <div className="flex items-center">
                            <Link href="/">
                                <AppLogoIconHor />
                            </Link>
                            <div className="ml-8 hidden gap-6 md:flex">
                                <Link
                                    href="#Eventos"
                                    className="text-xs font-bold text-white uppercase hover:text-[#f02a34]"
                                >
                                    Eventos
                                </Link>
                                {newsToShow.length > 0 && (
                                    <Link
                                        href="#Noticias"
                                        className="text-xs font-bold text-white uppercase hover:text-[#f02a34]"
                                    >
                                        Noticias
                                    </Link>
                                )}
                                {projectsToShow.length > 0 && (
                                    <Link
                                        href="#Proyectos"
                                        className="text-xs font-bold text-white uppercase hover:text-[#f02a34]"
                                    >
                                        Proyectos
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsSideOpen(true)}
                                className="text-white md:hidden"
                            >
                                <MenuIcon />
                            </button>
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

                <div className="hero-section flex h-[80vh] w-full flex-col items-center justify-center px-4 py-20">
                    <div className="animate-fade-in text-center">
                        <h1 className="title font-display text-6xl text-white drop-shadow-lg md:text-8xl">
                            SICI - ISI
                        </h1>
                        <p className="title-sub mx-auto mb-10 max-w-3xl text-lg text-white uppercase opacity-90 md:text-xl">
                            SOCIEDAD DE INVESTIGACIÓN, CIENCIA E INNOVACIÓN DE
                            INGENIERÍA EN SISTEMAS INFORMÁTICOS
                        </p>
                        <Link
                            href={auth.user ? dashboard() : login()}
                            className="btn-primary !text-white transition-transform hover:scale-105"
                        >
                            {auth.user ? 'IR AL DASHBOARD' : 'EMPEZAR AHORA'}
                        </Link>
                    </div>
                </div>

                {/* --- SECCIÓN EVENTOS --- */}
                {(featuredEvent || otherEvents.length > 0) && (
                    <div
                        id="Eventos"
                        className="mx-auto max-w-7xl px-6 py-24 dark:bg-[#0a0a0a]"
                    >
                        <div className="mb-12 flex items-end justify-between border-b border-gray-200 pb-4 dark:border-zinc-800">
                            <h1 className="font-display text-4xl font-black text-zinc-900 uppercase italic dark:text-white">
                                Eventos SICI
                            </h1>
                            <Link
                                href="/eventos-all"
                                className="group flex items-center gap-2 text-xs font-black text-[#f02a34] uppercase"
                            >
                                Ver todos los eventos{' '}
                                <ArrowRight
                                    size={14}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>

                        {featuredEvent && (
                            <div className="animate-fade-in mb-20">
                                <div className="relative overflow-hidden rounded-[3rem] bg-zinc-950 shadow-2xl transition-transform hover:scale-[1.01]">
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="h-96 w-full lg:h-[500px] lg:w-3/5">
                                            <img
                                                src={
                                                    featuredEvent.imagen_ruta ||
                                                    aboutImg
                                                }
                                                className="h-full w-full object-cover"
                                                alt={featuredEvent.titulo}
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center p-12 text-white">
                                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f02a34] px-4 py-1 text-[10px] font-black tracking-widest uppercase">
                                                Lo más reciente
                                            </div>
                                            <h2 className="mb-6 text-5xl leading-tight font-black uppercase italic">
                                                {featuredEvent.titulo}
                                            </h2>
                                            <p className="mb-8 text-xl leading-relaxed font-bold text-zinc-400 uppercase italic">
                                                "{featuredEvent.extracto}"
                                            </p>
                                            <div className="flex">
                                                <EventContainer
                                                    eventData={{
                                                        ...featuredEvent,
                                                        nombre_plantilla:
                                                            'TriggerOnly',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {otherEvents.length > 0 && (
                            <div className="mt-20">
                                <h2 className="mb-10 text-2xl font-black text-zinc-800 uppercase italic dark:text-zinc-200">
                                    Eventos recientes
                                </h2>
                                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                                    {otherEvents.map((e) => (
                                        <div
                                            key={e.id}
                                            className="animate-fade-in"
                                        >
                                            <EventContainer eventData={e} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- SECCIÓN NOTICIAS --- */}
                {newsToShow.length > 0 && (
                    <div
                        id="Noticias"
                        className="bg-zinc-50 py-24 dark:bg-zinc-950/40"
                    >
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="mb-12 flex items-end justify-between border-b border-gray-200 pb-4 dark:border-zinc-800">
                                <h1 className="font-display text-4xl font-black text-zinc-900 uppercase italic dark:text-white">
                                    Noticias
                                </h1>
                                <Link
                                    href="/noticias-all"
                                    className="group flex items-center gap-2 text-xs font-black text-[#f02a34] uppercase"
                                >
                                    Ver todas las noticias{' '}
                                    <ArrowRight
                                        size={14}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                                {newsToShow.map((n) => (
                                    <div key={n.id} className="animate-fade-in">
                                        <EventContainer eventData={n} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SECCIÓN ¿QUÉ HACEMOS? --- */}
                <div className="flex w-full justify-center bg-[#f02a34] py-24 text-white dark:bg-[#1a0505]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 md:flex-row">
                        <img
                            src={aboutImg}
                            className="animate-soft-float h-auto w-full max-w-md drop-shadow-2xl"
                            alt="Ilustración SICI"
                        />
                        <div className="w-full text-left md:w-1/2">
                            <h1 className="text-6xl font-black uppercase md:text-8xl">
                                ¿QUÉ HACEMOS?
                            </h1>
                            <p className="mt-6 text-xl font-bold uppercase dark:text-red-500">
                                LA CREATIVIDAD ES LA MEJOR ARMA.
                            </p>
                            <p className="mt-4 mb-10 text-lg opacity-80">
                                Promovemos la investigación y la innovación
                                tecnológica a través del trabajo colaborativo.
                            </p>
                            <button className="bg-zinc-900 px-10 py-4 font-black text-white uppercase transition-all hover:scale-105 active:scale-95 dark:bg-red-600">
                                CONTÁCTATE
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN PROYECTOS --- */}
                {projectsToShow.length > 0 && (
                    <div
                        id="Proyectos"
                        className="mx-auto max-w-7xl px-6 py-24"
                    >
                        <div className="mb-12 flex items-end justify-between border-b border-gray-200 pb-4 text-right dark:border-zinc-800">
                            <Link
                                href="/proyectos-all"
                                className="group flex items-center gap-2 text-xs font-black text-[#f02a34] uppercase"
                            >
                                <ArrowRight
                                    size={14}
                                    className="rotate-180 transition-transform group-hover:-translate-x-1"
                                />{' '}
                                Ver todos los proyectos
                            </Link>
                            <h1 className="font-display text-4xl font-black text-zinc-900 uppercase italic dark:text-white">
                                Proyectos destacados
                            </h1>
                        </div>
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                            {projectsToShow.map((p) => (
                                <div key={p.id} className="animate-fade-in">
                                    <EventContainer eventData={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
