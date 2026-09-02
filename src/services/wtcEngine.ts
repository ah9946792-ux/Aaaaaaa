import {
  StandardCountryCode,
  GlobalCricketPlayer,
  WTCTableEntry,
  WTCFixture,
  WTCPlayerProfile,
  WTCState,
  WTCLeaderboardBatter,
  WTCLeaderboardBowler,
} from '../types';
import { GLOBAL_PLAYERS_DATABASE } from '../data/players';
import {
  WTC_COUNTRIES,
  INITIAL_WTC_STANDINGS,
  generateWTCFixturesForCountry,
  generateWTCFinalFixture,
} from './wtcData';

const WTC_STORAGE_KEY = 'cricket_universe_wtc_2025_27_state';

// Helper: Check if player is retired (Active/Current Player Rule)
export function isPlayerEligibleForWTC(player: GlobalCricketPlayer): boolean {
  if (player.retired) return false;
  if (player.career_status === 'Retired') return false;
  return true;
}

// Get only current/active players for a WTC nation
export function getAvailableWTCCountryPlayers(countryCode: StandardCountryCode): GlobalCricketPlayer[] {
  return GLOBAL_PLAYERS_DATABASE.filter(
    (p) => p.country_code === countryCode && isPlayerEligibleForWTC(p)
  );
}

// Recalculate and sort WTC Standings by official PCT% rule
export function recalculateWTCStandings(standings: WTCTableEntry[]): WTCTableEntry[] {
  const updated = standings.map((entry) => {
    const pts = entry.won * 12 + entry.tied * 6 + entry.drawn * 4 - entry.penaltyPoints;
    const maxPts = entry.matchesPlayed * 12;
    const pct = maxPts > 0 ? Number(((pts / maxPts) * 100).toFixed(2)) : 0;
    return {
      ...entry,
      points: pts,
      maxPossiblePoints: maxPts,
      pct,
    };
  });

  // Sort by PCT descending, then Total Points, then Wins
  updated.sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    if (b.points !== a.points) return b.points - a.points;
    return b.won - a.won;
  });

  return updated.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}

// Update table after a completed Test match
export function applyMatchToStandings(
  standings: WTCTableEntry[],
  fixture: WTCFixture
): WTCTableEntry[] {
  if (!fixture.result) return standings;

  const res = fixture.result;
  const updated = standings.map((entry) => {
    if (entry.countryCode === fixture.homeTeam || entry.countryCode === fixture.awayTeam) {
      const isHome = entry.countryCode === fixture.homeTeam;
      const isAway = entry.countryCode === fixture.awayTeam;

      let won = entry.won;
      let lost = entry.lost;
      let drawn = entry.drawn;
      let tied = entry.tied;

      if (res.winnerCode === 'DRAW') {
        drawn += 1;
      } else if (res.winnerCode === 'TIE') {
        tied += 1;
      } else if (res.winnerCode === entry.countryCode) {
        won += 1;
      } else {
        lost += 1;
      }

      return {
        ...entry,
        matchesPlayed: entry.matchesPlayed + 1,
        won,
        lost,
        drawn,
        tied,
      };
    }
    return entry;
  });

  return recalculateWTCStandings(updated);
}

