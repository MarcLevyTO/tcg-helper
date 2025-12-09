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

const EventCard = ({ event, activeTab, minimized = false, isPastEvent = false }: { event: Event, activeTab: 'riftbound' | 'lorcana', minimized?: boolean, isPastEvent?: boolean }) => {
  const eventUrl = getEventUrl(event.id, activeTab);

  return (
    <li key={event.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative sm:min-h-[320px] border border-gray-700/50 hover:border-blue-500/30 flex flex-col overflow-hidden pb-12 sm:pb-14">
      {event.full_header_image_url && !minimized && (
        <div className="w-full aspect-[1.77/1] bg-black hidden sm:block overflow-hidden">
          <img
            src={event.full_header_image_url}
            alt={event.name}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <div className="flex flex-col flex-grow p-3 sm:p-4 pb-0 gap-2.5">
        <div className="flex flex-col gap-1">
          <p className="text-blue-400 font-semibold text-sm sm:text-base">
            {new Date(event.start_datetime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-blue-300 font-medium text-xs sm:text-sm">
            {new Date(event.start_datetime).toLocaleTimeString('en-US', {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })} EST
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-200 text-xs sm:text-sm line-clamp-2 break-words">{event.name}</p>
        </div>
        {!isPastEvent && <div className="flex flex-col gap-2.5">
          <p className="font-semibold text-red-400 text-xs sm:text-sm">MAX {event.capacity} PLAYERS</p>
          <p className="font-semibold text-red-400 text-xs sm:text-sm">{registrationString(event)}</p>
        </div>}
        {!minimized && event.store && (
          <div className="border-t border-gray-700/50 pt-2.5 flex flex-col gap-2.5">
            {getWebsite(event.store.id, activeTab) || event.store.website ? (
              <a
                href={ensureHttps(getWebsite(event.store.id, activeTab) || event.store.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-400 hover:text-blue-300 text-xs sm:text-sm inline-block transition-colors break-words"
              >
                {event.store.name}
              </a>
            ) : (
              <p className="font-semibold text-gray-200 text-xs sm:text-sm break-words">{event.store.name}</p>
            )}
            <a
              href={getGoogleMapsUrl(event.store)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-gray-400 hover:text-blue-400 text-xs sm:text-sm transition-colors group/maps mb-[10px] sm:mb-0"
            >
              <span className="text-red-500 group-hover/maps:text-red-400 transition-colors flex-shrink-0 mt-0.5">📍</span>
              <span className="group-hover/maps:underline break-words">{event.store.full_address}</span>
            </a>
          </div>
        )}
      </div>
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex gap-2">
        {new Date().getTime() >= new Date(event.start_datetime).getTime() - 3600000 && (
          <a
            id="view-event"
            href={`/events/${event.id}`}
            className="w-12 sm:w-14 text-center py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs sm:text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20"
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
          className="flex-1 text-center py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs sm:text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20"
        >
          {isPastEvent ? 'LINK' : formatCost(event.cost_in_cents, event.currency)}
        </a>
        <CalendarDropdown event={event} />
      </div>
    </li>
  );
};

export default EventCard;
