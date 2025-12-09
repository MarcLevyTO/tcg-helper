import { useStandings } from '@/src/hooks/useStandings';
import Spinner from '@/src/components/Spinner';
import './standings.scss';

const Standings = ({ round, searchTerm }: { round: any; searchTerm: string }) => {
  const { data, isLoading, error } = useStandings(round?.id);

  return (
    <div>
      {data && data.length > 0 && (
        <div className="standings-table-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th className="center">Points</th>
                <th className="center">Record</th>
                <th className="center">OMW%</th>
                <th className="center">OGW%</th>
              </tr>
            </thead>
            <tbody>
              {data.filter((standing: any) => {
                if (!searchTerm) return true;
                const term = searchTerm.toLowerCase();

                return (
                  standing.player_name.toLowerCase().includes(term) ||
                  (standing.player_username && standing.player_username.toLowerCase().includes(term))
                );
              }).map((standing: any) => (
                <tr key={standing.player_id}>
                  <td>
                    <span className="rank-cell">{standing.rank}</span>
                  </td>
                  <td>
                    <div className="player-cell">
                      <p className="name">{standing.player_name}</p>
                      {standing.player_username && (
                        <p className="username">@{standing.player_username}</p>
                      )}
                    </div>
                  </td>
                  <td className="center">
                    <span className="stats-cell">{standing.points}</span>
                  </td>
                  <td className="center">
                    <span className="stats-cell">{standing.match_record}</span>
                  </td>
                  <td className="center">
                    <span className="percentage-cell">{(standing.opponent_match_win_percentage * 100).toFixed(2)}%</span>
                  </td>
                  <td className="center">
                    <span className="percentage-cell">{(standing.opponent_game_win_percentage * 100).toFixed(2)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="no-standings-container">
          <p>No standings found.</p>
        </div>
      )}

      {isLoading && (
        <div className="loading-container-standings">
          <Spinner />
          <p>Loading standings...</p>
        </div>
      )}

      {error && (
        <div className="error-container-standings">
          <div className="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3>Failed to Load Standings</h3>
          <p>
            {error instanceof Error ? error.message : "We couldn't load the standings for this round. Please try again."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Standings;
