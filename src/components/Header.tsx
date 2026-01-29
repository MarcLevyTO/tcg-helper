'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

import { useHeader } from '@/src/hooks/useHeader';
import { useNotifications } from '@/src/hooks/useNotifications';
import { createStorageAccessor } from "@/src/utils/storage";
import LocationIcon from '@/src/icons/location.svg';
import './Header.scss';

const Header = ({ type, showPastEventsTab, showCalendar, setShowCalendar }: {
  type: 'events' | 'stores';
  showPastEventsTab?: boolean;
  showCalendar?: boolean;
  setShowCalendar?: (show: boolean) => void;
}) => {
  const {
    showNotification,
    notificationMessage,
    saveShowNotification,
    saveNotificationMessage,
  } = useNotifications();

  const {
    activeTab,
    eventNameFilter,
    storeNameFilter,
    eventDistance,
    showPastEvents,
    saveEventDistance,
    saveActiveTab,
    saveEventNameFilter,
    saveStoreNameFilter,
    saveLocation,
    saveShowPastEvents,
  } = useHeader();

  const [localFilter, setLocalFilter] = useState(type === 'events' ? eventNameFilter : storeNameFilter);
  const [showEventsStyle, setShowEventsStyle] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  // Load showPastEvents from localStorage after hydration
  useEffect(() => {
    const [getShowPastEvents] = createStorageAccessor<boolean>('showPastEvents');
    const savedValue = getShowPastEvents();
    if (savedValue !== null && savedValue !== showPastEvents) {
      saveShowPastEvents(savedValue);
    }
    setShowEventsStyle(true);
  }, []);

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
      () => {
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
      if (type === 'events') {
        saveEventNameFilter(value);
      } else {
        saveStoreNameFilter(value);
      }
    }, 300);
  };

  const handleChangeTab = (tab: 'riftbound' | 'lorcana') => {
    setLocalFilter('');
    if (type === 'events') {
      saveEventNameFilter('');
    } else {
      saveStoreNameFilter('');
    }
    saveActiveTab(tab);
  };

  return (
    <div>
      {showNotification && (
        <div className="notification-banner">
          <p>{notificationMessage}</p>
        </div>
      )}

      <div id="header" className="header-container">
        <div className="header-inner">
          <div className="header-top">
            <div className="tabs-container">
              <div className="tabs-list">
                {(['riftbound', 'lorcana'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleChangeTab(tab)}
                    className={`tab-button ${activeTab === tab
                      ? 'active-red'
                      : 'inactive'
                      }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
                <div className="flex-grow" />
                <button
                  key="events"
                  onClick={() => {
                    if (!window.location.href.includes('/events')) {
                      window.location.href = '/events';
                    } else {
                      saveShowPastEvents(false);
                    }
                  }}
                  className={`tab-button ${(showEventsStyle && type === 'events' && !showPastEvents)
                    ? 'active-blue'
                    : 'inactive'
                    }`}
                >
                  EVENTS
                </button>
                {showPastEventsTab && (
                  <button
                    key="past-events"
                    onClick={() => saveShowPastEvents(true)}
                    className={`tab-button ${showEventsStyle && showPastEvents
                      ? 'active-blue'
                      : 'inactive'
                      }`}
                  >
                    PAST EVENTS
                  </button>
                )}
                <a
                  key="stores"
                  href="/stores"
                  className={`tab-button ${type === 'stores'
                    ? 'active-blue'
                    : 'inactive'
                    }`}
                >
                  STORES
                </a>
              </div>
            </div>
          </div>

          <div className="controls-container">
            <div className="search-container">
              <input
                type="text"
                placeholder={type === 'events' ? 'Filter by event or store name...' : 'Filter by store name...'}
                value={localFilter}
                onChange={handleInputChange}
                className="search-input"
              />
              {localFilter && (
                <button
                  onClick={() => {
                    setLocalFilter('');
                    if (type === 'events') {
                      saveEventNameFilter('');
                    } else {
                      saveStoreNameFilter('');
                    }
                  }}
                  className="clear-button"
                  aria-label="Clear filter"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="actions-container">
              <div className="distance-select-wrapper">
                <select
                  value={eventDistance}
                  onChange={(e) => saveEventDistance(e.target.value)}
                >
                  <option value="15">15 miles</option>
                  <option value="20">20 miles</option>
                  <option value="25">25 miles</option>
                  <option value="30">30 miles</option>
                  <option value="40">40 miles</option>
                </select>
                <svg
                  className="select-icon"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button
                onClick={handleGetLocation}
                className="location-button"
                title="Set Location"
              >
                <Image
                  src={LocationIcon}
                  alt="Location"
                  width={20}
                  height={20}
                  className="location-icon-img"
                />
              </button>
              {type === 'events' && setShowCalendar && (
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="location-button view-mode-btn"
                  title={showCalendar ? 'Show List' : 'Show Calendar'}
                >
                  {showCalendar ? (
                    // List Icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  ) : (
                    // Calendar Icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;