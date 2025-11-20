'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useLocation } from '@/src/hooks/useLocation';
import { useEventDistance } from '@/src/hooks/useEventDistance';
import { useEvents } from '@/src/hooks/useEvents';
import { groupEventsByWeekByDay } from '@/src/shared/utils';

import EventCard from './EventCard';
import Spinner from '@/src/components/Spinner';
import LocationIcon from '@/src/icons/location.svg';

const Events = () => {
  const [activeTab, setActiveTab] = useState<'riftbound' | 'lorcana'>('riftbound');
  const [eventNameFilter, setEventNameFilter] = useState('');
  const { latitude, longitude, saveLocation } = useLocation();
  const { eventDistance, saveEventDistance } = useEventDistance();
  const [distance, setDistance] = useState(eventDistance || '15');
  const { data = [], isLoading: loading, error } = useEvents(latitude, longitude, distance, activeTab);
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setNotificationMessage('Geolocation is not supported by your browser');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    setShowNotification(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveLocation({
          latitude: position.coords.latitude.toFixed(4).toString(),
          longitude: position.coords.longitude.toFixed(4).toString(),
        });
        setNotificationMessage('Using current location');
        setTimeout(() => setShowNotification(false), 3000);
      },
      (error) => {
        setNotificationMessage('Unable to retrieve your location');
        setTimeout(() => setShowNotification(false), 3000);
      }
    );
  };

  const filteredData = data.filter((event: any) => 
    event.name.toLowerCase().includes(eventNameFilter.toLowerCase())
  );

  const setDistanceAndSave = (distance: string) => {
    setDistance(distance);
    saveEventDistance({ distance });
  };

  return (
    <div className="min-w-[450px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col min-h-screen">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
          <p className="font-medium">{notificationMessage}</p>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col space-y-4 flex-grow">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                TCG Event Locator
              </h1>
              <div className="flex space-x-4 border-b border-gray-700">
                {(['riftbound', 'lorcana'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
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
          
          <div className="mt-6 flex gap-4 items-center">
            <input
              type="text"
              placeholder="Filter by event name..."
              value={eventNameFilter}
              onChange={(e) => setEventNameFilter(e.target.value)}
              className="flex-grow px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg font-medium transition-colors placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <div className="relative">
              <select
                value={distance}
                onChange={(e) => setDistanceAndSave(e.target.value)}
                className="h-[50px] px-4 pr-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none rounded-lg font-semibold transition-all duration-300 cursor-pointer hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg appearance-none"
              >
                <option value="15" className="bg-gray-800 text-white">15 miles</option>
                <option value="20" className="bg-gray-800 text-white">20 miles</option>
                <option value="25" className="bg-gray-800 text-white">25 miles</option>
                <option value="30" className="bg-gray-800 text-white">30 miles</option>
                <option value="40" className="bg-gray-800 text-white">40 miles</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button
              onClick={handleGetLocation}
              className="h-[50px] px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Image src={LocationIcon} alt="Location" width={24} height={24} className="brightness-0 invert" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-grow">
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-6">
            <p className="text-center text-red-400">{error.message}</p>
          </div>
        )}

        {filteredData && !loading && (
          <div className="space-y-12 h-full -mx-4">
            {groupEventsByWeekByDay(filteredData, latitude, longitude).map(([weekStart, daysInWeek]) => (
              <div key={weekStart} className="space-y-8">
                <div className="space-y-8">
                  { daysInWeek.map(([dayStart, events]: [string, any[]]) => (
                    <div key={dayStart} className="space-y-4">
                      <h3 className="sticky top-[230px] z-[5] bg-gray-800 text-xl font-semibold text-gray-200 py-3 border-b border-gray-700/50 w-screen ml-[calc(-50vw+50%)] pl-[calc(50vw-50%+1rem)] text-center">
                        {new Date(dayStart).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 px-4">
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