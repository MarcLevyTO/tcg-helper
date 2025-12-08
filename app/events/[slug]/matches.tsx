import { useMatches } from '@/src/hooks/useMatches';
import Spinner from '@/src/components/Spinner';

const Matches = ({ round, searchTerm }: { round: any; searchTerm: string }) => {
  const { data, isLoading, error } = useMatches(round?.id);

  return (
    <div>
      {data && data.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.filter((match: any) => {
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

            const isDraw = match.match_is_intentional_draw || (match.winning_player === null && match.games_won_by_winner === 1 && match.games_won_by_loser === 1);
            const hasScore = match.winning_player !== null

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
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-gray-900/20 border-white/5'
                        }`}>
                        <div className="flex flex-col md:items-start min-w-0">
                          <div className="flex flex-col items-start gap-0">
                            <span className={`font-semibold text-sm md:text-lg md:truncate md:max-w-none transition-colors ${match.winning_player === player1.id
                              ? 'text-green-400'
                              : (match.winning_player && match.winning_player !== player1.id)
                                ? 'text-red-400'
                                : isDraw
                                  ? 'text-amber-400'
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
                                    ? 'text-amber-500/70'
                                    : 'text-gray-500 group-hover:text-gray-400'
                                }`}>@{player1.userName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* VS / Score - Center */}
                      <div className="flex items-center justify-center py-0">
                        {!hasScore && !isDraw && (
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800/80 border border-gray-700/80 flex items-center justify-center shadow-lg">
                            <span className="text-gray-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">vs</span>
                          </div>
                        )}
                        {hasScore && !isDraw && (
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
                        )}
                        {isDraw && (
                          <div className="bg-amber-500/10 px-3 py-1 md:px-5 md:py-2 rounded-xl border border-amber-500/20 flex items-center justify-center font-mono font-bold text-sm md:text-lg shadow-inner relative overflow-hidden group/score">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                            <span className="text-amber-400 uppercase tracking-wide drop-shadow-[0_0_8px_rgba(252,211,77,0.2)]">Draw</span>
                          </div>
                        )}
                      </div>

                      {/* Player 2 (Right Aligned) */}
                      <div className={`p-2 md:p-4 rounded-lg border transition-all duration-300 md:border md:flex md:flex-col md:justify-center ${player2 && match.winning_player === player2.id
                        ? 'bg-green-900/20 border-green-500/30 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]'
                        : player2 && (match.winning_player && match.winning_player !== player2.id)
                          ? 'bg-red-900/10 border-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]'
                          : isDraw
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-gray-900/20 border-white/5'
                        }`}>
                        <div className="flex flex-col md:items-end min-w-0">
                          {player2 ? (
                            <div className="flex flex-col items-end gap-0">
                              <span className={`font-semibold text-sm md:text-lg md:truncate md:max-w-none transition-colors ${match.winning_player === player2.id
                                ? 'text-green-400'
                                : (match.winning_player && match.winning_player !== player2.id)
                                  ? 'text-red-400'
                                  : isDraw
                                    ? 'text-amber-400'
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
                                      ? 'text-amber-500/70'
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

      {data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mt-4 animate-pulse font-medium">No matches found.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner />
          <p className="text-gray-500 mt-4 animate-pulse font-medium">Loading matches...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-red-950/20 rounded-xl border border-red-500/20 text-center backdrop-blur-sm">
          <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-red-400 font-semibold mb-1">Failed to Load Matches</h3>
          <p className="text-red-300/70 text-sm max-w-sm">
            {error instanceof Error ? error.message : "We couldn't load the matches for this round. Please try again."}
          </p>
        </div>
      )}

    </div>
  );
};

export default Matches;
