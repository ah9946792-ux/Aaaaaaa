import {
  CareerProfile,
  CareerStats,
  CareerStatsCategory,
  CareerPlayerRatings,
  PlayingRole,
  RoleSubType,
  CareerMatchFixture,
  CareerContract,
  LeagueOffer,
  CareerTrophy,
  LifestyleItem,
  CoachingProfile,
} from '../types';
import { COUNTRIES_DATA, FRANCHISE_LEAGUES } from '../data/cricketDatabase';
import { LIFESTYLE_CATALOG } from '../data/lifestyleCatalog';

function createEmptyStatsCategory(): CareerStatsCategory {
  return {
    matches: 0,
    innings: 0,
    runs: 0,
    average: 0,
    strikeRate: 0,
    fifties: 0,
    hundreds: 0,
    highestScore: 0,
    fours: 0,
    sixes: 0,
    notOuts: 0,
    overs: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
    bowlingAverage: 0,
    bestBowling: '-',
    threeWicketHauls: 0,
    fiveWicketHauls: 0,
    catches: 0,
    runOuts: 0,
    stumpings: 0,
  };
}

export function generateInitialRatings(
  role: PlayingRole,
  subType: string
): CareerPlayerRatings {
  const isBatter = role === 'Batter';
  const isBowler = role === 'Bowler';
  const isAllRounder = role === 'All-Rounder';
  const isWK = role === 'Wicketkeeper-Batter';

  const baseBat = isBatter ? 66 : isAllRounder ? 63 : isWK ? 64 : 32;
  const baseBowl = isBowler ? 67 : isAllRounder ? 64 : 22;
  const baseField = isWK ? 72 : 62;

  const isSpin =
    subType.includes('Spin') ||
    subType.includes('Orthodox') ||
    subType.includes('Leg');

  const batting = {
    batting: baseBat,
    power: isBatter ? 68 : isAllRounder ? 64 : 35,
    timing: isBatter ? 67 : isWK ? 65 : 40,
    technique: isBatter ? 66 : isAllRounder ? 62 : 38,
    runningBetweenWickets: isWK ? 70 : 64,
    shotSelection: isBatter ? 65 : 45,
  };

  const bowling = {
    bowling: baseBowl,
    pace: isBowler && !isSpin ? 69 : 28,
    accuracy: isBowler ? 66 : isAllRounder ? 62 : 30,
    movement: isBowler ? 67 : 35,
    variation: isBowler ? 65 : 40,
    spin: isSpin ? 68 : 20,
    control: isBowler ? 66 : 30,
  };

  const fielding = {
    fielding: baseField,
    catching: isWK ? 74 : 64,
    throwing: isBowler ? 66 : 62,
    groundFielding: 64,
    reaction: isWK ? 76 : 65,
    wicketkeeping: isWK ? 75 : 20,
  };

  const overall = isBatter
    ? Math.round((batting.batting * 0.7 + fielding.fielding * 0.3))
    : isBowler
    ? Math.round((bowling.bowling * 0.7 + fielding.fielding * 0.3))
    : isAllRounder
    ? Math.round((batting.batting * 0.45 + bowling.bowling * 0.45 + fielding.fielding * 0.1))
    : Math.round((batting.batting * 0.5 + fielding.wicketkeeping * 0.5));

  return {
    overall,
    potential: 94,
    form: 80,
    formStatus: 'Good',
    batting,
    bowling,
    fielding,
  };
}

