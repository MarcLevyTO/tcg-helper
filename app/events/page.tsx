'use client';

import { useEffect, useState } from 'react';
import { useHeader } from '@/src/hooks/useHeader';
import { useEvents } from '@/src/hooks/useEvents';
import { groupEventsByWeekByDay } from '@/src/utils/utils';
import { Event } from '@/src/types';
import Header from '@/src/components/Header';
import Spinner from '@/src/components/Spinner';
import EventCard from '@/src/components/EventCard';
import CalendarView from '@/src/components/CalendarView';
import './page.scss';

const Events = () => {
  const { activeTab, latitude, longitude, eventDistance, eventNameFilter, showPastEvents } = useHeader();
  const { data = [], isLoading: loading, error } = useEvents(latitude, longitude, eventDistance, activeTab, showPastEvents);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showPastEvents]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowCalendar(false);
      }
    };

    // Check on mount/update
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showCalendar]);

  const filteredData = data.filter((event: Event) =>
    event.name.toLowerCase().includes(eventNameFilter.toLowerCase()) || event.store.name.toLowerCase().includes(eventNameFilter.toLowerCase())
  );

  const calendarData = groupEventsByWeekByDay(filteredData, latitude, longitude, showPastEvents);

  const listView = () => {
    if (!filteredData || loading || error || showCalendar) {
      return null;
    }

    return (
      <div className="events-grid-container">
        {calendarData.map(([weekStart, daysInWeek]) => (
          <div key={weekStart} className="week-container">
            <div className="week-container">
              {daysInWeek.map(([dayStart, events]: [string, Event[]]) => (
                <div key={dayStart} className="day-container">
                  <h3 className="day-header">
                    {new Date(dayStart).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <ul className="events-list">
                    {events.map((event: Event) => (
                      <EventCard event={event} activeTab={activeTab} key={event.id} isPastEvent={showPastEvents} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const calendarView = () => {
    if (!filteredData || loading || error || !showCalendar) {
      return null;
    }

    return (
      <div className="calendar-view-wrapper">
        <CalendarView
          events={filteredData}
          activeTab={activeTab}
          latitude={latitude}
          longitude={longitude}
          maxDistance={eventDistance}
        />
      </div>
    );
  }


  return (
    <div className="events-page-container">
      <div className="events-sticky-header">
        <Header
          type="events"
          showPastEventsTab
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
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

        {listView()}
        {calendarView()}
      </div>
    </div>
  );
};

export default Events;