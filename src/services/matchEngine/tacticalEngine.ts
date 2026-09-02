import { GlobalCricketPlayer, PlayingRole, StandardCountryCode } from '../../types';
import { GLOBAL_PLAYERS_DATABASE } from '../../data/players';
import {
  MatchFormat,
  PitchCondition,
  WeatherCondition,
  MatchPlayerPerformance,
  BattingDecisionType,
  BowlingDeliveryChoice,
} from './types';

// Map of player ID to cached database entry for instant attribute lookup
const PLAYER_DB_MAP = new Map<string, GlobalCricketPlayer>();
GLOBAL_PLAYERS_DATABASE.forEach((p) => {
  PLAYER_DB_MAP.set(p.player_id, p);
});

export interface PlayerTacticalProfile {
  playerId: string;
  name: string;
  role: PlayingRole;
  secondaryRole?: string;
  battingStyle: string;
  bowlingStyle: string;
  battingAbility: number;
  bowlingAbility: number;
  overallRating: number;
  isPureBatter: boolean;
  isSpecialistBowler: boolean;
  isAllRounder: boolean;
  isWicketkeeper: boolean;
  isOpener: boolean;
  isTopOrder: boolean;
  isMiddleOrder: boolean;
  isFinisher: boolean;
  isPaceBowler: boolean;
  isSpinBowler: boolean;
  isDeathSpecialist: boolean;
  isPowerplaySpecialist: boolean;
}

/**
 * Extracts or computes deep tactical attributes for any player
 */
export function getPlayerTacticalProfile(
  player: MatchPlayerPerformance | GlobalCricketPlayer
): PlayerTacticalProfile {
  const playerId = 'playerId' in player ? player.playerId : player.player_id;
  const dbPlayer = PLAYER_DB_MAP.get(playerId);

  const role: PlayingRole = 'role' in player ? player.role : player.primary_role;
  const secondaryRole = dbPlayer?.secondary_role || ('secondary_role' in player ? (player as GlobalCricketPlayer).secondary_role : undefined);
  const battingStyle = dbPlayer?.batting_style || 'Right-hand bat';
  const bowlingStyle = dbPlayer?.bowling_style || 'Right-arm medium';

  const overallRating = 'overallRating' in player ? player.overallRating : player.overall_rating;
  
  // Batting Ability
  let battingAbility = dbPlayer?.batting_attributes?.battingAbility;
  if (battingAbility === undefined) {
    if (role === 'Batter') battingAbility = Math.round(overallRating * 0.95);
    else if (role === 'Wicketkeeper-Batter') battingAbility = Math.round(overallRating * 0.88);
    else if (role === 'All-Rounder') battingAbility = Math.round(overallRating * 0.82);
    else battingAbility = Math.min(45, Math.round(overallRating * 0.4));
  }

  // Bowling Ability
  let bowlingAbility = dbPlayer?.bowling_attributes?.bowlingAbility;
  if (bowlingAbility === undefined) {
    if (role === 'Bowler') bowlingAbility = Math.round(overallRating * 0.95);
    else if (role === 'All-Rounder') bowlingAbility = Math.round(overallRating * 0.82);
    else bowlingAbility = 0; // Pure batters have 0 bowling ability by default
  }

  // Check pure role classification
  const isPureBatter = (role === 'Batter' || role === 'Wicketkeeper-Batter') && bowlingAbility < 40;
  const isSpecialistBowler = role === 'Bowler' && battingAbility < 50;
  const isAllRounder = role === 'All-Rounder' || (battingAbility >= 65 && bowlingAbility >= 60);
  const isWicketkeeper = role === 'Wicketkeeper-Batter' || ('isWicketkeeper' in player && !!player.isWicketkeeper);

  // Position Specialization from secondary role and names
  const sec = (secondaryRole || '').toLowerCase();
  const name = player.name.toLowerCase();

  const isOpener =
    sec.includes('opener') ||
    sec.includes('opening') ||
    sec.includes('aggressive opener') ||
    name.includes('rohit') ||
    name.includes('head') ||
    name.includes('buttler') ||
    name.includes('warner') ||
    name.includes('litton') ||
    name.includes('shanto') ||
    name.includes('tamim') ||
    name.includes('de kock') ||
    name.includes('babar') ||
    name.includes('rizwan') ||
    name.includes('gurbaz') ||
    name.includes('conway');

  const isTopOrder =
    isOpener ||
    sec.includes('top-order') ||
    sec.includes('anchor') ||
    sec.includes('master') ||
    name.includes('kohli') ||
    name.includes('smith') ||
    name.includes('root') ||
    name.includes('williamson') ||
    name.includes('shakib') ||
    name.includes('gill');

  const isFinisher =
    sec.includes('finisher') ||
    sec.includes('power hitter') ||
    sec.includes('explosive') ||
    name.includes('dhoni') ||
    name.includes('rinku') ||
    name.includes('russell') ||
    name.includes('miller') ||
    name.includes('stoinis') ||
    name.includes('hardik') ||
    name.includes('maxwell') ||
    name.includes('klaasen') ||
    name.includes('tewatia') ||
    name.includes('mahmudullah');

  const isMiddleOrder = !isOpener && (role === 'Batter' || isAllRounder || isWicketkeeper);

  const isPaceBowler =
    bowlingStyle.toLowerCase().includes('fast') ||
    bowlingStyle.toLowerCase().includes('medium') ||
    bowlingStyle.toLowerCase().includes('seam') ||
    sec.includes('fast') ||
    sec.includes('pacer');

  const isSpinBowler =
    bowlingStyle.toLowerCase().includes('spin') ||
    bowlingStyle.toLowerCase().includes('break') ||
    bowlingStyle.toLowerCase().includes('orthodox') ||
    sec.includes('spin');

  const isDeathSpecialist =
    name.includes('bumrah') ||
    name.includes('starc') ||
    name.includes('boult') ||
    name.includes('mustafizur') ||
    name.includes('afridi') ||
    name.includes('nortje') ||
    name.includes('arshdeep') ||
    name.includes('curran') ||
    sec.includes('death') ||
    (isPaceBowler && bowlingAbility >= 85);

  const isPowerplaySpecialist =
    name.includes('boult') ||
    name.includes('bhuvi') ||
    name.includes('shami') ||
    name.includes('hazlewood') ||
    name.includes('afridi') ||
    name.includes('taskin') ||
    name.includes('woakes') ||
    sec.includes('swing') ||
    sec.includes('new ball');

  return {
    playerId,
    name: player.name,
    role,
    secondaryRole,
    battingStyle,
    bowlingStyle,
    battingAbility,
    bowlingAbility,
    overallRating,
    isPureBatter,
    isSpecialistBowler,
    isAllRounder,
    isWicketkeeper,
    isOpener,
    isTopOrder,
    isMiddleOrder,
    isFinisher,
    isPaceBowler,
    isSpinBowler,
    isDeathSpecialist,
    isPowerplaySpecialist,
  };
}

