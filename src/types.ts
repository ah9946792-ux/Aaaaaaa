export type GameModeId =
  | 'career'
  | 'dream_team'
  | 'manager'
  | 'worldwide_tournament'
  | 'universe_special';

export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  matchSpeed: '1x' | '1.5x' | '2x';
  themeAccent: 'emerald' | 'amber' | 'cyan' | 'ruby';
  notifications: boolean;
  autoSaveCloud: boolean;
}

export interface GameProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  rankTitle: string;
  totalMatchesPlayed: number;
  reputation: number;
}

export interface UserCurrency {
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
}

// ----------------------------------------------------
// CAREER MODE TYPES
// ----------------------------------------------------

export type PlayingRole = 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper-Batter';

export type BatterSubType =
  | 'Opening Batter'
  | 'Top-Order Batter'
  | 'Middle-Order Batter'
  | 'Lower-Order Batter';

export type BowlerSubType =
  | 'Fast Bowler'
  | 'Fast-Medium Bowler'
  | 'Medium Pacer'
  | 'Off Spin'
  | 'Leg Spin'
  | 'Left-Arm Orthodox'
  | 'Left-Arm Wrist Spin';

export type AllRounderSubType =
  | 'Batting All-Rounder'
  | 'Bowling All-Rounder'
  | 'Balanced All-Rounder';

export type WicketkeeperSubType =
  | 'Opening WK-Batter'
  | 'Middle-Order WK-Batter'
  | 'Finisher WK-Batter';

export type RoleSubType =
  | BatterSubType
  | BowlerSubType
  | AllRounderSubType
  | WicketkeeperSubType;

export interface BattingRatings {
  batting: number;
  power: number;
  timing: number;
  technique: number;
  runningBetweenWickets: number;
  shotSelection: number;
}

export interface BowlingRatings {
  bowling: number;
  pace: number;
  accuracy: number;
  movement: number;
  variation: number;
  spin: number;
  control: number;
}

export interface FieldingRatings {
  fielding: number;
  catching: number;
  throwing: number;
  groundFielding: number;
  reaction: number;
  wicketkeeping: number;
}

export interface CareerPlayerRatings {
  overall: number;
  potential: number;
  form: number; // 0 to 100
  formStatus: 'Excellent' | 'Good' | 'Average' | 'Poor';
  batting: BattingRatings;
  bowling: BowlingRatings;
  fielding: FieldingRatings;
}

export interface CareerStatsCategory {
  matches: number;
  innings: number;
  runs: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  highestScore: number;
  fours: number;
  sixes: number;
  notOuts: number;
  overs: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  bowlingAverage: number;
  bestBowling: string;
  threeWicketHauls: number;
  fiveWicketHauls: number;
  catches: number;
  runOuts: number;
  stumpings: number;
}

export interface CareerStats {
  club: CareerStatsCategory;
  franchise: CareerStatsCategory;
  international: CareerStatsCategory;
  total: CareerStatsCategory;
}

export interface CareerTrophy {
  id: string;
  name: string;
  competition: string;
  season: number;
  date: string;
  description: string;
  category: 'individual' | 'team' | 'championship' | 'milestone';
  iconName: string;
}

export interface CareerContract {
  clubId: string;
  clubName: string;
  clubTier: 'district' | 'regional' | 'domestic' | 'franchise' | 'international';
  teamType: string;
  salaryPerMatch: number;
  seasonalBonus: number;
  remainingMatches: number;
  status: 'active' | 'expired' | 'negotiating';
}

