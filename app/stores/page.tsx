'use client';

import { useState, useEffect } from 'react';
import { Store, Event } from '@/src/types';

import { getGoogleMapsUrl } from '@/src/utils/url';
import { ensureHttps } from '@/src/utils/utils';
import { getWebsite } from '@/src/utils/stores';

import { useHeader } from '@/src/hooks/useHeader';
import { useStores } from '@/src/hooks/useStores';
import { useEventsForStore } from '@/src/hooks/useEventsForStore';

import Header from '@/src/components/Header';
import Spinner from '@/src/components/Spinner';
import EventCard from '@/src/components/EventCard';
import './page.scss';

const Events = () => {
  const { activeTab, latitude, longitude, eventDistance, storeNameFilter } = useHeader();
  const { data = [], isLoading: loading, error } = useStores(latitude, longitude, eventDistance, activeTab);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeData, setStoreData] = useState<Store | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const {
    data: storeEventsData,
    isLoading: storeEventsLoading,
    error: storeEventsError
  } = useEventsForStore(selectedStore ? selectedStore.id : null, activeTab);

  const filteredData = data.filter((event: Store) =>
    event.name.toLowerCase().includes(storeNameFilter.toLowerCase())
  );

  const handleStoreSelect = (store: Store | null) => {
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
    <div className="stores-page-container">
      <div className="stores-sticky-header">
        <Header type="stores" />
      </div>

      <div className={`stores-list-container ${selectedStore ? 'hidden' : ''}`}>
        {loading && (
          <div className="loading-container">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error.message}</p>
          </div>
        )}

        <div className="stores-grid">
          {filteredData.map((store: Store) => {
            const websiteUrl = ensureHttps(getWebsite(store.id, activeTab) || store.website);
            return (
              <div
                id="store-card"
                key={store.id}
                className="store-card"
                onClick={() => handleStoreSelect(store)}
              >
                <div className="store-card-content">
                  <h2>{store.name}</h2>
                  <p>{store.full_address}</p>
                </div>

                <div className="store-actions">
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button-web"
                      onClick={(e) => e.stopPropagation()}
                      title="Visit Website"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                  <a
                    id="store-map"
                    href={getGoogleMapsUrl(store)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-button-map"
                    onClick={(e) => e.stopPropagation()}
                    title="View on Maps"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
          <div id="selected-store" className="selected-store-container">
            <div
              id="store-details"
              className="store-details-header"
              style={{ top: `${headerHeight}px` }}
            >
              <div className="store-details-inner">
                <div className="details-content">
                  {getWebsite(selectedStore.id, activeTab) || selectedStore.website ? (
                    <a
                      href={ensureHttps(getWebsite(selectedStore.id, activeTab) || selectedStore.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-name-link"
                    >
                      {selectedStore.name}
                    </a>
                  ) : (
                    <span className="store-name-span">
                      {selectedStore.name}
                    </span>
                  )}
                  <a
                    href={getGoogleMapsUrl(selectedStore)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-map-link group/maps"
                  >
                    <span className="icon">
                      📍
                    </span>
                    <span className="address">{selectedStore.full_address}</span>
                  </a>
                </div>
                <button
                  onClick={() => handleStoreSelect(null)}
                  className="close-button"
                  aria-label="Close"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="store-events-container">
              {storeEventsLoading && (
                <div className="loading-container">
                  <Spinner />
                </div>
              )}

              {storeEventsError && (
                <div className="error-container">
                  <p>{storeEventsError.message}</p>
                </div>
              )}

              {storeEventsData && storeEventsData.length > 0 && !storeEventsLoading && !storeEventsError && (
                <div className="store-events-grid">
                  {storeEventsData.map((event: Event) => (
                    <EventCard event={event} activeTab={activeTab} key={event.id} minimized />
                  ))}
                </div>
              )}

              {storeEventsData && storeEventsData.length === 0 && !storeEventsLoading && !storeEventsError && (
                <div className="no-events-container">
                  <p>No events found for this store.</p>
                </div>
              )}
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Events;