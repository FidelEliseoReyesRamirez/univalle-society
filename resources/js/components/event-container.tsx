import { Calendar, Clock, MapPin, Maximize2, Tag, X } from 'lucide-react';
import React, { useState } from 'react';
import logoPng from '../../images/logo-hor.png';

const EventContainer: React.FC<{ eventData: any }> = ({ eventData }) => {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const plantilla = eventData.nombre_plantilla || 'PostFacebook';

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
    const horaFormateada = fecha
        ? fecha.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    const imageStyle: React.CSSProperties = {
        backgroundImage: `url(${eventData.imagen_ruta ?? logoPng})`,
    };

    const CategoryBadge = () => (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f02a34]/10 px-3 py-1 text-[10px] font-bold tracking-wider text-[#f02a34] uppercase">
            <Tag size={10} strokeWidth={3} />
            {eventData.category?.nombre || 'General'}
        </div>
    );

    // --- MODAL DE LECTURA ---
    const InfoModal = () => (
        <div className="fixed inset-0 z-[110] flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200 fade-in zoom-in">
            <div className="relative w-full max-w-xl overflow-hidden rounded-[1.5rem] border-2 border-[#f02a34] bg-white shadow-2xl dark:bg-zinc-900">
                <button
                    onClick={() => setIsInfoModalOpen(false)}
                    className="absolute top-4 right-4 z-20 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-[#f02a34]"
                >
                    <X size={18} />
                </button>

                <div className="scrollbar-thin scrollbar-thumb-red-600 max-h-[85vh] overflow-y-auto">
                    <div
                        onClick={() => setIsImageModalOpen(true)}
                        style={imageStyle}
                        className="h-72 w-full cursor-zoom-in border-b border-gray-100 bg-cover bg-center dark:border-white/10"
                    />

                    <div className="p-6 md:p-8">
                        <div className="mb-4">
                            <CategoryBadge />
                        </div>
                        <div className="mb-6 flex flex-wrap gap-4 border-b border-gray-100 pb-6 dark:border-white/10">
                            <div className="flex items-center gap-2 text-[#f02a34]">
                                <MapPin size={16} strokeWidth={2.5} />
                                <span className="text-[11px] font-bold tracking-tight uppercase">
                                    {eventData.ubicacion || 'Por confirmar'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar size={15} />
                                <span className="text-[11px] font-semibold">
                                    {fechaFormateada}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <Clock size={15} />
                                <span className="text-[11px] font-semibold">
                                    {horaFormateada || '--:--'} HRS
                                </span>
                            </div>
                        </div>

                        <h2 className="mb-3 text-3xl leading-tight font-black text-gray-900 uppercase italic dark:text-white">
                            {eventData.titulo}
                        </h2>

                        <p className="mb-6 text-lg leading-snug font-bold text-[#f02a34] uppercase italic">
                            {eventData.extracto}
                        </p>

                        <div className="text-justify">
                            <p className="text-[15px] leading-relaxed font-normal text-gray-600 dark:text-gray-300">
                                {eventData.contenido ||
                                    'Sin descripción adicional.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const OpenModalButton = () => (
        <button
            onClick={() => setIsInfoModalOpen(true)}
            className="mt-4 flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-[#f02a34] uppercase transition-all hover:scale-105 active:scale-95"
        >
            <Maximize2 size={13} strokeWidth={3} /> Más información [+]
        </button>
    );

    return (
        <>
            {isInfoModalOpen && <InfoModal />}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 z-[130] flex animate-in items-center justify-center bg-black/95 p-4 duration-200 fade-in"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <button className="absolute top-6 right-6 text-white">
                        <X size={35} />
                    </button>
                    <img
                        src={eventData.imagen_ruta ?? logoPng}
                        className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
                    />
                </div>
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
                            <div className="mb-2">
                                <CategoryBadge />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase italic dark:text-white">
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
        </>
    );
};

export default EventContainer;