/**
 * Builds a completely balanced, realistic Playing XI from any pool of players
 */
export function buildOptimalPlayingXI(
  playerPool: (GlobalCricketPlayer | MatchPlayerPerformance)[],
  options: {
    format: MatchFormat;
    pitch: PitchCondition;
    weather: WeatherCondition;
    targetRating?: number;
    captainId?: string;
    wicketkeeperId?: string;
    userPlayerId?: string;
  }
): MatchPlayerPerformance[] {
  const profiles = playerPool.map((p) => ({
    raw: p,
    profile: getPlayerTacticalProfile(p),
  }));

  // Identify user player if present
  const userItem = profiles.find(
    (item) => item.profile.playerId === options.userPlayerId
  );

  const remaining = profiles.filter(
    (item) => item.profile.playerId !== options.userPlayerId
  );

  // Group candidates
  const openers = remaining.filter((p) => p.profile.isOpener && !p.profile.isSpecialistBowler);
  const topOrder = remaining.filter((p) => p.profile.isTopOrder && !openers.includes(p) && !p.profile.isSpecialistBowler);
  const wicketkeepers = remaining.filter((p) => p.profile.isWicketkeeper);
  const allRounders = remaining.filter((p) => p.profile.isAllRounder);
  const pacers = remaining.filter((p) => p.profile.isPaceBowler && p.profile.bowlingAbility >= 55);
  const spinners = remaining.filter((p) => p.profile.isSpinBowler && p.profile.bowlingAbility >= 55);
  const batters = remaining.filter(
    (p) =>
      p.profile.role === 'Batter' &&
      !openers.includes(p) &&
      !topOrder.includes(p) &&
      !wicketkeepers.includes(p)
  );

  const selected: typeof profiles = [];
  const chosenIds = new Set<string>();

  const add = (item?: typeof profiles[0]) => {
    if (item && !chosenIds.has(item.profile.playerId) && selected.length < 11) {
      selected.push(item);
      chosenIds.add(item.profile.playerId);
    }
  };

  // If user player is present, add them first
  if (userItem) {
    add(userItem);
  }

  // 1. Pick 1 Wicketkeeper
  if (!selected.some((s) => s.profile.isWicketkeeper)) {
    const bestWK = wicketkeepers.sort((a, b) => b.profile.overallRating - a.profile.overallRating)[0];
    add(bestWK);
  }

  // 2. Pick 2 Openers
  const neededOpeners = 2 - selected.filter((s) => s.profile.isOpener).length;
  openers
    .sort((a, b) => b.profile.battingAbility - a.profile.battingAbility)
    .slice(0, Math.max(0, neededOpeners))
    .forEach(add);

  // 3. Pitch & Weather aware bowling attack (Need 4-5 specialist bowlers)
  const isPaceFriendly = options.pitch === 'GREEN' || options.pitch === 'PACE_FRIENDLY' || options.weather === 'CLOUDY';
  const isSpinFriendly = options.pitch === 'SPIN_FRIENDLY' || options.pitch === 'DRY' || options.pitch === 'SLOW';

  const targetPacers = isPaceFriendly ? 3 : isSpinFriendly ? 2 : 3;
  const targetSpinners = isSpinFriendly ? 2 : 1;

  pacers.sort((a, b) => b.profile.bowlingAbility - a.profile.bowlingAbility).slice(0, targetPacers).forEach(add);
  spinners.sort((a, b) => b.profile.bowlingAbility - a.profile.bowlingAbility).slice(0, targetSpinners).forEach(add);

  // 4. Pick 1-2 All-Rounders
  allRounders.sort((a, b) => b.profile.overallRating - a.profile.overallRating).slice(0, 2).forEach(add);

  // 5. Fill remaining spots with top/middle order batters
  const bestBatters = [...topOrder, ...batters].sort(
    (a, b) => b.profile.battingAbility - a.profile.battingAbility
  );
  for (const b of bestBatters) {
    if (selected.length >= 11) break;
    add(b);
  }

  // 6. If still < 11, add best remaining players
  remaining.sort((a, b) => b.profile.overallRating - a.profile.overallRating).forEach(add);

  // Take top 11
  const finalElevenProfiles = selected.slice(0, 11);

  // Convert to MatchPlayerPerformance objects
  const rawXI: MatchPlayerPerformance[] = finalElevenProfiles.map((item) => {
    const raw = item.raw;
    if ('runs' in raw) {
      return { ...raw };
    }
    const gp = raw as GlobalCricketPlayer;
    return {
      playerId: gp.player_id,
      name: gp.name,
      shortName: gp.short_name,
      role: gp.primary_role,
      overallRating: options.targetRating || gp.overall_rating,
      condition: 'EXCELLENT' as const,
      form: gp.form_status === 'Excellent' ? 'IN_FORM' : 'NORMAL',
      fatigue: 0,
      isCaptain: gp.player_id === options.captainId,
      isWicketkeeper: gp.player_id === options.wicketkeeperId || gp.primary_role === 'Wicketkeeper-Batter',
      isUserPlayer: gp.player_id === options.userPlayerId,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      dismissalText: 'not out',
      battingPosition: 1,
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
    };
  });

  // Ensure Captain & Wicketkeeper flags
  if (!rawXI.some((p) => p.isCaptain)) rawXI[0].isCaptain = true;
  if (!rawXI.some((p) => p.isWicketkeeper)) {
    const wk = rawXI.find((p) => p.role === 'Wicketkeeper-Batter') || rawXI[1];
    wk.isWicketkeeper = true;
  }

  // Now arrange into logical batting order (1-11)
  return buildLogicalBattingOrder(rawXI, options.format, options.pitch);
}

