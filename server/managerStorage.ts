import fs from 'fs';
import path from 'path';
import {
  GlobalMarketPlayer,
  PlayerTier,
  MultiplayerTournament,
  UserProfile,
} from '../src/types.js';
import { GLOBAL_PLAYERS_DATABASE } from '../src/data/players/index.js';
import { loadAllProfiles, saveAllProfiles } from './storage.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const MARKET_FILE = path.join(DATA_DIR, 'manager_market.json');
const TOURNAMENTS_FILE = path.join(DATA_DIR, 'manager_tournaments.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function calculateTier(rating: number): {
  tier: PlayerTier;
  minReputation: number;
  minClubTierLevel: number;
  signingCost: number;
  salaryPerSeason: number;
} {
  if (rating >= 93) {
    return {
      tier: 6,
      minReputation: 900,
      minClubTierLevel: 6,
      signingCost: Math.round(rating * 140),
      salaryPerSeason: Math.round(rating * 35),
    };
  }
  if (rating >= 89) {
    return {
      tier: 5,
      minReputation: 800,
      minClubTierLevel: 5,
      signingCost: Math.round(rating * 100),
      salaryPerSeason: Math.round(rating * 25),
    };
  }
  if (rating >= 84) {
    return {
      tier: 4,
      minReputation: 650,
      minClubTierLevel: 4,
      signingCost: Math.round(rating * 70),
      salaryPerSeason: Math.round(rating * 18),
    };
  }
  if (rating >= 78) {
    return {
      tier: 3,
      minReputation: 450,
      minClubTierLevel: 3,
      signingCost: Math.round(rating * 45),
      salaryPerSeason: Math.round(rating * 12),
    };
  }
  if (rating >= 71) {
    return {
      tier: 2,
      minReputation: 250,
      minClubTierLevel: 2,
      signingCost: Math.round(rating * 28),
      salaryPerSeason: Math.round(rating * 8),
    };
  }
  return {
    tier: 1,
    minReputation: 100,
    minClubTierLevel: 1,
    signingCost: Math.round(rating * 15),
    salaryPerSeason: Math.round(rating * 5),
  };
}

export function initializeGlobalMarket(): GlobalMarketPlayer[] {
  ensureDataDir();
  let existingMarket: GlobalMarketPlayer[] = [];
  if (fs.existsSync(MARKET_FILE)) {
    try {
      const data = fs.readFileSync(MARKET_FILE, 'utf-8');
      const parsed = JSON.parse(data) as GlobalMarketPlayer[];
      if (Array.isArray(parsed)) {
        existingMarket = parsed;
      }
    } catch (err) {
      console.error('Error reading manager market file, re-initializing:', err);
    }
  }

  const existingMap = new Map<string, GlobalMarketPlayer>();
  for (const p of existingMarket) {
    if (p && p.id && !p.id.startsWith('gp_')) {
      existingMap.set(p.id, p);
    }
  }

  // Authoritatively construct all 704 real players from GLOBAL_PLAYERS_DATABASE
  const market: GlobalMarketPlayer[] = GLOBAL_PLAYERS_DATABASE.map((p) => {
    const existing = existingMap.get(p.player_id);
    const tierMeta = calculateTier(p.overall_rating);
    const batting = p.batting_attributes?.battingAbility ?? p.overall_rating;
    const bowling = p.bowling_attributes?.bowlingAbility ?? 25;
    const fielding = p.fielding_attributes?.fielding ?? 75;

    const signingCost = p.market_value || tierMeta.signingCost;
    const salaryPerSeason = p.salary_expectation || tierMeta.salaryPerSeason;

    return {
      id: p.player_id,
      name: p.name,
      country: p.country,
      countryCode: p.country_code,
      category: p.category,
      age: p.age,
      role: p.primary_role,
      roleSubType: p.secondary_role || p.primary_role,
      rating: p.overall_rating,
      baseRating: p.base_rating,
      maxUpgrade: p.max_upgrade,
      upgradeLevel: p.upgrade_level,
      careerStatus: p.career_status === 'Retired' ? 'Retired' : 'Active',
      batting,
      bowling,
      fielding,
      tier: tierMeta.tier,
      minReputationRequired: tierMeta.minReputation,
      minClubTierLevel: tierMeta.minClubTierLevel,
      signingCost,
      salaryPerSeason,
      ownershipState: existing?.ownershipState || (p.career_status === 'Retired' ? 'RETIRED' : 'AVAILABLE'),
      ownerClubId: existing?.ownerClubId || null,
      ownerClubName: existing?.ownerClubName || null,
      ownerManagerName: existing?.ownerManagerName || null,
      signedAt: existing?.signedAt || null,
      contractYears: existing?.contractYears || 2,
      ownershipHistory: existing?.ownershipHistory || [],
    };
  });

  // Re-save if market needs migration or full population
  if (existingMarket.length < 600 || existingMarket.some((p) => p.id.startsWith('gp_'))) {
    saveGlobalMarket(market);
  }

  return market;
}

