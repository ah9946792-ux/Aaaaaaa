import { GlobalCricketPlayer, StandardCountryCode } from '../../types';
import { GLOBAL_PLAYERS_DATABASE } from '../../data/players';
import { MatchFormat, PitchCondition, WeatherCondition, MatchPlayerPerformance } from './types';
import { buildOptimalPlayingXI } from './tacticalEngine';

export interface TournamentTableEntry {
  countryCode: StandardCountryCode;
  countryName: string;
  flag: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  runsScored: number;
  oversFaced: number;
  runsConceded: number;
  oversBowled: number;
  netRunRate: number;
}

export interface TournamentFixture {
  id: string;
  stage: 'Group Stage' | 'Super 8s' | 'Semi-Final' | 'Final';
  matchNumber: number;
  teamA: {
    code: StandardCountryCode;
    name: string;
    flag: string;
  };
  teamB: {
    code: StandardCountryCode;
    name: string;
    flag: string;
  };
  venue: string;
  format: MatchFormat;
  pitch: PitchCondition;
  weather: WeatherCondition;
  isPlayed: boolean;
  winnerCode?: StandardCountryCode;
  resultSummary?: string;
}

export interface TournamentData {
  id: string;
  name: string;
  format: MatchFormat;
  totalOvers: number;
  currentStage: 'Group Stage' | 'Super 8s' | 'Semi-Final' | 'Final' | 'Completed';
  currentMatchIndex: number;
  participatingCountries: StandardCountryCode[];
  table: TournamentTableEntry[];
  fixtures: TournamentFixture[];
  trophyWon?: boolean;
}

const COUNTRY_FLAGS: Record<StandardCountryCode, string> = {
  BAN: '🇧🇩',
  IND: '🇮🇳',
  PAK: '🇵🇰',
  SL: '🇱🇰',
  WI: '🌴',
  SA: '🇿🇦',
  AUS: '🇦🇺',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  NZ: '🇳🇿',
  AFG: '🇦🇫',
  ZIM: '🇿🇼',
  IRE: '🇮🇪',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  NEP: '🇳🇵',
  UAE: '🇦🇪',
  USA: '🇺🇸',
  CAN: '🇨🇦',
  OMA: '🇴🇲',
  NAM: '🇳🇦',
  NED: '🇳🇱',
};

const COUNTRY_NAMES: Record<StandardCountryCode, string> = {
  BAN: 'Bangladesh',
  IND: 'India',
  PAK: 'Pakistan',
  SL: 'Sri Lanka',
  WI: 'West Indies',
  SA: 'South Africa',
  AUS: 'Australia',
  ENG: 'England',
  NZ: 'New Zealand',
  AFG: 'Afghanistan',
  ZIM: 'Zimbabwe',
  IRE: 'Ireland',
  SCO: 'Scotland',
  NEP: 'Nepal',
  UAE: 'United Arab Emirates',
  USA: 'United States',
  CAN: 'Canada',
  OMA: 'Oman',
  NAM: 'Namibia',
  NED: 'Netherlands',
};

const VENUES = [
  'Melbourne Cricket Ground (MCG), Australia',
  "Lord's Cricket Ground, London",
  'Eden Gardens, Kolkata',
  'Dubai International Cricket Stadium, UAE',
  'Kensington Oval, Bridgetown, Barbados',
  'SuperSport Park, Centurion, South Africa',
  'Sher-e-Bangla National Cricket Stadium, Dhaka',
  'Gaddafi Stadium, Lahore',
  'R. Premadasa Stadium, Colombo',
  'Seddon Park, Hamilton, New Zealand',
];

const PITCH_OPTIONS: PitchCondition[] = [
  'BATTING',
  'BALANCED',
  'PACE_FRIENDLY',
  'SPIN_FRIENDLY',
  'SLOW',
  'GREEN',
  'DRY',
];

const WEATHER_OPTIONS: WeatherCondition[] = [
  'SUNNY',
  'PARTLY_CLOUDY',
  'CLOUDY',
  'HUMID',
  'WINDY',
];

