import React, { useState } from 'react';
import SummonerSearch from './search';
import SummonerProfile from './summonerProfile';
import MatchHistory from './matchHistory';
import type { SummonerData, RiotAccountData } from '../services/frontendAPIService';

const SummonerPage: React.FC = () => {
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [accountData, setAccountData] = useState<RiotAccountData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummonerFound = (data: any) => {
    setError(null);
    setIsLoading(false);
    
    if (data.puuid && data.name && data.summonerLevel) {
      setSummonerData(data);
      setAccountData(null);
    } else if (data.puuid && data.gameName && data.tagLine) {
      setAccountData(data);
      setSummonerData(null);
    }
  };

  const handleSearchError = (errorMsg: string) => {
    setError(errorMsg);
    setSummonerData(null);
    setAccountData(null);
    setIsLoading(false);
  };

  const handleSearchStart = () => {
    setIsLoading(true);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center" id="page-title">
        League of Legends Summoner Lookup
      </h1>
      
      <section aria-labelledby="search-section">
        <h2 id="search-section" className="sr-only">Search for a summoner</h2>
        <SummonerSearch 
          onSearchStart={handleSearchStart}
          onSummonerFound={handleSummonerFound}
          onError={handleSearchError}
        />
      </section>
      
      {isLoading && (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6" role="status" aria-live="polite">
          <p className="text-center">Searching for summoner data...</p>
          <div className="flex justify-center mt-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </div>
      )}
      
      {error && (
        <div 
          className="bg-red-800 text-white p-4 rounded-lg mb-6" 
          role="alert" 
          aria-live="assertive"
        >
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {summonerData && (
        <section aria-labelledby="summoner-profile">
          <h2 id="summoner-profile" className="sr-only">Summoner Profile</h2>
          <SummonerProfile summonerData={summonerData} />
          <MatchHistory puuid={summonerData.puuid} />
        </section>
      )}
      
      {accountData && (
        <section aria-labelledby="account-info">
          <h2 id="account-info" className="text-2xl font-bold mb-4">
            {accountData.gameName}#{accountData.tagLine}
          </h2>
          <p className="mb-2">
            <span className="sr-only">PUUID:</span>
            <span aria-hidden="true">PUUID:</span> {accountData.puuid.substring(0, 8)}...
          </p>
          <MatchHistory puuid={accountData.puuid} />
        </section>
      )}
    </div>
  );
};

export default SummonerPage;