export function loadGlobalMarket(): GlobalMarketPlayer[] {
  return initializeGlobalMarket();
}

export function saveGlobalMarket(market: GlobalMarketPlayer[]): boolean {
  ensureDataDir();
  try {
    const tempFile = `${MARKET_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(market, null, 2), 'utf-8');
    fs.renameSync(tempFile, MARKET_FILE);
    return true;
  } catch (error) {
    console.error('Error saving global market database:', error);
    return false;
  }
}

// ----------------------------------------------------
// ATOMIC EXCLUSIVE SIGNING & RELEASING TRANSACTION ENGINE
// ----------------------------------------------------

let isMarketLocked = false;
const marketLockQueue: Array<() => void> = [];

async function acquireMarketLock(): Promise<void> {
  if (!isMarketLocked) {
    isMarketLocked = true;
    return;
  }
  return new Promise((resolve) => {
    marketLockQueue.push(resolve);
  });
}

function releaseMarketLock(): void {
  if (marketLockQueue.length > 0) {
    const next = marketLockQueue.shift();
    if (next) next();
  } else {
    isMarketLocked = false;
  }
}

export async function signPlayerExclusively(
  googleId: string,
  playerId: string
): Promise<{
  success: boolean;
  message: string;
  user?: UserProfile;
  player?: GlobalMarketPlayer;
}> {
  await acquireMarketLock();
  try {
    const profiles = loadAllProfiles();
    const userIndex = profiles.findIndex((p) => p.googleId === googleId);
    if (userIndex === -1) {
      return { success: false, message: 'User profile not found.' };
    }

    const user = profiles[userIndex];
    if (!user.managerData) {
      return {
        success: false,
        message: 'You have not founded a Manager Club yet. Create a club first.',
      };
    }

    const club = user.managerData;
    const market = loadGlobalMarket();
    const playerIndex = market.findIndex((p) => p.id === playerId);

    if (playerIndex === -1) {
      return { success: false, message: 'Player does not exist in global database.' };
    }

    const player = market[playerIndex];

    // Eligibility check 0: Career Status (Manager Career is Active Players Only)
    if (player.careerStatus === 'Retired' || player.ownershipState === 'RETIRED') {
      return {
        success: false,
        message: 'NOT AVAILABLE — RETIRED PLAYER: Retired legendary cricketers cannot be signed in Manager Career. They are exclusively eligible for My Dream Cricket Team.',
      };
    }

    // Check if player is already owned by another club or currently signed
    if (player.ownershipState === 'SIGNED') {
      if (player.ownerClubId === club.id) {
        return {
          success: false,
          message: `${player.name} is already signed to your club roster.`,
        };
      }
      return {
        success: false,
        message: `Signing Failed: ${player.name} is no longer available! They have been signed exclusively by ${player.ownerClubName || 'another manager club'}.`,
      };
    }

    // Eligibility check 1: Club tier requirement
    if (club.tierLevel < player.minClubTierLevel) {
      return {
        success: false,
        message: `Eligibility Lock: Signing ${player.name} requires Club Tier Level ${player.minClubTierLevel}+ (Current Club Tier: ${club.tierLevel}). Advance your club through league promotions to unlock.`,
      };
    }

    // Eligibility check 2: Club reputation requirement
    if (club.reputation < player.minReputationRequired) {
      return {
        success: false,
        message: `Eligibility Lock: Signing ${player.name} requires Club Reputation ${player.minReputationRequired}+ (Your Club Reputation is currently ${club.reputation}).`,
      };
    }

    // Eligibility check 3: Financial capacity
    if (club.balance < player.signingCost) {
      return {
        success: false,
        message: `Insufficient Funds: Signing ${player.name} costs $${player.signingCost.toLocaleString()}, but your club balance is $${club.balance.toLocaleString()}.`,
      };
    }

    // Check squad size limit (e.g., maximum 22 players)
    if (club.squad.length >= 22) {
      return {
        success: false,
        message: 'Squad limit reached (22 players maximum). Release a player to sign new talent.',
      };
    }

    const now = new Date().toISOString();

    // 1. Atomically update Player in Global Market
    player.ownershipState = 'SIGNED';
    player.ownerClubId = club.id;
    player.ownerClubName = club.name;
    player.ownerManagerName = user.displayName || 'Manager';
    player.signedAt = now;
    player.contractYears = 2;
    player.ownershipHistory.unshift({
      clubId: club.id,
      clubName: club.name,
      managerName: user.displayName || 'Manager',
      seasons: `Season ${club.currentSeason}`,
      signedDate: now,
    });

    market[playerIndex] = player;
    saveGlobalMarket(market);

    // 2. Add player to Club squad and deduct signing cost
    club.balance -= player.signingCost;
    if (!club.transferHistory) club.transferHistory = [];
    club.transferHistory.unshift({
      type: 'buy',
      playerId: player.id,
      playerName: player.name,
      playerRating: player.rating,
      role: player.role,
      country: player.country,
      price: player.signingCost,
      date: new Date().toLocaleDateString(),
      notes: `Signed exclusively on a 2-year contract.`,
    });

    club.squad.push({
      playerId: player.id,
      name: player.name,
      country: player.country,
      age: player.age,
      role: player.role,
      roleSubType: player.roleSubType,
      rating: player.rating,
      batting: player.batting,
      bowling: player.bowling,
      fielding: player.fielding,
      tier: player.tier,
      salaryPerSeason: player.salaryPerSeason,
      contractYearsRemaining: 2,
      startDate: now,
      status: 'active',
      matchesPlayed: 0,
      runsScored: 0,
      wicketsTaken: 0,
      catchesTaken: 0,
      averageRating: player.rating,
    });

    // If starting XI has fewer than 11 players, auto-add
    if (club.playingXIIds.length < 11 && !club.playingXIIds.includes(player.id)) {
      club.playingXIIds.push(player.id);
      club.battingOrderIds.push(player.id);
      if (player.role === 'Bowler' || player.role === 'All-Rounder') {
        club.bowlingOrderIds.push(player.id);
      }
    }

    // Recalculate club overall rating
    if (club.squad.length > 0) {
      const top11 = [...club.squad].sort((a, b) => b.rating - a.rating).slice(0, 11);
      club.overallRating = Math.round(
        top11.reduce((sum, p) => sum + p.rating, 0) / top11.length
      );
    }

    user.managerData = club;
    profiles[userIndex] = user;
    saveAllProfiles(profiles);

    return {
      success: true,
      message: `Successfully signed ${player.name} exclusively for $${player.signingCost.toLocaleString()}! No other manager in the world can sign this player while under your contract.`,
      user,
      player,
    };
  } finally {
    releaseMarketLock();
  }
}

export async function releasePlayerExclusively(
  googleId: string,
  playerId: string
): Promise<{
  success: boolean;
  message: string;
  user?: UserProfile;
  sellValue?: number;
}> {
  await acquireMarketLock();
  try {
    const profiles = loadAllProfiles();
    const userIndex = profiles.findIndex((p) => p.googleId === googleId);
    if (userIndex === -1) {
      return { success: false, message: 'User profile not found.' };
    }

    const user = profiles[userIndex];
    if (!user.managerData) {
      return { success: false, message: 'No Manager Club found.' };
    }

    const club = user.managerData;
    const squadIndex = club.squad.findIndex((p) => p.playerId === playerId);

    if (squadIndex === -1) {
      return { success: false, message: 'Player is not in your club roster.' };
    }

    if (club.squad.length <= 11) {
      return {
        success: false,
        message: 'Cannot sell/release player: Your club must maintain at least 11 players for matchday fixtures.',
      };
    }

    const releasedSquadPlayer = club.squad[squadIndex];
    const now = new Date().toISOString();

    // 1. Update Global Market: Set to AVAILABLE
    const market = loadGlobalMarket();
    const playerIndex = market.findIndex((p) => p.id === playerId);
    let signingCost = Math.round(releasedSquadPlayer.rating * 50);

    if (playerIndex !== -1) {
      const p = market[playerIndex];
      signingCost = p.signingCost;
      p.ownershipState = 'AVAILABLE';
      p.ownerClubId = null;
      p.ownerClubName = null;
      p.ownerManagerName = null;
      p.signedAt = null;
      if (p.ownershipHistory.length > 0) {
        p.ownershipHistory[0].releasedDate = now;
      }
      market[playerIndex] = p;
      saveGlobalMarket(market);
    }

    // Calculate reasonable transfer/release value (75% of market value)
    const sellValue = Math.round(signingCost * 0.75);
    club.balance += sellValue;

    // 2. Remove from squad and lineups
    club.squad.splice(squadIndex, 1);

    // If in Starting XI, auto-fill with bench player if available
    if (club.playingXIIds.includes(playerId)) {
      const benchPlayer = club.squad.find((p) => !club.playingXIIds.includes(p.playerId));
      if (benchPlayer && club.playingXIIds.length <= 11) {
        club.playingXIIds = club.playingXIIds.map((id) => (id === playerId ? benchPlayer.playerId : id));
        club.battingOrderIds = club.battingOrderIds.map((id) => (id === playerId ? benchPlayer.playerId : id));
        if (benchPlayer.role === 'Bowler' || benchPlayer.role === 'All-Rounder') {
          club.bowlingOrderIds = club.bowlingOrderIds.map((id) => (id === playerId ? benchPlayer.playerId : id));
        } else {
          club.bowlingOrderIds = club.bowlingOrderIds.filter((id) => id !== playerId);
        }
      } else {
        club.playingXIIds = club.playingXIIds.filter((id) => id !== playerId);
        club.battingOrderIds = club.battingOrderIds.filter((id) => id !== playerId);
        club.bowlingOrderIds = club.bowlingOrderIds.filter((id) => id !== playerId);
      }
    }

    if (club.captainId === playerId) {
      club.captainId = club.playingXIIds[0] || club.squad[0]?.playerId || '';
    }
    if (club.viceCaptainId === playerId) {
      club.viceCaptainId = club.playingXIIds[1] || club.squad[1]?.playerId || '';
    }

    // Record transfer in club transfer history
    if (!club.transferHistory) club.transferHistory = [];
    club.transferHistory.unshift({
      type: 'sell',
      playerId: releasedSquadPlayer.playerId,
      playerName: releasedSquadPlayer.name,
      playerRating: releasedSquadPlayer.rating,
      role: releasedSquadPlayer.role,
      country: releasedSquadPlayer.country,
      price: sellValue,
      date: new Date().toLocaleDateString(),
      notes: `Sold to free agency / market for $${sellValue.toLocaleString()}`,
    });

    // Recalculate club rating
    if (club.squad.length > 0) {
      const top11 = [...club.squad].sort((a, b) => b.rating - a.rating).slice(0, 11);
      club.overallRating = Math.round(
        top11.reduce((sum, p) => sum + p.rating, 0) / top11.length
      );
    }

    user.managerData = club;
    profiles[userIndex] = user;
    saveAllProfiles(profiles);

    return {
      success: true,
      message: `Successfully sold ${releasedSquadPlayer.name} for $${sellValue.toLocaleString()}! Funds credited to treasury and player returned to the global market as AVAILABLE.`,
      user,
      sellValue,
    };
  } finally {
    releaseMarketLock();
  }
}

// ----------------------------------------------------
// MULTIPLAYER TOURNAMENTS ENGINE
// ----------------------------------------------------

export function initializeTournaments(): MultiplayerTournament[] {
  ensureDataDir();
  if (fs.existsSync(TOURNAMENTS_FILE)) {
    try {
      const data = fs.readFileSync(TOURNAMENTS_FILE, 'utf-8');
      const parsed = JSON.parse(data) as MultiplayerTournament[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.error('Error reading tournaments file:', err);
    }
  }

  const initialTournaments: MultiplayerTournament[] = [
    {
      id: 'tour_global_champions_cup',
      name: 'Global Manager Champions Cup 2026',
      tier: 'Major World Class',
      format: 'League + Knockout',
      status: 'registration',
      entryFee: 500,
      prizePool: 25000,
      maxClubs: 8,
      registeredClubs: [
        {
          clubId: 'MC-BOT-01',
          clubName: 'London Titans CC',
          managerName: 'Lord Sterling',
          country: 'England',
          rating: 84,
          reputation: 600,
          squadPlayerIds: ['eng_joe_root', 'eng_harry_brook', 'eng_jofra_archer'],
        },
        {
          clubId: 'MC-BOT-02',
          clubName: 'Sydney Thunderbolts',
          managerName: 'Brett W.',
          country: 'Australia',
          rating: 85,
          reputation: 650,
          squadPlayerIds: ['aus_travis_head', 'aus_mitchell_starc'],
        },
        {
          clubId: 'MC-BOT-03',
          clubName: 'Mumbai Royals',
          managerName: 'Vikram Mehta',
          country: 'India',
          rating: 86,
          reputation: 700,
          squadPlayerIds: ['ind_surya_kumar_yadav', 'ind_hardik_pandya', 'ind_shubman_gill'],
        },
        {
          clubId: 'MC-BOT-04',
          clubName: 'Dhaka Dragons CC',
          managerName: 'Aminul Islam',
          country: 'Bangladesh',
          rating: 81,
          reputation: 520,
          squadPlayerIds: ['ban_mehidy_hasan_miraz', 'ban_towhid_hridoy'],
        },
      ],
      fixtures: [
        {
          id: 'fix_gcc_01',
          roundName: 'Quarter-Final 1',
          homeClubId: 'MC-BOT-01',
          homeClubName: 'London Titans CC',
          awayClubId: 'MC-BOT-02',
          awayClubName: 'Sydney Thunderbolts',
          status: 'scheduled',
        },
        {
          id: 'fix_gcc_02',
          roundName: 'Quarter-Final 2',
          homeClubId: 'MC-BOT-03',
          homeClubName: 'Mumbai Royals',
          awayClubId: 'MC-BOT-04',
          awayClubName: 'Dhaka Dragons CC',
          status: 'scheduled',
        },
      ],
      standings: [
        { position: 1, clubId: 'MC-BOT-03', clubName: 'Mumbai Royals', managerName: 'Vikram Mehta', played: 1, won: 1, lost: 0, points: 2, nrr: 1.25 },
        { position: 2, clubId: 'MC-BOT-01', clubName: 'London Titans CC', managerName: 'Lord Sterling', played: 1, won: 1, lost: 0, points: 2, nrr: 0.85 },
        { position: 3, clubId: 'MC-BOT-02', clubName: 'Sydney Thunderbolts', managerName: 'Brett W.', played: 1, won: 0, lost: 1, points: 0, nrr: -0.85 },
        { position: 4, clubId: 'MC-BOT-04', clubName: 'Dhaka Dragons CC', managerName: 'Aminul Islam', played: 1, won: 0, lost: 1, points: 0, nrr: -1.25 },
      ],
    },
    {
      id: 'tour_subcontinent_super_cup',
      name: 'Subcontinent Super League Trophy',
      tier: 'Premier Division',
      format: 'Round Robin',
      status: 'registration',
      entryFee: 250,
      prizePool: 12000,
      maxClubs: 6,
      registeredClubs: [
        {
          clubId: 'MC-BOT-05',
          clubName: 'Lahore Warriors',
          managerName: 'Zubair Khan',
          country: 'Pakistan',
          rating: 83,
          reputation: 510,
          squadPlayerIds: ['pak_shadab_khan', 'pak_haris_rauf'],
        },
        {
          clubId: 'MC-BOT-06',
          clubName: 'Colombo Blasters',
          managerName: 'Sanath P.',
          country: 'Sri Lanka',
          rating: 82,
          reputation: 480,
          squadPlayerIds: ['sl_wanindu_hasaranga', 'sl_matheesha_pathirana'],
        },
      ],
      fixtures: [],
      standings: [],
    },
  ];

  saveTournaments(initialTournaments);
  return initialTournaments;
}

export function loadTournaments(): MultiplayerTournament[] {
  return initializeTournaments();
}

export function saveTournaments(tournaments: MultiplayerTournament[]): boolean {
  ensureDataDir();
  try {
    const tempFile = `${TOURNAMENTS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(tournaments, null, 2), 'utf-8');
    fs.renameSync(tempFile, TOURNAMENTS_FILE);
    return true;
  } catch (error) {
    console.error('Error saving tournaments:', error);
    return false;
  }
}

