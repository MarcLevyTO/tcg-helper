'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useEvent } from '@/src/hooks/useEvent';
import { useMatches } from '@/src/hooks/useMatches';

import Spinner from '@/src/components/Spinner';

const EventPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading: loading, error } = useEvent(slug);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!data) return;

    let lastRound = data.rounds.find((round: any) => round.status === 'IN_PROGRESS');
    if (!lastRound) {
      lastRound = data.rounds[data.rounds.length - 1];
    }

    setCurrentRound(lastRound);
  }, [data]);

  const { data: matchesData, isLoading: matchesLoading, error: matchesError } = useMatches(currentRound?.id);

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
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl flex flex-col">
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
                          className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/5 active:scale-95 text-gray-300 hover:text-white"
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
                          className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700/50 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/5 active:scale-95 text-gray-300 hover:text-white"
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
            </div>

            {matchesData && matchesData.length > 0 && (
              <div className="mt-8 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm backdrop-blur-sm transition-all duration-300"
                    placeholder="Filter by user"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              {matchesData && matchesData.length > 0 && (
                <div className="flex flex-col gap-3">
                  {matchesData.filter((match: any) => {
                    if (!searchTerm) return true;
                    const term = searchTerm.toLowerCase();
                    const player1 = match.players[0];
                    const player2 = match.players[1];

                    return (
                      player1.name.toLowerCase().includes(term) ||
                      (player1.userName && player1.userName.toLowerCase().includes(term)) ||
                      (player2 && player2.name.toLowerCase().includes(term)) ||
                      (player2 && player2.userName && player2.userName.toLowerCase().includes(term))
                    );
                  }).map((match: any) => {
                    const player1 = match.players[0];
                    const player2 = match.players[1];
                    const isDraw = match.match_is_intentional_draw || (!match.winning_player && !match.match_is_bye);

                    if (match.match_is_bye) {
                      return (
                        <div
                          key={match.id}
                          className="bg-green-800/30 backdrop-blur-sm rounded-xl border border-green-700/30 p-0 overflow-hidden hover:bg-green-800/50 hover:border-green-500/30 transition-all duration-300 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-0 md:gap-6 group text-center"
                        >
                          {/* Mobile Bye Header */}
                          <div className="md:hidden bg-green-900/40 border-b border-green-700/40 py-1 px-3 flex justify-center items-center">
                            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">BYE</span>
                          </div>

                          {/* Desktop Badge */}
                          <div className="hidden md:flex flex-shrink-0 pl-4 items-center">
                            <span className="px-3 py-1 rounded-md text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wide">
                              BYE
                            </span>
                          </div>

                          {/* Player Info */}
                          <div className="flex-1 flex items-center justify-center md:justify-center gap-1 min-w-0 p-2 md:p-4">
                            <span className="text-gray-300 font-medium text-base md:text-lg group-hover:text-white transition-colors truncate">
                              {player1.name}
                            </span>
                            {player1.userName && (
                              <span className="text-xs md:text-sm text-gray-500 font-medium truncate">(@{player1.userName})</span>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={match.id}
                        className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/40 p-0 hover:bg-gray-800/60 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md group relative overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row md:items-stretch">
                          {/* Mobile Table Header - NEW */}
                          <div className="md:hidden bg-gray-900/40 border-b border-gray-700/40 py-1 px-3 flex justify-center items-center">
                            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Table {match.table_number}</span>
                          </div>

                          {/* Table Number Section */}
                          <div className="hidden md:flex flex-col items-center justify-center min-w-[80px] bg-gray-900/30 border-r border-gray-700/30 p-4">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Table</span>
                            <span className="text-2xl font-bold text-gray-300 font-mono">{match.table_number}</span>
                          </div>

                          {/* Players & Status Container */}
                          <div className="flex-1 p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center">

                            {/* Match Content Grid */}
                            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 items-stretch">

                              {/* Player 1 (Left Aligned) */}
                              <div className={`p-2 md:p-4 rounded-lg border transition-all duration-300 md:border md:flex md:flex-col md:justify-center ${match.winning_player === player1.id
                                ? 'bg-green-900/20 border-green-500/30 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]'
                                : (match.winning_player && match.winning_player !== player1.id)
                                  ? 'bg-red-900/10 border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]'
                                  : isDraw
                                    ? 'bg-gray-800/40 border-gray-600/30'
                                    : 'bg-gray-900/20 border-white/5'
                                }`}>
                                <div className="flex flex-col md:items-start min-w-0">
                                  <div className="flex flex-col md:flex-row items-start md:items-baseline gap-0 md:gap-2">
                                    <span className={`font-semibold text-sm md:text-lg truncate max-w-[80px] md:max-w-none transition-colors ${match.winning_player === player1.id
                                      ? 'text-green-400'
                                      : (match.winning_player && match.winning_player !== player1.id)
                                        ? 'text-red-400'
                                        : isDraw
                                          ? 'text-gray-300'
                                          : 'text-gray-200 group-hover:text-white'
                                      }`}>
                                      {player1.name}
                                    </span>
                                    {player1.userName && (
                                      <span className={`text-[10px] md:text-xs font-medium transition-colors ${match.winning_player === player1.id
                                        ? 'text-green-500/70'
                                        : (match.winning_player && match.winning_player !== player1.id)
                                          ? 'text-red-500/70'
                                          : isDraw
                                            ? 'text-gray-500'
                                            : 'text-gray-500 group-hover:text-gray-400'
                                        }`}>@{player1.userName}</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* VS / Score - Center */}
                              <div className="flex items-center justify-center py-0">
                                {match.games_won_by_winner !== undefined && !match.match_is_bye && !isDraw ? (
                                  <div className="bg-gray-950/80 px-2 md:px-5 py-1 md:py-2 rounded-xl border border-gray-700/50 flex gap-2 md:gap-4 font-mono font-bold text-lg md:text-2xl shadow-inner relative overflow-hidden group/score">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                    <span className={match.winning_player === player1.id ? 'text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.4)]' : 'text-red-400 opacity-60'}>
                                      {match.winning_player === player1.id ? match.games_won_by_winner : match.games_won_by_loser}
                                    </span>
                                    <span className="text-gray-600 opacity-50">:</span>
                                    <span className={match.winning_player === player2?.id ? 'text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.4)]' : 'text-red-400 opacity-60'}>
                                      {match.winning_player === player2?.id ? match.games_won_by_winner : match.games_won_by_loser}
                                    </span>
                                  </div>
                                ) : isDraw ? (
                                  <div className="bg-gray-800/80 px-2 md:px-4 py-1 md:py-1.5 rounded-lg border border-gray-600/30 font-bold text-gray-400 text-xs md:text-sm tracking-wide">
                                    DRAW
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800/80 border border-gray-700/80 flex items-center justify-center shadow-lg">
                                    <span className="text-gray-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">vs</span>
                                  </div>
                                )}
                              </div>

                              {/* Player 2 (Right Aligned) */}
                              <div className={`p-2 md:p-4 rounded-lg border transition-all duration-300 md:border md:flex md:flex-col md:justify-center ${player2 && match.winning_player === player2.id
                                ? 'bg-green-900/20 border-green-500/30 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]'
                                : player2 && (match.winning_player && match.winning_player !== player2.id)
                                  ? 'bg-red-900/10 border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]'
                                  : isDraw
                                    ? 'bg-gray-800/40 border-gray-600/30'
                                    : 'bg-gray-900/20 border-white/5'
                                }`}>
                                <div className="flex flex-col md:items-end min-w-0">
                                  {player2 ? (
                                    <div className="flex flex-col md:flex-row items-end md:items-baseline md:justify-end gap-0 md:gap-2">
                                      <span className={`font-semibold text-sm md:text-lg truncate max-w-[80px] md:max-w-none transition-colors ${match.winning_player === player2.id
                                        ? 'text-green-400'
                                        : (match.winning_player && match.winning_player !== player2.id)
                                          ? 'text-red-400'
                                          : isDraw
                                            ? 'text-gray-300'
                                            : 'text-gray-200 group-hover:text-white'
                                        }`}>
                                        {player2.name}
                                      </span>
                                      {player2.userName && (
                                        <span className={`text-[10px] md:text-xs font-medium transition-colors ${match.winning_player === player2.id
                                          ? 'text-green-500/70'
                                          : (match.winning_player && match.winning_player !== player2.id)
                                            ? 'text-red-500/70'
                                            : isDraw
                                              ? 'text-gray-500'
                                              : 'text-gray-500 group-hover:text-gray-400'
                                          }`}>@{player2.userName}</span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="font-medium text-gray-500 text-sm md:text-lg italic">
                                      - Bye -
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {matchesData && matchesData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mt-4 animate-pulse font-medium">No matches found.</p>
                </div>
              )}

              {matchesLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner />
                  <p className="text-gray-500 mt-4 animate-pulse font-medium">Loading matches...</p>
                </div>
              )}

              {matchesError && (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-red-950/20 rounded-xl border border-red-500/20 text-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-red-400 font-semibold mb-1">Failed to Load Matches</h3>
                  <p className="text-red-300/70 text-sm max-w-sm">
                    {matchesError instanceof Error ? matchesError.message : "We couldn't load the matches for this round. Please try again."}
                  </p>
                </div>
              )}

            </div>
          </div>
        )
        }
      </div >
    </div >
  )
}

export default EventPage;