export interface LeagueOffer {
  id: string;
  leagueName: string;
  teamName: string;
  country: string;
  tier: string;
  salary: number;
  durationMatches: number;
  roleOffered: string;
  reputationRequired: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface LifestyleItem {
  id: string;
  name: string;
  category: 'kit' | 'gear' | 'housing' | 'vehicle' | 'luxury';
  price: number;
  icon: string;
  prestigeBoost: number;
  description: string;
  purchased: boolean;
  purchasedAt?: string;
}

export interface CareerMatchFixture {
  id: string;
  matchNumber: number;
  inGameDate: string;
  competitionName: string;
  format: 'T20' | 'ODI' | 'Test' | 'Club 20';
  venue: string;
  homeTeam: string;
  awayTeam: string;
  playerTeam: string;
  opponentTeam: string;
  teammateNames: string[];
  opponentNames: string[];
  status: 'upcoming' | 'ready' | 'completed';
  result?: {
    winner: string;
    margin: string;
    userPlayerPerformance?: {
      runsScored: number;
      ballsFaced: number;
      fours: number;
      sixes: number;
      oversBowled: number;
      wicketsTaken: number;
      runsConceded: number;
      catches: number;
      isManOfTheMatch?: boolean;
      pointsEarned: number;
      coinsEarned: number;
    };
  };
}

export interface CoachingHistoryItem {
  season: number;
  team: string;
  matches: number;
  wins: number;
  trophy?: string;
}

export interface CoachingProfile {
  active: boolean;
  currentTeam: string | null;
  seasonsCoached: number;
  trophiesWon: CareerTrophy[];
  reputation: number;
  salary: number;
  history: CoachingHistoryItem[];
}

export interface CareerProfile {
  id: string;
  playerName: string;
  age: number;
  birthYear: number;
  currentInGameYear: number;
  country: string;
  division: string;
  district: string;
  jerseyNumber: number;
  role: PlayingRole;
  roleSubType: string;
  currentClub: string;
  clubTier: 'district' | 'regional' | 'domestic' | 'franchise' | 'international';
  careerLevel: number;
  reputation: number; // 0-1000
  marketValue: number; // in coins
  ratings: CareerPlayerRatings;
  stats: CareerStats;
  wallet: number; // career in-game funds
  currentContract: CareerContract;
  clubHistory: Array<{
    clubName: string;
    tier: string;
    seasons: string;
    matches: number;
    runs: number;
    wickets: number;
    salaryEarned: number;
  }>;
  availableOffers: LeagueOffer[];
  internationalStatus: 'ineligible' | 'on_radar' | 'squad_member' | 'playing_xi' | 'captain';
  trophies: CareerTrophy[];
  purchases: LifestyleItem[];
  matchCalendar: CareerMatchFixture[];
  currentMatchIndex: number;
  playingCareerFinished: boolean;
  coachingUnlocked: boolean;
  coachingProfile?: CoachingProfile;
  lifetimeCareerCompleted: boolean;
}

// ----------------------------------------------------
// DREAM TEAM MODE TYPES
// ----------------------------------------------------

export type DreamPlayerRarity = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Legend';

export interface DreamPlayer {
  id: string; // Authoritative player_id from GLOBAL_PLAYERS_DATABASE
  name: string;
  country: string;
  countryCode?: StandardCountryCode;
  category?: PlayerCategory;
  age: number;
  role: PlayingRole;
  roleSubType: string;
  rating: number;
  baseRating?: number;
  maxUpgrade?: number;
  upgradeLevel?: number;
  careerStatus?: 'Active' | 'Retired';
  batting: number;
  bowling: number;
  fielding: number;
  marketValue: number;
  form: 'Excellent' | 'Good' | 'Average' | 'Poor';
  rarity: DreamPlayerRarity;
  isStarter?: boolean;
  jerseyNumber: number;
  teamStats?: {
    matches: number;
    runs: number;
    highestScore: number;
    fifties: number;
    hundreds: number;
    wickets: number;
    bestBowling: string;
    catches: number;
  };
}

export type DivisionTier =
  | 'Starter Division'
  | 'Regional League'
  | 'Challenger Division'
  | 'Premier Division'
  | 'Elite Super League'
  | 'Legendary Champions Division';

export interface DivisionTableEntry {
  position: number;
  teamName: string;
  isUserTeam: boolean;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr: number;
}

export interface DreamTeamRecord {
  highestTeamScore: string;
  biggestWinMargin: string;
  mostRunsByPlayer: string;
  mostWicketsByPlayer: string;
  bestBowlingFigure: string;
  currentWinStreak: number;
  longestWinStreak: number;
  totalMatches: number;
  totalWins: number;
}

export interface DreamTeamTrophy {
  id: string;
  name: string;
  competition: string;
  season: number;
  date: string;
  description: string;
  iconName: string;
}

export interface DreamTeamFixture {
  id: string;
  matchDay: number;
  inGameDate: string;
  matchType: 'competitive' | 'friendly';
  competitionName: string;
  opponentTeam: string;
  opponentRating: number;
  venue: string;
  status: 'upcoming' | 'ready' | 'completed';
  result?: {
    winner: string;
    userScore: string;
    opponentScore: string;
    manOfTheMatch: string;
    userWon: boolean;
    pointsGained: number;
    coinsEarned: number;
  };
}

export interface DreamTeamData {
  id: string;
  teamName: string;
  shortName: string;
  logoBadge: string;
  homeGround: string;
  funds: number; // in-game coins
  division: DivisionTier;
  divisionPoints: number;
  currentSeason: number;
  squad: DreamPlayer[];
  playingXIIds: string[]; // exactly 11 player IDs
  captainId: string;
  viceCaptainId: string;
  battingOrderIds: string[]; // 11 ordered IDs
  bowlingOrderIds: string[]; // bowler IDs
  divisionTable: DivisionTableEntry[];
  calendar: DreamTeamFixture[];
  currentFixtureIndex: number;
  trophies: DreamTeamTrophy[];
  lifetimeStats: {
    totalRuns: number;
    totalWickets: number;
    totalCatches: number;
    totalCenturies: number;
    totalFifties: number;
    totalMatches: number;
    totalWins: number;
    totalLosses: number;
  };
  records: DreamTeamRecord;
  transferHistory: Array<{
    type: 'buy' | 'sell';
    playerName: string;
    playerRating: number;
    price: number;
    date: string;
  }>;
  playerHistoricalContributions: Array<{
    playerId: string;
    playerName: string;
    country: string;
    matches: number;
    runs: number;
    wickets: number;
    highestScore: number;
    bestBowling: string;
    stillInSquad: boolean;
  }>;
}

// ----------------------------------------------------
// MANAGER CAREER MODE TYPES
// ----------------------------------------------------

export type PlayerOwnershipState =
  | 'AVAILABLE'
  | 'SIGNED'
  | 'RELEASED'
  | 'RETIRED'
  | 'CONTRACTED_NON_MANAGER';

export type PlayerTier = 1 | 2 | 3 | 4 | 5 | 6;

export interface PlayerOwnershipHistoryEntry {
  clubId: string;
  clubName: string;
  managerName?: string;
  seasons: string;
  signedDate: string;
  releasedDate?: string;
}

export interface GlobalMarketPlayer {
  id: string; // Authoritative player_id from GLOBAL_PLAYERS_DATABASE
  name: string;
  country: string;
  countryCode?: StandardCountryCode;
  category?: PlayerCategory;
  age: number;
  role: PlayingRole;
  roleSubType: string;
  rating: number;
  baseRating?: number;
  maxUpgrade?: number;
  upgradeLevel?: number;
  careerStatus?: 'Active' | 'Retired';
  batting: number;
  bowling: number;
  fielding: number;
  tier: PlayerTier;
  minReputationRequired: number;
  minClubTierLevel: number;
  signingCost: number;
  salaryPerSeason: number;
  ownershipState: PlayerOwnershipState;
  ownerClubId: string | null;
  ownerClubName: string | null;
  ownerManagerName: string | null;
  signedAt: string | null;
  contractYears: number;
  ownershipHistory: PlayerOwnershipHistoryEntry[];
}

export interface ManagerPlayerContract {
  playerId: string; // Authoritative player_id from GLOBAL_PLAYERS_DATABASE
  name: string;
  country: string;
  countryCode?: StandardCountryCode;
  category?: PlayerCategory;
  age: number;
  role: PlayingRole;
  roleSubType: string;
  rating: number;
  baseRating?: number;
  maxUpgrade?: number;
  upgradeLevel?: number;
  careerStatus?: 'Active' | 'Retired';
  batting: number;
  bowling: number;
  fielding: number;
  tier: PlayerTier;
  salaryPerSeason: number;
  contractYearsRemaining: number;
  startDate: string;
  status: 'active' | 'expired' | 'released';
  matchesPlayed: number;
  runsScored: number;
  wicketsTaken: number;
  catchesTaken: number;
  averageRating: number;
}

export interface ManagerClubTactics {
  battingAggression: 'Conservative' | 'Balanced' | 'Aggressive' | 'Ultra-Attack';
  bowlingStrategy: 'Pace Heavy' | 'Spin Choke' | 'Balanced Rotation' | 'Death Bowling Focus';
  fieldPreset: 'Attacking Ring' | 'Balanced Standard' | 'Boundary Protection' | 'Slip Cordon';
  captaincyStyle: 'Tactical Analyst' | 'Aggressive Leader' | 'Player Motivator';
}

export interface ManagerClubFacilities {
  trainingGround: number; // 1 to 5
  youthAcademy: number; // 1 to 5
  stadiumInfrastructure: number; // 1 to 5
  physioCenter: number; // 1 to 5
}

export interface ManagerTrophy {
  id: string;
  name: string;
  competition: string;
  season: number;
  date: string;
  description: string;
  iconBadge: string;
}

export interface ManagerClubHistorySeason {
  season: number;
  year: number;
  leagueName: string;
  divisionName: string;
  tierLevel: number;
  finalPosition: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  promoted: boolean;
  relegated: boolean;
  trophiesWon: string[];
  topScorerName: string;
  topScorerRuns: number;
  topBowlerName: string;
  topBowlerWickets: number;
}

export interface ManagerClubRecords {
  highestTeamScore: string;
  biggestWinMargin: string;
  longestWinStreak: number;
  allTimeTopScorer: string;
  allTimeTopScorerRuns: number;
  allTimeTopBowler: string;
  allTimeTopBowlerWickets: number;
  mostMatchesPlayedPlayer: string;
  bestSeasonWins: number;
  totalTrophies: number;
}

export interface ManagerDivisionTableEntry {
  position: number;
  teamName: string;
  isUserClub: boolean;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr: number;
}

export interface ManagerFixture {
  id: string;
  matchDay: number;
  inGameDate: string;
  competitionName: string;
  opponentTeam: string;
  opponentRating: number;
  isHome: boolean;
  venue: string;
  status: 'upcoming' | 'ready' | 'completed';
  result?: {
    winner: string;
    userClubScore: string;
    opponentScore: string;
    margin: string;
    userWon: boolean;
    pointsEarned: number;
    financialRevenue: number;
    playerOfTheMatch: string;
  };
}

export interface ManagerCareerStats {
  managerName: string;
  reputation: number; // 100 - 1000
  seasonsManaged: number;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winPercentage: number;
  promotions: number;
  relegations: number;
  trophiesWon: number;
  boardConfidence: number; // 0 - 100%
}

export interface ManagerTransferEntry {
  type: 'buy' | 'sell' | 'release';
  playerId: string;
  playerName: string;
  playerRating: number;
  role?: string;
  country?: string;
  price: number;
  date: string;
  notes?: string;
}

export interface ManagerClubData {
  id: string; // Unique club ID (e.g. 'MC-10924')
  name: string;
  shortName: string;
  country: string;
  divisionRegion: string; // e.g. 'Dhaka', 'New South Wales', 'Punjab'
  logoBadge: string; // Emblem symbol
  primaryColor: string;
  secondaryColor: string;
  stadiumName: string;
  stadiumCapacity: number;
  reputation: number; // 100 - 1000
  overallRating: number; // 0 - 99
  tierLevel: number; // 1: Lower, 2: Regional, 3: National, 4: Premier, 5: Top Domestic, 6: Major Franchise
  currentDivisionName: string;
  currentLeagueName: string;
  currentSeason: number;
  balance: number; // Club treasury balance ($)
  seasonTicketRevenue: number;
  sponsorshipRevenuePerMatch: number;
  squad: ManagerPlayerContract[];
  playingXIIds: string[]; // 11 unique player IDs
  captainId: string;
  viceCaptainId: string;
  battingOrderIds: string[]; // 11 ordered IDs
  bowlingOrderIds: string[]; // Bowler IDs
  tactics: ManagerClubTactics;
  facilities: ManagerClubFacilities;
  trophies: ManagerTrophy[];
  history: ManagerClubHistorySeason[];
  records: ManagerClubRecords;
  divisionTable: ManagerDivisionTableEntry[];
  calendar: ManagerFixture[];
  currentFixtureIndex: number;
  managerStats: ManagerCareerStats;
  transferHistory?: ManagerTransferEntry[];
}

// ----------------------------------------------------
// MULTIPLAYER TOURNAMENT FOUNDATION TYPES
// ----------------------------------------------------

export interface MultiplayerClubEntry {
  clubId: string;
  clubName: string;
  managerName: string;
  country: string;
  rating: number;
  reputation: number;
  squadPlayerIds: string[]; // Exclusive player verification
}

export interface MultiplayerFixture {
  id: string;
  roundName: string;
  homeClubId: string;
  homeClubName: string;
  awayClubId: string;
  awayClubName: string;
  status: 'scheduled' | 'live' | 'completed';
  result?: {
    winnerClubId: string;
    homeScore: string;
    awayScore: string;
    summary: string;
  };
}

export interface MultiplayerTournament {
  id: string;
  name: string;
  tier: string;
  format: 'League + Knockout' | 'Single Elimination' | 'Round Robin';
  status: 'registration' | 'in_progress' | 'completed';
  entryFee: number;
  prizePool: number;
  maxClubs: number;
  registeredClubs: MultiplayerClubEntry[];
  fixtures: MultiplayerFixture[];
  standings: Array<{
    position: number;
    clubId: string;
    clubName: string;
    managerName: string;
    played: number;
    won: number;
    lost: number;
    points: number;
    nrr: number;
  }>;
}

// ----------------------------------------------------
// USER PROFILE & SYSTEM TYPES
// ----------------------------------------------------

export interface UserProfile {
  id: string; // Unique game ID (e.g. local-player or CU-849201)
  googleId?: string | null; // Optional legacy identifier
  email?: string;
  displayName: string;
  photoURL: string;
  createdAt: string; // ISO 8601 string
  lastLoginAt: string; // ISO 8601 string
  currentSelectedMode: GameModeId | null;
  gameProgress: GameProgress;
  currency: UserCurrency;
  settings: UserSettings;

