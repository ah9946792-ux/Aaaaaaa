import {
  DreamTeamData,
  DreamPlayer,
  DivisionTier,
  DivisionTableEntry,
  DreamTeamFixture,
  DreamTeamTrophy,
  DreamTeamRecord,
} from '../types';
import { MASTER_PLAYER_DATABASE } from '../data/cricketDatabase';

export const DIVISION_TIERS: DivisionTier[] = [
  'Starter Division',
  'Regional League',
  'Challenger Division',
  'Premier Division',
  'Elite Super League',
  'Legendary Champions Division',
];

export function generateInitialDivisionTable(userTeamName: string): DivisionTableEntry[] {
  const opponentNames = [
    'Thunder Strikers XI',
    'Apex Warriors CC',
    'Titan Smashers',
    'Cyber Royals',
    'Vanguard Knights',
  ];

  const table: DivisionTableEntry[] = [
    {
      position: 1,
      teamName: userTeamName,
      isUserTeam: true,
      played: 0,
      won: 0,
      lost: 0,
      points: 0,
      nrr: 0.0,
    },
    ...opponentNames.map((name, i) => ({
      position: i + 2,
      teamName: name,
      isUserTeam: false,
      played: 0,
      won: 0,
      lost: 0,
      points: 0,
      nrr: 0.0,
    })),
  ];

  return table;
}

