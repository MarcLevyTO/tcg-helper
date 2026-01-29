import { useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { Event } from '@/src/types';
import Modal from './Modal';
import EventCard from './EventCard';
import { calculateDistance } from '@/src/utils/utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.scss';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  events: Event[];
  activeTab: 'riftbound' | 'lorcana';
  latitude: string;
  longitude: string;
  maxDistance: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Event;
}

const CalendarView = ({ events, activeTab, latitude, longitude, maxDistance }: CalendarViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const eventPropGetter = (event: CalendarEvent) => {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const maxDist = parseFloat(maxDistance) || 50; // default to 50 if invalid

    if (isNaN(userLat) || isNaN(userLon) || !event.resource.store.latitude || !event.resource.store.longitude) {
      return {};
    }

    const dist = calculateDistance(userLat, userLon, event.resource.store.latitude, event.resource.store.longitude);

    // Normalize distance (0 to 1)
    let ratio = dist / maxDist;
    if (ratio > 1) ratio = 1;
    if (ratio < 0) ratio = 0;

    // Calculate hue: 120 (Green) -> 0 (Red)
    const hue = (1 - ratio) * 120;

    return {
      style: {
        backgroundColor: `hsl(${hue}, 100%, 35%)`, // Keep saturation high and lightness distinct
        borderColor: `hsl(${hue}, 100%, 25%)`,
      }
    };
  };

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.name,
    start: new Date(event.start_datetime),
    // Use end_datetime if available, otherwise default to start + 3 hours
    end: event.end_datetime
      ? new Date(event.end_datetime)
      : new Date(new Date(event.start_datetime).getTime() + 3 * 60 * 60 * 1000),
    resource: event,
  }));

  const handleSelectEvent = (calendarEvent: CalendarEvent) => {
    setSelectedEvent(calendarEvent.resource);
  };

  const [date, setDate] = useState(new Date());

  const onNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const minTime = new Date();
  minTime.setHours(10, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0);

  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    return (
      <div>
        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
        <div style={{ fontSize: '0.85em' }}>{event.resource.store.name}</div>
        <div style={{ fontSize: '0.8em', fontStyle: 'italic' }}>{event.resource.store.full_address}</div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 200px)' }}
        onSelectEvent={handleSelectEvent}
        views={['day']}
        defaultView='day'
        date={date} // Controlled date
        onNavigate={onNavigate} // Callback for date navigation
        min={minTime}
        max={maxTime}
        components={{
          event: CustomEvent
        }}
        eventPropGetter={eventPropGetter}
      />

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.name}
      >
        {selectedEvent && (
          <div style={{ listStyle: 'none', padding: 0 }}>
            <EventCard event={selectedEvent} activeTab={activeTab} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarView;