/**
 * Arranges 11 players into a strictly logical, realistic 1–11 cricket batting order
 */
export function buildLogicalBattingOrder(
  players: MatchPlayerPerformance[],
  format: MatchFormat = 'T20',
  pitch: PitchCondition = 'BALANCED',
  situation?: {
    rrr?: number;
    isSecondInnings?: boolean;
    wicketsLost?: number;
    oversRemaining?: number;
  }
): MatchPlayerPerformance[] {

  if (players.length !== 11) return players;

  const list = players.map((p) => ({
    player: p,
    profile: getPlayerTacticalProfile(p),
  }));

  // Separate players into distinct strategic role buckets
  const openers: typeof list = [];
  const topOrder: typeof list = [];
  const middleOrder: typeof list = [];
  const finishers: typeof list = [];
  const allRounders: typeof list = [];
  const lowerOrderBowlers: typeof list = [];

  list.forEach((item) => {
    const prof = item.profile;
    if (prof.isSpecialistBowler) {
      lowerOrderBowlers.push(item);
    } else if (prof.isOpener) {
      openers.push(item);
    } else if (prof.isTopOrder) {
      topOrder.push(item);
    } else if (prof.isFinisher) {
      finishers.push(item);
    } else if (prof.isAllRounder) {
      allRounders.push(item);
    } else if (prof.isWicketkeeper) {
      if (prof.battingAbility >= 78) topOrder.push(item);
      else if (prof.battingAbility >= 65) middleOrder.push(item);
      else finishers.push(item);
    } else {
      middleOrder.push(item);
    }
  });

  // Sort each bucket by suitability
  openers.sort((a, b) => b.profile.battingAbility - a.profile.battingAbility);
  topOrder.sort((a, b) => b.profile.battingAbility - a.profile.battingAbility);
  middleOrder.sort((a, b) => b.profile.battingAbility - a.profile.battingAbility);
  finishers.sort((a, b) => b.profile.battingAbility - a.profile.battingAbility);
  allRounders.sort((a, b) => b.profile.battingAbility - a.profile.battingAbility);
  
  // Sort lower order bowlers by batting ability ASCENDING (so the #11 is the genuine tailender)
  lowerOrderBowlers.sort((a, b) => a.profile.battingAbility - b.profile.battingAbility);

  const ordered: typeof list = [];
  const used = new Set<string>();

  const place = (item?: typeof list[0]) => {
    if (item && !used.has(item.profile.playerId)) {
      ordered.push(item);
      used.add(item.profile.playerId);
    }
  };

  // Position 1 & 2: Openers
  place(openers.shift());
  place(openers.shift());

  // If we still need openers, use top order
  while (ordered.length < 2 && topOrder.length > 0) {
    place(topOrder.shift());
  }

  // Position 3: Best Top Order Anchor
  if (topOrder.length > 0) {
    place(topOrder.shift());
  } else if (openers.length > 0) {
    place(openers.shift());
  } else if (middleOrder.length > 0) {
    place(middleOrder.shift());
  }

  // Position 4: Best Middle Order Solid Batter
  if (middleOrder.length > 0) {
    place(middleOrder.shift());
  } else if (topOrder.length > 0) {
    place(topOrder.shift());
  } else if (allRounders.length > 0) {
    place(allRounders.shift());
  }

  // Position 5 & 6: Middle Order & Batting All-Rounders
  const midPool = [...topOrder, ...middleOrder, ...allRounders].sort(
    (a, b) => b.profile.battingAbility - a.profile.battingAbility
  );
  while (ordered.length < 6 && midPool.length > 0) {
    place(midPool.shift());
  }

  // Position 7: Finisher / Explosive All-Rounder
  const finPool = [...finishers, ...allRounders, ...middleOrder];
  while (ordered.length < 7 && finPool.length > 0) {
    place(finPool.shift());
  }

  // Position 8 to 11: Bowling All-Rounders & Lower Order Specialists
  const tailPool = [...list.filter((x) => !used.has(x.profile.playerId))].sort(
    (a, b) => b.profile.battingAbility - a.profile.battingAbility
  );

  while (tailPool.length > 0) {
    place(tailPool.shift());
  }

  // Map to final array with correct 1-indexed battingPosition
  return ordered.map((item, idx) => ({
    ...item.player,
    battingPosition: idx + 1,
  }));
}

