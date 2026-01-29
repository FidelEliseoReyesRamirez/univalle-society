import EventContainer from '@/components/event-container';
import HomeLayout from '@/layouts/HomeLayout';
import { Head } from '@inertiajs/react';

export default function NewsAll({ news = [] }: { news: any[] }) {
    return (
        <HomeLayout>
            <Head title="Todas las Noticias" />
            <div className="mx-auto max-w-7xl px-6 py-12">
                <h1 className="mb-12 text-5xl font-black uppercase italic dark:text-white">
                    Últimas Noticias
                </h1>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {news.length > 0 ? (
                        news.map((n) => (
                            <EventContainer key={n.id} eventData={n} />
                        ))
                    ) : (
                        <p className="col-span-full py-20 text-center text-zinc-500">
                            No hay noticias publicadas por el momento.
                        </p>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}
