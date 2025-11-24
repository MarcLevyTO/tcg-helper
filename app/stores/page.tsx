'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '@/src/components/Spinner';
import { generateICS, groupEventsByWeek, getStoreLink } from '@/src/shared/utils';
import { stores } from '@/src/shared/stores';

const page = () => {
  const [storeData, setStoreData] = useState<{ id: number; name: string; full_address: string; riftboundEvents?: any[]; lorcanaEvents?: any[] }[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allData = await Promise.all(
          stores.map(async (store) => {
            const riftboundUrl = getStoreLink('riftbound', store.id);
            const lorcanaUrl = getStoreLink('lorcana', store.id);

            const [riftboundResponse, lorcanaResponse] = await Promise.all([
              axios.get(riftboundUrl),
              axios.get(lorcanaUrl),
            ]);

            return {
              ...store,
              riftboundEvents: riftboundResponse.data?.results || [],
              lorcanaEvents: lorcanaResponse.data?.results || [],
            };
          })
        );
        setStoreData(allData);
      } catch (error) {
        setError('Failed to fetch store data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  const openModal = (store: any) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStore(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-w-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="sticky top-0 z-10 bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              TCG Store Locations
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 min-h-screen">
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

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {storeData.map((store) => (
              <div
                key={store.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 relative min-h-[150px] border border-gray-700/50 hover:border-blue-500/30 flex flex-col overflow-hidden"
                onClick={() => openModal(store)}
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

      {isModalOpen && selectedStore && (
        <div
          className="fixed inset-0 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-gray-800 text-gray-200 rounded-lg shadow-2xl w-10/12 md:w-3/4 lg:w-2/3 xl:w-1/2 relative max-h-[700px] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="sticky top-0 bg-gray-900 z-10 border-b border-gray-700 w-full">
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  {selectedStore.name}
                </h2>
                <p className="mb-4 text-gray-400 text-sm">{selectedStore.full_address}</p>
              </div>
            </div>
            <ul className="pl-4 pr-4 space-y-6 mt-8 mb-8">
              {Object.entries(groupEventsByWeek([...(selectedStore.riftboundEvents || []), ...(selectedStore.lorcanaEvents || [])]
                .sort((a, b) => {
                  const dateA = new Date(a.start_datetime);
                  const dateB = new Date(b.start_datetime);
                  return dateA.getTime() - dateB.getTime();
                })))
                .map(([week, events], index) => (
                  <li key={index} className="list-none">
                    <h4 className="text-lg font-bold text-gray-300 mb-4">
                      Week of {new Date(week).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h4>
                    <ul className="space-y-4">
                      {events.map((event, eventIndex) => (
                        <li
                          key={eventIndex}
                          className={`list-none p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer relative ${
                            event.game_type === 'RIFTBOUND' ? 'bg-red-500' : 'bg-purple-500'
                          }`}
                        >
                          <div className="flex flex-col pr-16">
                            <span className="block font-semibold text-sm text-blue-100">
                              {new Date(event.start_datetime).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                              })}
                            </span>
                            <span className="block text-white text-base mt-2">{event.name}</span>
                          </div>
                          <a
                            href={generateICS(event)}
                            download={`${event.name}.ics`}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-4 top-1/2 -translate-y-1/2 py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-medium rounded-md transition-all shadow-lg shadow-blue-500/20"
                            title="Add to Calendar"
                          >
                            📅
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;