export function generateDivisionFixtures(
  userTeamName: string,
  division: DivisionTier,
  season: number
): DreamTeamFixture[] {
  const opponentPool = [
    { name: 'Thunder Strikers XI', rating: 68 },
    { name: 'Apex Warriors CC', rating: 70 },
    { name: 'Titan Smashers', rating: 71 },
    { name: 'Cyber Royals', rating: 69 },
    { name: 'Vanguard Knights', rating: 72 },
    { name: 'Cosmic Blazers', rating: 74 },
  ];

  const fixtures: DreamTeamFixture[] = [];
  const baseMonth = 9;

  for (let i = 0; i < 6; i++) {
    const opp = opponentPool[i % opponentPool.length];
    const day = 10 + i * 3;
    const inGameDate = `${2026 + season - 1}-${String(baseMonth).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    fixtures.push({
      id: `dtf_s${season}_m${i + 1}`,
      matchDay: i + 1,
      inGameDate,
      matchType: 'competitive',
      competitionName: `${division} - Matchday ${i + 1}`,
      opponentTeam: opp.name,
      opponentRating: opp.rating,
      venue: i % 2 === 0 ? 'Home Arena' : `${opp.name} Stadium`,
      status: i === 0 ? 'ready' : 'upcoming',
    });
  }

  return fixtures;
}

export function createInitialDreamTeam(params: {
  teamName: string;
  shortName: string;
  logoBadge: string;
  homeGround: string;
}): DreamTeamData {
  // Grab all starter players from master database
  const starterPlayers = MASTER_PLAYER_DATABASE.filter((p) => p.isStarter).map((p) => ({
    ...p,
    teamStats: {
      matches: 0,
      runs: 0,
      highestScore: 0,
      fifties: 0,
      hundreds: 0,
      wickets: 0,
      bestBowling: '-',
      catches: 0,
    },
  }));

  const playingXIIds = starterPlayers.slice(0, 11).map((p) => p.id);
  const captainId = playingXIIds[4] || playingXIIds[0]; // All-Rounder captain
  const viceCaptainId = playingXIIds[0];

  const division: DivisionTier = 'Starter Division';
  const divisionTable = generateInitialDivisionTable(params.teamName);
  const calendar = generateDivisionFixtures(params.teamName, division, 1);

  const initialRecords: DreamTeamRecord = {
    highestTeamScore: '0/0',
    biggestWinMargin: 'None yet',
    mostRunsByPlayer: 'None yet',
    mostWicketsByPlayer: 'None yet',
    bestBowlingFigure: 'None yet',
    currentWinStreak: 0,
    longestWinStreak: 0,
    totalMatches: 0,
    totalWins: 0,
  };

  return {
    id: `dt_${Date.now()}`,
    teamName: params.teamName,
    shortName: params.shortName.toUpperCase(),
    logoBadge: params.logoBadge || 'Shield',
    homeGround: params.homeGround || 'Dream Universe Stadium',
    funds: 6000, // starting transfer coins
    division,
    divisionPoints: 0,
    currentSeason: 1,
    squad: starterPlayers,
    playingXIIds,
    captainId,
    viceCaptainId,
    battingOrderIds: [...playingXIIds],
    bowlingOrderIds: playingXIIds.slice(6, 11),
    divisionTable,
    calendar,
    currentFixtureIndex: 0,
    trophies: [],
    lifetimeStats: {
      totalRuns: 0,
      totalWickets: 0,
      totalCatches: 0,
      totalCenturies: 0,
      totalFifties: 0,
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
    },
    records: initialRecords,
    transferHistory: [],
    playerHistoricalContributions: [],
  };
}

export function buyPlayerForDreamTeam(
  dreamTeam: DreamTeamData,
  player: DreamPlayer
): { success: boolean; updatedTeam?: DreamTeamData; error?: string } {
  if (dreamTeam.funds < player.marketValue) {
    return { success: false, error: 'Insufficient transfer funds to sign this player.' };
  }
  if (dreamTeam.squad.length >= 20) {
    return { success: false, error: 'Squad is full (maximum 20 players allowed).' };
  }
  if (dreamTeam.squad.some((p) => p.id === player.id)) {
    return { success: false, error: 'Player is already signed to your squad.' };
  }

  const updated = structuredClone(dreamTeam) as DreamTeamData;
  updated.funds -= player.marketValue;

  const squadPlayer: DreamPlayer = {
    ...player,
    teamStats: {
      matches: 0,
      runs: 0,
      highestScore: 0,
      fifties: 0,
      hundreds: 0,
      wickets: 0,
      bestBowling: '-',
      catches: 0,
    },
  };

  updated.squad.push(squadPlayer);
  updated.transferHistory.unshift({
    type: 'buy',
    playerName: player.name,
    playerRating: player.rating,
    price: player.marketValue,
    date: new Date().toLocaleDateString(),
  });

  return { success: true, updatedTeam: updated };
}

export function sellPlayerFromDreamTeam(
  dreamTeam: DreamTeamData,
  playerId: string
): { success: boolean; updatedTeam?: DreamTeamData; error?: string } {
  if (dreamTeam.squad.length <= 11) {
    return {
      success: false,
      error: 'Cannot sell player. You must maintain at least 11 players in your squad.',
    };
  }

  const playerToSell = dreamTeam.squad.find((p) => p.id === playerId);
  if (!playerToSell) {
    return { success: false, error: 'Player not found in squad.' };
  }

  const updated = structuredClone(dreamTeam) as DreamTeamData;
  const sellValue = Math.round(playerToSell.marketValue * 0.75);
  updated.funds += sellValue;

  // Record historical contributions
  if (playerToSell.teamStats && playerToSell.teamStats.matches > 0) {
    updated.playerHistoricalContributions.push({
      playerId: playerToSell.id,
      playerName: playerToSell.name,
      country: playerToSell.country,
      matches: playerToSell.teamStats.matches,
      runs: playerToSell.teamStats.runs,
      wickets: playerToSell.teamStats.wickets,
      highestScore: playerToSell.teamStats.highestScore,
      bestBowling: playerToSell.teamStats.bestBowling,
      stillInSquad: false,
    });
  }

  // Remove from squad
  updated.squad = updated.squad.filter((p) => p.id !== playerId);

  // If in Playing XI, replace with first available bench player
  if (updated.playingXIIds.includes(playerId)) {
    const benchPlayer = updated.squad.find((p) => !updated.playingXIIds.includes(p.id));
    if (benchPlayer) {
      updated.playingXIIds = updated.playingXIIds.map((id) => (id === playerId ? benchPlayer.id : id));
    } else {
      updated.playingXIIds = updated.squad.slice(0, 11).map((p) => p.id);
    }
  }

  // Re-verify Captain and Vice Captain
  if (updated.captainId === playerId) {
    updated.captainId = updated.playingXIIds[0];
  }
  if (updated.viceCaptainId === playerId) {
    updated.viceCaptainId = updated.playingXIIds[1];
  }

  updated.transferHistory.unshift({
    type: 'sell',
    playerName: playerToSell.name,
    playerRating: playerToSell.rating,
    price: sellValue,
    date: new Date().toLocaleDateString(),
  });

  return { success: true, updatedTeam: updated };
}

export function updateDreamTeamAfterMatch(
  dreamTeam: DreamTeamData,
  matchData: {
    isFriendly: boolean;
    userWon: boolean;
    userRuns: number;
    userWickets: number;
    opponentRuns: number;
    opponentWickets: number;
    manOfTheMatchName: string;
    playerPerformances: Array<{
      playerId: string;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      wickets: number;
      runsConceded: number;
      catches: number;
    }>;
  }
): DreamTeamData {
  const updated = structuredClone(dreamTeam) as DreamTeamData;
  const fixture = updated.calendar[updated.currentFixtureIndex];

  const earnedCoins = matchData.userWon ? 1200 : 500;
  updated.funds += earnedCoins;

  // 1. Update Lifetime Squad & Player Stats
  matchData.playerPerformances.forEach((perf) => {
    const squadPlayer = updated.squad.find((p) => p.id === perf.playerId);
    if (squadPlayer) {
      if (!squadPlayer.teamStats) {
        squadPlayer.teamStats = {
          matches: 0,
          runs: 0,
          highestScore: 0,
          fifties: 0,
          hundreds: 0,
          wickets: 0,
          bestBowling: '-',
          catches: 0,
        };
      }
      const st = squadPlayer.teamStats;
      st.matches += 1;
      st.runs += perf.runs;
      st.highestScore = Math.max(st.highestScore, perf.runs);
      if (perf.runs >= 100) st.hundreds += 1;
      else if (perf.runs >= 50) st.fifties += 1;

      st.wickets += perf.wickets;
      st.catches += perf.catches;
      if (perf.wickets > 0) {
        st.bestBowling = `${perf.wickets}/${perf.runsConceded}`;
      }
    }
  });

  // 2. Team Lifetime Stats
  updated.lifetimeStats.totalMatches += 1;
  if (matchData.userWon) {
    updated.lifetimeStats.totalWins += 1;
    updated.records.currentWinStreak += 1;
    updated.records.longestWinStreak = Math.max(
      updated.records.longestWinStreak,
      updated.records.currentWinStreak
    );
  } else {
    updated.lifetimeStats.totalLosses += 1;
    updated.records.currentWinStreak = 0;
  }
  updated.lifetimeStats.totalRuns += matchData.userRuns;
  updated.lifetimeStats.totalWickets += matchData.opponentWickets;

  // Update records
  const userScoreStr = `${matchData.userRuns}/${matchData.userWickets}`;
  const oppScoreStr = `${matchData.opponentRuns}/${matchData.opponentWickets}`;
  updated.records.totalMatches = updated.lifetimeStats.totalMatches;
  updated.records.totalWins = updated.lifetimeStats.totalWins;

  if (matchData.userRuns > 180) {
    updated.records.highestTeamScore = `${matchData.userRuns}/${matchData.userWickets}`;
  }

  // 3. Mark competitive fixture result
  if (fixture && !matchData.isFriendly) {
    fixture.status = 'completed';
    fixture.result = {
      winner: matchData.userWon ? updated.teamName : fixture.opponentTeam,
      userScore: userScoreStr,
      opponentScore: oppScoreStr,
      manOfTheMatch: matchData.manOfTheMatchName,
      userWon: matchData.userWon,
      pointsGained: matchData.userWon ? 2 : 0,
      coinsEarned: earnedCoins,
    };

    // Update Division Standings
    const userRow = updated.divisionTable.find((r) => r.isUserTeam);
    if (userRow) {
      userRow.played += 1;
      if (matchData.userWon) {
        userRow.won += 1;
        userRow.points += 2;
        userRow.nrr += Number((Math.random() * 0.4 + 0.1).toFixed(2));
      } else {
        userRow.lost += 1;
        userRow.nrr -= Number((Math.random() * 0.3 + 0.1).toFixed(2));
      }
    }

    // Advance AI opponent results
    updated.divisionTable.forEach((row) => {
      if (!row.isUserTeam) {
        row.played += 1;
        const aiWon = Math.random() > 0.5;
        if (aiWon) {
          row.won += 1;
          row.points += 2;
        } else {
          row.lost += 1;
        }
      }
    });

    // Re-sort table
    updated.divisionTable.sort((a, b) => b.points - a.points || b.nrr - a.nrr);
    updated.divisionTable.forEach((r, idx) => {
      r.position = idx + 1;
    });

    // Advance Calendar
    if (updated.currentFixtureIndex < updated.calendar.length - 1) {
      updated.currentFixtureIndex += 1;
      updated.calendar[updated.currentFixtureIndex].status = 'ready';
    } else {
      // Season End!
      const finalUserPos = updated.divisionTable.find((r) => r.isUserTeam)?.position || 6;
      if (finalUserPos <= 2) {
        // Promotion!
        const curDivIdx = DIVISION_TIERS.indexOf(updated.division);
        if (curDivIdx < DIVISION_TIERS.length - 1) {
          const newDiv = DIVISION_TIERS[curDivIdx + 1];
          updated.division = newDiv;

          // Award Division Trophy
          const trophy: DreamTeamTrophy = {
            id: `dt_trophy_${Date.now()}`,
            name: `${updated.division} Champions Cup`,
            competition: updated.division,
            season: updated.currentSeason,
            date: new Date().toLocaleDateString(),
            description: `Finished #1 in ${updated.division} with commanding promotion!`,
            iconName: 'Trophy',
          };
          updated.trophies.unshift(trophy);
        }
      }

      updated.currentSeason += 1;
      updated.divisionTable = generateInitialDivisionTable(updated.teamName);
      updated.calendar = generateDivisionFixtures(
        updated.teamName,
        updated.division,
        updated.currentSeason
      );
      updated.currentFixtureIndex = 0;
    }
  }

  return updated;
}
