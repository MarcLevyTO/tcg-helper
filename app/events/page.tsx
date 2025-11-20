'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useEvents } from '@/src/hooks/useEvents';
import { groupEventsByWeekByDay } from '@/src/shared/utils';

import EventCard from './EventCard';
import Spinner from '@/src/components/Spinner';
import LocationIcon from '@/src/icons/location.svg';

const DEFAULT_LOCATION = {
  latitude: "43.7418",
  longitude: "-79.5734",
};

const Events = () => {
  const [activeTab, setActiveTab] = useState<'riftbound' | 'lorcana'>('riftbound');
  const [userLocation, setUserLocation] = useState<{ latitude: string; longitude: string }>(DEFAULT_LOCATION);
  const { data = [], isLoading: loading, error } = useEvents(userLocation.latitude, userLocation.longitude, activeTab);
  
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
        setUserLocation({
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

  return (
    <div className="min-w-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
          <p className="font-medium">{notificationMessage}</p>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col space-y-4 flex-grow">
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
            <button
              onClick={handleGetLocation}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Image src={LocationIcon} alt="Location" width={30} height={30} className="brightness-0 invert" />
            </button>
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
            <p className="text-center text-red-400">{error.message}</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-12">
            {groupEventsByWeekByDay(data, userLocation?.latitude, userLocation?.longitude).map(([weekStart, daysInWeek]) => (
              <div key={weekStart} className="space-y-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Week of {new Date(weekStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
                </h2>
                <div className="space-y-8">
                  { daysInWeek.map(([dayStart, events]: [string, any[]]) => (
                    <div key={dayStart} className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-200 px-2">
                        {new Date(dayStart).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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