'use client';

import { useState, useEffect, useRef } from 'react';

import { getGoogleMapsUrl, ensureHttps } from '@/src/shared/utils';
import { getWebsite } from '@/src/shared/stores';

import { useHeader } from '@/src/hooks/useHeader';
import { useStores } from '@/src/hooks/useStores';
import { useEventsForStore } from '@/src/hooks/useEventsForStore';

import Header from '@/src/components/Header';
import Spinner from '@/src/components/Spinner';
import EventCard from '@/src/components/EventCard';

const Events = () => {
  const { activeTab, latitude, longitude, eventDistance, storeNameFilter } = useHeader();
  const { data = [], isLoading: loading, error } = useStores(latitude, longitude, eventDistance, activeTab);

  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const {
    data: storeEventsData,
    isLoading: storeEventsLoading,
    error: storeEventsError
  } = useEventsForStore(selectedStore ? selectedStore.id : null, activeTab);

  const filteredData = data.filter((event: any) =>
    event.name.toLowerCase().includes(storeNameFilter.toLowerCase())
  );

  const handleStoreSelect = (store: any) => {
    if (store) {
      setScrollPosition(window.scrollY);
    } else {
      // Measure header height when closing
      const header = document.getElementById('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    }
    setSelectedStore(store);
    setStoreData(store);
  };

  useEffect(() => {
    if (!selectedStore && scrollPosition > 0) {
      // Use setTimeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  }, [selectedStore, scrollPosition]);

  useEffect(() => {
    // Measure header height on mount and resize
    const measureHeader = () => {
      const header = document.getElementById('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    measureHeader();
    window.addEventListener('resize', measureHeader);
    return () => window.removeEventListener('resize', measureHeader);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col min-h-screen">
      <div className="sticky top-0 z-10">
        <Header type="stores" />
      </div>

      <div className={`container mx-auto px-2 sm:px-4 flex-grow ${selectedStore ? 'hidden' : ''}`}>
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-6 mx-2">
            <p className="text-center text-red-400">{error.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-5">
          {filteredData.map((store: any) => {
            const websiteUrl = ensureHttps(getWebsite(store.id, activeTab) || store.website);
            return (
              <div
                id="store-card"
                key={store.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative min-h-[120px] sm:min-h-[150px] border border-gray-700/50 hover:border-blue-500/30 flex flex-row overflow-hidden cursor-pointer"
                onClick={() => handleStoreSelect(store)}
              >
                <div className="flex flex-col flex-grow p-4 sm:p-6">
                  <h2 className="text-lg sm:text-2xl font-semibold mb-2 text-gray-200 pr-2">{store.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-400">{store.full_address}</p>
                </div>

                <div className="flex flex-col justify-center items-center w-16 sm:w-20 border-l border-gray-700/50 bg-gray-900/20 gap-2">
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-700/50"
                      onClick={(e) => e.stopPropagation()}
                      title="Visit Website"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                  <a
                    id="store-map"
                    href={getGoogleMapsUrl(store)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-700/50"
                    onClick={(e) => e.stopPropagation()}
                    title="View on Maps"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {
        selectedStore && storeData && (
          <div id="selected-store" className="flex-grow">
            <div
              id="store-details"
              className="sticky z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-2 sm:pt-[10px] pb-3 sm:pb-4"
              style={{ top: `${headerHeight}px` }}
            >
              <div className="container mx-auto px-2 sm:px-4 flex justify-between items-start gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  {getWebsite(selectedStore.id, activeTab) || selectedStore.website ? (
                    <a
                      href={ensureHttps(getWebsite(selectedStore.id, activeTab) || selectedStore.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl sm:text-3xl font-semibold mb-2 text-gray-200 hover:text-blue-400 hover:underline transition-colors cursor-pointer block"
                    >
                      {selectedStore.name}
                    </a>
                  ) : (
                    <span className="text-xl sm:text-3xl font-semibold mb-2 text-gray-200 block">
                      {selectedStore.name}
                    </span>
                  )}
                  <a
                    href={getGoogleMapsUrl(selectedStore)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-gray-400 hover:text-blue-400 text-xs sm:text-sm transition-colors group/maps mt-2"
                  >
                    <span className="text-red-500 group-hover/maps:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                      📍
                    </span>
                    <span className="group-hover/maps:underline break-words">{selectedStore.full_address}</span>
                  </a>
                </div>
                <button
                  onClick={() => handleStoreSelect(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1 sm:p-2 cursor-pointer flex-shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="container mx-auto px-2 sm:px-4">
              {storeEventsLoading && (
                <div className="flex justify-center items-center min-h-[200px]">
                  <Spinner />
                </div>
              )}

              {storeEventsError && (
                <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-6 mx-2">
                  <p className="text-center text-red-400">{storeEventsError.message}</p>
                </div>
              )}

              {storeEventsData && storeEventsData.length > 0 && !storeEventsLoading && !storeEventsError && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 mt-5">
                  {storeEventsData.map((event: any) => (
                    <EventCard event={event} activeTab={activeTab} key={event.id} minimized />
                  ))}
                </div>
              )}

              {storeEventsData && storeEventsData.length === 0 && !storeEventsLoading && !storeEventsError && (
                <div className="flex justify-center items-center min-h-[200px]">
                  <p className="text-gray-400 text-sm sm:text-base">No events found for this store.</p>
                </div>
              )}
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Events;