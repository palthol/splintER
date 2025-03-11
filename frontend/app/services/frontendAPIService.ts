import axios from 'axios';

// Create an axios instance for our backend API

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

export interface SummonerData {
  id: string;         // Encrypted summoner ID
  accountId: string;  // Encrypted account ID
  puuid: string;      // Encrypted PUUID
  name: string;       // Summoner name
  profileIconId: number; // ID of the summoner icon
  revisionDate: number; // Date summoner was last modified (epoch milliseconds)
  summonerLevel: number; // Summoner level
}

export interface RiotAccountData {
  puuid: string;     // Player's universal unique ID
  gameName: string;  // Game name component of Riot ID
  tagLine: string;   // Tag line component of Riot ID
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetches summoner data from the backend API
 * @param summonerName - The name of the summoner to lookup
 * @returns Promise containing summoner data
 */
export const fetchSummonerData = async (summonerName: string): Promise<SummonerData> => {
  try {
    const response = await api.get<ApiResponse<SummonerData>>(
      `/summoner/${encodeURIComponent(summonerName)}`
    );
    
    return response.data.data as SummonerData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Summoner "${summonerName}" not found`);
      }
      
      throw new Error(`API Error: ${error.response?.data?.error || error.message}`);
    }
    
    throw error;
  }
};

/**
 * Fetches account data by Riot ID
 * @param gameName - The game name part of Riot ID
 * @param tagLine - The tagline part of Riot ID
 * @returns Promise containing account data
 */
export const fetchAccountByRiotId = async (gameName: string, tagLine: string): Promise<RiotAccountData> => {
  try {
    const response = await api.get<ApiResponse<RiotAccountData>>(
      `/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    
    return response.data.data as RiotAccountData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Riot ID "${gameName}#${tagLine}" not found`);
      }
      
      throw new Error(`API Error: ${error.response?.data?.error || error.message}`);
    }
    
    throw error;
  }
};

/**
 * Fetches match IDs for a player
 * @param puuid - Player Universal Unique ID
 * @param count - Number of matches to return
 */
export const fetchMatchesByPuuid = async (puuid: string, count: number = 10): Promise<string[]> => {
  try {
    const response = await api.get<ApiResponse<string[]>>(
      `/matches/ids/${puuid}`,
      { params: { count } }
    );
    
    return response.data.data as string[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.error || error.message}`);
    }
    
    throw error;
  }
};

/**
 * Fetches detailed match data
 * @param matchId - The match ID to retrieve details for
 */
export const fetchMatchDetails = async (matchId: string): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `/matches/${matchId}`
    );
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.error || error.message}`);
    }
    
    throw error;
  }
};

export default api;