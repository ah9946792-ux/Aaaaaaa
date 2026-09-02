import {
  GlobalCricketPlayer,
  DreamPlayer,
  GlobalMarketPlayer,
  ManagerPlayerContract,
  PlayingRole,
} from '../types';
import { GLOBAL_PLAYERS_DATABASE } from '../data/players';
import { MatchPlayerPerformance } from './matchEngine/types';

export type GameModeKey = 'dream_team' | 'manager' | 'career' | 'worldwide_tournament' | 'universe_special';

export interface PlayerModeEligibilityInfo {
  isRetired: boolean;
  careerStatus: 'Active' | 'Retired' | 'Emerging' | 'Unavailable';
  category: string;
  dreamTeam: {
    eligible: boolean;
    badgeText: 'ELIGIBLE' | 'NOT ELIGIBLE';
    reason: string;
  };
  managerCareer: {
    eligible: boolean;
    badgeText: 'ELIGIBLE' | 'NOT ELIGIBLE';
    reason: string;
  };
  myCareer: {
    eligible: boolean;
    badgeText: 'ELIGIBLE' | 'NOT ELIGIBLE';
    reason: string;
  };
}

/**
 * Authoritatively determines if a player is retired.
 * Primary field: career_status / careerStatus === 'Retired' or retired === true.
 * Note: Category (e.g. LEGENDARY) does NOT automatically mean retired unless career_status is 'Retired'.
 */
export function isPlayerRetired(
  player:
    | GlobalCricketPlayer
    | DreamPlayer
    | GlobalMarketPlayer
    | ManagerPlayerContract
    | MatchPlayerPerformance
    | { career_status?: string; careerStatus?: string; retired?: boolean }
): boolean {
  if (!player) return false;
  if ('retired' in player && player.retired === true) return true;
  if ('career_status' in player && player.career_status === 'Retired') return true;
  if ('careerStatus' in player && player.careerStatus === 'Retired') return true;
  return false;
}

/**
 * 1. MY DREAM CRICKET TEAM ELIGIBILITY
 * Allowed: CURRENT + RETIRED PLAYERS
 * (Active players, Current superstars, Current stars, Retired Legendary players, Retired historic greats)
 */
export function isDreamTeamEligible(
  player: GlobalCricketPlayer | DreamPlayer | GlobalMarketPlayer | ManagerPlayerContract | MatchPlayerPerformance
): boolean {
  if (!player) return false;
  // Dream Team accepts all players in the database (current and retired)
  return true;
}

/**
 * 2. MY MANAGER CAREER ELIGIBILITY
 * Allowed: CURRENT / ACTIVE PLAYERS ONLY
 * Retired players must NOT appear in Manager Market, Transfer Window, Squad, or Matches.
 */
export function isManagerCareerEligible(
  player: GlobalCricketPlayer | DreamPlayer | GlobalMarketPlayer | ManagerPlayerContract | MatchPlayerPerformance
): boolean {
  if (!player) return false;
  return !isPlayerRetired(player);
}

/**
 * 3. MY CAREER ELIGIBILITY
 * Allowed: CURRENT / ACTIVE PLAYERS ONLY
 * Teammates, domestic, franchise, and international opponents must be active cricketers.
 */
export function isMyCareerEligible(
  player: GlobalCricketPlayer | DreamPlayer | GlobalMarketPlayer | ManagerPlayerContract | MatchPlayerPerformance
): boolean {
  if (!player) return false;
  return !isPlayerRetired(player);
}

/**
 * Returns full eligibility analysis for UI display cards & modal dossiers
 */
