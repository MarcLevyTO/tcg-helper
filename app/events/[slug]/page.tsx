'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useEvent } from '@/src/hooks/useEvent';
import { getEventUrl } from '@/src/utils/url';
import Matches from '@/app/events/[slug]/matches';
import Standings from '@/app/events/[slug]/standings';
import Spinner from '@/src/components/Spinner';
import './page.scss';

const EventPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading: loading, error } = useEvent(slug);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('matches');

  useEffect(() => {
    if (!data) return;
    document.title = `Event ${data.id} - MarcLevyTO.com`;
    let lastRound = data.rounds.find((round: any) => round.status === 'IN_PROGRESS');
    if (!lastRound) {
      lastRound = data.rounds[data.rounds.length - 1];
    }
    setCurrentRound(lastRound);
  }, [data]);

  return (
    <div className="event-detail-container">

      <div className="event-content-wrapper">
        {/* Back to Events Button */}
        <a
          href="/events"
          className="back-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Back to Events</span>
        </a>

        {loading && (
          <div className="loading-container">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="error-container">
            <h3>Error Loading Event</h3>
            <p>{error.message}</p>
          </div>
        )}

        {data && (
          <div className="space-y-8 fade-in">
            {/* Event Header & Round Navigation Combined */}
            <div className="event-header-card">
              <div className="header-content-wrapper">
                {data.full_header_image_url && (
                  <div className="header-image">
                    <img
                      src={data.full_header_image_url}
                      alt={data.name}
                    />
                  </div>
                )}

                <div className="header-info">
                  <h1>
                    {data.name}
                  </h1>
                  <p className="date-text">
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
                  <p className="info-subtext">
                    {data.store_name}
                  </p>
                  <p className="info-subtext">
                    {data.full_address}
                  </p>
                  <div className="actions">
                    <a
                      href={getEventUrl(data.id, data.game_type.toLowerCase())}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="carde-link"
                    >
                      <span>View on Carde.IO</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Round Navigation Integrated */}
              {data.rounds && data.rounds.length > 0 && (
                <div className="round-nav-container">
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
                      <div className="nav-inner">
                        <button
                          onClick={goToPreviousRound}
                          disabled={!canGoToPreviousRound}
                          className="nav-button prev-button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          <span>PREVIOUS</span>
                        </button>

                        <div className="flex flex-col items-center">
                          <h2 className="round-title">
                            <span className="round-badge">
                              {currentRound ? `ROUND ${currentRound.round_number}` : 'No Details'}
                            </span>
                          </h2>
                        </div>

                        <button
                          onClick={goToNextRound}
                          disabled={!canGoToNextRound}
                          className="nav-button next-button"
                        >
                          <span>NEXT</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Search Filter */}
              <div className="search-filter-container">
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Filter by user"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="clear-button"
                      aria-label="Clear search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div id="tabs" className="flex flex-col gap-4">
              {/* Tab Navigation */}
              <div className="tabs-nav-container">
                <button
                  onClick={() => setCurrentTab('matches')}
                  className={`tab-button ${currentTab === 'matches'
                    ? 'active'
                    : 'inactive'
                    }`}
                >
                  Matches
                </button>
                <button
                  onClick={() => setCurrentTab('standings')}
                  className={`tab-button ${currentTab === 'standings'
                    ? 'active'
                    : 'inactive'
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