export function generateCareerCalendar(
  clubName: string,
  country: string,
  startYear: number,
  tier: 'district' | 'regional' | 'domestic' | 'franchise' | 'international'
): CareerMatchFixture[] {
  const countryObj =
    COUNTRIES_DATA.find((c) => c.country.toLowerCase() === country.toLowerCase()) ||
    COUNTRIES_DATA[0];

  const opponents =
    tier === 'district'
      ? ['Mirpur Rising Stars', 'Dhanmondi Lions', 'Gulshan Strikers', 'Padma CC', 'Surma Kings', 'Meghna Titans']
      : tier === 'domestic'
      ? countryObj.domesticClubs
      : tier === 'franchise'
      ? FRANCHISE_LEAGUES[0].teams.map((t) => t.name)
      : ['Australia', 'India', 'England', 'Pakistan', 'South Africa', 'New Zealand'];

  const teammates =
    tier === 'international'
      ? countryObj.nationalTeammates
      : tier === 'franchise'
      ? [
          countryObj.nationalTeammates[0] || 'Shakib Al Hasan',
          countryObj.nationalTeammates[1] || 'Tamim Iqbal',
          'David Miller',
          'Sunil Narine',
          'Andre Russell',
          'Mustafizur Rahman',
          'Towhid Hridoy',
        ]
      : [
          'Arif Hossain',
          'Tanvir Islam',
          'Sabbir Rahman',
          'Zahid Hasan',
          'Al-Amin Junior',
          'Mizanur Rahman',
          'Nayeem Hasan',
          'Shohidul Islam',
        ];

  const fixtures: CareerMatchFixture[] = [];
  const baseMonth = 8; // August

  for (let i = 0; i < 6; i++) {
    const opp = opponents[i % opponents.length] || 'Challenger CC';
    const day = 15 + i * 3;
    const formattedDate = `${startYear}-${String(baseMonth).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    fixtures.push({
      id: `cm_${startYear}_${i + 1}`,
      matchNumber: i + 1,
      inGameDate: formattedDate,
      competitionName:
        tier === 'district'
          ? 'District Championship Trophy'
          : tier === 'domestic'
          ? 'National Cricket League'
          : tier === 'franchise'
          ? 'Premier T20 Championship'
          : 'ICC World Series',
      format: tier === 'franchise' ? 'T20' : tier === 'district' ? 'Club 20' : 'ODI',
      venue: `${countryObj.country} National Stadium`,
      homeTeam: clubName,
      awayTeam: opp,
      playerTeam: clubName,
      opponentTeam: opp,
      teammateNames: teammates,
      opponentNames: [
        'Opponent Captain',
        'Top Batter 1',
        'Top Batter 2',
        'All-Rounder Ace',
        'Strike Bowler',
        'Mystery Spinner',
      ],
      status: i === 0 ? 'ready' : 'upcoming',
    });
  }

  return fixtures;
}

export function createInitialCareer(params: {
  playerName: string;
  age: number;
  country: string;
  division: string;
  district: string;
  jerseyNumber: number;
  role: PlayingRole;
  roleSubType: RoleSubType;
}): CareerProfile {
  const ratings = generateInitialRatings(params.role, params.roleSubType);
  const countryObj =
    COUNTRIES_DATA.find((c) => c.country.toLowerCase() === params.country.toLowerCase()) ||
    COUNTRIES_DATA[0];

  const divObj = countryObj.divisions.find((d) => d.name === params.division) || countryObj.divisions[0];
  const distObj = divObj?.districts.find((d) => d.name === params.district) || divObj?.districts[0];
  const startingClub = distObj?.clubs[0] || `${params.district} Pioneers CC`;

  const currentYear = 2026;
  const birthYear = currentYear - params.age;

  const emptyStats: CareerStats = {
    club: createEmptyStatsCategory(),
    franchise: createEmptyStatsCategory(),
    international: createEmptyStatsCategory(),
    total: createEmptyStatsCategory(),
  };

  const initialContract: CareerContract = {
    clubId: `club_init_${Date.now()}`,
    clubName: startingClub,
    clubTier: 'district',
    teamType: 'District Club',
    salaryPerMatch: 500,
    seasonalBonus: 1500,
    remainingMatches: 6,
    status: 'active',
  };

  const calendar = generateCareerCalendar(startingClub, params.country, currentYear, 'district');

  const lifestylePurchases: LifestyleItem[] = LIFESTYLE_CATALOG.map((item) => ({
    ...item,
    purchased: false,
  }));

  return {
    id: `car_${Date.now()}`,
    playerName: params.playerName,
    age: params.age,
    birthYear,
    currentInGameYear: currentYear,
    country: params.country,
    division: params.division,
    district: params.district,
    jerseyNumber: params.jerseyNumber,
    role: params.role,
    roleSubType: params.roleSubType,
    currentClub: startingClub,
    clubTier: 'district',
    careerLevel: 1,
    reputation: 120,
    marketValue: 2000,
    ratings,
    stats: emptyStats,
    wallet: 3000, // starting signing bonus
    currentContract: initialContract,
    clubHistory: [],
    availableOffers: [],
    internationalStatus: 'ineligible',
    trophies: [],
    purchases: lifestylePurchases,
    matchCalendar: calendar,
    currentMatchIndex: 0,
    playingCareerFinished: false,
    coachingUnlocked: false,
    lifetimeCareerCompleted: false,
  };
}

export function updateCareerAfterMatch(
  career: CareerProfile,
  matchPerformance: {
    runsScored: number;
    ballsFaced: number;
    fours: number;
    sixes: number;
    oversBowled: number;
    wicketsTaken: number;
    runsConceded: number;
    catches: number;
    isManOfTheMatch: boolean;
  }
): CareerProfile {
  const updated = structuredClone(career) as CareerProfile;
  const currentFixture = updated.matchCalendar[updated.currentMatchIndex];

  if (!currentFixture) return updated;

  // 1. Calculate points, ratings gain, and earnings
  const matchFee = updated.currentContract.salaryPerMatch || 500;
  const motmBonus = matchPerformance.isManOfTheMatch ? 1000 : 0;
  const totalEarned = matchFee + motmBonus;

  updated.wallet += totalEarned;
  updated.reputation = Math.min(1000, updated.reputation + 25 + (matchPerformance.isManOfTheMatch ? 40 : 10));

  // 2. Update Form & Ratings
  const scoreScore = matchPerformance.runsScored * 1.5 + matchPerformance.wicketsTaken * 25 + matchPerformance.catches * 10;
  let newForm = Math.min(100, Math.max(20, updated.ratings.form + (scoreScore > 40 ? 5 : -3)));
  updated.ratings.form = newForm;
  updated.ratings.formStatus = newForm >= 85 ? 'Excellent' : newForm >= 65 ? 'Good' : newForm >= 45 ? 'Average' : 'Poor';

  // Incremental attribute growth
  if (matchPerformance.runsScored > 30) {
    updated.ratings.batting.batting = Math.min(99, updated.ratings.batting.batting + 0.3);
    updated.ratings.batting.timing = Math.min(99, updated.ratings.batting.timing + 0.3);
  }
  if (matchPerformance.wicketsTaken >= 2) {
    updated.ratings.bowling.bowling = Math.min(99, updated.ratings.bowling.bowling + 0.3);
    updated.ratings.bowling.accuracy = Math.min(99, updated.ratings.bowling.accuracy + 0.3);
  }
  if (matchPerformance.catches >= 1) {
    updated.ratings.fielding.catching = Math.min(99, updated.ratings.fielding.catching + 0.2);
  }

  // Recalculate Overall
  if (updated.role === 'Batter') {
    updated.ratings.overall = Math.round(updated.ratings.batting.batting * 0.7 + updated.ratings.fielding.fielding * 0.3);
  } else if (updated.role === 'Bowler') {
    updated.ratings.overall = Math.round(updated.ratings.bowling.bowling * 0.7 + updated.ratings.fielding.fielding * 0.3);
  } else if (updated.role === 'All-Rounder') {
    updated.ratings.overall = Math.round(
      updated.ratings.batting.batting * 0.45 + updated.ratings.bowling.bowling * 0.45 + updated.ratings.fielding.fielding * 0.1
    );
  } else {
    updated.ratings.overall = Math.round(
      updated.ratings.batting.batting * 0.5 + updated.ratings.fielding.wicketkeeping * 0.5
    );
  }

  // 3. Update Statistics
  if (!updated.stats) {
    updated.stats = {
      club: createEmptyStatsCategory(),
      franchise: createEmptyStatsCategory(),
      international: createEmptyStatsCategory(),
      total: createEmptyStatsCategory(),
    };
  }
  if (!updated.stats.club) updated.stats.club = createEmptyStatsCategory();
  if (!updated.stats.franchise) updated.stats.franchise = createEmptyStatsCategory();
  if (!updated.stats.international) updated.stats.international = createEmptyStatsCategory();
  if (!updated.stats.total) updated.stats.total = createEmptyStatsCategory();

  const targetCategory =
    updated.clubTier === 'international'
      ? updated.stats.international
      : updated.clubTier === 'franchise'
      ? updated.stats.franchise
      : updated.stats.club;

  [targetCategory, updated.stats.total].forEach((cat) => {
    if (!cat) return;
    cat.matches = (cat.matches || 0) + 1;
    cat.innings = (cat.innings || 0) + 1;
    cat.runs = (cat.runs || 0) + matchPerformance.runsScored;
    cat.fours = (cat.fours || 0) + matchPerformance.fours;
    cat.sixes = (cat.sixes || 0) + matchPerformance.sixes;
    cat.highestScore = Math.max(cat.highestScore || 0, matchPerformance.runsScored);
    if (matchPerformance.runsScored >= 100) cat.hundreds = (cat.hundreds || 0) + 1;
    else if (matchPerformance.runsScored >= 50) cat.fifties = (cat.fifties || 0) + 1;
    cat.average = cat.innings > 0 ? Number((cat.runs / cat.innings).toFixed(2)) : 0;
    cat.strikeRate =
      matchPerformance.ballsFaced > 0
        ? Number(((cat.runs / Math.max(1, cat.matches * 25)) * 100).toFixed(1))
        : 120;

    cat.overs = (cat.overs || 0) + matchPerformance.oversBowled;
    cat.runsConceded = (cat.runsConceded || 0) + matchPerformance.runsConceded;
    cat.wickets = (cat.wickets || 0) + matchPerformance.wicketsTaken;
    cat.catches = (cat.catches || 0) + matchPerformance.catches;
    if (matchPerformance.wicketsTaken >= 5) cat.fiveWicketHauls = (cat.fiveWicketHauls || 0) + 1;
    else if (matchPerformance.wicketsTaken >= 3) cat.threeWicketHauls = (cat.threeWicketHauls || 0) + 1;
    cat.economy = cat.overs > 0 ? Number((cat.runsConceded / cat.overs).toFixed(2)) : 0;
    cat.bowlingAverage = cat.wickets > 0 ? Number((cat.runsConceded / cat.wickets).toFixed(2)) : 0;
    if (matchPerformance.wicketsTaken > 0) {
      cat.bestBowling = `${matchPerformance.wicketsTaken}/${matchPerformance.runsConceded}`;
    }
  });

  // 4. Mark fixture completed
  const userWon = matchPerformance.runsScored > 25 || matchPerformance.wicketsTaken >= 2 || Math.random() > 0.4;
  currentFixture.status = 'completed';
  currentFixture.result = {
    winner: userWon ? currentFixture.playerTeam : currentFixture.opponentTeam,
    margin: userWon ? 'Won by 28 runs' : 'Lost by 3 wickets',
    userPlayerPerformance: {
      ...matchPerformance,
      pointsEarned: 50,
      coinsEarned: totalEarned,
    },
  };

  // 5. Check Trophy Unlock (e.g. Man of the Match or Milestone)
  if (matchPerformance.isManOfTheMatch) {
    const trophyId = `trophy_motm_${Date.now()}`;
    const newTrophy: CareerTrophy = {
      id: trophyId,
      name: 'Player of the Match Medal',
      competition: currentFixture.competitionName,
      season: updated.currentInGameYear,
      date: currentFixture.inGameDate,
      description: `Awarded for match-winning performance (${matchPerformance.runsScored} runs, ${matchPerformance.wicketsTaken} wkts) vs ${currentFixture.opponentTeam}`,
      category: 'individual',
      iconName: 'Medal',
    };
    updated.trophies.unshift(newTrophy);
  }

  // 6. Advance Match Index / Season
  if (updated.currentMatchIndex < updated.matchCalendar.length - 1) {
    updated.currentMatchIndex += 1;
    updated.matchCalendar[updated.currentMatchIndex].status = 'ready';
  } else {
    // Completed season! Generate League Offers & Increment Age
    updated.age += 1;
    updated.currentInGameYear += 1;

    // Check Retirement at Age 45
    if (updated.age >= 45) {
      updated.playingCareerFinished = true;
      updated.coachingUnlocked = true;
      updated.coachingProfile = {
        active: true,
        currentTeam: `${updated.country} National Academy`,
        seasonsCoached: 0,
        trophiesWon: [],
        reputation: Math.round(updated.reputation * 0.8),
        salary: 25000,
        history: [],
      };
    } else {
      // Evaluate International Status
      if (updated.ratings.overall >= 80 && updated.reputation >= 400) {
        updated.internationalStatus = 'playing_xi';
      } else if (updated.ratings.overall >= 74 && updated.reputation >= 250) {
        updated.internationalStatus = 'squad_member';
      } else if (updated.ratings.overall >= 68) {
        updated.internationalStatus = 'on_radar';
      }

      // Generate Offers
      const newOffers: LeagueOffer[] = [
        {
          id: `off_${Date.now()}_1`,
          leagueName: 'Premier Domestic Championship',
          teamName: `${updated.country} Elite XI`,
          country: updated.country,
          tier: 'domestic',
          salary: 3500,
          durationMatches: 8,
          roleOffered: `Key ${updated.role}`,
          reputationRequired: 150,
          status: 'pending',
        },
        {
          id: `off_${Date.now()}_2`,
          leagueName: 'BPL / Global T20 Franchise',
          teamName: 'Dhaka Dominators',
          country: 'Bangladesh',
          tier: 'franchise',
          salary: 8000,
          durationMatches: 10,
          roleOffered: `Star ${updated.role}`,
          reputationRequired: 300,
          status: 'pending',
        },
      ];
      updated.availableOffers = newOffers;

      // New season calendar
      updated.matchCalendar = generateCareerCalendar(
        updated.currentClub,
        updated.country,
        updated.currentInGameYear,
        updated.clubTier
      );
      updated.currentMatchIndex = 0;
    }
  }

  return updated;
}

export function acceptLeagueOffer(
  career: CareerProfile,
  offerId: string
): CareerProfile {
  const updated = structuredClone(career) as CareerProfile;
  const offer = updated.availableOffers.find((o) => o.id === offerId);
  if (!offer) return updated;

  // Add current club to history
  const clubMatches = updated.stats?.club?.matches || 0;
  const clubRuns = updated.stats?.club?.runs || 0;
  const clubWickets = updated.stats?.club?.wickets || 0;
  const salaryPerMatch = updated.currentContract?.salaryPerMatch || 1000;

  updated.clubHistory.push({
    clubName: updated.currentClub,
    tier: updated.clubTier,
    seasons: `${updated.currentInGameYear - 1}`,
    matches: clubMatches,
    runs: clubRuns,
    wickets: clubWickets,
    salaryEarned: clubMatches * salaryPerMatch,
  });

  // Switch club
  updated.currentClub = offer.teamName;
  updated.clubTier = offer.tier as 'district' | 'regional' | 'domestic' | 'franchise' | 'international';
  updated.currentContract = {
    clubId: `club_${Date.now()}`,
    clubName: offer.teamName,
    clubTier: offer.tier as 'district' | 'regional' | 'domestic' | 'franchise' | 'international',
    teamType: offer.leagueName,
    salaryPerMatch: offer.salary,
    seasonalBonus: offer.salary * 2,
    remainingMatches: offer.durationMatches,
    status: 'active',
  };

  // Generate calendar for new club
  updated.matchCalendar = generateCareerCalendar(
    offer.teamName,
    offer.country,
    updated.currentInGameYear,
    updated.clubTier
  );
  updated.currentMatchIndex = 0;

  // Mark offer accepted and remove others
  offer.status = 'accepted';
  updated.availableOffers = [];

  return updated;
}

export function purchaseLifestyleItem(
  career: CareerProfile,
  itemId: string
): CareerProfile {
  const updated = structuredClone(career) as CareerProfile;
  const item = updated.purchases.find((p) => p.id === itemId);
  if (!item || item.purchased || updated.wallet < item.price) {
    return updated;
  }

  updated.wallet -= item.price;
  item.purchased = true;
  item.purchasedAt = new Date().toISOString();
  updated.reputation = Math.min(1000, updated.reputation + item.prestigeBoost);

  return updated;
}

export function simulateCoachingSeason(career: CareerProfile): CareerProfile {
  const updated = structuredClone(career) as CareerProfile;
  if (!updated.coachingProfile || !updated.coachingProfile.active) return updated;

  updated.age += 1;
  updated.currentInGameYear += 1;
  updated.coachingProfile.seasonsCoached += 1;

  const matches = 14;
  const wins = Math.floor(8 + Math.random() * 5);
  const earnedSalary = updated.coachingProfile.salary;
  updated.wallet += earnedSalary;

  let wonTrophy: string | undefined = undefined;
  if (wins >= 11) {
    wonTrophy = 'Championship Golden Shield';
    const newTrophy: CareerTrophy = {
      id: `coach_trophy_${Date.now()}`,
      name: `${updated.coachingProfile.currentTeam} Championship Gold`,
      competition: 'Premier League',
      season: updated.currentInGameYear,
      date: `${updated.currentInGameYear}-11-20`,
      description: `Guided squad to championship victory with ${wins} wins in 14 matches!`,
      category: 'championship',
      iconName: 'Trophy',
    };
    updated.trophies.unshift(newTrophy);
    updated.coachingProfile.trophiesWon.push(newTrophy);
  }

  updated.coachingProfile.history.unshift({
    season: updated.currentInGameYear,
    team: updated.coachingProfile.currentTeam || 'National Academy',
    matches,
    wins,
    trophy: wonTrophy,
  });

  if (updated.age >= 75) {
    updated.coachingProfile.active = false;
    updated.lifetimeCareerCompleted = true;
  }

  return updated;
}