// Helper: Convert Global Players of country to MatchPlayerPerformance using tactical engine
export function getCountryPlayingXI(
  countryCode: StandardCountryCode,
  format: MatchFormat = 'T20',
  pitch: PitchCondition = 'BALANCED',
  weather: WeatherCondition = 'SUNNY'
): MatchPlayerPerformance[] {
  const countryPlayers = GLOBAL_PLAYERS_DATABASE.filter(
    (p) => p.country_code === countryCode && !p.retired
  );

  // Fallback if not enough active
  const pool = countryPlayers.length >= 11
    ? countryPlayers
    : GLOBAL_PLAYERS_DATABASE.filter((p) => p.country_code === countryCode);

  const rawSquad: MatchPlayerPerformance[] = pool.map((p, idx) => ({
    playerId: p.player_id,
    name: p.name,
    shortName: p.short_name,
    role: p.primary_role,
    overallRating: p.overall_rating,
    condition: 'EXCELLENT',
    form: 'IN_FORM',
    fatigue: 0,
    isCaptain: idx === 0,
    isWicketkeeper: p.primary_role === 'Wicketkeeper-Batter' || idx === 1,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0,
    isOut: false,
    dismissalText: 'not out',
    battingPosition: idx + 1,
    oversBowled: 0,
    ballsBowledInOver: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economyRate: 0,
    dotBalls: 0,
    wides: 0,
    noBalls: 0,
    catches: 0,
    runOuts: 0,
    stumpings: 0,
    boundarySaves: 0,
    impactPoints: 0,
  }));

  return buildOptimalPlayingXI(rawSquad, {
    format,
    pitch,
    weather,
  });
}


// Generate Full Worldwide Tournament (World T20 Cup, 50-Over World Cup, etc.)
export function createWorldwideTournament(
  userCountryCode: StandardCountryCode = 'BAN',
  format: MatchFormat = 'T20'
): TournamentData {
  const defaultNations: StandardCountryCode[] = ['IND', 'AUS', 'ENG', 'PAK', 'SA', 'NZ', 'WI', 'SL', 'AFG'];
  const allCodes: StandardCountryCode[] = [userCountryCode, ...defaultNations];
  const participatingCodes = allCodes.filter((c, idx, arr) => arr.indexOf(c) === idx).slice(0, 8); // Top 8 nations

  const table: TournamentTableEntry[] = participatingCodes.map((code) => ({
    countryCode: code,
    countryName: COUNTRY_NAMES[code] || code,
    flag: COUNTRY_FLAGS[code] || '🏏',
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    noResult: 0,
    points: 0,
    runsScored: 0,
    oversFaced: 0,
    runsConceded: 0,
    oversBowled: 0,
    netRunRate: 0.0,
  }));

  const fixtures: TournamentFixture[] = [];
  let matchNum = 1;

  // Generate Group Round-Robin matches (User plays all opponents + opponent matches)
  for (let i = 0; i < participatingCodes.length; i++) {
    for (let j = i + 1; j < participatingCodes.length; j++) {
      const codeA = participatingCodes[i];
      const codeB = participatingCodes[j];

      fixtures.push({
        id: `wt_match_${matchNum}`,
        stage: 'Group Stage',
        matchNumber: matchNum,
        teamA: {
          code: codeA,
          name: COUNTRY_NAMES[codeA],
          flag: COUNTRY_FLAGS[codeA],
        },
        teamB: {
          code: codeB,
          name: COUNTRY_NAMES[codeB],
          flag: COUNTRY_FLAGS[codeB],
        },
        venue: VENUES[matchNum % VENUES.length],
        format,
        pitch: PITCH_OPTIONS[matchNum % PITCH_OPTIONS.length],
        weather: WEATHER_OPTIONS[matchNum % WEATHER_OPTIONS.length],
        isPlayed: false,
      });
      matchNum++;
    }
  }

  return {
    id: `TOURNAMENT_${Date.now()}`,
    name: format === 'T20' ? 'ICC Men’s T20 World Cup' : format === 'ODI' ? 'ICC Men’s Cricket World Cup (50-Over)' : 'ICC World Test Championship',
    format,
    totalOvers: format === 'T20' ? 20 : format === 'ODI' ? 50 : 90,
    currentStage: 'Group Stage',
    currentMatchIndex: 0,
    participatingCountries: participatingCodes,
    table,
    fixtures,
    trophyWon: false,
  };
}

