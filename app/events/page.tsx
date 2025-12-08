'use client';

import { useHeader } from '@/src/hooks/useHeader';
import { useEvents } from '@/src/hooks/useEvents';

import { groupEventsByWeekByDay } from '@/src/utils/utils';

import Header from '@/src/components/Header';
import Spinner from '@/src/components/Spinner';
import EventCard from '@/src/components/EventCard';

const Events = () => {
  const { activeTab, latitude, longitude, eventDistance, eventNameFilter } = useHeader();
  const { data = [], isLoading: loading, error } = useEvents(latitude, longitude, eventDistance, activeTab);

  const filteredData = data.filter((event: any) =>
    event.name.toLowerCase().includes(eventNameFilter.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col min-h-screen">
      <div className="sticky top-0 z-10">
        <Header type="events" />
      </div>

      <div className="container mx-auto px-2 sm:px-4 flex-grow">
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-6 mx-2">
            <p className="text-center text-red-400">{error.message}</p>
          </div>
        )}

        {filteredData && !loading && !error && (
          <div className="space-y-8 sm:space-y-12 h-full -mx-2 sm:-mx-4">
            {groupEventsByWeekByDay(filteredData, latitude, longitude).map(([weekStart, daysInWeek]) => (
              <div key={weekStart} className="space-y-6 sm:space-y-8">
                <div className="space-y-6 sm:space-y-8">
                  {daysInWeek.map(([dayStart, events]: [string, any[]]) => (
                    <div key={dayStart} className="space-y-3 sm:space-y-4">
                      <h3 className="sticky top-[158px] z-[5] bg-gray-900 text-lg sm:text-xl font-semibold text-gray-200 py-2 sm:py-3 border-b border-gray-700/50 w-screen ml-[calc(-50vw+50%)] text-center">
                        {new Date(dayStart).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 px-2 sm:px-4">
                        {events.map((event: any) => (
                          <EventCard event={event} activeTab={activeTab} key={event.id} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;