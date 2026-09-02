import { CompletedMatchReport } from './types';
import { CareerProfile, DreamTeamData, ManagerClubData } from '../../types';
import { updateCareerAfterMatch } from '../careerService';
import { updateDreamTeamAfterMatch } from '../dreamTeamService';

// Set of processed Match IDs to ensure Anti-Duplicate Protection
const PROCESSED_MATCH_IDS = new Set<string>();

export function isMatchAlreadyProcessed(matchId: string): boolean {
  if (PROCESSED_MATCH_IDS.has(matchId)) return true;
  try {
    const saved = localStorage.getItem(`processed_match_${matchId}`);
    return saved === 'true';
  } catch {
    return false;
  }
}

export function markMatchAsProcessed(matchId: string): void {
  PROCESSED_MATCH_IDS.add(matchId);
  try {
    localStorage.setItem(`processed_match_${matchId}`, 'true');
  } catch {
    // ignore
  }
}

// 1. Process Career Mode Match Result
export function processCareerMatchIntegration(
  career: CareerProfile,
  report: CompletedMatchReport
): CareerProfile {
  if (isMatchAlreadyProcessed(report.matchId)) {
    console.warn(`Match ${report.matchId} already processed! Preventing duplicate stat updates.`);
    return career;
  }

  // Find user player in the report
  const allBatters = [...report.innings1.batters, ...(report.innings2?.batters || [])];
  const allBowlers = [...report.innings1.bowlers, ...(report.innings2?.bowlers || [])];

  const userBatter = allBatters.find((p) => p.isUserPlayer || p.name === career.playerName);
  const userBowler = allBowlers.find((p) => p.isUserPlayer || p.name === career.playerName);

  const runsScored = userBatter?.runs || 0;
  const ballsFaced = userBatter?.balls || 0;
  const fours = userBatter?.fours || 0;
  const sixes = userBatter?.sixes || 0;

  const oversBowled = userBowler?.oversBowled || 0;
  const runsConceded = userBowler?.runsConceded || 0;
  const wicketsTaken = userBowler?.wickets || 0;

  const catchesTaken = (userBatter?.catches || 0) + (userBowler?.catches || 0);
  const isMotm = report.awards.manOfTheMatch.player.name === career.playerName;

  const updatedCareer = updateCareerAfterMatch(career, {
    runsScored,
    ballsFaced,
    fours,
    sixes,
    oversBowled,
    wicketsTaken,
    runsConceded,
    catches: catchesTaken,
    isManOfTheMatch: isMotm,
  });

  markMatchAsProcessed(report.matchId);
  return updatedCareer;
}

// 2. Process Dream Team Match Result
export function processDreamTeamMatchIntegration(
  dreamTeam: DreamTeamData,
  report: CompletedMatchReport
): DreamTeamData {
  if (isMatchAlreadyProcessed(report.matchId)) {
    console.warn(`Match ${report.matchId} already processed!`);
    return dreamTeam;
  }

  const isUserTeamWinner = report.result.winnerName === dreamTeam.teamName;
  const userInnings = report.innings1.battingTeamName === dreamTeam.teamName ? report.innings1 : report.innings2!;
  const oppInnings = report.innings1.battingTeamName === dreamTeam.teamName ? report.innings2! : report.innings1;

  const userRuns = userInnings.totalRuns;
  const userWickets = userInnings.totalWickets;
  const oppRuns = oppInnings.totalRuns;
  const oppWickets = oppInnings.totalWickets;

  const potmPlayer = report.awards.manOfTheMatch.player;
  const potmName = potmPlayer.name;

  const playerPerformances = dreamTeam.squad.map((squadPlayer) => {
    const batEntry = userInnings.batters.find((b) => b.playerId === squadPlayer.id || b.name === squadPlayer.name);
    const bowlEntry = oppInnings.bowlers.find((b) => b.playerId === squadPlayer.id || b.name === squadPlayer.name);

    return {
      playerId: squadPlayer.id,
      runs: batEntry?.runs || 0,
      balls: batEntry?.balls || 0,
      fours: batEntry?.fours || 0,
      sixes: batEntry?.sixes || 0,
      wickets: bowlEntry?.wickets || 0,
      runsConceded: bowlEntry?.runsConceded || 0,
      catches: (batEntry?.catches || 0) + (bowlEntry?.catches || 0),
    };
  });

  const updatedTeam = updateDreamTeamAfterMatch(dreamTeam, {
    isFriendly: false,
    userWon: isUserTeamWinner,
    userRuns,
    userWickets,
    opponentRuns: oppRuns,
    opponentWickets: oppWickets,
    manOfTheMatchName: potmName,
    playerPerformances,
  });

  markMatchAsProcessed(report.matchId);
  return updatedTeam;
}