// Update Tournament Table after a match
export function updateTournamentTable(
  table: TournamentTableEntry[],
  teamACode: StandardCountryCode,
  teamBCode: StandardCountryCode,
  teamARuns: number,
  teamAOvers: number,
  teamBRuns: number,
  teamBOvers: number,
  winnerCode?: StandardCountryCode,
  isNoResult: boolean = false
): TournamentTableEntry[] {
  return table
    .map((entry) => {
      if (entry.countryCode === teamACode) {
        const isWin = winnerCode === teamACode;
        const isLoss = winnerCode === teamBCode;
        const isTie = !winnerCode && !isNoResult;

        const newPlayed = entry.played + 1;
        const newWon = entry.won + (isWin ? 1 : 0);
        const newLost = entry.lost + (isLoss ? 1 : 0);
        const newTied = entry.tied + (isTie ? 1 : 0);
        const newNR = entry.noResult + (isNoResult ? 1 : 0);
        const newPoints = entry.points + (isWin ? 2 : isTie || isNoResult ? 1 : 0);

        const newRunsFor = entry.runsScored + teamARuns;
        const newOversFor = entry.oversFaced + teamAOvers;
        const newRunsAgainst = entry.runsConceded + teamBRuns;
        const newOversAgainst = entry.oversBowled + teamBOvers;

        const forRate = newOversFor > 0 ? newRunsFor / newOversFor : 0;
        const againstRate = newOversAgainst > 0 ? newRunsAgainst / newOversAgainst : 0;
        const newNRR = Number((forRate - againstRate).toFixed(3));

        return {
          ...entry,
          played: newPlayed,
          won: newWon,
          lost: newLost,
          tied: newTied,
          noResult: newNR,
          points: newPoints,
          runsScored: newRunsFor,
          oversFaced: newOversFor,
          runsConceded: newRunsAgainst,
          oversBowled: newOversAgainst,
          netRunRate: newNRR,
        };
      }

      if (entry.countryCode === teamBCode) {
        const isWin = winnerCode === teamBCode;
        const isLoss = winnerCode === teamACode;
        const isTie = !winnerCode && !isNoResult;

        const newPlayed = entry.played + 1;
        const newWon = entry.won + (isWin ? 1 : 0);
        const newLost = entry.lost + (isLoss ? 1 : 0);
        const newTied = entry.tied + (isTie ? 1 : 0);
        const newNR = entry.noResult + (isNoResult ? 1 : 0);
        const newPoints = entry.points + (isWin ? 2 : isTie || isNoResult ? 1 : 0);

        const newRunsFor = entry.runsScored + teamBRuns;
        const newOversFor = entry.oversFaced + teamBOvers;
        const newRunsAgainst = entry.runsConceded + teamARuns;
        const newOversAgainst = entry.oversBowled + teamAOvers;

        const forRate = newOversFor > 0 ? newRunsFor / newOversFor : 0;
        const againstRate = newOversAgainst > 0 ? newRunsAgainst / newOversAgainst : 0;
        const newNRR = Number((forRate - againstRate).toFixed(3));

        return {
          ...entry,
          played: newPlayed,
          won: newWon,
          lost: newLost,
          tied: newTied,
          noResult: newNR,
          points: newPoints,
          runsScored: newRunsFor,
          oversFaced: newOversFor,
          runsConceded: newRunsAgainst,
          oversBowled: newOversAgainst,
          netRunRate: newNRR,
        };
      }

      return entry;
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.netRunRate !== a.netRunRate) return b.netRunRate - a.netRunRate;
      return b.won - a.won;
    });
}
