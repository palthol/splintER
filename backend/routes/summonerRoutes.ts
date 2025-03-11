import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { getSummonerByName, getAccountByRiotId, getMatchIdsByPuuid, getMatchById } from '../services/riotAPI';
const router = express.Router();

// Use RequestHandler type for the route callback
const getSummoner: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.params;
    
    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'Summoner name is required' });
      return; // Just return to exit the function, don't return the Response
    }
    
    const summonerData = await getSummonerByName(name);
    
    res.json({
      success: true,
      data: summonerData
    });
  } catch (error) {
    next(error);
  }
};

router.get('/summoner/:name', getSummoner);
// Add a new route for Riot ID lookup
router.get('/account/:gameName/:tagLine', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameName, tagLine } = req.params;
      
      if (!gameName || !tagLine) {
        res.status(400).json({ error: 'Game name and tagline are required' });
        return;
      }
      
      const accountData = await getAccountByRiotId(gameName, tagLine);
      
      res.json({
        success: true,
        data: accountData
      });
    } catch (error) {
      next(error);
    }
  });
  // Get match IDs by PUUID
router.get('/matches/ids/:puuid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { puuid } = req.params;
    const count = req.query.count ? parseInt(req.query.count as string) : 10;
    
    if (!puuid || puuid.trim() === '') {
      res.status(400).json({ error: 'Player PUUID is required' });
      return;
    }
    
    const matchIds = await getMatchIdsByPuuid(puuid, count);
    
    res.json({
      success: true,
      data: matchIds
    });
  } catch (error) {
    next(error);
  }
});

// Get match details by match ID
router.get('/matches/:matchId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { matchId } = req.params;
    
    if (!matchId || matchId.trim() === '') {
      res.status(400).json({ error: 'Match ID is required' });
      return;
    }
    
    const matchData = await getMatchById(matchId);
    
    res.json({
      success: true,
      data: matchData
    });
  } catch (error) {
    next(error);
  }
});

// Convenience route: Get match history directly from Riot ID
router.get('/match-history/:gameName/:tagLine', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gameName, tagLine } = req.params;
    const count = req.query.count ? parseInt(req.query.count as string) : 5;
    
    if (!gameName || !tagLine) {
      res.status(400).json({ error: 'Game name and tagline are required' });
      return;
    }
    
    // Step 1: Get account data to retrieve PUUID
    const accountData = await getAccountByRiotId(gameName, tagLine);
    const { puuid } = accountData;
    
    // Step 2: Get match IDs using the PUUID
    const matchIds = await getMatchIdsByPuuid(puuid, count);
    
    res.json({
      success: true,
      data: {
        account: accountData,
        matchIds: matchIds
      }
    });
  } catch (error) {
    next(error);
  }
});
export default router;