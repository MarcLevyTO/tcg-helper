'use client';

import { useEffect } from 'react';
import { useHeader } from '@/src/hooks/useHeader';
import { useEvents } from '@/src/hooks/useEvents';
import { groupEventsByWeekByDay } from '@/src/utils/utils';
import Header from '@/src/components/Header';
import Spinner from '@/src/components/Spinner';
import EventCard from '@/src/components/EventCard';
import './page.scss';

const Events = () => {
  const { activeTab, latitude, longitude, eventDistance, eventNameFilter, showPastEvents } = useHeader();
  const { data = [], isLoading: loading, error } = useEvents(latitude, longitude, eventDistance, activeTab, showPastEvents);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showPastEvents]);

  const filteredData = data.filter((event: any) =>
    event.name.toLowerCase().includes(eventNameFilter.toLowerCase()) || event.store.name.toLowerCase().includes(eventNameFilter.toLowerCase())
  );

  return (
    <div className="events-page-container">
      <div className="events-sticky-header">
        <Header type="events" showPastEventsTab />
      </div>

      <div className="events-content-container">
        {loading && (
          <div className="loading-container">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error.message}</p>
          </div>
        )}

        {filteredData && !loading && !error && (
          <div className="events-grid-container">
            {groupEventsByWeekByDay(filteredData, latitude, longitude, showPastEvents).map(([weekStart, daysInWeek]) => (
              <div key={weekStart} className="week-container">
                <div className="week-container">
                  {daysInWeek.map(([dayStart, events]: [string, any[]]) => (
                    <div key={dayStart} className="day-container">
                      <h3 className="day-header">
                        {new Date(dayStart).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <ul className="events-list">
                        {events.map((event: any) => (
                          <EventCard event={event} activeTab={activeTab} key={event.id} isPastEvent={showPastEvents} />
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