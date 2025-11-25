import { useHeader } from "@/src/hooks/useHeader";
import { useNotifications } from "@/src/hooks/useNotifications";
import LocationIcon from '@/src/icons/location.svg';

import Image from 'next/image';
import { useRef, useState } from 'react';

const Header = () => {
  const { 
    showNotification,
    notificationMessage,
    saveShowNotification,
    saveNotificationMessage,
  } = useNotifications();

  const {
    activeTab,
    eventNameFilter,
    eventDistance,
    saveEventDistance,
    saveActiveTab,
    saveEventNameFilter,
    saveLocation,
  } = useHeader();

  const [localFilter, setLocalFilter] = useState(eventNameFilter);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      saveNotificationMessage('Geolocation is not supported by your browser');
      saveShowNotification(true);
      setTimeout(() => saveShowNotification(false), 3000);
      return;
    }

    saveShowNotification(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveLocation({
          latitude: position.coords.latitude.toFixed(4).toString(),
          longitude: position.coords.longitude.toFixed(4).toString(),
        });
        saveNotificationMessage('Using current location');
        setTimeout(() => saveShowNotification(false), 3000);
      },
      (error) => {
        saveNotificationMessage('Unable to retrieve your location');
        setTimeout(() => saveShowNotification(false), 3000);
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalFilter(value);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      saveEventNameFilter(value);
    }, 300);
  }

  return (
    <div>
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
          <p className="font-medium">{notificationMessage}</p>
        </div>
      )}

      <div id="header" className="z-10 bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col space-y-4 flex-grow">
              <div className="flex space-x-4 border-b border-gray-700">
                {(['riftbound', 'lorcana'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => saveActiveTab(tab)}
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
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Filter by event name..."
                value={localFilter}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 bg-gray-700 text-white border border-gray-600 rounded-lg font-medium transition-colors placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              {localFilter && (
                <button
                  onClick={() => {
                    setLocalFilter('');
                    saveEventNameFilter('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear filter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={eventDistance}
                onChange={(e) => saveEventDistance(e.target.value)}
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
    </div>
  )
}

export default Header;