import {
  BallByBallEvent,
  BattingDecisionType,
  BowlingDeliveryChoice,
  WicketDismissalType,
  DRSReviewState,
} from './types';

export function generateDeliveryCommentary(event: Partial<BallByBallEvent>): string {
  const {
    bowler,
    striker,
    runsScored,
    extras,
    isWicket,
    wicketType,
    isBoundaryFour,
    isBoundarySix,
    isFreeHit,
    dismissedPlayerName,
    fielderName,
    deliveryChoice,
    battingChoice,
    scoreAfterBall,
    overIndex = 0,
    ballInOver = 1,
  } = event;

  const bowlerName = bowler?.shortName || bowler?.name || 'Bowler';
  const strikerName = striker?.shortName || striker?.name || 'Batter';
  const overPrefix = `${overIndex}.${ballInOver}`;

  if (extras?.wides) {
    return `${overPrefix} ${bowlerName} sprays it wide outside the guideline! Umpire signals WIDE. (+1 Extra)`;
  }

  if (extras?.noBalls) {
    return `${overPrefix} NO BALL! ${bowlerName} oversteps the front crease line! FREE HIT coming up! (+1 Extra)`;
  }

  if (isWicket) {
    const victim = dismissedPlayerName || strikerName;
    switch (wicketType) {
      case 'BOWLED':
        return `${overPrefix} TIMBER! ${bowlerName} cleans up ${victim}! The stumps are shattered into the air! WICKET!`;
      case 'LBW':
        return `${overPrefix} HUGE APPEAL... AND GIVEN! ${bowlerName} traps ${victim} plumb in front with a pin-point delivery! OUT LBW!`;
      case 'CAUGHT':
        return `${overPrefix} GONE! ${victim} looks to clear the ropes but is caught by ${fielderName || 'fielder'}! Fantastic catch!`;
      case 'STUMPED':
        return `${overPrefix} LIGHTNING GLOVEWORK! ${victim} drags the back foot out and the keeper whips the bails off in a flash! STUMPED!`;
      case 'RUN_OUT':
        return `${overPrefix} DIRECT HIT! Mix-up in the middle and ${victim} is caught short of the crease! RUN OUT!`;
      case 'HIT_WICKET':
        return `${overPrefix} DISASTER! ${victim} steps back onto the stumps! OUT Hit Wicket!`;
      default:
        return `${overPrefix} OUT! ${victim} departs! ${bowlerName} strikes for the bowling side!`;
    }
  }

  if (isBoundarySix) {
    const sixPhrases = [
      `${overPrefix} MASSIVE! ${strikerName} connects sweetly and launches it 95 meters deep into the stands! SIX!`,
      `${overPrefix} HIGH AND HANDSOME! Picked up off the pads and dispatched over deep square leg! SIX RUNS!`,
      `${overPrefix} BOOM! Right out of the sweet spot! Clean strike over long-on for a monumental MAXIMUM!`,
    ];
    return sixPhrases[Math.floor(Math.random() * sixPhrases.length)];
  }

  if (isBoundaryFour) {
    const fourPhrases = [
      `${overPrefix} CRACK! ${strikerName} punches it through extra cover with glorious timing! Races away for FOUR!`,
      `${overPrefix} FOUR! Short and punished! Cut away through point with venom!`,
      `${overPrefix} FOUR RUNS! Exquisite straight drive off ${bowlerName}, no fielder moves an inch!`,
      `${overPrefix} FOUR! Pulled hard into the gap between deep midwicket and square leg!`,
    ];
    return fourPhrases[Math.floor(Math.random() * fourPhrases.length)];
  }

  if (runsScored === 1) {
    const singlePhrases = [
      `${overPrefix} ${strikerName} drops it with soft hands into the covers and rotates the strike. (1 Run)`,
      `${overPrefix} Pushed down to long-on for an easy single.`,
      `${overPrefix} Tucked away off the hips behind square for a single.`,
      `${overPrefix} Worked into the gap on the leg side to bring the non-striker on strike.`,
    ];
    return singlePhrases[Math.floor(Math.random() * singlePhrases.length)];
  }

  if (runsScored === 2) {
    return `${overPrefix} Excellent running between the wickets! Placed in the gap and they push hard for two runs. (+2 Runs)`;
  }

  if (runsScored === 3) {
    return `${overPrefix} Great fielding on the boundary prevents the four, but the batters hustle back for 3 runs! (+3 Runs)`;
  }

  // Dot Ball (0 runs)
  const dotPhrases = [
    `${overPrefix} Good length ball from ${bowlerName}, ${strikerName} defends solidly back down the pitch. (Dot)`,
    `${overPrefix} Beaten outside off stump! Lovely shape away from the right-hander.`,
    `${overPrefix} Direct block into the off-side, no run on offer.`,
    `${overPrefix} Well bowled by ${bowlerName}, keeps the batter quiet with tight discipline.`,
  ];
  return dotPhrases[Math.floor(Math.random() * dotPhrases.length)];
}

export function generateDRSCommentary(drs: DRSReviewState): string {
  const { teamName, originalDecision, pitching, impact, wickets, finalDecision } = drs;
  return `DRS REVIEW by ${teamName}: Original Decision: ${originalDecision} -> Ball Tracking shows Pitching: ${pitching}, Impact: ${impact}, Wickets: ${wickets}. Final Decision: ${finalDecision}!`;
}
