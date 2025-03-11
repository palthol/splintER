import React, { useState, useEffect } from 'react';
import { fetchMatchesByPuuid, fetchMatchDetails } from '../services/frontendAPIService';

interface MatchHistoryProps {
  puuid: string;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ puuid }) => {
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [matchDetails, setMatchDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First get match IDs
        const ids = await fetchMatchesByPuuid(puuid);
        setMatchIds(ids);
        
        // Then get details for each match (limit to 5 for performance)
        const detailsPromises = ids.slice(0, 5).map(id => fetchMatchDetails(id));
        const details = await Promise.all(detailsPromises);
        setMatchDetails(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match history');
      } finally {
        setLoading(false);
      }
    };
    
    if (puuid) {
      loadMatchHistory();
    }
  }, [puuid]);

  if (loading) return <div className="text-center p-4">Loading match history...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (matchDetails.length === 0) return <div className="p-4">No recent matches found.</div>;

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Recent Matches</h3>
      <div className="space-y-4">
        {matchDetails.map((match, index) => (
          <div key={matchIds[index]} className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Game Type: {match.info.gameMode}</p>
                <p>Duration: {Math.floor(match.info.gameDuration / 60)}m {match.info.gameDuration % 60}s</p>
              </div>
              <div className="text-right">
                <p>{new Date(match.info.gameCreation).toLocaleDateString()}</p>
                <p>{match.info.gameType}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;