export function getPlayerModeEligibility(
  player: GlobalCricketPlayer | DreamPlayer | GlobalMarketPlayer | ManagerPlayerContract | MatchPlayerPerformance
): PlayerModeEligibilityInfo {
  const retired = isPlayerRetired(player);
  const status = ('career_status' in player ? player.career_status : 'careerStatus' in player ? player.careerStatus : retired ? 'Retired' : 'Active') as
    | 'Active'
    | 'Retired'
    | 'Emerging'
    | 'Unavailable';
  const category = 'category' in player ? String(player.category) : 'STAR';

  return {
    isRetired: retired,
    careerStatus: status || (retired ? 'Retired' : 'Active'),
    category,
    dreamTeam: {
      eligible: true,
      badgeText: 'ELIGIBLE',
      reason: retired
        ? 'Eligible as Historical Legend / Iconic Great'
        : 'Eligible as Current Active Pro',
    },
    managerCareer: {
      eligible: !retired,
      badgeText: !retired ? 'ELIGIBLE' : 'NOT ELIGIBLE',
      reason: !retired
        ? 'Eligible (Active Professional)'
        : 'NOT AVAILABLE — RETIRED PLAYER',
    },
    myCareer: {
      eligible: !retired,
      badgeText: !retired ? 'ELIGIBLE' : 'NOT ELIGIBLE',
      reason: !retired
        ? 'Eligible (Active Circuit Teammate & Opponent)'
        : 'NOT AVAILABLE — RETIRED PLAYER',
    },
  };
}

/**
 * Returns filtered player pool for specific game mode without duplicating database
 */
export function getPlayersForGameMode(
  mode: GameModeKey,
  sourceList: GlobalCricketPlayer[] = GLOBAL_PLAYERS_DATABASE
): GlobalCricketPlayer[] {
  switch (mode) {
    case 'dream_team':
      return sourceList.filter(isDreamTeamEligible);
    case 'manager':
      return sourceList.filter(isManagerCareerEligible);
    case 'career':
      return sourceList.filter(isMyCareerEligible);
    case 'worldwide_tournament':
    case 'universe_special':
    default:
      return sourceList.filter((p) => !isPlayerRetired(p));
  }
}

/**
 * Match Engine Pre-Match Roster Validation
 * Ensures all 11 players comply with game mode rules.
 * If an invalid (e.g. retired) player is in a Manager or Career match,
 * automatically replaces them with a matching role/rating active player from the global database.
 */
export function validateAndRepairMatchSquad(
  squad: MatchPlayerPerformance[],
  mode: GameModeKey
): {
  validSquad: MatchPlayerPerformance[];
  replacementsMade: Array<{ originalName: string; replacementName: string; reason: string }>;
} {
  const replacementsMade: Array<{ originalName: string; replacementName: string; reason: string }> = [];
  
  if (mode === 'dream_team' || mode === 'universe_special') {
    // Dream Team permits all players
    return { validSquad: squad, replacementsMade: [] };
  }

  // Active pool for finding replacements
  const activePool = GLOBAL_PLAYERS_DATABASE.filter((p) => !isPlayerRetired(p));
  const currentIds = new Set(squad.map((p) => p.playerId));

  const validSquad = squad.map((player, idx) => {
    if (player.isUserPlayer) return player; // Never replace user custom cricketer

    const retired = isPlayerRetired(player);
    if (!retired) return player;

    // Find suitable active replacement of matching or similar role
    const candidate =
      activePool.find(
        (p) =>
          !currentIds.has(p.player_id) &&
          p.primary_role === player.role &&
          Math.abs(p.overall_rating - player.overallRating) <= 10
      ) ||
      activePool.find(
        (p) => !currentIds.has(p.player_id) && p.primary_role === player.role
      ) ||
      activePool.find((p) => !currentIds.has(p.player_id)) ||
      activePool[idx % activePool.length];

    currentIds.add(candidate.player_id);

    replacementsMade.push({
      originalName: player.name,
      replacementName: candidate.name,
      reason: `Retired player replaced with active pro ${candidate.name} for ${mode} match eligibility.`,
    });

    const replaced: MatchPlayerPerformance = {
      ...player,
      playerId: candidate.player_id,
      name: candidate.name,
      shortName: candidate.short_name,
      role: candidate.primary_role,
      overallRating: candidate.overall_rating,
      condition: 'EXCELLENT',
      form: 'NORMAL',
    };

    return replaced;
  });

  return { validSquad, replacementsMade };
}
