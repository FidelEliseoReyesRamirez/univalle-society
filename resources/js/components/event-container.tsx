import React, { useState } from 'react';
import logoPng from '../../images/logo-hor.png';

const EventContainer: React.FC<{ eventData: any }> = ({ eventData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
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
    const toggleExpand = () => setIsExpanded(!isExpanded);

    const ExpandButton = () => (
        <button
            onClick={toggleExpand}
            className="mt-4 flex items-center gap-1 text-xs font-black tracking-tighter text-[#f02a34] uppercase hover:underline"
        >
            {isExpanded ? 'Cerrar [-]' : 'Leer más [+]'}
        </button>
    );

    const ExpandedInfo = () => (
        <div
            className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="space-y-3 rounded-lg border border-gray-200 bg-white/50 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/20">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {eventData.contenido || 'Sin descripción adicional.'}
                </p>
                <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    <span>📍 {eventData.ubicacion || 'Confirmar'}</span>
                    <span>⏰ {horaFormateada || '--:--'}</span>
                </div>
            </div>
        </div>
    );

    // 1. TICKET STYLE (Imagen integrada en el cuerpo del ticket)
    if (plantilla === 'TicketStyle') {
        return (
            <article className="group flex w-full max-w-[40em] flex-col overflow-hidden rounded-2xl bg-[#f02a34] shadow-2xl md:flex-row">
                <div className="flex flex-col items-center justify-center border-r-2 border-dashed border-white/30 bg-black p-6 text-white md:w-1/4">
                    <span className="text-3xl leading-none font-black">
                        {fecha?.getDate() || '??'}
                    </span>
                    <span className="text-xs font-bold uppercase opacity-70">
                        {fecha?.toLocaleDateString('es-ES', { month: 'short' })}
                    </span>
                    <div className="mt-4 rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#f02a34] uppercase">
                        SICI
                    </div>
                </div>
                <div className="relative flex flex-1 flex-col p-0 text-white">
                    <div
                        style={imageStyle}
                        className="h-32 w-full border-b border-white/20 bg-cover bg-center opacity-90"
                    />
                    <div className="p-6">
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                            {eventData.category?.nombre}
                        </span>
                        <h2 className="mt-1 text-2xl leading-tight font-black uppercase italic">
                            {eventData.titulo}
                        </h2>
                        <p
                            className={`mt-2 text-sm text-white/80 ${!isExpanded && 'line-clamp-1'}`}
                        >
                            {eventData.extracto}
                        </p>
                        <button
                            onClick={toggleExpand}
                            className="mt-4 rounded-lg bg-black px-4 py-2 text-[10px] font-black uppercase transition-all hover:bg-white hover:text-black"
                        >
                            {isExpanded ? 'OCULTAR' : 'VER TICKET'}
                        </button>
                        <ExpandedInfo />
                    </div>
                </div>
            </article>
        );
    }

    // 2. GLASS OVERLAY (Imagen de fondo total)
    if (plantilla === 'GlassOverlay') {
        return (
            <article className="group relative h-[450px] w-full max-w-[40em] overflow-hidden rounded-3xl shadow-2xl">
                <div
                    style={imageStyle}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 w-full border-t border-white/20 bg-white/10 p-8 backdrop-blur-md">
                    <span className="text-xs font-black tracking-[0.3em] text-[#f02a34] uppercase">
                        {eventData.category?.nombre}
                    </span>
                    <h2 className="my-2 text-3xl leading-none font-black text-white uppercase italic">
                        {eventData.titulo}
                    </h2>
                    <p
                        className={`text-sm text-white/70 ${!isExpanded && 'line-clamp-2'}`}
                    >
                        {eventData.extracto}
                    </p>
                    <ExpandButton />
                    <ExpandedInfo />
                </div>
            </article>
        );
    }

    // 3. MINIMAL NEWS (Imagen a la derecha, estilo periódico)
    if (plantilla === 'Minimalist') {
        return (
            <article className="group w-full max-w-[40em] rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-zinc-900/50">
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="flex-1 border-l-8 border-[#f02a34] pl-6">
                        <div className="flex items-center gap-4 text-xs font-bold tracking-tighter text-[#f02a34] uppercase">
                            <span>{fechaFormateada}</span>
                        </div>
                        <h2 className="my-3 text-3xl leading-[1] font-black text-gray-900 uppercase transition-colors group-hover:text-[#f02a34] dark:text-white">
                            {eventData.titulo}
                        </h2>
                        <p
                            className={`text-sm leading-tight font-medium text-gray-600 dark:text-gray-400 ${!isExpanded && 'line-clamp-2'}`}
                        >
                            {eventData.extracto}
                        </p>
                    </div>
                    <div
                        style={imageStyle}
                        className="h-28 w-28 shrink-0 rounded-lg bg-cover bg-center shadow-lg grayscale transition-all group-hover:grayscale-0 md:h-32 md:w-32"
                    />
                </div>
                <ExpandButton />
                <ExpandedInfo />
            </article>
        );
    }

    // 4. BENTO BOX (Imagen en bloque superior)
    if (plantilla === 'BentoBox') {
        return (
            <article className="grid w-full max-w-[40em] grid-cols-6 gap-2">
                <div
                    style={imageStyle}
                    className="col-span-2 h-40 rounded-2xl border-4 border-white bg-cover bg-center shadow-xl dark:border-zinc-800"
                />
                <div className="col-span-4 flex flex-col justify-center rounded-2xl border border-gray-200 bg-zinc-100 p-4 dark:border-white/5 dark:bg-zinc-900">
                    <span className="text-[10px] font-black text-[#f02a34] uppercase">
                        {eventData.category?.nombre}
                    </span>
                    <h2 className="text-lg leading-tight font-black uppercase italic dark:text-white">
                        {eventData.titulo}
                    </h2>
                    <span className="mt-1 text-[10px] font-bold text-gray-500">
                        {fechaFormateada}
                    </span>
                </div>
                <div className="col-span-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg dark:border-white/5 dark:bg-zinc-800">
                    <p
                        className={`text-sm text-gray-600 dark:text-gray-400 ${!isExpanded && 'line-clamp-2'}`}
                    >
                        {eventData.extracto}
                    </p>
                    <ExpandButton />
                    <ExpandedInfo />
                </div>
            </article>
        );
    }

    // 5. POSTFACEBOOK (Fallback / Estilo por defecto)
    return (
        <article className="w-full max-w-[40em] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all dark:border-zinc-800 dark:bg-zinc-950">
            <div
                style={imageStyle}
                className="h-64 w-full bg-cover bg-center"
            />
            <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                    <span className="border-b-2 border-[#f02a34] pb-0.5 text-[10px] font-extrabold tracking-widest text-[#f02a34] uppercase">
                        {eventData.category?.nombre}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase dark:text-gray-500">
                        {fechaFormateada}
                    </span>
                </div>
                <h2 className="mb-2 text-2xl leading-tight font-black text-gray-900 uppercase italic dark:text-white">
                    {eventData.titulo}
                </h2>
                <p
                    className={`text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${!isExpanded && 'line-clamp-3'}`}
                >
                    {eventData.extracto}
                </p>
                <ExpandButton />
                <ExpandedInfo />
            </div>
        </article>
    );
};

export default EventContainer;