// 3. Process Manager Mode Match Result
export function processManagerMatchIntegration(
  club: ManagerClubData,
  report: CompletedMatchReport
): ManagerClubData {
  if (isMatchAlreadyProcessed(report.matchId)) {
    console.warn(`Match ${report.matchId} already processed!`);
    return club;
  }

  const isUserWinner = report.result.winnerName === club.name;
  const userInnings = report.innings1.battingTeamName === club.name ? report.innings1 : report.innings2!;
  const oppInnings = report.innings1.battingTeamName === club.name ? report.innings2! : report.innings1;

  const userRuns = userInnings.totalRuns;
  const oppRuns = oppInnings.totalRuns;

  // Financial Revenue
  const isHomeMatch = club.calendar[club.currentFixtureIndex]?.isHome ?? true;
  const ticketRevenue = isHomeMatch ? club.stadiumCapacity * 1.6 : 0;
  const sponsorBonus = isUserWinner ? club.sponsorshipRevenuePerMatch * 1.5 : club.sponsorshipRevenuePerMatch;
  const matchRevenue = Math.round(ticketRevenue + sponsorBonus);

  // Update Squad Stats & Condition
  const updatedSquad = club.squad.map((player) => {
    const batEntry = userInnings.batters.find((b) => b.playerId === player.playerId || b.name === player.name);
    const bowlEntry = oppInnings.bowlers.find((b) => b.playerId === player.playerId || b.name === player.name);

    if (batEntry || bowlEntry) {
      const addedRuns = batEntry?.runs || 0;
      const addedWickets = bowlEntry?.wickets || 0;
      const addedCatches = (batEntry?.catches || 0) + (bowlEntry?.catches || 0);

      return {
        ...player,
        matchesPlayed: (player.matchesPlayed || 0) + 1,
        runsScored: (player.runsScored || 0) + addedRuns,
        wicketsTaken: (player.wicketsTaken || 0) + addedWickets,
        catchesTaken: (player.catchesTaken || 0) + addedCatches,
      };
    }
    return player;
  });

  // Update Division Table
  const updatedTable = club.divisionTable
    .map((row) => {
      if (row.isUserClub) {
        const played = row.played + 1;
        const won = row.won + (isUserWinner ? 1 : 0);
        const lost = row.lost + (!isUserWinner && !report.result.isTie ? 1 : 0);
        const points = row.points + (isUserWinner ? 2 : report.result.isTie ? 1 : 0);
        const runDelta = userRuns - oppRuns;
        const nrr = Number((row.nrr + runDelta / 20).toFixed(2));
        return { ...row, played, won, lost, points, nrr };
      }
      return row;
    })
    .sort((a, b) => b.points - a.points || b.nrr - a.nrr);

  // Advance fixture index
  const nextFixtureIndex = Math.min(club.calendar.length - 1, club.currentFixtureIndex + 1);

  // Update calendar fixture status
  const currentFixture = club.calendar[club.currentFixtureIndex];
  const updatedCalendar = club.calendar.map((f, idx) => {
    if (idx === club.currentFixtureIndex) {
      return {
        ...f,
        status: 'completed' as const,
        result: {
          winner: report.result.winnerName,
          userClubScore: `${userInnings.totalRuns}/${userInnings.totalWickets}`,
          opponentScore: `${oppInnings.totalRuns}/${oppInnings.totalWickets}`,
          margin: report.result.marginText,
          userWon: isUserWinner,
          pointsEarned: isUserWinner ? 2 : report.result.isTie ? 1 : 0,
          financialRevenue: matchRevenue,
          playerOfTheMatch: report.awards.manOfTheMatch.player.name,
        },
      };
    }
    if (idx === nextFixtureIndex && f.status === 'upcoming') {
      return { ...f, status: 'ready' as const };
    }
    return f;
  });

  const updatedClub: ManagerClubData = {
    ...club,
    balance: club.balance + matchRevenue,
    reputation: Math.min(1000, club.reputation + (isUserWinner ? 15 : -5)),
    squad: updatedSquad,
    divisionTable: updatedTable,
    calendar: updatedCalendar,
    currentFixtureIndex: nextFixtureIndex,
    managerStats: {
      ...club.managerStats,
      reputation: Math.min(1000, club.managerStats.reputation + (isUserWinner ? 15 : -5)),
      totalMatches: club.managerStats.totalMatches + 1,
      totalWins: club.managerStats.totalWins + (isUserWinner ? 1 : 0),
      totalLosses: club.managerStats.totalLosses + (!isUserWinner ? 1 : 0),
      winPercentage: Math.round(
        ((club.managerStats.totalWins + (isUserWinner ? 1 : 0)) /
          (club.managerStats.totalMatches + 1)) *
          100
      ),
      boardConfidence: Math.min(100, Math.max(10, club.managerStats.boardConfidence + (isUserWinner ? 3 : -4))),
    },
  };

  markMatchAsProcessed(report.matchId);
  return updatedClub;
}