  // Career and Dream Team Data for Master Prompt 2
  careerData: CareerProfile | null;
  dreamTeamData: DreamTeamData | null;

  // Master Prompt 3: Dedicated Manager Club Data
  managerData: ManagerClubData | null;

  // Extensibility fields
  tournamentData: Record<string, unknown> | null;
  playerCollections: Array<Record<string, unknown>>;
  achievements: Array<{ id: string; title: string; unlockedAt: string }>;
  records: Record<string, unknown>;
  rankings: Record<string, unknown>;
}

export interface GameModeInfo {
  id: GameModeId;
  title: string;
  tagline: string;
  description: string;
  category: string;
  badge: string;
  accentColor: string;
  features: string[];
}

export interface AuthGooglePayload {
  googleId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  idToken?: string;
}

export interface AuthResponse {
  success: boolean;
  user: UserProfile;
  isNewUser: boolean;
  message?: string;
}

export type CurrentScreen =
  | 'home'
  | 'career'
  | 'dream_team'
  | 'manager'
  | 'worldwide_tournament'
  | 'universe_special'
  | 'database'
  | 'profile'
  | 'settings';

// ----------------------------------------------------
// GLOBAL PLAYER DATABASE TYPES (MASTER PROMPT 4)
// ----------------------------------------------------

export type StandardCountryCode =
  | 'BAN'
  | 'IND'
  | 'PAK'
  | 'SL'
  | 'WI'
  | 'SA'
  | 'AUS'
  | 'ENG'
  | 'NZ'
  | 'AFG'
  | 'ZIM'
  | 'IRE'
  | 'SCO'
  | 'NEP'
  | 'UAE'
  | 'USA'
  | 'CAN'
  | 'OMA'
  | 'NAM'
  | 'NED';

export type PlayerCategory =
  | 'LEGENDARY'
  | 'ICON'
  | 'SUPERSTAR'
  | 'STAR'
  | 'RISING_STAR'
  | 'DOMESTIC_PRO';

export type PlayerCareerStatus = 'Active' | 'Retired' | 'Emerging' | 'Unavailable';

export type GlobalPlayerOwnershipStatus =
  | 'AVAILABLE'
  | 'MANAGER_OWNED'
  | 'RELEASED'
  | 'RETIRED'
  | 'RESTRICTED';

export interface BattingDetailedAttributes {
  battingAbility: number;
  technique: number;
  timing: number;
  power: number;
  shotSelection: number;
  strikeRotation: number;
  runningBetweenWickets: number;
}

export interface BowlingDetailedAttributes {
  bowlingAbility: number;
  pace: number;
  accuracy: number;
  swing: number;
  seam: number;
  spin: number;
  variation: number;
  control: number;
}

export interface FieldingDetailedAttributes {
  fielding: number;
  catching: number;
  throwing: number;
  groundFielding: number;
  reaction: number;
}

export interface WicketkeepingDetailedAttributes {
  wicketkeeping: number;
  catching: number;
  stumping: number;
  reflexes: number;
}

export interface PlayerCareerStatsSummary {
  matches: number;
  innings?: number;
  runs: number;
  highestScore: number;
  battingAverage: number;
  strikeRate: number;
  hundreds: number;
  fifties: number;
  wickets: number;
  bowlingAverage: number;
  economyRate: number;
  bestBowling: string;
  fiveWickets?: number;
  catches: number;
  stumpings: number;
}

export interface GlobalCricketPlayer {
  player_id: string; // Unique permanent ID (e.g., 'ban_shakib_al_hasan', 'ind_sachin_tendulkar')
  name: string;
  short_name: string;
  country: string;
  country_code: StandardCountryCode;
  age: number;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  career_status: PlayerCareerStatus;
  category: PlayerCategory;
  overall_rating: number; // 61-70 for Star, 71-80 for Superstar, 81-90 for Legendary (+ up to 10 upgrades)
  base_rating: number; // original baseline rating
  max_upgrade: number; // always 10
  upgrade_level: number; // 0 to 10
  potential: number;
  form: number; // 0 to 100
  form_status: 'Excellent' | 'Good' | 'Average' | 'Poor';
  primary_role: PlayingRole;
  secondary_role?: string;
  batting_style: string;
  bowling_style: string;
  batting_attributes: BattingDetailedAttributes;
  bowling_attributes: BowlingDetailedAttributes;
  fielding_attributes: FieldingDetailedAttributes;
  wicketkeeping_attributes?: WicketkeepingDetailedAttributes;
  retired: boolean;
  current_team: string;
  current_league: string;
  market_value: number; // base valuation in coins / dollars
  salary_expectation: number;
  ownership_status: GlobalPlayerOwnershipStatus;
  owner_manager_club_id: string | null;
  owner_manager_club_name?: string | null;
  owner_user_id?: string | null;
  signed_at?: string | null;
  career_statistics: PlayerCareerStatsSummary;
  avatar_url?: string;
  achievements?: string[];
}

export interface WTCTableEntry {
  countryCode: StandardCountryCode;
  countryName: string;
  flag: string;
  seriesPlayed: number;
  seriesTotal: number;
  matchesPlayed: number;
  won: number;
  lost: number;
  drawn: number;
  tied: number;
  penaltyPoints: number;
  points: number; // Won * 12 + Tied * 6 + Drawn * 4 - penaltyPoints
  maxPossiblePoints: number; // matchesPlayed * 12
  pct: number; // (points / maxPossiblePoints) * 100
  rank: number;
}

export interface WTCFixture {
  id: string;
  seriesId: string;
  seriesName: string;
  matchNumberInSeries: number;
  totalMatchesInSeries: number;
  homeTeam: StandardCountryCode;
  awayTeam: StandardCountryCode;
  venue: string;
  city: string;
  pitch: 'GREEN' | 'PACE_FRIENDLY' | 'SPIN_FRIENDLY' | 'DRY' | 'BATTING' | 'BALANCED';
  weather: 'SUNNY' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'HUMID' | 'WINDY';
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'active' | 'completed';
  isUserMatch: boolean;
  isFinal?: boolean;
  result?: {
    winnerCode?: StandardCountryCode | 'DRAW' | 'TIE';
    winnerName: string;
    margin: string;
    summary: string;
    playerOfTheMatch?: string;
    team1Score?: string;
    team2Score?: string;
    team1Innings2?: string;
    team2Innings2?: string;
    userPlayerPerformance?: {
      runsScored: number;
      ballsFaced: number;
      wicketsTaken: number;
      runsConceded: number;
      catches: number;
      isManOfTheMatch: boolean;
    };
  };
}

export interface WTCPlayerProfile {
  id: string;
  name: string;
  age: number;
  countryCode: StandardCountryCode;
  countryName: string;
  jerseyNumber: number;
  role: PlayingRole;
  battingStyle: string;
  bowlingStyle: string;
  overallRating: number;
  category: PlayerCategory;
  attributes: {
    batting: number;
    bowling: number;
    fielding: number;
    stamina: number;
    temperament: number;
  };
}

export interface WTCLeaderboardBatter {
  playerId: string;
  name: string;
  countryCode: StandardCountryCode;
  countryName: string;
  flag: string;
  matches: number;
  innings: number;
  runs: number;
  average: number;
  hundreds: number;
  fifties: number;
  highScore: number;
}

export interface WTCLeaderboardBowler {
  playerId: string;
  name: string;
  countryCode: StandardCountryCode;
  countryName: string;
  flag: string;
  matches: number;
  innings: number;
  wickets: number;
  average: number;
  economy: number;
  fiveWickets: number;
  bestBowling: string;
}

export interface WTCState {
  id: string;
  cycleName: string; // 'World Test Championship 2025–27'
  userCountry: StandardCountryCode;
  squadPlayerIds?: string[]; // Tournament registered squad player IDs
  captainId?: string;
  wicketkeeperId?: string;
  preferredPlayingXI?: string[];
  preferredBattingOrder?: string[];
  userPlayer?: WTCPlayerProfile;
  standings: WTCTableEntry[];
  fixtures: WTCFixture[];
  currentFixtureIndex: number;
  status: 'league_in_progress' | 'final_ready' | 'final_completed';
  finalFixture?: WTCFixture;
  isChampion?: boolean;
  playerLeaderboards: {
    mostRuns: WTCLeaderboardBatter[];
    mostWickets: WTCLeaderboardBowler[];
  };
  teamStats: {
    matches: number;
    won: number;
    lost: number;
    drawn: number;
    tied: number;
    runsScored: number;
    wicketsTaken: number;
    highestTeamScore: number;
    lowestTeamScore: number;
    centuriesScored: number;
    fiveWicketHauls: number;
    potmCount: number;
  };
  userStats?: {
    matches: number;
    innings: number;
    runs: number;
    ballsFaced: number;
    highScore: number;
    fifties: number;
    hundreds: number;
    wickets: number;
    oversBowled: number;
    runsConceded: number;
    fiveWicketHauls: number;
    bestBowling: string;
    catches: number;
    playerOfTheMatchAwards: number;
  };
  awards?: {
    playerOfTheTournament?: { name: string; country: string; flag: string; reason: string };
    bestBatter?: { name: string; country: string; flag: string; runs: number; avg: number };
    bestBowler?: { name: string; country: string; flag: string; wickets: number; avg: number };
    bestFielder?: { name: string; country: string; flag: string; catches: number };
    playerOfTheFinal?: { name: string; country: string; flag: string; performance: string };
  };
}

export interface CountryPlayerDirectoryMeta {
  country: string;
  code: StandardCountryCode;
  flag: string;
  capitalVenue: string;
  totalPlayers: number;
  legendaryCount: number;
  superstarCount: number;
  starCount: number;
  iccRanking: number;
  primaryColor: string;
  description: string;
}

