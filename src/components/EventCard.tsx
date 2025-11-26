import { Event } from '@/src/types';
import { 
  generateICS,
  getGoogleMapsUrl,
  getEventUrl,
  formatCost,
  ensureHttps,
  registrationString,
} from '@/src/shared/utils';
import { getWebsite } from '@/src/shared/stores';

const EventCard = ({event, activeTab, minimized = false}: {event: Event, activeTab: 'riftbound' | 'lorcana', minimized?: boolean}) => {
  const eventUrl = getEventUrl(event.id, activeTab);

  return (
    <li key={event.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative min-h-[280px] sm:min-h-[320px] border border-gray-700/50 hover:border-blue-500/30 flex flex-col overflow-hidden pb-16 sm:pb-20">
      {event.full_header_image_url && !minimized && (
        <div className="w-full bg-black hidden sm:block">
          <img 
            src={event.full_header_image_url} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col flex-grow p-4 sm:p-6 pb-0">
        <div className="mb-3 sm:mb-4">
          <p className="text-blue-400 font-semibold text-sm sm:text-base">
            {new Date(event.start_datetime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-blue-300 font-medium text-xs sm:text-sm mt-1 sm:mt-2">
            {new Date(event.start_datetime).toLocaleTimeString('en-US', {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })} EST
          </p>
        </div>
        <div className="h-[1.5rem] mb-3 sm:mb-4 flex items-center">
          <p className="font-semibold text-gray-200 text-xs sm:text-sm line-clamp-2">{event.name}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-red-400 text-xs sm:text-sm">MAX {event.capacity} PLAYERS</p>
          <p className="font-semibold text-red-400 text-xs sm:text-sm">{registrationString(event)}</p>
        </div>
        {!minimized && event.store && (
          <div className="border-t border-gray-700/50 pt-3 sm:pt-4 mt-3 sm:mt-5">
            {getWebsite(event.store.id, activeTab) || event.store.website ? (
              <a 
                href={ensureHttps(getWebsite(event.store.id, activeTab) || event.store.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-400 hover:text-blue-300 text-xs sm:text-sm mb-3 sm:mb-4 inline-block transition-colors"
              >
                {event.store.name}
              </a>
            ) : (
              <p className="font-semibold text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4">{event.store.name}</p>
            )}
            <a
              href={getGoogleMapsUrl(event.store)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-gray-400 hover:text-blue-400 text-xs sm:text-sm transition-colors group/maps mt-2"
            >
              <span className="text-red-500 group-hover/maps:text-red-400 transition-colors flex-shrink-0 mt-0.5">📍</span>
              <span className="group-hover/maps:underline">{event.store.full_address}</span>
            </a>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex gap-2">
        <a 
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View Event Details"
          className="flex-1 text-center py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs sm:text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20"
        >
          {formatCost(event.cost_in_cents, event.currency)}
        </a>
        <a
          href={generateICS(event)}
          download={`${event.name}.ics`}
          className="py-2 sm:py-2.5 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs sm:text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20"
          title="Add to Calendar"
        >
          📅
        </a>
      </div>
    </li>
  );
};

export default EventCard;
