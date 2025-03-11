import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
// Get API key from environment variables
const RIOT_API_KEY = process.env.RIOT_API_KEY;

// Base URL for North America region (can be modified for other regions)
const BASE_URL = 'https://na1.api.riotgames.com'; 

/**
 * Configured axios instance with Riot API authorization header
 * All requests through this client will include the API key
 */
const riotAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Riot-Token': RIOT_API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

/**
 * Fetches summoner data by summoner name
 * @param summonerName - The name of the summoner to retrieve (comes from summonerRoutes.ts)
 * @returns Promise with summoner data
 */
const getSummonerByName = async (summonerName: string): Promise<any>=> {
  try {
    // URL encode the summoner name to handle special characters
    const encodedName = encodeURIComponent(summonerName);
    
    // Make request to the Summoner-V4 API endpoint
    const response = await riotAxios.get(`/lol/summoner/v4/summoners/by-name/${encodedName}`);
    
    return response.data;
  } catch (error) {
    // Enhanced error handling with specific error messages by status code
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Summoner '${summonerName}' not found`);
      } else if (error.response?.status === 403) {
        throw new Error('API key expired or unauthorized');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      }
      throw new Error(`Riot API Error: ${error.response?.data?.status?.message || error.message}`);
    }
    throw new Error(`Failed to fetch summoner data: ${error.message || 'Unknown error'}`);
  }
};


/**
 * Fetches account information by Riot ID (game name + tagline)
 * @param gameName - The game name part of the Riot ID
 * @param tagLine - The tagline part of the Riot ID (e.g., "NA1" or "2025")
 * @returns Promise with account data including puuid
 */
const getAccountByRiotId = async (gameName: string, tagLine: string): Promise<any> => {
    try {
      // URL encode the game name to handle special characters
      const encodedName = encodeURIComponent(gameName);
      const encodedTagLine = encodeURIComponent(tagLine);
      
      // Note: Different base URL for account API
      const accountApi = axios.create({
        baseURL: 'https://americas.api.riotgames.com',
        headers: {
          'X-Riot-Token': RIOT_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      // Make request to the Account-V1 API endpoint
      const response = await accountApi.get(`/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTagLine}`);
      
      return response.data;
    } catch (error) {
      // Error handling similar to getSummonerByName
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Riot ID '${gameName}#${tagLine}' not found`);
        } else if (error.response?.status === 403) {
          throw new Error('API key expired or unauthorized');
        }
        // Additional error handling
      }
      throw new Error(`Failed to fetch account data: ${error.message || 'Unknown error'}`);
    }
  };
  

/**
 * Fetches match IDs for a player using their PUUID
 * @param puuid - Player Universal Unique ID
 * @param count - Number of matches to return (default: 10)
 * @returns Promise with array of match IDs
 */
const getMatchIdsByPuuid = async (puuid: string, count: number = 10): Promise<string[]> => {
  try {
    // Match API requires different regional routing
    const matchApi = axios.create({
      baseURL: 'https://americas.api.riotgames.com',
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    // Make request to the Match-V5 API endpoint
    const response = await matchApi.get(`/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
      params: { count }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`No matches found for PUUID: ${puuid}`);
      } else if (error.response?.status === 403) {
        throw new Error('API key expired or unauthorized');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      }
      throw new Error(`Riot API Error: ${error.response?.data?.status?.message || error.message}`);
    }
    throw new Error(`Failed to fetch match IDs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Fetches detailed match data by match ID
 * @param matchId - The unique identifier for a match
 * @returns Promise with match details
 */
const getMatchById = async (matchId: string): Promise<any> => {
  try {
    const matchApi = axios.create({
      baseURL: 'https://americas.api.riotgames.com',
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    const response = await matchApi.get(`/lol/match/v5/matches/${matchId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Match not found: ${matchId}`);
      } else if (error.response?.status === 403) {
        throw new Error('API key expired or unauthorized');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      }
      throw new Error(`Riot API Error: ${error.response?.data?.status?.message || error.message}`);
    }
    throw new Error(`Failed to fetch match details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Update exports to include the new functions
export { getSummonerByName, getAccountByRiotId, getMatchIdsByPuuid, getMatchById };
