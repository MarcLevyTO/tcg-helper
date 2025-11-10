'use client';

import React, { useState, useEffect } from 'react';
import Spinner from './components/Spinner';

// Utility function to format today's date for API URLs
const getTodayFormatted = () => {
  const date = new Date();
  return date.toISOString().replace(/:/g, '%3A');
};

const TODAY = getTodayFormatted();
const LATITUDE = 43.7418592;
const LONGITUDE = -79.57345579999999;
const NUM_MILES = 15;

// API Configuration
const RIFTBOUND_API_URL = `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/?start_date_after=${TODAY}&display_status=upcoming&latitude=${LATITUDE}&longitude=${LONGITUDE}&num_miles=${NUM_MILES}&upcoming_only=true&game_slug=riftbound&page=1&page_size=250`;
const LORCANA_API_URL = `https://api.cloudflare.ravensburgerplay.com/hydraproxy/api/v2/events/?start_date_after=${TODAY}&display_status=upcoming&latitude=${LATITUDE}&longitude=${LONGITUDE}&num_miles=${NUM_MILES}&upcoming_only=true&game_slug=disney-lorcana&page=1&page_size=250`;
const RIFTBOUND_EVENTS_URL = 'https://locator.riftbound.uvsgames.com/events/';
const LORCANA_EVENTS_URL = 'https://tcg.ravensburgerplay.com/events/';

const Page = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<'riftbound' | 'lorcana'>('riftbound');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility function to format currency display
  const formatCost = (cents: number | undefined) => {
    if (!cents) return 'View Event Details';
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD'
    }).format(dollars);
  };

  // Groups events by day, returning a sorted array of [date, events] pairs
  const groupEventsByDay = (events: any[]) => {
    const grouped = new Map();
    
    events.forEach(event => {
      const date = new Date(event.start_datetime);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString();
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(event);
    });

    return Array.from(grouped)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  };

  // Groups events by week, then by day within each week
  const groupEventsByWeek = (events: any[]) => {
    const grouped = new Map();
    
    events.forEach(event => {
      const date = new Date(event.start_datetime);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      
      const key = monday.toISOString();
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(event);
    });

    // Group each week's events by day
    return Array.from(grouped)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([weekStart, weekEvents]) => [
        weekStart,
        groupEventsByDay(weekEvents)
      ]);
  };

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = activeTab === 'riftbound' ? RIFTBOUND_API_URL : LORCANA_API_URL;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        let results = result ? result.results : [];
        setData(results);
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
      {/* Sticky Header with Navigation */}
      <div className="sticky top-0 z-10 bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              TCG Event Locator
            </h1>
            <div className="flex space-x-4 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('riftbound')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'riftbound'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                RIFTBOUND
              </button>
              <button
                onClick={() => setActiveTab('lorcana')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'lorcana'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                LORCANA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-6">
            <p className="text-center text-red-400">{error}</p>
          </div>
        )}

        {/* Event Display */}
        {data && !loading && (
          <div className="space-y-12">
            {/* Week Sections */}
            {groupEventsByWeek(data).map(([weekStart, daysInWeek]) => (
              <div key={weekStart} className="space-y-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Week of {new Date(weekStart).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h2>
                {/* Day Sections */}
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
                      {/* Event Cards Grid */}
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {events.map((item: any) => (
                          // Individual Event Card
                          <li key={item.id} className="group bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative min-h-[320px] border border-gray-700/50 hover:border-blue-500/30 flex flex-col overflow-hidden">
                            {/* Event Header Image */}
                            {item.full_header_image_url && (
                              <div className="h-32 w-full bg-black">
                                <img 
                                  src={item.full_header_image_url} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            {/* Event Details */}
                            <div className="flex flex-col flex-grow p-6">
                              {/* Date and Time */}
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
                              {/* Event Title */}
                              <div className="h-[3.5rem] mb-4 flex items-center">
                                <p className="font-semibold text-gray-200 text-sm line-clamp-2">{item.name}</p>
                              </div>
                              {/* Store Information */}
                              <div className="mt-auto pb-16">
                                {item.store && (
                                  <div className="border-t border-gray-700/50 pt-4">
                                    <p className="font-semibold text-gray-200 text-sm mb-4">{item.store.name}</p>
                                    <p className="text-gray-400 text-sm">{item.store.full_address}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Action Button */}
                            <a 
                              href={`${activeTab === 'riftbound' ? RIFTBOUND_EVENTS_URL : LORCANA_EVENTS_URL}${item.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-6 left-6 right-6 text-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-blue-500/20"
                            >
                              {formatCost(item.cost_in_cents)}
                            </a>
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
  )
}

export default Page;