/**
 * Validates and repairs any team lineup to ensure realism before match/innings starts
 */
export function validateAndRepairPlayingXI(
  squad: MatchPlayerPerformance[],
  options?: {
    format?: MatchFormat;
    pitch?: PitchCondition;
    weather?: WeatherCondition;
    userPlayerId?: string;
  }
): MatchPlayerPerformance[] {
  if (squad.length !== 11) return squad;

  const format = options?.format || 'T20';
  const pitch = options?.pitch || 'BALANCED';

  // Build logical batting order
  const repaired = buildLogicalBattingOrder(squad, format, pitch);

  // Validate that no specialist bowler with < 40 batting ability is in positions 1-3
  const pos1Prof = getPlayerTacticalProfile(repaired[0]);
  const pos2Prof = getPlayerTacticalProfile(repaired[1]);
  const pos3Prof = getPlayerTacticalProfile(repaired[2]);

  if (pos1Prof.isSpecialistBowler || pos2Prof.isSpecialistBowler || pos3Prof.isSpecialistBowler) {
    // Re-run with aggressive sort
    return buildLogicalBattingOrder(repaired, format, pitch);
  }

  return repaired;
}

export interface TacticalBowlingContext {
  bowlingXI: MatchPlayerPerformance[];
  currentStriker: MatchPlayerPerformance;
  lastCompletedBowlerIndex: number;
  overIndex: number; // 0-based (e.g. 0 to 19 for T20)
  maxOversPerInnings: number;
  format: MatchFormat;
  pitch: PitchCondition;
  weather: WeatherCondition;
  isSecondInnings: boolean;
  rrr?: number;
  target?: number;
  currentScore?: number;
  wicketsLost?: number;
}

