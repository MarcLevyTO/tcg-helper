import { useState } from 'react';
import { useMatches } from '@/src/hooks/useMatches';
import Spinner from '@/src/components/Spinner';
import './matches.scss';

const Matches = ({ round, searchTerm }: { round: any; searchTerm: string }) => {
  const { data, isLoading, error } = useMatches(round?.id);
  const [showRemainingOnly, setShowRemainingOnly] = useState(false);
  const matchesRemaining = data?.filter((match: any) => match.games_won_by_winner === null && match.games_won_by_loser === null && match.table_number > 0).length || 0;

  return (
    <div>
      {data && data.length > 0 && (
        <>
          {matchesRemaining > 0 && (
            <div
              className={`matches-remaining ${showRemainingOnly ? 'filter-active' : ''}`}
              onClick={() => setShowRemainingOnly(!showRemainingOnly)}
            >
              Matches remaining: {matchesRemaining} {showRemainingOnly && '(Filtered)'}
            </div>
          )}
          <div className="matches-container">
            {data.filter((match: any) => {
              if (showRemainingOnly) {
                if (!(match.games_won_by_winner === null && match.games_won_by_loser === null && match.table_number > 0)) {
                  return false;
                }
              }

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

              // Add case for table number = -1 or 0, this means a player dropped
              if ((match.table_number === -1 || match.table_number === 0) && !match.match_is_bye) {
                return (
                  <div
                    key={match.id}
                    className="match-card dropped"
                  >
                    {/* Mobile Dropped Header */}
                    <div className="dropped-header-mobile">
                      <span>DROPPED</span>
                    </div>

                    {/* Desktop Badge */}
                    <div className="dropped-badge-desktop">
                      <span>
                        DROPPED
                      </span>
                    </div>

                    {/* Player Info */}
                    <div className="dropped-player-info">
                      <span className="name">
                        {player1.name}
                      </span>
                      {player1.userName && (
                        <span className="username">(@{player1.userName})</span>
                      )}
                    </div>
                  </div>
                );
              }

              if (match.match_is_bye) {
                return (
                  <div
                    key={match.id}
                    className="match-card bye"
                  >
                    {/* Mobile Bye Header */}
                    <div className="bye-header-mobile">
                      <span>BYE</span>
                    </div>

                    {/* Desktop Badge */}
                    <div className="bye-badge-desktop">
                      <span>
                        BYE
                      </span>
                    </div>

                    {/* Player Info */}
                    <div className="bye-player-info">
                      <span className="name">
                        {player1.name}
                      </span>
                      {player1.userName && (
                        <span className="username">(@{player1.userName})</span>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={match.id}
                  className="match-card active"
                >
                  <div className="match-content-wrapper">
                    {/* Mobile Table Header - NEW */}
                    <div className="table-header-mobile">
                      <span>Table {match.table_number}</span>
                    </div>

                    {/* Table Number Section */}
                    <div className="table-number-desktop">
                      <span className="label">Table</span>
                      <span className="number">{match.table_number}</span>
                    </div>

                    {/* Players & Status Container */}
                    <div className="players-container">

                      {/* Match Content Grid */}
                      <div className="grid-layout">

                        {/* Player 1 (Left Aligned) */}
                        <div className={`player-card ${match.winning_player === player1.id
                          ? 'winner'
                          : (match.winning_player && match.winning_player !== player1.id)
                            ? 'loser'
                            : isDraw
                              ? 'draw'
                              : 'neutral'
                          }`}>
                          <div className="player-info align-start">
                            <div className="flex flex-col items-start gap-0">
                              <span className={`player-name ${match.winning_player === player1.id
                                ? 'winner-text'
                                : (match.winning_player && match.winning_player !== player1.id)
                                  ? 'loser-text'
                                  : isDraw
                                    ? 'draw-text'
                                    : 'neutral-text'
                                }`}>
                                {player1.name}
                              </span>
                              {player1.userName && (
                                <span className={`player-username ${match.winning_player === player1.id
                                  ? 'winner-text'
                                  : (match.winning_player && match.winning_player !== player1.id)
                                    ? 'loser-text'
                                    : isDraw
                                      ? 'draw-text'
                                      : 'neutral-text'
                                  }`}>@{player1.userName}</span>
                              )}
                              <div className={`player-stats ${match.winning_player === player1.id
                                ? 'winner-text'
                                : (match.winning_player && match.winning_player !== player1.id)
                                  ? 'loser-text'
                                  : isDraw
                                    ? 'draw-text'
                                    : 'neutral-text'
                                }`}>
                                <p className="stats-label">Current round standing:</p>
                                <p className="stats-value-player1">{player1.matchesWon} - {player1.matchesLost} - {player1.matchesDrawn} ({player1.totalMatchPoints} points)</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* VS / Score - Center */}
                        <div className="score-area">
                          {!hasScore && !isDraw && (
                            <div className="vs-badge">
                              <span>vs</span>
                            </div>
                          )}
                          {hasScore && !isDraw && (
                            <div className="score-badge">
                              <div className="gradient-overlay" />
                              <span className={match.winning_player === player1.id ? 'winner-score' : 'loser-score'}>
                                {match.winning_player === player1.id ? match.games_won_by_winner : match.games_won_by_loser}
                              </span>
                              <span className="separator">:</span>
                              <span className={match.winning_player === player2?.id ? 'winner-score' : 'loser-score'}>
                                {match.winning_player === player2?.id ? match.games_won_by_winner : match.games_won_by_loser}
                              </span>
                            </div>
                          )}
                          {isDraw && (
                            <div className="draw-badge">
                              <div className="gradient-overlay" />
                              <span className="text">Draw</span>
                            </div>
                          )}
                        </div>

                        {/* Player 2 (Right Aligned) */}
                        <div className={`player-card ${player2 && match.winning_player === player2.id
                          ? 'winner'
                          : player2 && (match.winning_player && match.winning_player !== player2.id)
                            ? 'loser'
                            : isDraw
                              ? 'draw'
                              : 'neutral'
                          }`}>
                          <div className="player-info align-end">
                            {player2 ? (
                              <div className="flex flex-col items-end gap-0">
                                <span className={`player-name ${match.winning_player === player2.id
                                  ? 'winner-text'
                                  : (match.winning_player && match.winning_player !== player2.id)
                                    ? 'loser-text'
                                    : isDraw
                                      ? 'draw-text'
                                      : 'neutral-text'
                                  }`}>
                                  {player2.name}
                                </span>
                                {player2.userName && (
                                  <span className={`player-username ${match.winning_player === player2.id
                                    ? 'winner-text'
                                    : (match.winning_player && match.winning_player !== player2.id)
                                      ? 'loser-text'
                                      : isDraw
                                        ? 'draw-text'
                                        : 'neutral-text'
                                    }`}>@{player2.userName}</span>
                                )}
                                <div className={`player-stats ${match.winning_player === player2.id
                                  ? 'winner-text'
                                  : (match.winning_player && match.winning_player !== player2.id)
                                    ? 'loser-text'
                                    : isDraw
                                      ? 'draw-text'
                                      : 'neutral-text'
                                  }`}>
                                  <p className="stats-label">Current round standing:</p>
                                  <p className="stats-value-player2">{player2.matchesWon} - {player2.matchesLost} - {player2.matchesDrawn} ({player2.totalMatchPoints} points)</p>
                                </div>
                              </div>
                            ) : (
                              <span className="bye-text">
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
        </>
      )}

      {data && data.length === 0 && (
        <div className="no-matches-container">
          <p>No matches found.</p>
        </div>
      )}

      {isLoading && (
        <div className="loading-container-matches">
          <Spinner />
          <p>Loading matches...</p>
        </div>
      )}

      {error && (
        <div className="error-container-matches">
          <div className="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3>Failed to Load Matches</h3>
          <p>
            {error instanceof Error ? error.message : "We couldn't load the matches for this round. Please try again."}
          </p>
        </div>
      )}

    </div>
  );
};

export default Matches;