export function registerClubForTournament(
  googleId: string,
  tournamentId: string
): { success: boolean; message: string; tournament?: MultiplayerTournament; user?: UserProfile } {
  const profiles = loadAllProfiles();
  const user = profiles.find((p) => p.googleId === googleId);
  if (!user || !user.managerData) {
    return { success: false, message: 'Manager Club required to enter tournaments.' };
  }

  const club = user.managerData;
  if (club.squad.length < 11) {
    return { success: false, message: 'Club must have at least 11 contracted players to register.' };
  }

  const tournaments = loadTournaments();
  const tourIndex = tournaments.findIndex((t) => t.id === tournamentId);
  if (tourIndex === -1) {
    return { success: false, message: 'Tournament not found.' };
  }

  const tournament = tournaments[tourIndex];
  if (tournament.registeredClubs.some((c) => c.clubId === club.id)) {
    return { success: false, message: 'Your club is already registered for this tournament.' };
  }

  if (tournament.registeredClubs.length >= tournament.maxClubs) {
    return { success: false, message: 'Tournament registrations are full.' };
  }

  if (club.balance < tournament.entryFee) {
    return {
      success: false,
      message: `Insufficient club funds: Tournament entry fee is $${tournament.entryFee}, balance is $${club.balance}.`,
    };
  }

  // Deduct entry fee
  club.balance -= tournament.entryFee;
  tournament.registeredClubs.push({
    clubId: club.id,
    clubName: club.name,
    managerName: user.displayName || 'Manager',
    country: club.country,
    rating: club.overallRating,
    reputation: club.reputation,
    squadPlayerIds: club.squad.map((p) => p.playerId),
  });

  tournament.standings.push({
    position: tournament.standings.length + 1,
    clubId: club.id,
    clubName: club.name,
    managerName: user.displayName || 'Manager',
    played: 0,
    won: 0,
    lost: 0,
    points: 0,
    nrr: 0.0,
  });

  tournaments[tourIndex] = tournament;
  saveTournaments(tournaments);

  const uIndex = profiles.findIndex((p) => p.googleId === googleId);
  user.managerData = club;
  profiles[uIndex] = user;
  saveAllProfiles(profiles);

  return {
    success: true,
    message: `Successfully registered ${club.name} for ${tournament.name}!`,
    tournament,
    user,
  };
}
