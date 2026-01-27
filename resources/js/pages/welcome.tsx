import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

import AppLogoIconHor from '@/components/app-logo-hor-icon';
import EventContainer from '@/components/event-container';
import Footer from '@/components/footer';
import LinkArrowIcon from '@/components/link-arrow-icon';
import MenuIcon from '@/components/menu-icon';
import MobileMenu from '@/components/mobile-menu';

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
            <div className="min-h-screen items-center bg-gray-200 p-6 lg:justify-center lg:p-8">
                <header className="lg:max-w-8xl w-full text-sm not-has-[nav]:hidden">
                    <nav className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between gap-4 bg-[#0a0a0a] px-4">
                        <div className="flex items-center">
                            <div>
                                <AppLogoIconHor />
                            </div>
                            <div className="ml-4 hidden gap-6 md:flex">
                                <Link
                                    href="#Eventos"
                                    className="text-sm font-bold text-white hover:underline"
                                >
                                    EVENTOS
                                </Link>
                                <Link
                                    href="#Proyectos"
                                    className="text-sm font-bold text-white hover:underline"
                                >
                                    PROYECTOS
                                </Link>
                                <Link
                                    href="#Contacto"
                                    className="text-sm font-bold text-white hover:underline"
                                >
                                    CONTÁCTANOS
                                </Link>
                            </div>
                        </div>
                        <div className="flex gap-4">
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
                                        className="rounded border border-white/30 px-4 py-1.5 text-xs text-white hover:bg-white/10"
                                    >
                                        DASHBOARD
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="px-4 py-1.5 text-xs text-white hover:underline"
                                        >
                                            INGRESAR
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                id="special-button"
                                                className="btn-11 rounded px-4 py-1.5 text-xs text-white"
                                            >
                                                REGÍSTRATE
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </header>

                <div className="hero-section h-1000px -mx-6 w-screen items-center justify-center px-4 py-20 lg:-mx-8 lg:px-0">
                    <div className="text-center">
                        <h1 className="title font-display">SICI - ISI</h1>
                        <p className="title-sub mb-16 font-display text-lg">
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

                <div className="events-section mx-10 px-4 py-10 text-gray-800 md:mx-40 md:mb-8 lg:px-0">
                    <div className="flex items-baseline justify-between border-b border-gray-300 pb-4">
                        <h1 className="heading1 font-display uppercase">
                            Eventos más recientes
                        </h1>
                        <Link
                            href="/eventos"
                            className="flex items-center gap-2 text-sm font-bold hover:opacity-70"
                        >
                            VER TODO EL BLOG <LinkArrowIcon />
                        </Link>
                    </div>
                    <div className="mt-8 flex flex-col items-center justify-center gap-8 md:flex-row">
                        {recentEvents.length > 0 ? (
                            recentEvents.map((event) => (
                                <EventContainer
                                    key={event.id}
                                    eventData={event}
                                />
                            ))
                        ) : (
                            <p className="py-10 text-gray-500 italic">
                                No hay publicaciones recientes disponibles.
                            </p>
                        )}
                    </div>
                </div>

                <div className="about-section -mx-6 w-screen justify-center text-white md:mb-16 md:flex md:px-80 lg:-mx-8 lg:px-0">
                    <div className="w-auto md:w-170">
                        <img src={aboutImg} alt="SICI Sobre Nosotros" />
                    </div>
                    <div className="flex w-1/2 items-center pl-20 text-start text-gray-200">
                        <div>
                            <h1 className="headingBig heading1 font-display">
                                ¿QUÉ HACEMOS?
                            </h1>
                            <p className="mt-4 font-bold">
                                LA CREATIVIDAD ES LA MEJOR ARMA.
                            </p>
                            <p className="mt-2 mb-10 text-lg">
                                Promovemos la investigación y la innovación
                                tecnológica a través del trabajo colaborativo.
                                Somos un espacio para aprender, desarrollar
                                habilidades y crear proyectos con impacto real.
                            </p>
                            <Link
                                href="/contacto"
                                className="btn-13 btn-secondary"
                            >
                                CONTÁCTATE
                            </Link>
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
