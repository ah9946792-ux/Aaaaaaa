import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  authenticateOrRegisterGoogleUser,
  getProfileByGoogleId,
  updateProfile,
} from './server/storage.js';
import {
  loadGlobalMarket,
  signPlayerExclusively,
  releasePlayerExclusively,
  loadTournaments,
  registerClubForTournament,
} from './server/managerStorage.js';
import { GameModeInfo } from './src/types.js';

const GAME_MODES: GameModeInfo[] = [
  {
    id: 'career',
    title: 'My Career',
    tagline: 'Build your journey from rising cricketer to legend.',
    description:
      'Create your custom cricketer, train core skills (Batting, Bowling, Fielding), sign with premier domestic franchises, earn your national cap, and conquer international test & white-ball arenas.',
    category: 'Single Player Story',
    badge: 'FLAGSHIP',
    accentColor: '#10b981', // emerald
    features: [
      'Player Creator & Batting/Bowling Archetypes',
      'Training Drills & Skill Progression Tree',
      'Club Contracts, Premier League Drafts & National Selection',
      'Dynamic Press Conferences & Rivalry Matchups',
    ],
  },
  {
    id: 'dream_team',
    title: 'My Dream Cricket Team',
    tagline: 'Assemble your fantasy XI and conquer the global league.',
    description:
      'Collect world-class cricket player cards, strategize batting orders, balance pace vs. spin attack combinations, and compete in PvP & AI Dream XI championships.',
    category: 'Fantasy & Team Building',
    badge: 'POPULAR',
    accentColor: '#f59e0b', // amber / gold
    features: [
      'Player Card Packs & Tier Rarities (Gold, Diamond, Icon)',
      'Custom Team Lineups & Squad Chemistry Synergy',
      'Auction Room & Real-time Player Trading',
      'Dream XI Ranked Seasons & Trophy Showcases',
    ],
  },
  {
    id: 'manager',
    title: 'My Manager Career',
    tagline: 'Tactical mastermind: contracts, pitch strategy, and club glory.',
    description:
      'Take full tactical and financial command of a cricket franchise. Scout wonderkids, manage player fatigue and morale, set pitch-specific game plans, and negotiate million-dollar sponsorships.',
    category: 'Tactical Management',
    badge: 'STRATEGY',
    accentColor: '#3b82f6', // blue
    features: [
      'Deep Tactical Match Engine & Ball-by-Ball Orders',
      'Stadium Upgrades, Academy Scouting & Staff Hiring',
      'Franchise Finances, Merchandising & Sponsor Deals',
      'Season Board Objectives & Performance Pressure',
    ],
  },
  {
    id: 'worldwide_tournament',
    title: 'Worldwide Tournament',
    tagline: 'Compete across ICC venues and dominate the world stage.',
    description:
      'Represent your country in prestigious world championships across iconic cricket grounds like Lord’s, MCG, Eden Gardens, and Kensington Oval. Experience group stages, knockouts, and thrilling finals.',
    category: 'Global Championship',
    badge: 'WORLD STAGE',
    accentColor: '#8b5cf6', // purple
    features: [
      'Authentic World Cup & Champions Trophy Formats',
      'Real Venue Pitch Conditions (Green Top, Dusty, Flat Track)',
      'T20, ODI, and 5-Day Test Championship Brackets',
      'Global Leaderboards & Historical Trophy Cabinet',
    ],
  },
  {
    id: 'universe_special',
    title: 'Universe Special Tournament',
    tagline: 'Exclusive seasonal leagues, cosmic cups, and super-over showdowns.',
    description:
      'Step into the Universe Arena featuring cosmic rule twists, Super-Over Blitzes, Power-Play Frenzies, Six-Hitting Derbies, and limited-time galactic rewards.',
    category: 'Cosmic & Arcade Event',
    badge: 'SPECIAL EVENT',
    accentColor: '#ec4899', // pink/ruby
    features: [
      'Super-Over Sudden Death Elimination Cups',
      'Cosmic Modifiers (Multiplied Run Zones, Power Bats)',
      'Weekly Limited-Time Universe Quests & Exclusive Badges',
      'Cosmic Champion Rings & Mythic Cosmetic Unlocks',
    ],
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      game: 'CRICKET UNIVERSE',
      version: '2.5.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Deployment & Mobile App Meta Info
  app.get('/api/apk/info', (_req, res) => {
    return res.json({
      success: true,
      apk: {
        appName: 'Cricket Universe',
        versionName: '2.5.0',
        versionCode: 250,
        packageName: 'com.cricketuniverse.app',
        buildType: 'PWA_AND_WEB',
        pwaReady: true,
        note: 'Standalone Android APK requires compiling with the official Android Gradle toolchain (./gradlew assembleRelease). The full web application can be installed on mobile via Add to Home Screen.',
      },
    });
  });

  // Game Modes Meta
  app.get('/api/modes', (_req, res) => {
    res.json({ modes: GAME_MODES });
  });

  // Google Authentication: Permanent Account Link
  app.post('/api/auth/google', (req, res) => {
    try {
      const { googleId, email, displayName, photoURL } = req.body;
      if (!googleId) {
        return res.status(400).json({
          success: false,
          error: 'Google ID is required for authentication.',
        });
      }

      const { user, isNewUser } = authenticateOrRegisterGoogleUser({
        googleId: String(googleId).trim(),
        email: email ? String(email).trim() : '',
        displayName: displayName ? String(displayName).trim() : 'Cricket Legend',
        photoURL: photoURL ? String(photoURL).trim() : undefined,
      });

      return res.json({
        success: true,
        user,
        isNewUser,
        message: isNewUser
          ? 'New Cricket Universe profile created.'
          : 'Welcome back! Loaded existing Cricket Universe profile.',
      });
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed.',
      });
    }
  });

  // Get Profile by Google ID
  app.get('/api/profile/:googleId', (req, res) => {
    try {
      const { googleId } = req.params;
      const profile = getProfileByGoogleId(googleId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Profile not found for this Google account.',
        });
      }

      return res.json({ success: true, user: profile });
    } catch (error) {
      console.error('Fetch profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve profile.',
      });
    }
  });

  // Update Profile
  app.put('/api/profile/:googleId', (req, res) => {
    try {
      const { googleId } = req.params;
      const updates = req.body;

      const updated = updateProfile(googleId, updates);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Profile not found to update.',
        });
      }

      return res.json({ success: true, user: updated });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update profile.',
      });
    }
  });

  // --- MANAGER MODE & EXCLUSIVE PLAYER OWNERSHIP API ---

  // Global Player Market status
  app.get('/api/manager/market', (_req, res) => {
    try {
      const market = loadGlobalMarket();
      return res.json({ success: true, players: market });
    } catch (error) {
      console.error('Manager market error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve global player market.',
      });
    }
  });

  // Sign Player Exclusively (Atomic transaction with server validation)
  app.post('/api/manager/sign', async (req, res) => {
    try {
      const { googleId, playerId } = req.body;
      if (!googleId || !playerId) {
        return res.status(400).json({
          success: false,
          error: 'Google ID and Player ID are required.',
        });
      }

      const result = await signPlayerExclusively(String(googleId), String(playerId));
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.message,
        });
      }

      return res.json({
        success: true,
        message: result.message,
        user: result.user,
        player: result.player,
      });
    } catch (error) {
      console.error('Sign player error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Player signing failed.',
      });
    }
  });

  // Release / Sell Player (Atomic transaction)
  const handleReleaseOrSell = async (req: express.Request, res: express.Response) => {
    try {
      const { googleId, playerId } = req.body;
      if (!googleId || !playerId) {
        return res.status(400).json({
          success: false,
          error: 'Google ID and Player ID are required.',
        });
      }

      const result = await releasePlayerExclusively(String(googleId), String(playerId));
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.message,
        });
      }

      return res.json({
        success: true,
        message: result.message,
        user: result.user,
        sellValue: result.sellValue,
      });
    } catch (error) {
      console.error('Release/Sell player error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Player transaction failed.',
      });
    }
  };

  app.post('/api/manager/release', handleReleaseOrSell);
  app.post('/api/manager/sell', handleReleaseOrSell);

  // Multiplayer Tournaments
  app.get('/api/manager/tournaments', (_req, res) => {
    try {
      const tournaments = loadTournaments();
      return res.json({ success: true, tournaments });
    } catch (error) {
      console.error('Tournaments load error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve tournaments.',
      });
    }
  });

  // Register for Multiplayer Tournament
  app.post('/api/manager/tournaments/register', (req, res) => {
    try {
      const { googleId, tournamentId } = req.body;
      if (!googleId || !tournamentId) {
        return res.status(400).json({
          success: false,
          error: 'Google ID and Tournament ID are required.',
        });
      }

      const result = registerClubForTournament(String(googleId), String(tournamentId));
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.message,
        });
      }

      return res.json({
        success: true,
        message: result.message,
        tournament: result.tournament,
        user: result.user,
      });
    } catch (error) {
      console.error('Tournament register error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Tournament registration failed.',
      });
    }
  });

  // --- API 404 Catch-All (Prevents API requests from falling through to HTML SPA fallback) ---
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `API route ${req.method} ${req.originalUrl} not found`,
    });
  });

  // --- Vite Dev & Production Static Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CRICKET UNIVERSE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
