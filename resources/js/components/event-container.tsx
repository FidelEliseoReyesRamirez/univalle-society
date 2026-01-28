import {
    Calendar,
    Code,
    ExternalLink,
    Github,
    MapPin,
    Maximize2,
    Tag,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // <--- Importante para el Portal
import logoPng from '../../images/logo-hor.png';

const EventContainer: React.FC<{ eventData: any }> = ({ eventData }) => {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    useEffect(() => {
        if (isInfoModalOpen || isImageModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isInfoModalOpen, isImageModalOpen]);

    const plantilla = eventData.nombre_plantilla || 'PostFacebook';
    const isProject = plantilla.startsWith('Project');

    const fecha = eventData.fecha_evento
        ? new Date(eventData.fecha_evento)
        : null;
    const fechaFormateada = fecha
        ? fecha.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : 'Próximamente';

    const imageStyle: React.CSSProperties = {
        backgroundImage: `url(${eventData.imagen_ruta ?? logoPng})`,
    };

    const CategoryBadge = () => (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f02a34]/10 px-3 py-1 text-[10px] font-bold tracking-wider text-[#f02a34] uppercase">
            <Tag size={10} strokeWidth={3} />
            {eventData.category?.nombre || 'General'}
        </div>
    );

    const OpenModalButton = () => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                setIsInfoModalOpen(true);
            }}
            className="mt-4 flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-[#f02a34] uppercase transition-all hover:scale-105 active:scale-95"
        >
            <Maximize2 size={13} strokeWidth={3} /> Ver detalles [+]
        </button>
    );

    // --- COMPONENTE DEL MODAL (Lógica de Renderizado fuera del DOM local) ---
    const ModalPortal = ({ children }: { children: React.ReactNode }) => {
        return createPortal(
            <div className="fixed inset-0 !z-[999999] flex h-screen w-screen animate-in items-center justify-center bg-black/80 backdrop-blur-md duration-300 fade-in">
                {children}
            </div>,
            document.body,
        );
    };

    return (
        <>
            {/* --- MODAL DE INFORMACIÓN (USANDO PORTAL) --- */}
            {isInfoModalOpen && (
                <ModalPortal>
                    <div
                        className="relative mx-auto w-[95%] max-w-2xl animate-in overflow-hidden rounded-[2.5rem] border-2 border-[#f02a34]/30 bg-white shadow-2xl duration-300 zoom-in-95 dark:bg-zinc-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsInfoModalOpen(false)}
                            className="absolute top-5 right-5 z-[1000001] rounded-full bg-black/60 p-2 text-white hover:bg-[#f02a34]"
                        >
                            <X size={20} />
                        </button>

                        <div className="scrollbar-thin scrollbar-thumb-red-600 max-h-[90vh] overflow-y-auto">
                            <div
                                onClick={() => setIsImageModalOpen(true)}
                                style={imageStyle}
                                className="h-80 w-full cursor-zoom-in bg-cover bg-center"
                            />
                            <div className="p-8">
                                <CategoryBadge />
                                <div className="my-6 flex flex-wrap gap-6 border-b border-gray-100 pb-6 dark:border-white/10">
                                    <div className="flex items-center gap-2 text-[#f02a34]">
                                        {isProject ? (
                                            <Code size={18} />
                                        ) : (
                                            <MapPin
                                                size={18}
                                                strokeWidth={2.5}
                                            />
                                        )}
                                        <span className="text-xs font-bold uppercase">
                                            {isProject
                                                ? 'SICI I+D+I'
                                                : eventData.ubicacion ||
                                                  'SICI Lab'}
                                        </span>
                                    </div>
                                    {!isProject && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar size={18} />
                                            <span className="text-xs font-semibold">
                                                {fechaFormateada}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="mb-4 text-4xl leading-tight font-black text-gray-900 uppercase italic dark:text-white">
                                    {eventData.titulo}
                                </h2>
                                <p className="mb-6 text-xl font-bold text-[#f02a34] uppercase italic">
                                    {eventData.extracto}
                                </p>
                                <div className="text-justify text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                    {eventData.contenido ||
                                        'Sin descripción adicional.'}
                                </div>
                                {isProject && eventData.ubicacion && (
                                    <div className="mt-8 border-t border-gray-100 pt-6 dark:border-white/10">
                                        <a
                                            href={eventData.ubicacion}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-xs font-black text-white uppercase hover:bg-[#f02a34]"
                                        >
                                            <Github size={16} /> Ver Repositorio
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* --- MODAL DE IMAGEN FULLSCREEN (USANDO PORTAL) --- */}
            {isImageModalOpen && (
                <ModalPortal>
                    <div
                        className="relative flex h-full w-full items-center justify-center p-4"
                        onClick={() => setIsImageModalOpen(false)}
                    >
                        <button className="absolute top-8 right-8 text-white hover:text-[#f02a34]">
                            <X size={40} />
                        </button>
                        <img
                            src={eventData.imagen_ruta ?? logoPng}
                            className="max-h-[90vh] max-w-full animate-in rounded-lg shadow-2xl duration-300 zoom-in-90"
                            alt="Preview"
                        />
                    </div>
                </ModalPortal>
            )}

            {/* --- PLANTILLAS (TODAS SE MANTIENEN IGUAL) --- */}
            {plantilla === 'ProjectCard' && (
                <article className="group w-full max-w-[35em] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="relative overflow-hidden">
                        <div
                            onClick={() => setIsImageModalOpen(true)}
                            style={imageStyle}
                            className="h-64 w-full cursor-zoom-in bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                            <CategoryBadge />
                        </div>
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic dark:text-white">
                            {eventData.titulo}
                        </h2>
                        <div className="my-2 flex items-center gap-2 text-[10px] font-bold text-[#f02a34] uppercase">
                            <Code size={12} />
                            <span>Proyecto de Innovación</span>
                        </div>
                        <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                            {eventData.extracto}
                        </p>
                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <OpenModalButton />
                            <ExternalLink size={14} className="text-gray-400" />
                        </div>
                    </div>
                </article>
            )}

            {plantilla === 'ProjectTech' && (
                <article className="relative h-96 w-full max-w-[30em] overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl transition-all hover:-translate-y-2">
                    <div
                        style={imageStyle}
                        className="absolute inset-0 bg-cover bg-center opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                    <div className="absolute top-5 right-5">
                        <CategoryBadge />
                    </div>
                    <div className="absolute bottom-0 p-8">
                        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />{' '}
                            I+D+I SICI
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic">
                            {eventData.titulo}
                        </h2>
                        <p className="mt-4 line-clamp-2 text-sm text-zinc-400">
                            {eventData.extracto}
                        </p>
                        <button
                            onClick={() => setIsInfoModalOpen(true)}
                            className="mt-6 rounded-lg bg-white px-5 py-2 text-[11px] font-black text-black uppercase hover:bg-red-500 hover:text-white"
                        >
                            Explorar Proyecto
                        </button>
                    </div>
                </article>
            )}

            {plantilla === 'ProjectMinimal' && (
                <article className="flex w-full max-w-[35em] flex-col gap-5 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-900/50">
                    <div
                        onClick={() => setIsImageModalOpen(true)}
                        style={imageStyle}
                        className="h-48 w-full cursor-zoom-in rounded-xl bg-cover bg-center shadow-inner"
                    />
                    <div className="px-2 pb-2">
                        <div className="flex items-start justify-between">
                            <h2 className="text-xl font-black text-zinc-900 uppercase dark:text-white">
                                {eventData.titulo}
                            </h2>
                            <CategoryBadge />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-[#f02a34] uppercase italic">
                            "{eventData.extracto}"
                        </p>
                        <OpenModalButton />
                    </div>
                </article>
            )}

            {plantilla === 'TicketStyle' && (
                <article className="group flex w-full max-w-[40em] flex-col overflow-hidden rounded-xl border border-gray-200 shadow-xl md:flex-row dark:border-zinc-800">
                    <div className="flex flex-col items-center justify-center bg-black p-6 text-white md:w-28">
                        <span className="text-3xl font-black">
                            {fecha?.getDate() || '??'}
                        </span>
                        <span className="text-xs font-bold uppercase opacity-60">
                            {fecha?.toLocaleDateString('es-ES', {
                                month: 'short',
                            })}
                        </span>
                    </div>
                    <div className="relative flex flex-1 flex-col bg-white dark:bg-zinc-950">
                        <div
                            onClick={() => setIsImageModalOpen(true)}
                            style={imageStyle}
                            className="h-40 w-full cursor-zoom-in bg-cover bg-center"
                        />
                        <div className="p-5">
                            <CategoryBadge />
                            <h2 className="mt-2 text-xl font-black text-gray-900 uppercase italic dark:text-white">
                                {eventData.titulo}
                            </h2>
                            <p className="mt-1 line-clamp-1 text-sm font-bold text-[#f02a34] uppercase italic">
                                {eventData.extracto}
                            </p>
                            <OpenModalButton />
                        </div>
                    </div>
                </article>
            )}

            {plantilla === 'GlassOverlay' && (
                <article className="group relative h-[450px] w-full max-w-[35em] overflow-hidden rounded-2xl shadow-2xl">
                    <div
                        onClick={() => setIsImageModalOpen(true)}
                        style={imageStyle}
                        className="absolute inset-0 cursor-zoom-in bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                        <CategoryBadge />
                    </div>
                    <div className="absolute bottom-0 w-full p-8 text-center">
                        <h2 className="text-2xl font-black text-white uppercase italic">
                            {eventData.titulo}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm font-bold text-white/90 uppercase italic">
                            {eventData.extracto}
                        </p>
                        <div className="flex justify-center">
                            <OpenModalButton />
                        </div>
                    </div>
                </article>
            )}

            {plantilla === 'Minimalist' && (
                <article className="w-full max-w-[35em] rounded-2xl border-t-8 border-[#f02a34] bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
                    <div className="mb-4 flex justify-center">
                        <CategoryBadge />
                    </div>
                    <div
                        onClick={() => setIsImageModalOpen(true)}
                        style={imageStyle}
                        className="mx-auto mb-6 h-32 w-32 cursor-zoom-in rounded-full border-4 border-gray-100 bg-cover bg-center shadow-md"
                    />
                    <h2 className="text-2xl font-black text-gray-900 uppercase dark:text-white">
                        {eventData.titulo}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-base font-bold text-gray-500 uppercase italic">
                        {eventData.extracto}
                    </p>
                    <OpenModalButton />
                </article>
            )}

            {plantilla === 'BentoBox' && (
                <article className="grid w-full max-w-[35em] gap-3">
                    <div className="rounded-2xl border-b-8 border-[#f02a34] bg-zinc-900 p-6 text-center text-white shadow-lg">
                        <div className="mb-2">
                            <CategoryBadge />
                        </div>
                        <h2 className="text-xl font-black uppercase italic">
                            {eventData.titulo}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div
                            onClick={() => setIsImageModalOpen(true)}
                            style={imageStyle}
                            className="h-44 cursor-zoom-in rounded-2xl bg-cover bg-center shadow-md"
                        />
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                            <p className="line-clamp-4 text-xs font-bold text-gray-800 uppercase italic dark:text-white">
                                {eventData.extracto}
                            </p>
                            <span className="mt-4 text-[10px] font-black tracking-widest text-[#f02a34]">
                                {fechaFormateada}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <OpenModalButton />
                    </div>
                </article>
            )}

            {plantilla === 'PostFacebook' && (
                <article className="w-full max-w-[35em] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                    <div
                        onClick={() => setIsImageModalOpen(true)}
                        style={imageStyle}
                        className="h-72 w-full cursor-zoom-in bg-cover bg-center transition-opacity hover:opacity-95"
                    />
                    <div className="p-8 text-center">
                        <div className="mb-3 flex flex-col items-center gap-2">
                            <CategoryBadge />
                            <div className="flex gap-3 text-[11px] font-black tracking-tight text-[#f02a34] uppercase">
                                <span>
                                    {eventData.ubicacion || 'Confirmar'}
                                </span>
                                <span className="text-gray-300">|</span>
                                <span>{fechaFormateada}</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic dark:text-white">
                            {eventData.titulo}
                        </h2>
                        <p className="mt-3 line-clamp-2 text-base font-bold text-gray-600 uppercase italic dark:text-gray-400">
                            {eventData.extracto}
                        </p>
                        <div className="flex justify-center">
                            <OpenModalButton />
                        </div>
                    </div>
                </article>
            )}

            {plantilla === 'ProjectDetailed' && (
                <article className="group relative w-full max-w-[35em] overflow-hidden rounded-[2.5rem] border-2 border-gray-100 bg-white p-3 shadow-xl transition-all hover:border-[#f02a34]/20 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="relative h-64 overflow-hidden rounded-[2rem]">
                        <div
                            onClick={() => setIsImageModalOpen(true)}
                            style={imageStyle}
                            className="h-full w-full cursor-zoom-in bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute top-5 left-5">
                            <CategoryBadge />
                        </div>
                        <div className="absolute right-8 bottom-5 left-8 flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />{' '}
                                    SICI Innovación
                                </div>
                                <h2 className="mt-1 text-2xl font-black text-white uppercase italic">
                                    {eventData.titulo}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-6">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <div className="h-7 w-7 rounded-full border-2 border-white bg-zinc-200 dark:border-zinc-950" />
                                <div className="h-7 w-7 rounded-full border-2 border-white bg-[#f02a34] dark:border-zinc-950" />
                            </div>
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                Activo en Laboratorio
                            </span>
                        </div>
                        <p className="line-clamp-2 text-sm font-medium text-gray-600 italic dark:text-gray-400">
                            "{eventData.extracto}"
                        </p>
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => setIsInfoModalOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-[11px] font-black text-white uppercase transition-all hover:bg-[#f02a34] active:scale-95"
                            >
                                <Maximize2 size={14} /> Ver Proyecto
                            </button>
                            {eventData.ubicacion &&
                                eventData.ubicacion.includes('github.com') && (
                                    <a
                                        href={eventData.ubicacion}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 transition-colors hover:text-black dark:hover:text-white"
                                    >
                                        <Github size={20} />
                                    </a>
                                )}
                        </div>
                    </div>
                </article>
            )}
        </>
    );
};

export default EventContainer;
