'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useEvent } from '@/src/hooks/useEvent';
import { getEventUrl } from '@/src/shared/utils';
import Matches from '@/app/event/[slug]/matches';
import Standings from '@/app/event/[slug]/standings';
import Spinner from '@/src/components/Spinner';

const EventPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading: loading, error } = useEvent(slug);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentTab, setCurrentTab] = useState('matches');

  useEffect(() => {
    if (!data) return;

    let lastRound = data.rounds.find((round: any) => round.status === 'IN_PROGRESS');
    if (!lastRound) {
      lastRound = data.rounds[data.rounds.length - 1];
    }

    setCurrentRound(lastRound);
  }, [data]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col min-h-screen">

      <div className="container mx-auto px-2 md:px-4 flex-grow py-6 md:py-8">
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Event</h3>
            <p className="text-red-300">{error.message}</p>
          </div>
        )}

        {data && (
          <div className="space-y-8 animate-fade-in">
            {/* Event Header & Round Navigation Combined */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl flex flex-col mb-[15px]">
              <div className="flex flex-col md:flex-row">
                {data.full_header_image_url && (
                  <div className="hidden md:block w-full md:w-1/2 relative bg-black/20">
                    <img
                      src={data.full_header_image_url}
                      alt={data.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="p-4 md:p-6 flex flex-col justify-center flex-1 items-center md:items-start text-center md:text-left">
                  <h1 className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2 drop-shadow-md">
                    {data.name}
                  </h1>
                  <p className="text-blue-400 font-medium flex items-center gap-2 text-sm md:text-base">
                    {new Date(data.start_datetime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    {data.store_name}
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    {data.full_address}
                  </p>
                  <a
                    href={getEventUrl(data.id, 'riftbound')}
                    className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md border border-blue-500/50 transition-all duration-300 hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:cursor-pointer"
                  >
                    Go to Carde.IO Page
                  </a>
                </div>
              </div>

              {/* Round Navigation Integrated */}
              {data.rounds && data.rounds.length > 0 && (
                <div className="bg-gray-800/30 p-3 border-t border-gray-700/50">
                  {(() => {
                    const currentRoundIndex = data.rounds.findIndex(
                      (round: any) => round.id === currentRound?.id
                    );

                    const canGoToPreviousRound = currentRoundIndex > 0;
                    const canGoToNextRound = currentRoundIndex < data.rounds.length - 1;

                    const goToPreviousRound = () => {
                      if (canGoToPreviousRound) {
                        setCurrentRound(data.rounds[currentRoundIndex - 1]);
                      }
                    };

                    const goToNextRound = () => {
                      if (canGoToNextRound) {
                        setCurrentRound(data.rounds[currentRoundIndex + 1]);
                      }
                    };

                    return (
                      <div className="flex justify-between items-center gap-4">
                        <button
                          onClick={goToPreviousRound}
                          disabled={!canGoToPreviousRound}
                          className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/5 active:scale-95 text-gray-300 hover:text-white cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          <span className="text-sm font-semibold tracking-wide hidden md:inline">PREVIOUS</span>
                        </button>

                        <div className="flex flex-col items-center">
                          <h2 className="text-xl md:text-2xl font-bold text-white text-center flex items-center gap-2">
                            <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-lg border border-blue-500/20 font-mono tracking-tight shadow-inner">
                              {currentRound ? `ROUND ${currentRound.round_number}` : 'No Details'}
                            </span>
                          </h2>
                        </div>

                        <button
                          onClick={goToNextRound}
                          disabled={!canGoToNextRound}
                          className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/5 active:scale-95 text-gray-300 hover:text-white cursor-pointer"
                        >
                          <span className="text-sm font-semibold tracking-wide hidden md:inline">NEXT</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Search Filter */}
              <div className="bg-gray-800/30 p-3 border-t border-gray-700/50">
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full px-3 py-2 pr-10 border border-gray-700 rounded-lg leading-5 bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm backdrop-blur-sm transition-all duration-300"
                    placeholder="Filter by user"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700/50 transition-colors duration-200 text-gray-400 hover:text-gray-200 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div id="tabs" className="flex flex-col gap-4">
              {/* Tab Navigation */}
              <div className="flex gap-2 bg-gray-800/30 p-2 rounded-lg border border-gray-700/50">
                <button
                  onClick={() => setCurrentTab('matches')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 cursor-pointer ${currentTab === 'matches'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50 hover:text-gray-300'
                    }`}
                >
                  Matches
                </button>
                <button
                  onClick={() => setCurrentTab('standings')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 cursor-pointer ${currentTab === 'standings'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50 hover:text-gray-300'
                    }`}
                >
                  Standings
                </button>
              </div>

              {/* Tab Content */}
              {currentTab === 'matches' && (
                <Matches round={currentRound} searchTerm={searchTerm} />
              )}
              {currentTab === 'standings' && (
                <Standings round={currentRound} searchTerm={searchTerm} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventPage;