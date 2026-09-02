import {
  MatchFormat,
  PitchCondition,
  WeatherCondition,
  PlayerConditionState,
  PlayerFormState,
  BattingDecisionType,
  BowlingDeliveryChoice,
  FieldingEventAction,
  WicketDismissalType,
  MatchPlayerPerformance,
  DRSReviewState,
  BallByBallEvent,
} from './types';

// Multipliers for Player Condition
export const CONDITION_MULTIPLIER: Record<PlayerConditionState, number> = {
  EXCELLENT: 1.15,
  GOOD: 1.08,
  NORMAL: 1.0,
  BELOW_AVERAGE: 0.92,
  POOR: 0.82,
  INJURED: 0.65,
};

// Multipliers for Player Form
export const FORM_MULTIPLIER: Record<PlayerFormState, number> = {
  EXCELLENT: 1.15,
  IN_FORM: 1.08,
  NORMAL: 1.0,
  OUT_OF_FORM: 0.90,
  POOR: 0.78,
};

export type MatchPhase = 'POWERPLAY' | 'MIDDLE_OVERS' | 'DEATH_OVERS' | 'TEST_SESSION';

export function getMatchPhase(
  format: MatchFormat,
  currentOver: number, // 0-based
  totalOvers: number
): MatchPhase {
  if (format === 'TEST') return 'TEST_SESSION';

  if (totalOvers <= 20) {
    if (currentOver < 6) return 'POWERPLAY';
    if (currentOver < 15) return 'MIDDLE_OVERS';
    return 'DEATH_OVERS';
  } else {
    // 50 overs
    if (currentOver < 10) return 'POWERPLAY';
    if (currentOver < 40) return 'MIDDLE_OVERS';
    return 'DEATH_OVERS';
  }
}

export interface BallSimulationInput {
  striker: MatchPlayerPerformance;
  bowler: MatchPlayerPerformance;
  fielders: MatchPlayerPerformance[];
  format: MatchFormat;
  pitch: PitchCondition;
  weather: WeatherCondition;
  phase: MatchPhase;
  battingChoice?: BattingDecisionType;
  bowlingChoice?: BowlingDeliveryChoice;
  isFreeHit?: boolean;
  requiredRunRate?: number;
  currentOver: number;
  currentBallInOver: number;
  wicketsLost: number;
  isSecondInnings: boolean;
  target?: number;
  currentScore: number;
}

export interface BallSimulationOutput {
  runsScored: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
  };
  isLegalDelivery: boolean;
  isBoundaryFour: boolean;
  isBoundarySix: boolean;
  isWicket: boolean;
  wicketType?: WicketDismissalType;
  dismissedPlayerId?: string;
  fielderName?: string;
  isNextFreeHit: boolean;
  drsEligible: boolean;
  simulatedDRS?: DRSReviewState;
  catchOpportunity?: {
    fielder: MatchPlayerPerformance;
    difficulty: 'EASY' | 'MEDIUM' | 'DIFFICULT' | 'SPECTACULAR';
  };
  injuryEvent?: {
    playerName: string;
    description: string;
    severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  };
}