/**
 * Professional AI Captain Bowling Rotation Engine
 * Selects the optimal bowler for the next over based on:
 * - Match phase (Powerplay vs Middle vs Death)
 * - Bowler over limits (T20 max 4, ODI max 10)
 * - Future quota preservation (saving death overs for over 18-20)
 * - Pitch & Weather synergy
 * - Strict ban on pure batters (bowling ability 0)
 * - Consecutive over rule
 */
export function selectAIBowlerForOver(context: TacticalBowlingContext): {
  bowlerIndex: number;
  player: MatchPlayerPerformance;
  tacticalReason: string;
} {
  const {
    bowlingXI,
    currentStriker,
    lastCompletedBowlerIndex,
    overIndex,
    maxOversPerInnings,
    format,
    pitch,
    weather,
    isSecondInnings,
    rrr,
  } = context;

  // 1. Calculate format max overs per bowler
  let maxOvers = 4;
  if (format === 'TEST') maxOvers = 999;
  else if (format === 'ODI') maxOvers = 10;
  else if (format === 'SUPER_OVER') maxOvers = 1;
  else if (format === 'THE_HUNDRED') maxOvers = 4;
  else maxOvers = Math.max(1, Math.ceil(maxOversPerInnings / 5));

  const oversRemainingInInnings = Math.max(0, maxOversPerInnings - overIndex);
  const currentTotalOvers = maxOversPerInnings;

  // 2. Identify match phase
  let phase: 'POWERPLAY' | 'MIDDLE' | 'DEATH' = 'MIDDLE';
  if (currentTotalOvers <= 20) {
    if (overIndex < 6) phase = 'POWERPLAY';
    else if (overIndex >= maxOversPerInnings - 4) phase = 'DEATH';
    else phase = 'MIDDLE';
  } else {
    if (overIndex < 10) phase = 'POWERPLAY';
    else if (overIndex >= maxOversPerInnings - 10) phase = 'DEATH';
    else phase = 'MIDDLE';
  }

  // 3. Filter eligible bowlers
  const strikerProfile = getPlayerTacticalProfile(currentStriker);

  const scoredCandidates: Array<{
    index: number;
    player: MatchPlayerPerformance;
    profile: PlayerTacticalProfile;
    score: number;
    reasons: string[];
  }> = [];

  bowlingXI.forEach((player, idx) => {
    const prof = getPlayerTacticalProfile(player);

    // Hard Rule 1: Bowler quota limit
    if (player.oversBowled >= maxOvers) return;

    // Hard Rule 2: Consecutive over rule
    if (overIndex > 0 && idx === lastCompletedBowlerIndex) return;

    // Hard Rule 3: Pure batters with 0 bowling ability MUST NOT BOWL
    if (prof.isPureBatter && prof.bowlingAbility < 40) return;

    // Hard Rule 4: Specialist wicketkeeper should not bowl
    if (prof.isWicketkeeper && prof.bowlingAbility < 50) return;

    // Base score from Bowling Ability & Rating
    let score = prof.bowlingAbility * 1.2 + prof.overallRating * 0.5;
    const reasons: string[] = [];

    // --- Match Phase Tactics ---
    if (phase === 'POWERPLAY') {
      if (prof.isPowerplaySpecialist || prof.isPaceBowler) {
        score += 18;
        reasons.push('new ball swing specialist');
      }
      if (player.oversBowled === 0) {
        score += 10;
        reasons.push('opening spell');
      }
    } else if (phase === 'MIDDLE') {
      if (prof.isSpinBowler) {
        score += 16;
        reasons.push('middle-overs spin choke');
      } else if (prof.isAllRounder) {
        score += 12;
        reasons.push('middle-overs change bowler');
      }
    } else if (phase === 'DEATH') {
      if (prof.isDeathSpecialist) {
        score += 26;
        reasons.push('death over execution');
      } else if (prof.isPaceBowler) {
        score += 14;
        reasons.push('pace at the death');
      } else if (prof.bowlingAbility >= 80) {
        score += 12;
        reasons.push('premier strike option');
      }
    }

    // --- Quota & Future Planning Preservation ---
    // In T20, if we are in overs 10-15 and this is the best death bowler (e.g. Bumrah),
    // don't exhaust all their remaining overs in the middle if only 2 overs remain!
    const oversLeftForBowler = maxOvers - player.oversBowled;
    if (prof.isDeathSpecialist && phase === 'MIDDLE' && oversLeftForBowler <= 2) {
      score -= 15; // Reserve for death overs
    }

    // In Death overs, heavily prioritize bowlers who still have overs left
    if (phase === 'DEATH') {
      score += oversLeftForBowler * 5;
    }

    // --- Pitch Synergy ---
    if ((pitch === 'GREEN' || pitch === 'PACE_FRIENDLY') && prof.isPaceBowler) {
      score += 12;
      reasons.push('pacer-friendly deck');
    }
    if ((pitch === 'SPIN_FRIENDLY' || pitch === 'DRY' || pitch === 'SLOW') && prof.isSpinBowler) {
      score += 14;
      reasons.push('turning track advantage');
    }

    // --- Weather Synergy ---
    if ((weather === 'CLOUDY' || weather === 'HUMID') && prof.isPaceBowler) {
      score += 8;
      reasons.push('overcast swing conditions');
    }

    // --- Matchup Advantage ---
    if (strikerProfile.battingStyle.includes('Left') && prof.bowlingStyle.includes('Off break')) {
      score += 10;
      reasons.push('tactical off-spin vs left-hander match-up');
    }

    // --- Match Economy & Form Bonus ---
    if (player.oversBowled > 0) {
      if (player.economyRate < 6.5) {
        score += 10;
        reasons.push(`economical rhythm (${player.economyRate} RPO)`);
      } else if (player.economyRate > 12.0 && phase !== 'DEATH') {
        score -= 12; // expensive in earlier overs
      }
      if (player.wickets > 0) {
        score += player.wickets * 6;
        reasons.push(`${player.wickets} wicket${player.wickets > 1 ? 's' : ''} in the bag`);
      }
    }

    if (player.condition === 'EXCELLENT') score += 5;
    if (player.form === 'IN_FORM' || player.form === 'EXCELLENT') score += 5;

    scoredCandidates.push({
      index: idx,
      player,
      profile: prof,
      score,
      reasons,
    });
  });

  // If no candidates qualify (e.g. extreme edge case), fallback to any eligible player who is not consecutive
  if (scoredCandidates.length === 0) {
    const fallback = bowlingXI
      .map((p, idx) => ({ p, idx }))
      .filter(({ p, idx }) => p.oversBowled < maxOvers && idx !== lastCompletedBowlerIndex);

    if (fallback.length > 0) {
      const bestFallback = fallback.sort(
        (a, b) =>
          getPlayerTacticalProfile(b.p).bowlingAbility -
          getPlayerTacticalProfile(a.p).bowlingAbility
      )[0];
      return {
        bowlerIndex: bestFallback.idx,
        player: bestFallback.p,
        tacticalReason: 'Regular rotation bowler.',
      };
    }

    // Ultimate safety fallback
    return {
      bowlerIndex: 0,
      player: bowlingXI[0],
      tacticalReason: 'Emergency default bowler.',
    };
  }

  // Sort candidates by score descending
  scoredCandidates.sort((a, b) => b.score - a.score);
  const chosen = scoredCandidates[0];

  const reasonText =
    chosen.reasons.length > 0
      ? `Captain deployed ${chosen.player.shortName}: ${chosen.reasons.slice(0, 2).join(' + ')} in ${phase.toLowerCase()} phase.`
      : `Tactical bowling rotation: ${chosen.player.shortName} deployed with ${maxOvers - chosen.player.oversBowled} overs remaining.`;

  return {
    bowlerIndex: chosen.index,
    player: chosen.player,
    tacticalReason: reasonText,
  };
}

