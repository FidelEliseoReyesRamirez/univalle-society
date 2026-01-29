import EventContainer from '@/components/event-container';
import HomeLayout from '@/layouts/HomeLayout';
import { Head } from '@inertiajs/react';

export default function EventsAll({ events = [] }: { events: any[] }) {
    return (
        <HomeLayout>
            <Head title="Todos los Eventos" />
            <div className="mx-auto max-w-7xl px-6 py-12">
                <h1 className="mb-12 text-5xl font-black uppercase italic dark:text-white">
                    Explorar Eventos
                </h1>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((e) => (
                        <EventContainer key={e.id} eventData={e} />
                    ))}
                </div>
            </div>
        </HomeLayout>
    );
}