export function simulateBallPhysics(input: BallSimulationInput): BallSimulationOutput {
  const {
    striker,
    bowler,
    fielders,
    format,
    pitch,
    weather,
    phase,
    battingChoice,
    bowlingChoice,
    isFreeHit = false,
    requiredRunRate,
    wicketsLost,
  } = input;

  // 1. Calculate Effective Ratings
  const strikerCondMult = CONDITION_MULTIPLIER[striker.condition] || 1.0;
  const strikerFormMult = FORM_MULTIPLIER[striker.form] || 1.0;
  const strikerEffectiveRating = striker.overallRating * strikerCondMult * strikerFormMult * (1 - striker.fatigue * 0.002);

  const bowlerCondMult = CONDITION_MULTIPLIER[bowler.condition] || 1.0;
  const bowlerFormMult = FORM_MULTIPLIER[bowler.form] || 1.0;
  const bowlerEffectiveRating = bowler.overallRating * bowlerCondMult * bowlerFormMult * (1 - bowler.fatigue * 0.002);

  // 2. Pitch Factors
  let paceBonus = 1.0;
  let spinBonus = 1.0;
  let battingSurfaceBonus = 1.0;
  let seamBonus = 1.0;

  switch (pitch) {
    case 'BATTING':
      battingSurfaceBonus = 1.25;
      break;
    case 'GREEN':
      seamBonus = 1.35;
      paceBonus = 1.25;
      battingSurfaceBonus = 0.85;
      break;
    case 'PACE_FRIENDLY':
      paceBonus = 1.30;
      battingSurfaceBonus = 0.92;
      break;
    case 'SPIN_FRIENDLY':
    case 'DRY':
      spinBonus = 1.35;
      battingSurfaceBonus = 0.88;
      break;
    case 'SLOW':
      battingSurfaceBonus = 0.82;
      spinBonus = 1.20;
      break;
    case 'BALANCED':
    default:
      battingSurfaceBonus = 1.0;
      break;
  }

  // 3. Weather Factors
  let swingWeatherBonus = 1.0;
  if (weather === 'CLOUDY' || weather === 'HUMID') {
    swingWeatherBonus = 1.25;
  } else if (weather === 'WINDY') {
    swingWeatherBonus = 1.15;
  }

  // 4. Extras Check (Wides / No-Balls)
  const extraRoll = Math.random();
  const wideThreshold = bowler.overallRating > 80 ? 0.025 : 0.055;
  const noBallThreshold = bowler.overallRating > 80 ? 0.012 : 0.025;

  if (extraRoll < wideThreshold && !isFreeHit) {
    return {
      runsScored: 0,
      extras: { wides: 1, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
      isLegalDelivery: false,
      isBoundaryFour: false,
      isBoundarySix: false,
      isWicket: false,
      isNextFreeHit: false,
      drsEligible: false,
    };
  }

  if (extraRoll < wideThreshold + noBallThreshold) {
    return {
      runsScored: 0,
      extras: { wides: 0, noBalls: 1, byes: 0, legByes: 0, penalty: 0 },
      isLegalDelivery: false,
      isBoundaryFour: false,
      isBoundarySix: false,
      isWicket: false,
      isNextFreeHit: true,
      drsEligible: false,
    };
  }

  // 5. Duel Calculation: Batter Advantage Delta
  const ratingDelta = strikerEffectiveRating - bowlerEffectiveRating;
  let batterSkillScore = 50 + ratingDelta * 0.75; // Baseline 50

  // Apply Phase & Pitch
  if (phase === 'POWERPLAY') {
    batterSkillScore += 6; // Field restrictions aid batting
  } else if (phase === 'DEATH_OVERS') {
    batterSkillScore += 3; // High intent
  }

  // Tactics modifier
  let wicketRiskWeight = 1.0;
  let boundaryBoost = 1.0;

  if (battingChoice === 'LOFTED_SIX' || battingChoice === 'AGGRESSIVE_ATTACK') {
    boundaryBoost = 2.2;
    wicketRiskWeight = 2.4;
  } else if (battingChoice === 'DRIVE_FOUR') {
    boundaryBoost = 1.7;
    wicketRiskWeight = 1.3;
  } else if (battingChoice === 'ROTATE_STRIKE' || battingChoice === 'LATE_CUT_TWO') {
    boundaryBoost = 0.6;
    wicketRiskWeight = 0.65;
  } else if (battingChoice === 'DEFEND' || battingChoice === 'CONSERVATIVE_NUDGE') {
    boundaryBoost = 0.1;
    wicketRiskWeight = 0.35;
  }

  // Bowling choice counter-effect
  if (bowlingChoice === 'YORKER') {
    boundaryBoost *= 0.6;
    wicketRiskWeight *= 1.4;
  } else if (bowlingChoice === 'SLOWER_BALL' || bowlingChoice === 'DOOSRA_CARROM' || bowlingChoice === 'FLIGHTED_BALL') {
    boundaryBoost *= 0.8;
    wicketRiskWeight *= 1.3;
  } else if (bowlingChoice === 'BOUNCER' || bowlingChoice === 'SHORT_BALL') {
    boundaryBoost *= 1.4; // Can be hooked or top-edged
    wicketRiskWeight *= 1.6;
  }

  // Calculate Base Probabilities
  const isBowlerSpin = bowler.role === 'Bowler' && bowlerEffectiveRating > 0;
  const surfaceBonus = battingSurfaceBonus * swingWeatherBonus;

  // Wicket Probability
  let baseWicketProb = 0.042;
  if (wicketsLost > 6) baseWicketProb += 0.02;
  if (requiredRunRate && requiredRunRate > 10) baseWicketProb += 0.035;

  const adjustedWicketProb = (baseWicketProb * wicketRiskWeight) / Math.max(0.6, surfaceBonus * (batterSkillScore / 50));
  const finalWicketProb = isFreeHit ? 0.005 : Math.min(0.35, Math.max(0.015, adjustedWicketProb));

  const outcomeRoll = Math.random();

  // WICKET OCCURS
  if (outcomeRoll < finalWicketProb) {
    const isSpinner = bowlingChoice?.includes('SPIN') || bowlingChoice?.includes('BREAK') || bowler.overallRating % 2 === 0;
    const wicketRoll = Math.random();
    let dismissal: WicketDismissalType = 'CAUGHT';

    if (isFreeHit) {
      dismissal = 'RUN_OUT'; // Only run out on free hit
    } else if (wicketRoll < 0.30) {
      dismissal = 'BOWLED';
    } else if (wicketRoll < 0.52) {
      dismissal = 'LBW';
    } else if (wicketRoll < 0.88) {
      dismissal = 'CAUGHT';
    } else if (isSpinner && wicketRoll < 0.94) {
      dismissal = 'STUMPED';
    } else {
      dismissal = 'RUN_OUT';
    }

    const randomFielder = fielders.length > 0
      ? fielders[Math.floor(Math.random() * fielders.length)]
      : { name: 'Deep Fielder' };

    // Build DRS Ball tracking if LBW or Caught Behind
    const drsEligible = dismissal === 'LBW' || dismissal === 'CAUGHT';
    let simulatedDRS: DRSReviewState | undefined = undefined;

    if (drsEligible) {
      const isPlumb = Math.random() > 0.3;
      simulatedDRS = {
        teamName: 'Batting Team',
        reviewsRemaining: 2,
        reviewsUsed: 0,
        successfulReviews: 0,
        isUnderReview: false,
        reviewType: dismissal === 'LBW' ? 'LBW' : 'CAUGHT_BEHIND',
        originalDecision: 'OUT',
        pitching: isPlumb ? 'IN_LINE' : 'OUTSIDE_OFF',
        impact: isPlumb ? 'IN_LINE' : 'UMPIRES_CALL',
        wickets: isPlumb ? 'HITTING' : 'UMPIRES_CALL',
        finalDecision: isPlumb ? 'OUT' : 'NOT_OUT',
        reviewRetained: !isPlumb,
        explanation: isPlumb
          ? 'Ball Tracking confirms: Pitching in-line, Impact in-line, Wickets hitting the middle stump! Decision OUT stands.'
          : 'Ball Tracking shows Impact is Umpire’s Call / Missing leg stump! Decision OVERTURNED.',
      };
    }

    return {
      runsScored: 0,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
      isLegalDelivery: true,
      isBoundaryFour: false,
      isBoundarySix: false,
      isWicket: true,
      wicketType: dismissal,
      dismissedPlayerId: striker.playerId,
      fielderName: dismissal === 'CAUGHT' || dismissal === 'RUN_OUT' ? randomFielder.name : undefined,
      isNextFreeHit: false,
      drsEligible,
      simulatedDRS,
      catchOpportunity: dismissal === 'CAUGHT' ? {
        fielder: randomFielder as MatchPlayerPerformance,
        difficulty: Math.random() > 0.5 ? 'MEDIUM' : 'DIFFICULT',
      } : undefined,
    };
  }

  // RUNS / BOUNDARY CALCULATION
  const scoringRoll = Math.random();
  const sixThreshold = 0.08 * boundaryBoost * (batterSkillScore / 50);
  const fourThreshold = sixThreshold + 0.16 * boundaryBoost * (batterSkillScore / 50);
  const twoThreeThreshold = fourThreshold + 0.18;
  const singleThreshold = twoThreeThreshold + 0.32;

  // Check possible fatigue/minor injury
  let injuryEvent: BallSimulationOutput['injuryEvent'] = undefined;
  if (Math.random() < 0.008 && (striker.fatigue > 60 || bowler.fatigue > 60)) {
    const isStriker = Math.random() > 0.5;
    injuryEvent = {
      playerName: isStriker ? striker.name : bowler.name,
      description: isStriker ? 'Slight hamstring tightness while taking off for a run' : 'Cramp in bowling calf after strenuous delivery stride',
      severity: 'MINOR',
    };
  }

  if (scoringRoll < sixThreshold) {
    return {
      runsScored: 6,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
      isLegalDelivery: true,
      isBoundaryFour: false,
      isBoundarySix: true,
      isWicket: false,
      isNextFreeHit: false,
      drsEligible: false,
      injuryEvent,
    };
  }

  if (scoringRoll < fourThreshold) {
    return {
      runsScored: 4,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
      isLegalDelivery: true,
      isBoundaryFour: true,
      isBoundarySix: false,
      isWicket: false,
      isNextFreeHit: false,
      drsEligible: false,
      injuryEvent,
    };
  }

  if (scoringRoll < twoThreeThreshold) {
    const isThree = Math.random() < 0.15;
    return {
      runsScored: isThree ? 3 : 2,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
      isLegalDelivery: true,
      isBoundaryFour: false,
      isBoundarySix: false,
      isWicket: false,
      isNextFreeHit: false,
      drsEligible: false,
      injuryEvent,
    };
  }

  if (scoringRoll < singleThreshold) {
    return {
      runsScored: 1,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
      isLegalDelivery: true,
      isBoundaryFour: false,
      isBoundarySix: false,
      isWicket: false,
      isNextFreeHit: false,
      drsEligible: false,
      injuryEvent,
    };
  }

  // Dot Ball (0 runs)
  return {
    runsScored: 0,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    isLegalDelivery: true,
    isBoundaryFour: false,
    isBoundarySix: false,
    isWicket: false,
    isNextFreeHit: false,
    drsEligible: false,
    injuryEvent,
  };
}

// Calculate Man of the Match and Post-Match Awards
export function calculateMatchAwards(
  allPlayers: MatchPlayerPerformance[],
  winnerTeamName: string,
  teamAPlayers: MatchPlayerPerformance[],
  teamBPlayers: MatchPlayerPerformance[]
) {
  let highestPoints = -1;
  let potmPlayer: MatchPlayerPerformance = allPlayers[0];
  let potmTeam = '';
  let potmReason = '';

  let bestBatter: MatchPlayerPerformance = allPlayers[0];
  let mostRuns = -1;

  let bestBowler: MatchPlayerPerformance = allPlayers[0];
  let mostWickets = -1;

  let bestFielder: MatchPlayerPerformance = allPlayers[0];
  let mostFieldingImpact = -1;

  allPlayers.forEach((p) => {
    // 1. Batting Points
    const batPoints = p.runs * 1.25 + (p.strikeRate > 120 ? (p.strikeRate - 100) * 0.15 : 0) + p.sixes * 2 + p.fours * 1;
    
    // 2. Bowling Points
    const bowlPoints = p.wickets * 28 + (p.oversBowled > 1 && p.economyRate < 6.5 ? (7 - p.economyRate) * 4 : 0) + p.maidens * 12 + p.dotBalls * 0.5;

    // 3. Fielding Points
    const fieldPoints = p.catches * 10 + p.runOuts * 15 + p.stumpings * 12 + p.boundarySaves * 3;

    // Total Impact Score
    const totalImpact = batPoints + bowlPoints + fieldPoints;
    p.impactPoints = Math.round(totalImpact);

    if (totalImpact > highestPoints) {
      highestPoints = totalImpact;
      potmPlayer = p;
      potmTeam = teamAPlayers.some((tp) => tp.playerId === p.playerId) ? 'Team A' : 'Team B';
      if (p.wickets >= 3 && p.runs >= 25) {
        potmReason = `All-round masterclass: ${p.runs} runs & ${p.wickets} wickets!`;
      } else if (p.wickets >= 3) {
        potmReason = `Sensational bowling figures of ${p.wickets}/${p.runsConceded} (${p.oversBowled} ov)!`;
      } else if (p.runs >= 50) {
        potmReason = `Commanding match-winning knock of ${p.runs} (${p.balls}b, ${p.fours}x4, ${p.sixes}x6)!`;
      } else {
        potmReason = `Game-defining performance scoring ${p.runs} runs & claiming key wickets!`;
      }
    }

    if (p.runs > mostRuns) {
      mostRuns = p.runs;
      bestBatter = p;
    }

    if (p.wickets > mostWickets || (p.wickets === mostWickets && p.economyRate < bestBowler.economyRate)) {
      mostWickets = p.wickets;
      bestBowler = p;
    }

    const fieldScore = p.catches * 2 + p.runOuts * 3 + p.stumpings * 2;
    if (fieldScore > mostFieldingImpact) {
      mostFieldingImpact = fieldScore;
      bestFielder = p;
    }
  });

  return {
    manOfTheMatch: {
      player: potmPlayer,
      teamName: winnerTeamName,
      reason: potmReason || `Outstanding match impact score of ${highestPoints} points!`,
      points: Math.round(highestPoints),
    },
    bestBatter: {
      player: bestBatter,
      teamName: winnerTeamName,
      runs: bestBatter.runs,
      strikeRate: bestBatter.strikeRate,
    },
    bestBowler: {
      player: bestBowler,
      teamName: winnerTeamName,
      wickets: bestBowler.wickets,
      economy: bestBowler.economyRate,
    },
    bestFielder: {
      player: bestFielder,
      teamName: winnerTeamName,
      catches: bestFielder.catches,
      runOuts: bestFielder.runOuts,
    },
  };
}