/**
 * AI Captain Toss Decision Engine
 */
export function getAICaptainTossDecision(
  pitch: PitchCondition,
  weather: WeatherCondition,
  format: MatchFormat,
  dayNight?: boolean
): 'BAT' | 'BOWL' {
  // Heavy moisture / green pitch -> bowl first
  if (pitch === 'GREEN' || weather === 'CLOUDY' || weather === 'HUMID') {
    return 'BOWL';
  }

  // Dry turning track or flat batting paradise -> bat first
  if (pitch === 'BATTING' || pitch === 'DRY') {
    return 'BAT';
  }

  // Day/Night T20s often favor chasing due to dew
  if (dayNight && format === 'T20') {
    return 'BOWL';
  }

  return 'BAT';
}

/**
 * AI Tactical Shot/Delivery Recommendation Engine for realistic simulation
 */
export function getTacticalBattingChoice(
  striker: MatchPlayerPerformance,
  bowler: MatchPlayerPerformance,
  situation: {
    phase: 'POWERPLAY' | 'MIDDLE_OVERS' | 'DEATH_OVERS' | 'TEST_SESSION';
    rrr?: number;
    ballsRemaining: number;
    wicketsLeft: number;
  }
): BattingDecisionType {
  const profile = getPlayerTacticalProfile(striker);

  if (situation.phase === 'TEST_SESSION') {
    if (situation.wicketsLeft <= 2 || profile.isSpecialistBowler) return 'DEFEND';
    if (profile.battingAbility >= 80) return 'DRIVE_FOUR';
    return 'ROTATE_STRIKE';
  }

  // High RRR in limited overs (> 11.0)
  if (situation.rrr && situation.rrr >= 11.0) {
    if (profile.isFinisher || profile.battingAbility >= 82) return 'LOFTED_SIX';
    return 'AGGRESSIVE_ATTACK';
  }

  // Death overs
  if (situation.phase === 'DEATH_OVERS') {
    if (profile.isFinisher || profile.isAllRounder) return 'AGGRESSIVE_ATTACK';
    return 'DRIVE_FOUR';
  }

  // Powerplay
  if (situation.phase === 'POWERPLAY') {
    if (profile.isOpener) return 'DRIVE_FOUR';
    return 'ROTATE_STRIKE';
  }

  // Middle overs
  return 'ROTATE_STRIKE';
}

export function getTacticalBowlingDeliveryChoice(
  bowler: MatchPlayerPerformance,
  situation: {
    phase: 'POWERPLAY' | 'MIDDLE_OVERS' | 'DEATH_OVERS' | 'TEST_SESSION';
    isDeathOvers: boolean;
  }
): BowlingDeliveryChoice {
  const profile = getPlayerTacticalProfile(bowler);

  if (profile.isSpinBowler) {
    if (situation.isDeathOvers) return 'ARM_BALL';
    if (profile.bowlingStyle.includes('Leg')) return 'GOOGLY';
    return 'OFF_BREAK';
  }


  // Pace bowler
  if (situation.isDeathOvers) {
    return Math.random() > 0.4 ? 'YORKER' : 'SLOWER_BALL';
  }

  if (situation.phase === 'POWERPLAY') {
    return Math.random() > 0.5 ? 'OUTSWINGER' : 'INSWINGER';
  }

  return 'GOOD_LENGTH';
}
