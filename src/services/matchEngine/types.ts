import { GlobalCricketPlayer, PlayingRole, StandardCountryCode } from '../../types';

export type MatchFormat = 'T20' | 'ODI' | 'TEST' | 'SUPER_OVER' | 'THE_HUNDRED' | 'CUSTOM';

export type PitchCondition =
  | 'BATTING'
  | 'BALANCED'
  | 'PACE_FRIENDLY'
  | 'SPIN_FRIENDLY'
  | 'SLOW'
  | 'GREEN'
  | 'DRY';

export type WeatherCondition =
  | 'SUNNY'
  | 'PARTLY_CLOUDY'
  | 'CLOUDY'
  | 'HUMID'
  | 'WINDY'
  | 'RAIN'
  | 'HEAVY_RAIN';

export type PlayerConditionState =
  | 'EXCELLENT'
  | 'GOOD'
  | 'NORMAL'
  | 'BELOW_AVERAGE'
  | 'POOR'
  | 'INJURED';

export type PlayerFormState =
  | 'EXCELLENT'
  | 'IN_FORM'
  | 'NORMAL'
  | 'OUT_OF_FORM'
  | 'POOR';

export type BattingDecisionType =
  | 'DEFEND'
  | 'ROTATE_STRIKE'
  | 'DRIVE_FOUR'
  | 'LOFTED_SIX'
  | 'LATE_CUT_TWO'
  | 'AGGRESSIVE_ATTACK'
  | 'CONSERVATIVE_NUDGE';

export type FastBowlingDelivery =
  | 'YORKER'
  | 'GOOD_LENGTH'
  | 'SHORT_BALL'
  | 'BOUNCER'
  | 'FULL_BALL'
  | 'SLOWER_BALL'
  | 'OUTSWINGER'
  | 'INSWINGER'
  | 'REVERSE_SWING';

export type SpinBowlingDelivery =
  | 'OFF_BREAK'
  | 'LEG_BREAK'
  | 'GOOGLY'
  | 'FLIGHTED_BALL'
  | 'ARM_BALL'
  | 'TOPSPINTURN'
  | 'DOOSRA_CARROM';

export type BowlingDeliveryChoice = FastBowlingDelivery | SpinBowlingDelivery;

export type FieldingEventAction =
  | 'ATTEMPT_SPECTACULAR_CATCH'
  | 'SAFE_CATCH_POSITION'
  | 'AGGRESSIVE_DIRECT_HIT'
  | 'SAFE_THROW_TO_KEEPER'
  | 'SLIDING_BOUNDARY_SAVE';

export type WicketDismissalType =
  | 'BOWLED'
  | 'CAUGHT'
  | 'LBW'
  | 'RUN_OUT'
  | 'STUMPED'
  | 'HIT_WICKET'
  | 'RETIRED_HURT'
  | 'OBSTRUCTING_FIELD';

export interface MatchPlayerPerformance {
  playerId: string;
  name: string;
  shortName: string;
  role: PlayingRole;
  isUserPlayer?: boolean;
  overallRating: number;
  condition: PlayerConditionState;
  form: PlayerFormState;
  fatigue: number; // 0 to 100
  isCaptain?: boolean;
  isWicketkeeper?: boolean;

  // Batting card
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalText: string;
  dismissalType?: WicketDismissalType;
  bowlerWhoDismissed?: string;
  fielderWhoAssisted?: string;
  battingPosition: number;

  // Bowling card
  oversBowled: number;
  ballsBowledInOver: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economyRate: number;
  dotBalls: number;
  wides: number;
  noBalls: number;

  // Fielding card
  catches: number;
  runOuts: number;
  stumpings: number;
  boundarySaves: number;

  // Impact Rating
  impactPoints: number;
}

export interface DRSReviewState {
  teamName: string;
  reviewsRemaining: number;
  reviewsUsed: number;
  successfulReviews: number;
  isUnderReview: boolean;
  reviewType: 'LBW' | 'CAUGHT_BEHIND' | 'RUN_OUT';
  originalDecision: 'OUT' | 'NOT_OUT';
  pitching: 'IN_LINE' | 'OUTSIDE_OFF' | 'OUTSIDE_LEG';
  impact: 'IN_LINE' | 'OUTSIDE_OFF' | 'UMPIRES_CALL';
  wickets: 'HITTING' | 'MISSING' | 'UMPIRES_CALL';
  finalDecision: 'OUT' | 'NOT_OUT';
  reviewRetained: boolean;
  explanation: string;
}

export interface RainInterruptionState {
  isInterrupted: boolean;
  rainIntensity: 'LIGHT' | 'MODERATE' | 'HEAVY';
  originalTotalOvers: number;
  revisedOvers: number;
  oversLost: number;
  originalTarget: number;
  dlsRevisedTarget: number;
  statusMessage: string;
  isAbandoned: boolean;
}

