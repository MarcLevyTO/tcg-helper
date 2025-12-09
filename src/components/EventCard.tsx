import { Event } from '@/src/types';
import {
  formatCost,
  ensureHttps,
  registrationString,
} from '@/src/utils/utils';
import {
  getEventUrl,
  getGoogleMapsUrl,
} from '@/src/utils/url';
import { getWebsite } from '@/src/utils/stores';
import CalendarDropdown from '@/src/components/CalendarDropdown';
import './EventCard.scss';

const EventCard = ({ event, activeTab, minimized = false, isPastEvent = false }: { event: Event, activeTab: 'riftbound' | 'lorcana', minimized?: boolean, isPastEvent?: boolean }) => {
  const eventUrl = getEventUrl(event.id, activeTab);

  return (
    <li key={event.id} className="event-card">
      {event.full_header_image_url && !minimized && (
        <div className="header-image-container">
          <img
            src={event.full_header_image_url}
            alt={event.name}
          />
        </div>
      )}
      <div className="card-content">
        <div className="date-time-section">
          <p className="event-date">
            {new Date(event.start_datetime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="event-time">
            {new Date(event.start_datetime).toLocaleTimeString('en-US', {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })} EST
          </p>
        </div>
        <div>
          <p className="event-name">{event.name}</p>
        </div>
        {!isPastEvent && <div className="registration-info">
          <p>MAX {event.capacity} PLAYERS</p>
          <p>{registrationString(event)}</p>
        </div>}
        {!minimized && event.store && (
          <div className="store-section">
            {getWebsite(event.store.id, activeTab) || event.store.website ? (
              <a
                href={ensureHttps(getWebsite(event.store.id, activeTab) || event.store.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="store-name-link"
              >
                {event.store.name}
              </a>
            ) : (
              <p className="store-name-text">{event.store.name}</p>
            )}
            <a
              href={getGoogleMapsUrl(event.store)}
              target="_blank"
              rel="noopener noreferrer"
              className="address-link"
            >
              <span className="location-icon">📍</span>
              <span className="address-text">{event.store.full_address}</span>
            </a>
          </div>
        )}
      </div>
      <div className="button-row">
        {new Date().getTime() >= new Date(event.start_datetime).getTime() - 3600000 && (
          <a
            id="view-event"
            href={`/events/${event.id}`}
            className="view-event-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" enableBackground="new 0 0 128 128" xmlSpace="preserve" width="100%" height="20px">
              <path fill="currentColor" d="M122.465 12.122H5.535A5.53 5.53 0 0 0 0 17.657v80.26a5.53 5.53 0 0 0 5.535 5.535h43.918l-.692 4.359s-.242 2.647-2.647 4.411c-2.387 1.764-4.29 3.286-2.387 3.546 1.816.242 19.01.017 20.272 0 1.28.017 18.456.242 20.29 0 1.885-.259-.017-1.782-2.404-3.546-2.404-1.764-2.647-4.411-2.647-4.411l-.675-4.359h43.901a5.53 5.53 0 0 0 5.535-5.535v-80.26a5.528 5.528 0 0 0-5.534-5.535zm-2.768 74.724H8.303V20.424h111.395v66.422zM26.294 58.468h11.069v20.758H26.294V58.468zm23.524-6.227h11.071v26.985H49.818V52.241zM71.96 48.09h11.07v31.136H71.96V48.09zm20.756-7.957h11.071v39.093H92.716V40.133z" />
            </svg>
          </a>
        )}
        <a
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View Event Details"
          className="event-link-btn"
        >
          {isPastEvent ? 'LINK' : formatCost(event.cost_in_cents, event.currency)}
        </a>
        <CalendarDropdown event={event} />
      </div>
    </li>
  );
};

export default EventCard;
