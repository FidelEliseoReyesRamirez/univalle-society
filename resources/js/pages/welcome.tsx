import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

import AppLogoIconHor from '@/components/app-logo-hor-icon';
import MenuIcon from '@/components/menu-icon';
import MobileMenu from '@/components/mobile-menu';
import '@/../css/special-button.css';
import '@/../css/hero-section.css';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [isSideOpen, setIsSideOpen] = useState(false);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className=" min-h-screen items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="w-full text-sm not-has-[nav]:hidden lg:max-w-8xl">
                    <nav className="fixed top-0 left-0 right-0 z-50 px-4 flex justify-between items-center gap-4 border-2 border-amber-600 bg-[#FDFDFC] dark:bg-[#0a0a0a]">
                        <div className='flex items-center'>
                            <div>
                                <AppLogoIconHor/>
                            </div>
                            <div className='hidden md:flex gap-2 ml-4'>
                                <Link
                                    href="#Noticias"
                                    className='inline-block rounded-sm px-5 py-1.5 text-sm leading-normal text-[#1b1b18]  dark:text-[#EDEDEC] hover:underline'
                                >
                                    <b>EVENTOS</b>
                                </Link>
                                <Link
                                    href="#Noticias"
                                    className='inline-block rounded-sm px-5 py-1.5 text-sm leading-normal text-[#1b1b18]  dark:text-[#EDEDEC] hover:underline'
                                >
                                    <b>PROMOCIONES</b>
                                </Link>
                                <Link
                                    href="#Noticias"
                                    className='inline-block rounded-sm px-5 py-1.5 text-sm leading-normal text-[#1b1b18]  dark:text-[#EDEDEC] hover:underline'
                                >
                                    <b>PROYECTOS</b>
                                </Link>  
                                <Link
                                    href="#Noticias"
                                    className='inline-block rounded-sm px-5 py-1.5 text-sm leading-normal text-[#1b1b18]  dark:text-[#EDEDEC] hover:underline'
                                >
                                    <b>CONTÁCTANOS</b>
                                </Link>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='md:hidden flex items-center'>
                                    <button onClick={() => setIsSideOpen(true)} aria-label="Open menu" className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <MenuIcon />
                                    </button>
                                </div>                                          
                            <div className='flex hidden md:flex gap-2 ml-4'>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        DASHBOARD
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                        >
                                            Ingresar
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                id="special-button"
                                                className="btn-11 relative inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
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

                <div className="hero-section w-screen -mx-6 lg:-mx-8 h-1000px items-center justify-center py-20 px-4 lg:px-0">
                    <div className="text-center">
                        <h1 className="title font-display">SICI - ISI</h1>
                        <p className="title-sub font-display text-lg mb-16">SOCIEDAD DE INVESTIGACIÓN, CIENCIA E INNOVACIÓN DE INGENIERÍA EN SISTEMAS INFORMÁTICOS</p>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="btn-primary"
                            >
                                Ir a Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="btn-12 btn-secondary mr-4"
                                >
                                    INGRESAR
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="events-section dark:bg-blue-600 w-screen -mx-6 lg:-mx-8 items-center justify-center py-20 px-4 lg:px-0">
                    <div className="text-center">
                        <h1 className="font-display text-4xl font-bold mb-4">ÚLTIMOS EVENTOS</h1>
                        <p className="text-lg mb-8">This is the welcome page of our awesome application built with Inertia.js and React.</p>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="btn-primary"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="btn-secondary mr-4"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>

            </div>

            <MobileMenu
                isOpen={isSideOpen}
                onClose={() => setIsSideOpen(false)}
                auth={auth}
                canRegister={canRegister}
            />

        </>
    );
}
