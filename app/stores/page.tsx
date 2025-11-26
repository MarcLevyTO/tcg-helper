'use client';

import { useState, useEffect } from 'react';

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
    }
    setSelectedStore(store);
    setStoreData(store);
  };

  useEffect(() => {
    if (!selectedStore && scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [selectedStore, scrollPosition]);

  return (
    <div className="min-w-[450px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col min-h-screen">
      <div className="sticky top-0 z-10">
        <Header type="stores" />
      </div>
      
      <div className={`container mx-auto px-4 flex-grow ${selectedStore ? 'hidden' : ''}`}>
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

        {filteredData && !loading && !error && (
          <div className="grid grid-cols-1 gap-6 mt-5">
            {filteredData.map((store: any) => (
              <div 
                key={store.id} 
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative min-h-[150px] border border-gray-700/50 hover:border-blue-500/30 flex flex-col overflow-hidden cursor-pointer"
                onClick={() => handleStoreSelect(store)}
              >
                <div className="flex flex-col flex-grow p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-200">{store.name}</h2>
                  <p className="text-sm text-gray-400">{store.full_address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStore && storeData && (
        <div id="selected-store" className="flex-grow">
          <div id="store-details" className="sticky top-[158px] z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-[10px] pb-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div>
                {getWebsite(selectedStore.id, activeTab) || selectedStore.website ? (
                  <a 
                    href={ensureHttps(getWebsite(selectedStore.id, activeTab) || selectedStore.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-3xl font-semibold mb-2 text-gray-200 hover:text-blue-400 hover:underline transition-colors cursor-pointer"
                  >
                    {selectedStore.name}
                  </a>
                ) : (
                  <span className="text-3xl font-semibold mb-2 text-gray-200">
                    {selectedStore.name}
                  </span>
                )}
                <a
                  href={getGoogleMapsUrl(selectedStore)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-gray-400 hover:text-blue-400 text-sm transition-colors group/maps mt-2"
                >
                  <span className="text-red-500 group-hover/maps:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                    📍
                  </span>
                  <span className="group-hover/maps:underline">{selectedStore.full_address}</span>
                </a>
              </div>
              <button
                onClick={() => handleStoreSelect(null)}
                className="text-gray-400 hover:text-white transition-colors p-2 cursor-pointer flex-shrink-0"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="container mx-auto px-4">
            {storeEventsLoading && (
              <div className="flex justify-center items-center min-h-[200px]">
                <Spinner />
              </div>
            )}

            {storeEventsError && (
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-6">
                <p className="text-center text-red-400">{storeEventsError.message}</p>
              </div>
            )}

            {storeEventsData && storeEventsData.length > 0 && !storeEventsLoading && !storeEventsError && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-5">
                {storeEventsData.map((event: any) => (
                  <EventCard event={event} activeTab={activeTab} key={event.id} minimized />
                ))}
              </div>
            )}

            {storeEventsData && storeEventsData.length === 0 && !storeEventsLoading && !storeEventsError && (
              <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-gray-400">No events found for this store.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;