// Initialize fresh WTC state for a full National Team Campaign
export function createInitialWTCState(
  userCountry: StandardCountryCode
): WTCState {
  const fixtures = generateWTCFixturesForCountry(userCountry);
  const standings = recalculateWTCStandings(JSON.parse(JSON.stringify(INITIAL_WTC_STANDINGS)));

  const initialLeaderboardBatters: WTCLeaderboardBatter[] = [
    { playerId: 'ind_vk18', name: 'Virat Kohli', countryCode: 'IND', countryName: 'India', flag: '🇮🇳', matches: 0, innings: 0, runs: 0, average: 0, hundreds: 0, fifties: 0, highScore: 0 },
    { playerId: 'aus_ss49', name: 'Steve Smith', countryCode: 'AUS', countryName: 'Australia', flag: '🇦🇺', matches: 0, innings: 0, runs: 0, average: 0, hundreds: 0, fifties: 0, highScore: 0 },
    { playerId: 'eng_jr66', name: 'Joe Root', countryCode: 'ENG', countryName: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', matches: 0, innings: 0, runs: 0, average: 0, hundreds: 0, fifties: 0, highScore: 0 },
    { playerId: 'nz_kw22', name: 'Kane Williamson', countryCode: 'NZ', countryName: 'New Zealand', flag: '🇳🇿', matches: 0, innings: 0, runs: 0, average: 0, hundreds: 0, fifties: 0, highScore: 0 },
  ];

  const initialLeaderboardBowlers: WTCLeaderboardBowler[] = [
    { playerId: 'ind_jb93', name: 'Jasprit Bumrah', countryCode: 'IND', countryName: 'India', flag: '🇮🇳', matches: 0, innings: 0, wickets: 0, average: 0, economy: 0, fiveWickets: 0, bestBowling: '0/0' },
    { playerId: 'aus_pc30', name: 'Pat Cummins', countryCode: 'AUS', countryName: 'Australia', flag: '🇦🇺', matches: 0, innings: 0, wickets: 0, average: 0, economy: 0, fiveWickets: 0, bestBowling: '0/0' },
    { playerId: 'sa_kr25', name: 'Kagiso Rabada', countryCode: 'SA', countryName: 'South Africa', flag: '🇿🇦', matches: 0, innings: 0, wickets: 0, average: 0, economy: 0, fiveWickets: 0, bestBowling: '0/0' },
    { playerId: 'aus_nl67', name: 'Nathan Lyon', countryCode: 'AUS', countryName: 'Australia', flag: '🇦🇺', matches: 0, innings: 0, wickets: 0, average: 0, economy: 0, fiveWickets: 0, bestBowling: '0/0' },
  ];

  const countryPlayers = getAvailableWTCCountryPlayers(userCountry);
  const squadPlayerIds = countryPlayers.map((p) => p.player_id);
  const defaultWk = countryPlayers.find((p) => p.primary_role === 'Wicketkeeper-Batter')?.player_id;
  const defaultCapt = countryPlayers[0]?.player_id;

  const state: WTCState = {
    id: `wtc_state_${Date.now()}`,
    cycleName: 'World Test Championship 2025–27',
    userCountry,
    squadPlayerIds,
    captainId: defaultCapt,
    wicketkeeperId: defaultWk,
    preferredPlayingXI: undefined,
    preferredBattingOrder: undefined,
    standings,
    fixtures,
    currentFixtureIndex: 0,
    status: 'league_in_progress',
    playerLeaderboards: {
      mostRuns: initialLeaderboardBatters,
      mostWickets: initialLeaderboardBowlers,
    },
    teamStats: {
      matches: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      tied: 0,
      runsScored: 0,
      wicketsTaken: 0,
      highestTeamScore: 0,
      lowestTeamScore: 9999,
      centuriesScored: 0,
      fiveWicketHauls: 0,
      potmCount: 0,
    },
    userStats: {
      matches: 0,
      innings: 0,
      runs: 0,
      ballsFaced: 0,
      highScore: 0,
      fifties: 0,
      hundreds: 0,
      wickets: 0,
      oversBowled: 0,
      runsConceded: 0,
      fiveWicketHauls: 0,
      bestBowling: '0/0',
      catches: 0,
      playerOfTheMatchAwards: 0,
    },
  };

  saveWTCState(state);
  return state;
}

// AI Selection for Opponent Teams ONLY (Never for User Team)
export function generateAIOpponentPlayingXI(
  opponentCountry: StandardCountryCode,
  pitch: string
): {
  playingXIIds: string[];
  battingOrderIds: string[];
  captainId: string;
  wicketkeeperId: string;
} {
  const squad = getAvailableWTCCountryPlayers(opponentCountry);
  const isSpinPitch = pitch.toLowerCase().includes('spin') || pitch.toLowerCase().includes('dry');

  const keepers = squad.filter((p) => p.primary_role === 'Wicketkeeper-Batter');
  const batters = squad.filter((p) => p.primary_role === 'Batter');
  const allRounders = squad.filter((p) => p.primary_role === 'All-Rounder');
  const spinners = squad.filter((p) => p.primary_role === 'Bowler' && (p.bowling_style.includes('Spin') || p.bowling_style.includes('Break')));
  const pacers = squad.filter((p) => p.primary_role === 'Bowler' && !p.bowling_style.includes('Spin') && !p.bowling_style.includes('Break'));

  const chosen: GlobalCricketPlayer[] = [];

  // 1. Wicketkeeper (Position 6 or 7)
  const wk = keepers[0] || squad.find((p) => p.primary_role === 'Batter') || squad[0];
  
  // 2. Top Batters (Positions 1 to 5)
  batters.slice(0, 5).forEach((b) => {
    if (!chosen.some((c) => c.player_id === b.player_id)) chosen.push(b);
  });

  // 3. Top All-Rounders
  allRounders.slice(0, 2).forEach((ar) => {
    if (chosen.length < 6 && !chosen.some((c) => c.player_id === ar.player_id)) chosen.push(ar);
  });

  // Add Keeper
  if (!chosen.some((c) => c.player_id === wk.player_id)) chosen.push(wk);

  // 4. Bowlers based on pitch
  if (isSpinPitch) {
    spinners.slice(0, 2).forEach((s) => {
      if (chosen.length < 11 && !chosen.some((c) => c.player_id === s.player_id)) chosen.push(s);
    });
    pacers.slice(0, 2).forEach((p) => {
      if (chosen.length < 11 && !chosen.some((c) => c.player_id === p.player_id)) chosen.push(p);
    });
  } else {
    pacers.slice(0, 3).forEach((p) => {
      if (chosen.length < 11 && !chosen.some((c) => c.player_id === p.player_id)) chosen.push(p);
    });
    spinners.slice(0, 1).forEach((s) => {
      if (chosen.length < 11 && !chosen.some((c) => c.player_id === s.player_id)) chosen.push(s);
    });
  }

  // Fill up to 11
  squad.forEach((p) => {
    if (chosen.length < 11 && !chosen.some((c) => c.player_id === p.player_id)) chosen.push(p);
  });

  const playingXIIds = chosen.slice(0, 11).map((p) => p.player_id);
  const captainId = chosen[0]?.player_id || playingXIIds[0];
  const wicketkeeperId = wk.player_id;

  return {
    playingXIIds,
    battingOrderIds: playingXIIds,
    captainId,
    wicketkeeperId,
  };
}

// Simulate an AI vs AI Test match realistically
export function simulateAITestMatch(fixture: WTCFixture): WTCFixture {
  const homeInfo = WTC_COUNTRIES.find((c) => c.code === fixture.homeTeam)!;
  const awayInfo = WTC_COUNTRIES.find((c) => c.code === fixture.awayTeam)!;

  // Rating advantage + home ground advantage
  const homeAdvantage = 3;
  const homeEffective = homeInfo.rating + homeAdvantage;
  const awayEffective = awayInfo.rating;

  const diff = homeEffective - awayEffective;
  const roll = Math.random() * 100 + diff * 3;

  let winnerCode: StandardCountryCode | 'DRAW' | 'TIE';
  let winnerName: string;
  let margin: string;
  let summary: string;

  // Generate realistic Test match innings scores
  const t1Innings1 = 280 + Math.floor(Math.random() * 180) + (diff > 0 ? 30 : -20);
  const t2Innings1 = 260 + Math.floor(Math.random() * 170) + (diff < 0 ? 30 : -20);

  if (roll > 45) {
    // Home Win
    winnerCode = fixture.homeTeam;
    winnerName = homeInfo.name;
    const byWickets = Math.random() > 0.4;
    const marginNum = byWickets ? Math.floor(Math.random() * 7) + 3 : Math.floor(Math.random() * 120) + 25;
    margin = byWickets ? `by ${marginNum} wickets` : `by ${marginNum} runs`;
    summary = `${homeInfo.name} dominated the key sessions at ${fixture.venue} to claim a commanding ${margin} victory.`;
  } else if (roll > 15) {
    // Away Win
    winnerCode = fixture.awayTeam;
    winnerName = awayInfo.name;
    const byWickets = Math.random() > 0.4;
    const marginNum = byWickets ? Math.floor(Math.random() * 6) + 2 : Math.floor(Math.random() * 95) + 20;
    margin = byWickets ? `by ${marginNum} wickets` : `by ${marginNum} runs`;
    summary = `${awayInfo.name} showed relentless grit in overseas conditions to triumph ${margin}.`;
  } else {
    // Test Draw
    winnerCode = 'DRAW';
    winnerName = 'Match Drawn';
    margin = 'Draw';
    summary = `Resolute rearguard batting on Day 5 secured a hard-fought draw between ${homeInfo.name} and ${awayInfo.name}.`;
  }

  // Pick top player from active country pool
  const winnerPool = getAvailableWTCCountryPlayers(winnerCode === 'DRAW' ? fixture.homeTeam : winnerCode);
  const potm = winnerPool[Math.floor(Math.random() * winnerPool.length)]?.name || `${winnerName} Star Player`;

  return {
    ...fixture,
    status: 'completed',
    result: {
      winnerCode,
      winnerName,
      margin,
      summary,
      playerOfTheMatch: potm,
      team1Score: `${t1Innings1}/10`,
      team2Score: `${t2Innings1}/10`,
    },
  };
}

// Advance tournament fixtures up to the next user match
export function advanceToNextUserFixture(state: WTCState): WTCState {
  let updatedFixtures = [...state.fixtures];
  let updatedStandings = [...state.standings];
  let currentIndex = state.currentFixtureIndex;

  // Process any unplayed AI fixtures that occur before or at the current user match
  for (let i = 0; i < updatedFixtures.length; i++) {
    const fix = updatedFixtures[i];
    if (fix.status === 'scheduled') {
      if (!fix.isUserMatch) {
        // Auto-simulate AI match
        const completedFix = simulateAITestMatch(fix);
        updatedFixtures[i] = completedFix;
        updatedStandings = applyMatchToStandings(updatedStandings, completedFix);
      } else {
        // Found next user match
        currentIndex = i;
        break;
      }
    }
  }

  const newState: WTCState = {
    ...state,
    fixtures: updatedFixtures,
    standings: updatedStandings,
    currentFixtureIndex: currentIndex,
  };

  saveWTCState(newState);
  return newState;
}

// Complete a user match with performance and result
export function recordCompletedUserWTCFixture(
  state: WTCState,
  fixtureId: string,
  resultData: {
    winnerCode: StandardCountryCode | 'DRAW' | 'TIE';
    winnerName: string;
    margin: string;
    summary: string;
    playerOfTheMatch: string;
    team1Score?: string;
    team2Score?: string;
    team1Innings2?: string;
    team2Innings2?: string;
    matchDetails?: {
      userTeamRuns: number;
      userTeamWickets: number;
      userTeamCenturies: number;
      userTeamFiveWickets: number;
    };
    userPlayerPerformance?: {
      runsScored: number;
      ballsFaced: number;
      wicketsTaken: number;
      runsConceded: number;
      catches: number;
      isManOfTheMatch: boolean;
    };
  }
): WTCState {
  const updatedFixtures = state.fixtures.map((f) => {
    if (f.id === fixtureId) {
      return {
        ...f,
        status: 'completed' as const,
        result: resultData,
      };
    }
    return f;
  });

  const targetFixture = updatedFixtures.find((f) => f.id === fixtureId)!;
  let updatedStandings = applyMatchToStandings(state.standings, targetFixture);

  // Update team stats
  const isWon = resultData.winnerCode === state.userCountry;
  const isLost = resultData.winnerCode !== 'DRAW' && resultData.winnerCode !== 'TIE' && resultData.winnerCode !== state.userCountry;
  const isDrawn = resultData.winnerCode === 'DRAW';
  const isTied = resultData.winnerCode === 'TIE';

  const matchDetails = resultData.matchDetails || {
    userTeamRuns: 320,
    userTeamWickets: 10,
    userTeamCenturies: 1,
    userTeamFiveWickets: 0,
  };

  const currentTeamStats = state.teamStats || {
    matches: 0,
    won: 0,
    lost: 0,
    drawn: 0,
    tied: 0,
    runsScored: 0,
    wicketsTaken: 0,
    highestTeamScore: 0,
    lowestTeamScore: 9999,
    centuriesScored: 0,
    fiveWicketHauls: 0,
    potmCount: 0,
  };

  const newTeamStats = {
    ...currentTeamStats,
    matches: (currentTeamStats.matches || 0) + 1,
    won: (currentTeamStats.won || 0) + (isWon ? 1 : 0),
    lost: (currentTeamStats.lost || 0) + (isLost ? 1 : 0),
    drawn: (currentTeamStats.drawn || 0) + (isDrawn ? 1 : 0),
    tied: (currentTeamStats.tied || 0) + (isTied ? 1 : 0),
    runsScored: (currentTeamStats.runsScored || 0) + matchDetails.userTeamRuns,
    wicketsTaken: (currentTeamStats.wicketsTaken || 0) + matchDetails.userTeamWickets,
    highestTeamScore: Math.max(currentTeamStats.highestTeamScore || 0, matchDetails.userTeamRuns),
    lowestTeamScore: Math.min(
      currentTeamStats.lowestTeamScore === 9999 || !currentTeamStats.lowestTeamScore
        ? matchDetails.userTeamRuns
        : currentTeamStats.lowestTeamScore,
      matchDetails.userTeamRuns
    ),
    centuriesScored: (currentTeamStats.centuriesScored || 0) + matchDetails.userTeamCenturies,
    fiveWicketHauls: (currentTeamStats.fiveWicketHauls || 0) + matchDetails.userTeamFiveWickets,
    potmCount: (currentTeamStats.potmCount || 0) + (isWon ? 1 : 0),
  };

  // Optional user player stats update
  const perf = resultData.userPlayerPerformance || {
    runsScored: 0,
    ballsFaced: 0,
    wicketsTaken: 0,
    runsConceded: 0,
    catches: 0,
    isManOfTheMatch: false,
  };
  const is50 = perf.runsScored >= 50 && perf.runsScored < 100;
  const is100 = perf.runsScored >= 100;
  const is5W = perf.wicketsTaken >= 5;

  const currentUserStats = state.userStats || {
    matches: 0,
    innings: 0,
    runs: 0,
    ballsFaced: 0,
    highScore: 0,
    fifties: 0,
    hundreds: 0,
    wickets: 0,
    oversBowled: 0,
    runsConceded: 0,
    fiveWicketHauls: 0,
    bestBowling: '0/0',
    catches: 0,
    playerOfTheMatchAwards: 0,
  };

  const newUserStats = {
    ...currentUserStats,
    matches: (currentUserStats.matches || 0) + 1,
    innings: (currentUserStats.innings || 0) + 1,
    runs: (currentUserStats.runs || 0) + perf.runsScored,
    ballsFaced: (currentUserStats.ballsFaced || 0) + perf.ballsFaced,
    highScore: Math.max(currentUserStats.highScore || 0, perf.runsScored),
    fifties: (currentUserStats.fifties || 0) + (is50 ? 1 : 0),
    hundreds: (currentUserStats.hundreds || 0) + (is100 ? 1 : 0),
    wickets: (currentUserStats.wickets || 0) + perf.wicketsTaken,
    runsConceded: (currentUserStats.runsConceded || 0) + perf.runsConceded,
    fiveWicketHauls: (currentUserStats.fiveWicketHauls || 0) + (is5W ? 1 : 0),
    catches: (currentUserStats.catches || 0) + perf.catches,
    playerOfTheMatchAwards: (currentUserStats.playerOfTheMatchAwards || 0) + (perf.isManOfTheMatch ? 1 : 0),
  };

  // Check if all user league fixtures are finished
  const remainingUserFixtures = updatedFixtures.filter(
    (f) => f.isUserMatch && !f.isFinal && f.status === 'scheduled'
  );

  let newStatus = state.status;
  let finalFixture = state.finalFixture;
  let isChampion = state.isChampion;

  if (targetFixture.isFinal) {
    newStatus = 'final_completed';
    isChampion = resultData.winnerCode === state.userCountry;
  } else if (remainingUserFixtures.length === 0) {
    // League completed: Simulate all remaining AI league matches
    for (let i = 0; i < updatedFixtures.length; i++) {
      if (updatedFixtures[i].status === 'scheduled' && !updatedFixtures[i].isFinal) {
        const completed = simulateAITestMatch(updatedFixtures[i]);
        updatedFixtures[i] = completed;
        updatedStandings = applyMatchToStandings(updatedStandings, completed);
      }
    }

    // Top 2 qualify for Final
    const top2 = [updatedStandings[0], updatedStandings[1]];
    const isUserQualified = top2.some((t) => t.countryCode === state.userCountry);

    if (isUserQualified) {
      const opponent = top2.find((t) => t.countryCode !== state.userCountry)!;
      finalFixture = generateWTCFinalFixture(state.userCountry, opponent.countryCode);
      updatedFixtures.push(finalFixture);
      newStatus = 'final_ready';
    } else {
      newStatus = 'final_completed';
    }
  }

  // Find next unplayed fixture index
  const nextIdx = updatedFixtures.findIndex((f) => f.status === 'scheduled');

  const awards = newStatus === 'final_completed' ? calculateWTCAwards(state, updatedStandings) : state.awards;

  const newState: WTCState = {
    ...state,
    fixtures: updatedFixtures,
    standings: updatedStandings,
    currentFixtureIndex: nextIdx !== -1 ? nextIdx : updatedFixtures.length - 1,
    status: newStatus,
    finalFixture,
    isChampion,
    teamStats: newTeamStats,
    userStats: newUserStats,
    awards,
  };

  saveWTCState(newState);
  return newState;
}

// Calculate tournament awards upon completion
function calculateWTCAwards(state: WTCState, standings: WTCTableEntry[]) {
  const topTeam = standings[0];
  const userCountryInfo = WTC_COUNTRIES.find((c) => c.code === state.userCountry)!;

  const playerOfTheTournament = state.isChampion
    ? {
        name: `Top Performer (${userCountryInfo.name})`,
        country: userCountryInfo.name,
        flag: userCountryInfo.flag,
        reason: `Exceptional match-winning performance throughout the 2025–27 cycle to win the WTC Mace.`,
      }
    : {
        name: 'Jasprit Bumrah',
        country: 'India',
        flag: '🇮🇳',
        reason: '58 Wickets at an outstanding 14.8 Average across 6 Test series',
      };

  return {
    playerOfTheTournament,
    bestBatter: {
      name: 'Joe Root',
      country: 'England',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      runs: 1420,
      avg: 61.7,
    },
    bestBowler: {
      name: 'Pat Cummins',
      country: 'Australia',
      flag: '🇦🇺',
      wickets: 54,
      avg: 18.2,
    },
    bestFielder: {
      name: 'Steve Smith',
      country: 'Australia',
      flag: '🇦🇺',
      catches: 24,
    },
    playerOfTheFinal: state.isChampion
      ? {
        name: `${userCountryInfo.name} Star Captain`,
        country: userCountryInfo.name,
        flag: userCountryInfo.flag,
        performance: `Match-winning leadership and century in the WTC Final at Lord's`,
      }
      : {
        name: 'Travis Head',
        country: 'Australia',
        flag: '🇦🇺',
        performance: "163 (174) in the 1st Innings at Lord's",
      },
  };
}

// Local Storage helpers
export function saveWTCState(state: WTCState): void {
  try {
    localStorage.setItem(WTC_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save WTC State:', err);
  }
}

export function loadWTCState(): WTCState | null {
  try {
    const raw = localStorage.getItem(WTC_STORAGE_KEY);
    if (!raw) return null;
    const parsed: WTCState = JSON.parse(raw);
    if (!parsed || !parsed.userCountry) return null;

    // Ensure teamStats defaults
    if (!parsed.teamStats) {
      parsed.teamStats = {
        matches: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        tied: 0,
        runsScored: 0,
        wicketsTaken: 0,
        highestTeamScore: 0,
        lowestTeamScore: 9999,
        centuriesScored: 0,
        fiveWicketHauls: 0,
        potmCount: 0,
      };
    } else {
      parsed.teamStats.matches = parsed.teamStats.matches ?? 0;
      parsed.teamStats.won = parsed.teamStats.won ?? 0;
      parsed.teamStats.lost = parsed.teamStats.lost ?? 0;
      parsed.teamStats.drawn = parsed.teamStats.drawn ?? 0;
      parsed.teamStats.tied = parsed.teamStats.tied ?? 0;
      parsed.teamStats.runsScored = parsed.teamStats.runsScored ?? 0;
      parsed.teamStats.wicketsTaken = parsed.teamStats.wicketsTaken ?? 0;
      parsed.teamStats.highestTeamScore = parsed.teamStats.highestTeamScore ?? 0;
      parsed.teamStats.lowestTeamScore = parsed.teamStats.lowestTeamScore ?? 9999;
      parsed.teamStats.centuriesScored = parsed.teamStats.centuriesScored ?? 0;
      parsed.teamStats.fiveWicketHauls = parsed.teamStats.fiveWicketHauls ?? 0;
      parsed.teamStats.potmCount = parsed.teamStats.potmCount ?? 0;
    }

    // Ensure userStats defaults
    if (!parsed.userStats) {
      parsed.userStats = {
        matches: 0,
        innings: 0,
        runs: 0,
        ballsFaced: 0,
        highScore: 0,
        fifties: 0,
        hundreds: 0,
        wickets: 0,
        oversBowled: 0,
        runsConceded: 0,
        fiveWicketHauls: 0,
        bestBowling: '0/0',
        catches: 0,
        playerOfTheMatchAwards: 0,
      };
    }

    if (!Array.isArray(parsed.standings)) {
      parsed.standings = [];
    }

    if (!Array.isArray(parsed.fixtures)) {
      parsed.fixtures = [];
    }

    return parsed;
  } catch {
    return null;
  }
}

export function resetWTCState(): void {
  try {
    localStorage.removeItem(WTC_STORAGE_KEY);
  } catch {
    // ignore
  }
}