export interface BallByBallEvent {
  id: string;
  ballNumberInMatch: number;
  inningsNumber: 1 | 2 | 3 | 4;
  overIndex: number; // 0-based
  ballInOver: number; // 1 to 6 (legal)
  legalBallNumber: number;
  
  bowler: MatchPlayerPerformance;
  striker: MatchPlayerPerformance;
  nonStriker: MatchPlayerPerformance;

  deliveryChoice?: BowlingDeliveryChoice;
  battingChoice?: BattingDecisionType;

  runsScored: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
  };
  totalRunsOnBall: number;

  isLegalDelivery: boolean;
  isBoundaryFour: boolean;
  isBoundarySix: boolean;
  isFreeHit: boolean;
  isNextFreeHit: boolean;

  isWicket: boolean;
  wicketType?: WicketDismissalType;
  dismissedPlayerName?: string;
  fielderName?: string;

  drsEvent?: DRSReviewState;
  rainEvent?: RainInterruptionState;
  playerInjury?: {
    playerName: string;
    description: string;
    severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  };

  scoreAfterBall: {
    runs: number;
    wickets: number;
    oversString: string; // e.g. "12.4"
  };

  commentary: string;
}

export interface InningsScorecard {
  inningsNumber: 1 | 2 | 3 | 4;
  battingTeamName: string;
  bowlingTeamName: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  ballsInCurrentOver: number;
  isDeclared?: boolean;
  isAllOut: boolean;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    total: number;
  };
  currentRunRate: number;
  requiredRunRate?: number;
  target?: number;
  batters: MatchPlayerPerformance[];
  bowlers: MatchPlayerPerformance[];
  fallOfWickets: Array<{
    wicketNumber: number;
    score: number;
    overs: string;
    playerName: string;
  }>;
  partnerships: Array<{
    batter1Name: string;
    batter1Runs: number;
    batter2Name: string;
    batter2Runs: number;
    totalRuns: number;
    balls: number;
  }>;
  currentPartnership: {
    batter1Name: string;
    batter1Runs: number;
    batter2Name: string;
    batter2Runs: number;
    totalRuns: number;
    balls: number;
  };
}

export interface MatchTeamDetails {
  id: string;
  name: string;
  shortName: string;
  countryCode?: StandardCountryCode;
  logoBadge?: string;
  isUserTeam: boolean;
  controlMode?: 'USER' | 'AI';
  playingXI: MatchPlayerPerformance[];
  fullSquad?: MatchPlayerPerformance[];
  reviewsRemaining?: number;
  totalOversTarget?: number;
  captainPlayerId?: string;
  wicketkeeperPlayerId?: string;
}

export interface MatchTeamsSetup {
  teamA: MatchTeamDetails;
  teamB: MatchTeamDetails;
}

export interface MatchContextConfig {
  matchId: string; // Permanent Unique ID e.g. "MATCH-2026-88192"
  gameMode?: 'career' | 'dream_team' | 'manager' | 'worldwide_tournament' | 'universe_special' | 'friendly';
  competitionName: string;
  season?: number;
  matchDay?: number;
  venue: string;
  format: MatchFormat;
  totalInnings?: number;
  maxOversPerInnings: number;
  pitch: PitchCondition;
  weather: WeatherCondition;
  dlsApplicable: boolean;
  dayNight?: boolean;
  userPlayerId?: string; // For career mode
  userTeamId?: string;
}

export interface MatchAwards {
  manOfTheMatch: {
    player: MatchPlayerPerformance;
    teamName: string;
    reason: string;
    points: number;
  };
  bestBatter: {
    player: MatchPlayerPerformance;
    teamName: string;
    runs: number;
    strikeRate: number;
  };
  bestBowler: {
    player: MatchPlayerPerformance;
    teamName: string;
    wickets: number;
    economy: number;
  };
  bestFielder: {
    player: MatchPlayerPerformance;
    teamName: string;
    catches: number;
    runOuts: number;
  };
}

export interface CompletedMatchReport {
  matchId: string;
  competition: string;
  venue: string;
  format: MatchFormat;
  pitch: PitchCondition;
  weather: WeatherCondition;
  date: string;
  teams: {
    teamA: string;
    teamB: string;
  };
  toss: {
    winnerName: string;
    decision: 'BAT' | 'BOWL';
  };
  innings1: InningsScorecard;
  innings2?: InningsScorecard;
  result: {
    winnerName: string;
    isTie: boolean;
    isNoResult: boolean;
    isSuperOver?: boolean;
    marginText: string;
    summary: string;
  };
  awards: MatchAwards;
  processedAndSaved: boolean;
}
