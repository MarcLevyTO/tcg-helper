'use client';

import React, { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import Spinner from '../components/Spinner';

// Utility function to format today's date for API URLs
const getTodayFormatted = () => {
  const date = new Date();
  return date.toISOString().replace(/:/g, '%3A');
};

const TODAY = getTodayFormatted();

const getRiftboundStoreLink = (storeId: number) => {
  return `https://api.cloudflare.riftbound.uvsgames.com/hydraproxy/api/v2/events/?start_date_after=${TODAY}&display_status=upcoming&store_id=${storeId}&upcoming_only=true&game_slug=riftbound&page=1&page_size=1000`
}

const getLorcanaStoreLink = (storeId: number) => {
  return `https://api.cloudflare.ravensburgerplay.com/hydraproxy/api/v2/events/?start_date_after=${TODAY}&display_status=upcoming&store_id=${storeId}&upcoming_only=true&game_slug=disney-lorcana&page=1&page_size=1000`
}

const getRiftboundEventLink = (eventId: number) => {
  return `https://locator.riftbound.uvsgames.com/events/${eventId}/`
}

const getLorcanaEventLink = (eventId: number) => {
  return `https://tcg.ravensburgerplay.com/events/${eventId}/`
}

const stores = [
  {
    "id": 2503,
    "name": "Hope Club Collectibles",
    "full_address": "1530 Albion Rd, unit 52, Etobicoke, ON, M9V 5H4, CA"
  },
  {
    "id": 14538,
    "name": "Wandering Adventures",
    "full_address": "7766 Martin Grove Road, Woodbridge, ON, L4L 2C7, CA"
  },
  {
    "id": 3576,
    "name": "New Realm Games",
    "full_address": "30 Famous Avenue, Unit 141A, Vaughan, ON, L4L 9M3, CA"
  },
  {
    "id": 29,
    "name": "401 Games Vaughan",
    "full_address": "7700 Keele St, unit 6b, Vaughan, ON, L4K 2A1, CA"
  },
  {
    "id": 1986,
    "name": "Game Shack",
    "full_address": "39 Orfus Road, Toronto, ON, M6A 1L7, CA"
  },
  {
    "id": 1449,
    "name": "Emmett's ToyStop",
    "full_address": "5324 Dundas Street West, Toronto, ON, M9B 1B4, CA"
  },
  {
    "id": 16544,
    "name": "Cardboard Classics",
    "full_address": "31 Disera Dr, 100-31 Disera Drive, Thornhill ON, L4J0A7  , Vaughan, ON, L4J 0A7, CA"
  },
  {
    "id": 13786,
    "name": "Gotham Central Comics & Collectibles",
    "full_address": "unit 1, 1400, Aimco Blvd, Mississauga, ON, L4W 1B2, CA"
  },
  {
    "id": 834,
    "name": "Claw Me Baby Games",
    "full_address": "5580 Yonge Street, North York, ON, M2N 5S2, CA"
  },
  {
    "id": 2358,
    "name": "Hairy Tarantula",
    "full_address": "3456 Yonge Street, Toronto, ON, M4N 2N4, CA"
  },
  {
    "id": 5227,
    "name": "Untouchables Sports Cards and Gaming",
    "full_address": "377 Burnhamthorpe Road East, Mississauga, ON, L5A 3Y1, CA"
  },
  {
    "id": 2743,
    "name": "KanZenGames Sports & Collectibles",
    "full_address": "7070 Saint Barbara Boulevard, Unit 60-62, Mississauga, ON, L5W 0E6, CA"
  },
  {
    "id": 3004,
    "name": "Legendary Collectables",
    "full_address": "800 Dundas Street East, Unit G, Mississauga, ON, L4Y2B6, CA"
  },
  {
    "id": 17734,
    "name": "A & C Games",
    "full_address": "452, Spadina Ave., Toronto, ON, M5T 2G8, CA"
  },
  {
    "id": 185,
    "name": "Anime Alley",
    "full_address": "667 Yonge Street, Upper, Toronto, ON, M4Y1Z9, CA"
  },
  {
    "id": 659,
    "name": "Cardboard Memories",
    "full_address": "230 Sandalwood Parkway East, Brampton, ON, L6Z 1N1, CA"
  },
  {
    "id": 16213,
    "name": "401 Games Downtown",
    "full_address": "431 Yonge St, Toronto, ON M5B 1T3, Canada"
  },
  {
    "id": 2417,
    "name": "Heroes World",
    "full_address": "9078 Leslie St, Richmond Hill, ON, L4B 3L8, CA"
  },
  {
    "id": 1536,
    "name": "Face to Face Games",
    "full_address": "1398 Danforth Avenue, Old Toronto, ON, M4J 1M9, CA"
  },
  {
    "id": 1146,
    "name": "Derpy Cards",
    "full_address": "636 Edward Avenue, Unit #4, Richmond Hill, ON, L4C0V4, CA"
  },
  {
    "id": 13900,
    "name": "Manta Trading",
    "full_address": "7170 Warden Avenue, Markham, ON, L3R 8B4, CA"
  },    
];

const groupEventsByWeek = (events: any[]) => {
  const weeks: { [key: string]: any[] } = {};
  events.forEach((event) => {
    const eventDate = new Date(event.start_datetime);
    const monday = new Date(eventDate);
    monday.setDate(eventDate.getDate() - ((eventDate.getDay() + 6) % 7)); // Get the Monday of the week
    const weekKey = monday.toISOString().split('T')[0]; // Use Monday's date as the key
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(event);
  });
  return weeks;
};

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
            const riftboundUrl = getRiftboundStoreLink(store.id);
            const lorcanaUrl = getLorcanaStoreLink(store.id);

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

        console.log('Fetched store data:', allData);
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
                      Week of {new Date(week).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h4>
                    <ul className="space-y-4">
                      {events.map((event, eventIndex) => (
                        <li
                          key={eventIndex}
                          className={`list-none p-4 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all cursor-pointer ${
                            event.game_type === 'RIFTBOUND' ? 'bg-red-500' : 'bg-purple-500'
                          }`}
                          onClick={() => {
                            const eventLink =
                              event.game_type === 'RIFTBOUND'
                                ? getRiftboundEventLink(event.id)
                                : getLorcanaEventLink(event.id);
                            window.open(eventLink, '_blank');
                          }}
                        >
                          <div className="flex flex-col">
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