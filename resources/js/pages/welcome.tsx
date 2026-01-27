import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

import AppLogoIconHor from '@/components/app-logo-hor-icon';
import MenuIcon from '@/components/menu-icon';
import LinkArrowIcon from '@/components/link-arrow-icon';
import MobileMenu from '@/components/mobile-menu';
import EventContainer from '@/components/event-container';

//imagenes de ejemplo (más adelnate se usarán de la base de datos)
import eventImg1 from '@/../images/event-cover-1.jpg';
import eventImg2 from '@/../images/event-cover-2.jpeg';
import eventImg3 from '@/../images/event-cover-3.png';

import '@/../css/special-button.css';
import '@/../css/home-page.css';

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
            <div className=" min-h-screen items-center p-6  lg:justify-center lg:p-8 bg-gray-200 ">
                <header className="w-full text-sm not-has-[nav]:hidden lg:max-w-8xl">
                    <nav className="fixed top-0 left-0 right-0 z-50 px-4 flex justify-between items-center gap-4 bg-[#0a0a0a]">
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
                <div className="events-section text-black mx-10 md:mx-40 py-10 px-4 lg:px-0">                   
                    <div className="justify-between flex items-baseline">
                        <h1 className="font-display heading1">ÚLTIMOS EVENTOS</h1>
                        <div className='hidden sm:flex justify-baseline gap-2 items-end'>
                            <p className="text-lg">IR A LA PÁGINA DE NOTICIAS </p>
                            <LinkArrowIcon/>
                        </div>
                    </div>
                    <div className='flex gap-8 mt-6 items-center justify-center md:flex-row flex-col'>
                        <EventContainer imageSrc={eventImg1}/>
                        <EventContainer imageSrc={eventImg2}/>
                        <EventContainer imageSrc={eventImg3}/>
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
