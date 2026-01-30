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
    recentNews?: any[];
}

export default function Welcome({
    canRegister = true,
    recentEvents = [],
    recentProjects = [],
    recentNews = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [isSideOpen, setIsSideOpen] = useState(false);

    const featuredEvent = recentEvents.length > 0 ? recentEvents[0] : null;
    const otherEvents = recentEvents.length > 1 ? recentEvents.slice(1, 4) : [];

    const newsToShow = recentNews;
    const projectsToShow = recentProjects;

    // Lógica para determinar el rol y destino del botón principal
    const isAdminOrGestor =
        auth.user?.role === 'admin' || auth.user?.role === 'gestor';

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
                    <nav className="fixed top-0 right-0 left-0 z-50 flex h-20 items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a0a]/95 px-4 backdrop-blur-md">
                        <div className="flex items-center">
                            <Link href="/">
                                <AppLogoIconHor />
                            </Link>
                            <div className="ml-8 hidden gap-6 md:flex">
                                <Link
                                    href="#Eventos"
                                    className="text-m font-medium text-white uppercase hover:text-[#f02a34]"
                                >
                                    Eventos
                                </Link>
                                {newsToShow.length > 0 && (
                                    <Link
                                        href="#Noticias"
                                        className="text-m font-medium text-white uppercase hover:text-[#f02a34]"
                                    >
                                        Noticias
                                    </Link>
                                )}
                                {projectsToShow.length > 0 && (
                                    <Link
                                        href="#Proyectos"
                                        className="text-m font-medium text-white uppercase hover:text-[#f02a34]"
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
                                    isAdminOrGestor ? (
                                        <Link
                                            href={dashboard()}
                                            className="rounded border border-white/30 px-4 py-1.5 text-xs font-bold text-white uppercase hover:bg-white/10"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        /* Ajuste para el Estudiante */
                                        <Link
                                            href="/settings/profile"
                                            className="px-4 py-1.5 text-xs font-bold text-red-500 uppercase transition-colors hover:text-white"
                                        >
                                            Hola, {auth.user.name}
                                        </Link>
                                    )
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-m px-4 py-1.5 font-medium tracking-widest text-white uppercase hover:underline"
                                        >
                                            Ingresar
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="btn-11 text-m rounded px-4 py-1.5 font-medium tracking-widest uppercase"
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

                <div className="hero-section flex h-[85vh] w-full flex-col items-center justify-center px-4 pt-20 text-center">
                    <div className="animate-fade-in">
                        <h1 className="title mb-4 font-display text-6xl text-white drop-shadow-lg md:text-8xl">
                            SICI - ISI
                        </h1>
                        <p className="title-sub mx-auto mb-10 max-w-3xl font-display text-lg text-white uppercase opacity-90 md:text-3xl">
                            SOCIEDAD DE INVESTIGACIÓN, CIENCIA E INNOVACIÓN DE
                            INGENIERÍA EN SISTEMAS INFORMÁTICOS
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            {auth.user ? (
                                isAdminOrGestor ? (
                                    <Link
                                        href={dashboard()}
                                        className="btn-13 dark:btn-14 inline-block w-full bg-[#0f1923] px-10 py-5 text-center font-black text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95 sm:w-auto dark:bg-red-600"
                                    >
                                        ADMINISTRAR PORTAL
                                    </Link>
                                ) : (
                                    <a
                                        href="#Eventos"
                                        className="btn-13 dark:btn-14 inline-block w-full bg-[#0f1923] px-10 py-5 text-center font-black text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95 sm:w-auto dark:bg-red-600"
                                    >
                                        EXPLORAR NOVEDADES
                                    </a>
                                )
                            ) : (
                                <Link
                                    href={register()}
                                    className="btn-13 dark:btn-14 inline-block w-full bg-[#0f1923] px-10 py-5 text-center font-black text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95 sm:w-auto dark:bg-red-600"
                                >
                                    ÚNETE A LA COMUNIDAD
                                </Link>
                            )}
                            {!auth.user && (
                                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                                    Regístrate para recibir notificaciones de
                                    eventos y noticias
                                </p>
                            )}
                        </div>
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
                {/* --- SECCIÓN ACERCA DE NOSOTROS --- */}
                <div
                    id="Nosotros"
                    className="relative flex w-full justify-center overflow-hidden bg-[#f02a34] py-20 text-white md:py-32 dark:bg-[#1a0505]"
                >
                    {/* Degradados de fondo para profundidad */}
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                        <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-white/10 blur-[100px]"></div>
                        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-black/20 blur-[120px]"></div>
                    </div>

                    <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-10 md:flex-row md:px-16">
                        {/* Imagen con sombra proyectada */}
                        <div className="w-full max-w-sm shrink-0 md:w-1/2 md:max-w-md">
                            <img
                                src={aboutImg}
                                className="animate-soft-float w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                alt="SICI Comunidad"
                            />
                        </div>

                        <div className="w-full text-left md:w-1/2">
                            <div className="mb-6 inline-block rounded-full bg-zinc-900/30 px-4 py-1.5 backdrop-blur-md">
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                                    Identidad de Carrera
                                </span>
                            </div>

                            <h1 className="font-display text-5xl leading-[0.85] font-black tracking-tighter uppercase italic md:text-8xl">
                                ACERCA DE <br /> NOSOTROS
                            </h1>

                            <p className="mt-8 text-xl font-black text-zinc-900 uppercase italic dark:text-red-500">
                                Somos el motor de innovación de Sistemas.
                            </p>

                            <p className="mt-4 max-w-xl text-lg leading-relaxed font-medium opacity-90">
                                Somos una comunidad activa de estudiantes
                                apasionados por la tecnología. No solo
                                estudiamos la carrera, la vivimos creando
                                espacios de colaboración, desarrollo real y
                                networking estratégico entre colegas.
                            </p>

                            {/* Grid de Pilares con Bordes Semitransparentes (Sin Hover) */}
                            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                                    <h3 className="text-xs font-black tracking-widest text-zinc-900 uppercase dark:text-white">
                                        Socialización
                                    </h3>
                                    <p className="mt-2 text-[11px] leading-snug font-bold opacity-80">
                                        Unimos a todas las generaciones de la
                                        carrera en un solo entorno colaborativo.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                                    <h3 className="text-xs font-black tracking-widest text-zinc-900 uppercase dark:text-white">
                                        Proyectos Reales
                                    </h3>
                                    <p className="mt-2 text-[11px] leading-snug font-bold opacity-80">
                                        Somos el puente entre la teoría
                                        académica y la práctica técnica de alto
                                        nivel.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                                    <h3 className="text-xs font-black tracking-widest text-zinc-900 uppercase dark:text-white">
                                        Cultura Tech
                                    </h3>
                                    <p className="mt-2 text-[11px] leading-snug font-bold opacity-80">
                                        Debatimos y exploramos las tendencias
                                        que están definiendo el futuro del
                                        software.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                                    <h3 className="text-xs font-black tracking-widest text-zinc-900 uppercase dark:text-white">
                                        Networking
                                    </h3>
                                    <p className="mt-2 text-[11px] leading-snug font-bold opacity-80">
                                        Creamos conexiones valiosas que
                                        potencian el futuro profesional de cada
                                        miembro.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-start sm:justify-start">
                                <a
                                    href="https://chat.whatsapp.com/FkjOK8j9Afl1fcabVlCPGI"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-13 dark:btn-14 inline-block w-full bg-[#0f1923] px-10 py-5 text-center font-black text-white uppercase shadow-[0_10px_30px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-all hover:scale-105 active:scale-95 sm:w-auto dark:bg-red-600"
                                >
                                    Únete a la Comunidad en WhatsApp
                                </a>
                            </div>
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
