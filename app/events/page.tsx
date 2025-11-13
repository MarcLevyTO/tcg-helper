'use client';

import { useState, useEffect } from 'react';
import { 
  generateICS,
  groupEventsByWeekByDay,
  getGoogleMapsUrl,
  getEventUrl,
  formatCost,
  ensureHttps,
} from '../../shared/utils';
import Spinner from '../components/Spinner';

const Events = () => {
  const [activeTab, setActiveTab] = useState<'riftbound' | 'lorcana'>('riftbound');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = `/api/events?game=${activeTab}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        setData(result || []);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="min-w-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="sticky top-0 z-10 bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              TCG Event Locator
            </h1>
            <div className="flex space-x-4 border-b border-gray-700">
              {(['riftbound', 'lorcana'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-6">
            <p className="text-center text-red-400">{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-12">
            {groupEventsByWeekByDay(data).map(([weekStart, daysInWeek]) => (
              <div key={weekStart} className="space-y-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Week of {new Date(weekStart).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h2>
                <div className="space-y-8">
                  {daysInWeek.map(([dayStart, events]: [string, any[]]) => (
                    <div key={dayStart} className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-200 px-2">
                        {new Date(dayStart).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {events.map((item: any) => (
                          <li key={item.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative min-h-[320px] border border-gray-700/50 hover:border-blue-500/30 flex flex-col overflow-hidden">
                            {item.full_header_image_url && (
                              <div className="h-32 w-full bg-black">
                                <img 
                                  src={item.full_header_image_url} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex flex-col flex-grow p-6">
                              <div className="mb-4">
                                <p className="text-blue-400 font-semibold text-base">
                                  {new Date(item.start_datetime).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                                <p className="text-blue-300 font-medium text-sm mt-2">
                                  {new Date(item.start_datetime).toLocaleTimeString('en-US', {
                                    timeZone: 'America/New_York',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                  })} EST
                                </p>
                              </div>
                              <div className="h-[3.5rem] mb-4 flex items-center">
                                <p className="font-semibold text-gray-200 text-sm line-clamp-2">{item.name}</p>
                              </div>
                              <div className="mt-auto pb-16">
                                {item.store && (
                                  <div className="border-t border-gray-700/50 pt-4">
                                    {item.store.website ? (
                                      <a 
                                        href={ensureHttps(item.store.website)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block transition-colors"
                                      >
                                        {item.store.name}
                                      </a>
                                    ) : (
                                      <p className="font-semibold text-gray-200 text-sm mb-4">{item.store.name}</p>
                                    )}
                                    <a
                                      href={getGoogleMapsUrl(item.store)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-2 text-gray-400 hover:text-blue-400 text-sm transition-colors group/maps mt-2"
                                    >
                                      <span className="text-red-500 group-hover/maps:text-red-400 transition-colors flex-shrink-0 mt-0.5">📍</span>
                                      <span className="group-hover/maps:underline">{item.store.full_address}</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                              <a 
                                href={getEventUrl(item.id, activeTab)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20"
                              >
                                {formatCost(item.cost_in_cents)}
                              </a>
                              <a
                                href={generateICS(item)}
                                download={`${item.name}.ics`}
                                className="py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20"
                                title="Add to Calendar"
                              >
                                📅
                              </a>
                            </div>
                          </li>
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