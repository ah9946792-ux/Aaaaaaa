// Duckworth-Lewis-Stern (DLS) calculation table & resource percentage handler

// Standard 50-over and 20-over resource percentages table by overs remaining and wickets lost
// Table format: [oversRemaining][wicketsLost 0..9]
const DLS_RESOURCE_TABLE_20: Record<number, number[]> = {
  20: [100.0, 93.4, 85.1, 74.9, 62.7, 49.0, 34.9, 22.0, 11.9, 4.7],
  18: [91.8, 86.2, 79.0, 70.0, 59.1, 46.7, 33.7, 21.4, 11.7, 4.6],
  16: [83.2, 78.5, 72.4, 64.6, 55.0, 44.0, 32.2, 20.7, 11.4, 4.6],
  14: [74.2, 70.4, 65.3, 58.7, 50.4, 40.8, 30.3, 19.8, 11.1, 4.5],
  12: [64.8, 61.8, 57.6, 52.2, 45.2, 37.1, 28.0, 18.6, 10.6, 4.4],
  10: [54.9, 52.6, 49.3, 45.0, 39.4, 32.8, 25.1, 17.1, 10.0, 4.3],
  8: [44.6, 42.9, 40.5, 37.2, 32.9, 27.8, 21.6, 15.1, 9.1, 4.1],
  6: [33.9, 32.8, 31.1, 28.8, 25.8, 22.1, 17.5, 12.6, 7.9, 3.8],
  5: [28.4, 27.5, 26.2, 24.4, 21.9, 18.9, 15.2, 11.1, 7.1, 3.5],
  4: [22.8, 22.1, 21.1, 19.7, 17.9, 15.6, 12.7, 9.4, 6.2, 3.2],
  3: [17.2, 16.7, 16.0, 15.0, 13.7, 12.1, 10.0, 7.6, 5.1, 2.7],
  2: [11.5, 11.2, 10.8, 10.2, 9.4, 8.4, 7.1, 5.5, 3.8, 2.1],
  1: [5.8, 5.7, 5.5, 5.2, 4.8, 4.4, 3.8, 3.0, 2.2, 1.3],
  0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

export function getResourcePercentage(oversRemaining: number, wicketsLost: number, maxOvers: number = 20): number {
  const boundedWickets = Math.max(0, Math.min(9, wicketsLost));
  const boundedOvers = Math.max(0, Math.min(maxOvers, Math.round(oversRemaining)));

  if (maxOvers <= 20) {
    if (DLS_RESOURCE_TABLE_20[boundedOvers]) {
      return DLS_RESOURCE_TABLE_20[boundedOvers][boundedWickets];
    }
    // Linear interpolation
    const ratio = boundedOvers / 20;
    const baseVal = DLS_RESOURCE_TABLE_20[20][boundedWickets];
    return baseVal * ratio;
  } else {
    // 50-over calculation
    const ratio = Math.pow(boundedOvers / 50, 0.9);
    const wicketFactor = 1 - boundedWickets * 0.085;
    return Math.max(0, Math.min(100, 100 * ratio * wicketFactor));
  }
}

export function calculateDLSTarget(params: {
  team1Score: number;
  originalMaxOvers: number;
  revisedMaxOvers: number;
  interruptedAtOverInnings2: number;
  wicketsLostInnings2: number;
}): { revisedTarget: number; explanation: string } {
  const {
    team1Score,
    originalMaxOvers,
    revisedMaxOvers,
    interruptedAtOverInnings2,
    wicketsLostInnings2,
  } = params;

  if (revisedMaxOvers >= originalMaxOvers) {
    return {
      revisedTarget: team1Score + 1,
      explanation: `Standard target of ${team1Score + 1} runs from full ${originalMaxOvers} overs.`,
    };
  }

  // Minimum overs check for official match result (e.g. 5 overs in T20, 20 overs in ODI)
  const minRequiredOvers = originalMaxOvers <= 20 ? 5 : 20;
  if (revisedMaxOvers < minRequiredOvers) {
    return {
      revisedTarget: 0,
      explanation: `Match abandoned due to persistent rain. Less than minimum ${minRequiredOvers} overs possible.`,
    };
  }

  // Resources Available:
  // Team 1 had 100% resources
  const r1 = 100.0;

  // Team 2 resources: resources for revisedMaxOvers overs minus lost resources
  const r2 = getResourcePercentage(revisedMaxOvers, 0, originalMaxOvers);

  let target: number;
  if (r2 < r1) {
    // Team 2 has less resources
    target = Math.floor(team1Score * (r2 / r1)) + 1;
  } else {
    // Team 2 has more resources (unusual, e.g. T1 shortened mid-innings)
    const g50 = originalMaxOvers <= 20 ? 150 : 245;
    target = Math.floor(team1Score + ((r2 - r1) / 100) * g50) + 1;
  }

  return {
    revisedTarget: Math.max(1, target),
    explanation: `DLS Method applied: Revised target of ${target} runs in ${revisedMaxOvers} overs (Resource factor: ${r2.toFixed(1)}%).`,
  };
}
