import { useEffect } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchEvents } from '@/store/slices/eventsSlice';
import { formatDate } from '@/utils/formatDate';
import EmptyState from '@/components/common/EmptyState';
import { FullPageSpinner } from '@/components/common/Spinner';

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const activeEvents = items
    .filter((e) => e.status === 'active')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display text-4xl font-bold text-primary-900 mb-2">
            Événements
          </h1>
          <p className="text-neutral-500 text-lg">
            {activeEvents.length > 0
              ? `${activeEvents.length} événement${activeEvents.length > 1 ? 's' : ''} à venir`
              : 'Découvrez les prochains événements à Nador'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <FullPageSpinner />
        ) : activeEvents.length === 0 ? (
          <EmptyState
            title="Aucun événement à venir"
            description="Revenez bientôt pour découvrir les prochains événements à Nador."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Date banner */}
                <div className="bg-primary-700 px-6 py-4 flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-primary-200" />
                  <span className="text-white font-semibold text-sm">
                    {formatDate(event.date)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-display text-xl font-bold text-primary-900 mb-2">
                    {event.title}
                  </h2>

                  <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  <p className="text-neutral-600 text-sm leading-relaxed flex-1">
                    {event.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
