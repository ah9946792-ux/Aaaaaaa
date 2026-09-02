import {
  ManagerClubData,
  ManagerPlayerContract,
  ManagerFixture,
  ManagerDivisionTableEntry,
  PlayerTier,
} from '../../types';
import { GLOBAL_PLAYERS_DATABASE } from '../../data/players/index';
import { STARTER_PLAYER_IDS, calculatePlayerTier } from '../../data/cricketDatabase';

export const CLUB_EMBLEMS = [
  '🦅', '🦁', '🐅', '⚡', '👑', '🛡️', '⚔️', '🔥', '🐉', '🌪️', '🌟', '🏏'
];

export const INITIAL_STARTER_SQUAD: Omit<
  ManagerPlayerContract,
  'startDate' | 'status' | 'matchesPlayed' | 'runsScored' | 'wicketsTaken' | 'catchesTaken' | 'averageRating'
>[] = GLOBAL_PLAYERS_DATABASE.filter((p) => STARTER_PLAYER_IDS.has(p.player_id)).map((p, idx) => {
  const batting = p.batting_attributes?.battingAbility ?? p.overall_rating;
  const bowling = p.bowling_attributes?.bowlingAbility ?? 25;
  const fielding = p.fielding_attributes?.fielding ?? 75;
  const tier = calculatePlayerTier(p.overall_rating);

  return {
    playerId: p.player_id,
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
    tier,
    salaryPerSeason: p.salary_expectation || 350,
    contractYearsRemaining: idx % 2 === 0 ? 3 : 2,
  };
});

export function createInitialManagerClub(
  clubName: string,
  shortName: string,
  country: string,
  region: string,
  stadiumName: string,
  badge: string,
  primaryColor: string,
  secondaryColor: string,
  managerName: string
): ManagerClubData {
  const now = new Date().toISOString();
  const squad: ManagerPlayerContract[] = INITIAL_STARTER_SQUAD.map((p) => ({
    ...p,
    startDate: now,
    status: 'active',
    matchesPlayed: 0,
    runsScored: 0,
    wicketsTaken: 0,
    catchesTaken: 0,
    averageRating: p.rating,
  }));

  const starting11Ids = squad.slice(0, 11).map((p) => p.playerId);
  const bowlerIds = squad
    .filter((p) => p.role === 'Bowler' || p.role === 'All-Rounder')
    .slice(0, 5)
    .map((p) => p.playerId);

  const potentialOpponents = [
    `${region} Gladiators CC`,
    `${region} Dynamos CC`,
    'Northern Vipers',
    'Coastal Mariners',
    'Valley Titans',
    'Metro Hawks',
    'Southern Falcons',
    'Highland Mavericks',
  ];
  const uniqueOpponents = potentialOpponents
    .filter((opp) => opp.trim().toLowerCase() !== clubName.trim().toLowerCase())
    .slice(0, 5);

  const divisionTable: ManagerDivisionTableEntry[] = [
    { position: 1, teamName: clubName, isUserClub: true, played: 0, won: 0, lost: 0, points: 0, nrr: 0.0 },
    ...uniqueOpponents.map((opp, idx) => ({
      position: idx + 2,
      teamName: opp,
      isUserClub: false,
      played: 0,
      won: 0,
      lost: 0,
      points: 0,
      nrr: 0.0,
    })),
  ];

  const calendar: ManagerFixture[] = [
    {
      id: 'fix_s1_01',
      matchDay: 1,
      inGameDate: 'May 12, Season 1',
      competitionName: 'Regional Tier 1 Championship',
      opponentTeam: uniqueOpponents[0] || 'Northern Vipers',
      opponentRating: 68,
      isHome: true,
      venue: stadiumName,
      status: 'ready',
    },
    {
      id: 'fix_s1_02',
      matchDay: 2,
      inGameDate: 'May 19, Season 1',
      competitionName: 'Regional Tier 1 Championship',
      opponentTeam: uniqueOpponents[1] || 'Coastal Mariners',
      opponentRating: 69,
      isHome: false,
      venue: `${uniqueOpponents[1] || 'Northern'} Cricket Ground`,
      status: 'upcoming',
    },
    {
      id: 'fix_s1_03',
      matchDay: 3,
      inGameDate: 'May 26, Season 1',
      competitionName: 'Regional Tier 1 Championship',
      opponentTeam: uniqueOpponents[2] || 'Valley Titans',
      opponentRating: 67,
      isHome: true,
      venue: stadiumName,
      status: 'upcoming',
    },
    {
      id: 'fix_s1_04',
      matchDay: 4,
      inGameDate: 'June 2, Season 1',
      competitionName: 'Regional Tier 1 Championship',
      opponentTeam: uniqueOpponents[3] || 'Metro Hawks',
      opponentRating: 70,
      isHome: false,
      venue: 'Highland Oval',
      status: 'upcoming',
    },
    {
      id: 'fix_s1_05',
      matchDay: 5,
      inGameDate: 'June 9, Season 1',
      competitionName: 'Regional Tier 1 Championship',
      opponentTeam: uniqueOpponents[4] || 'Southern Falcons',
      opponentRating: 68,
      isHome: true,
      venue: stadiumName,
      status: 'upcoming',
    },
    {
      id: 'fix_s1_06',
      matchDay: 6,
      inGameDate: 'June 16, Season 1',
      competitionName: 'Regional Tier 1 Semi-Final',
      opponentTeam: uniqueOpponents[0] || 'Northern Vipers',
      opponentRating: 70,
      isHome: true,
      venue: stadiumName,
      status: 'upcoming',
    },
  ];

  return {
    id: `MC-${Date.now().toString(36).toUpperCase()}`,
    name: clubName,
    shortName: shortName.toUpperCase(),
    country,
    divisionRegion: region,
    logoBadge: badge,
    primaryColor,
    secondaryColor,
    stadiumName,
    stadiumCapacity: 12000,
    reputation: 150,
    overallRating: 69,
    tierLevel: 1,
    currentDivisionName: 'Regional Tier 1 Division',
    currentLeagueName: 'National Cricket Pyramid',
    currentSeason: 1,
    balance: 50000,
    seasonTicketRevenue: 15000,
    sponsorshipRevenuePerMatch: 2500,
    squad,
    playingXIIds: starting11Ids,
    captainId: starting11Ids[0],
    viceCaptainId: starting11Ids[1],
    battingOrderIds: [...starting11Ids],
    bowlingOrderIds: bowlerIds,
    tactics: {
      battingAggression: 'Balanced',
      bowlingStrategy: 'Balanced Rotation',
      fieldPreset: 'Balanced Standard',
      captaincyStyle: 'Tactical Analyst',
    },
    facilities: {
      trainingGround: 1,
      youthAcademy: 1,
      stadiumInfrastructure: 1,
      physioCenter: 1,
    },
    trophies: [],
    history: [],
    records: {
      highestTeamScore: 'N/A',
      biggestWinMargin: 'N/A',
      longestWinStreak: 0,
      allTimeTopScorer: 'N/A',
      allTimeTopScorerRuns: 0,
      allTimeTopBowler: 'N/A',
      allTimeTopBowlerWickets: 0,
      mostMatchesPlayedPlayer: 'N/A',
      bestSeasonWins: 0,
      totalTrophies: 0,
    },
    divisionTable,
    calendar,
    currentFixtureIndex: 0,
    managerStats: {
      managerName,
      reputation: 150,
      seasonsManaged: 0,
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
      winPercentage: 0,
      promotions: 0,
      relegations: 0,
      trophiesWon: 0,
      boardConfidence: 95,
    },
  };
}
