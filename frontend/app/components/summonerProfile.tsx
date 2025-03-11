import React from 'react';
import type { SummonerData } from '../services/frontendAPIService';

interface SummonerProfileProps {
  summonerData: SummonerData;
}

const SummonerProfile: React.FC<SummonerProfileProps> = ({ summonerData }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center gap-4">
        <img 
          src={`https://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${summonerData.profileIconId}.png`}
          alt="Summoner Icon"
          className="w-20 h-20 rounded-full border-2 border-yellow-500"
        />
        
        <div>
          <h2 className="text-2xl font-bold">{summonerData.name}</h2>
          <p className="text-gray-400">Level {summonerData.summonerLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default SummonerProfile;