import { useStandings } from '@/src/hooks/useStandings';
import Spinner from '@/src/components/Spinner';

const Standings = ({ round, searchTerm }: { round: any; searchTerm: string }) => {
  const { data, isLoading, error } = useStandings(round?.id);

  return (
    <div>
      {data && data.length > 0 && (
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/60 border-b border-gray-700/50">
              <tr>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Player</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Points</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Record</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">OMW%</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">OGW%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {data.filter((standing: any) => {
                if (!searchTerm) return true;
                const term = searchTerm.toLowerCase();

                return (
                  standing.player_name.toLowerCase().includes(term) ||
                  (standing.player_username && standing.player_username.toLowerCase().includes(term))
                );
              }).map((standing: any) => (
                <tr key={standing.player_id} className="hover:bg-gray-800/60 transition-colors duration-200">
                  <td className="px-2 md:px-4 py-2 md:py-4">
                    <span className="font-bold text-sm md:text-lg text-blue-400">{standing.rank}</span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-4">
                    <div>
                      <p className="font-semibold text-xs md:text-base text-white">{standing.player_name}</p>
                      {standing.player_username && (
                        <p className="text-[10px] md:text-sm text-gray-400">@{standing.player_username}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                    <span className="font-semibold text-xs md:text-base text-white">{standing.points}</span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                    <span className="font-semibold text-xs md:text-base text-white">{standing.match_record}</span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                    <span className="text-[10px] md:text-sm text-gray-300">{(standing.opponent_match_win_percentage * 100).toFixed(2)}%</span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-4 text-center">
                    <span className="text-[10px] md:text-sm text-gray-300">{(standing.opponent_game_win_percentage * 100).toFixed(2)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mt-4 animate-pulse font-medium">No standings found.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner />
          <p className="text-gray-500 mt-4 animate-pulse font-medium">Loading standings...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-red-950/20 rounded-xl border border-red-500/20 text-center backdrop-blur-sm">
          <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-red-400 font-semibold mb-1">Failed to Load Standings</h3>
          <p className="text-red-300/70 text-sm max-w-sm">
            {error instanceof Error ? error.message : "We couldn't load the standings for this round. Please try again."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Standings;
