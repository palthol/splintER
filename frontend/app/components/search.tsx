import React, { useState } from 'react';
import { fetchSummonerData, fetchAccountByRiotId } from '../services/frontendAPIService';

export interface SummonerSearchProps {
  onSearchStart: () => void; // Added this prop
  onSummonerFound: (data: any) => void;
  onError: (error: string) => void;
}

const SummonerSearch: React.FC<SummonerSearchProps> = ({ 
  onSearchStart, 
  onSummonerFound, 
  onError 
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState<'summoner' | 'riotid'>('summoner');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      onError('Please enter a summoner name or Riot ID');
      return;
    }
    
    // Call onSearchStart to trigger loading state
    onSearchStart();
    
    try {
      if (searchType === 'summoner') {
        // Search by summoner name
        const data = await fetchSummonerData(searchInput);
        onSummonerFound(data);
      } else {
        // Search by Riot ID (format: gameName#tagLine)
        const [gameName, tagLine] = searchInput.split('#');
        
        if (!tagLine) {
          onError('Please enter a valid Riot ID in the format "Name#Tag"');
          return;
        }
        
        const data = await fetchAccountByRiotId(gameName, tagLine);
        onSummonerFound(data);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="mb-6 p-4 bg-slate-800 rounded-lg shadow-lg">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4" aria-labelledby="search-form-title">
        <h2 id="search-form-title" className="sr-only">Summoner Search Form</h2>
        
        <div className="flex items-center gap-4">
          <fieldset className="flex items-center gap-4">
            <legend className="sr-only">Search type</legend>
            
            <div className="flex items-center">
              <input 
                type="radio"
                id="summoner"
                name="searchType"
                checked={searchType === 'summoner'}
                onChange={() => setSearchType('summoner')}
                className="mr-2"
                aria-describedby="summoner-description"
              />
              <label htmlFor="summoner">Summoner Name</label>
              <div className="sr-only" id="summoner-description">
                Search using legacy League of Legends summoner name
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                type="radio"
                id="riotid"
                name="searchType"
                checked={searchType === 'riotid'}
                onChange={() => setSearchType('riotid')}
                className="mr-2"
                aria-describedby="riotid-description"
              />
              <label htmlFor="riotid">Riot ID</label>
              <div className="sr-only" id="riotid-description">
                Search using Riot ID in format Name#Tag
              </div>
            </div>
          </fieldset>
        </div>
        
        <div className="flex-grow">
          <label htmlFor="search-input" className="sr-only">
            {searchType === 'summoner' ? 'Enter summoner name' : 'Enter Riot ID (Name#Tag)'}
          </label>
          <input
            type="text"
            id="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={searchType === 'summoner' ? 'Enter summoner name...' : 'Enter Riot ID (Name#Tag)...'}
            className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white"
            aria-required="true"
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SummonerSearch;