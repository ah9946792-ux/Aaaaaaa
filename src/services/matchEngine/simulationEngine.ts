import {
  MatchContextConfig,
  MatchTeamsSetup,
  InningsScorecard,
  MatchPlayerPerformance,
  BallByBallEvent,
  CompletedMatchReport,
  DRSReviewState,
  RainInterruptionState,
  BattingDecisionType,
  BowlingDeliveryChoice,
  WicketDismissalType,
} from './types';
import {
  simulateBallPhysics,
  getMatchPhase,
  calculateMatchAwards,
} from './physics';
import { generateDeliveryCommentary, generateDRSCommentary } from './commentary';
import { calculateDLSTarget } from './dls';
import {
  validateAndRepairPlayingXI,
  selectAIBowlerForOver,
  getAICaptainTossDecision,
  getTacticalBattingChoice,
  getTacticalBowlingDeliveryChoice,
  getPlayerTacticalProfile,
} from './tacticalEngine';

export class CricketMatchSimulator {
  config: MatchContextConfig;
  teams: MatchTeamsSetup;
  
  // Toss
  tossWinner: 'teamA' | 'teamB' = 'teamA';
  tossDecision: 'BAT' | 'BOWL' = 'BAT';

  // Innings State
  currentInningsNumber: 1 | 2 = 1;
  innings1: InningsScorecard;
  innings2?: InningsScorecard;

  // Active Innings Pointers
  battingTeamKey: 'teamA' | 'teamB' = 'teamA';
  bowlingTeamKey: 'teamA' | 'teamB' = 'teamB';

  currentStrikerIndex: number = 0;
  currentNonStrikerIndex: number = 1;
  currentBowlerIndex: number = 0;
  nextBatterIndex: number = 2;

  // Ball & Overs Tracker
  overIndex: number = 0; // 0-based (e.g. 0 to 19 for 20 overs)
  legalBallsInOver: number = 0; // 0 to 6
  isFreeHitActive: boolean = false;

  // History & Commentary
  ballHistory: BallByBallEvent[] = [];
  recentBallPills: string[] = []; // e.g. ['0', '4', '1', 'W', '6', '1']

  // DRS & Rain
  activeDRS?: DRSReviewState;
  rainState?: RainInterruptionState;

  // Match State Flags
  isMatchOver: boolean = false;
  isInningsBreak: boolean = false;
  isPausedForUserDecision: boolean = false;
  pendingUserDecisionType?: 'BATTING' | 'BOWLING' | 'CATCH' | 'DRS';

  // Bowler selection & Over limits
  isAwaitingBowlerSelection: boolean = false;
  lastCompletedBowlerIndex: number = -1;

  constructor(config: MatchContextConfig, teams: MatchTeamsSetup) {
    this.config = config;

    // Validate and organize playing XIs:
    // USER teams retain their exact manual Playing XI and batting order (never overwritten by AI)
    // AI teams get tactical optimization
    const teamAXI = teams.teamA.isUserTeam || teams.teamA.controlMode === 'USER'
      ? teams.teamA.playingXI.map((p, idx) => ({ ...p, battingPosition: idx + 1 }))
      : validateAndRepairPlayingXI(teams.teamA.playingXI, {
          format: config.format,
          pitch: config.pitch,
          weather: config.weather,
          userPlayerId: config.userPlayerId,
        });

    const teamBXI = teams.teamB.isUserTeam || teams.teamB.controlMode === 'USER'
      ? teams.teamB.playingXI.map((p, idx) => ({ ...p, battingPosition: idx + 1 }))
      : validateAndRepairPlayingXI(teams.teamB.playingXI, {
          format: config.format,
          pitch: config.pitch,
          weather: config.weather,
          userPlayerId: config.userPlayerId,
        });

    this.teams = {
      teamA: {
        ...teams.teamA,
        controlMode: teams.teamA.controlMode || (teams.teamA.isUserTeam ? 'USER' : 'AI'),
        playingXI: teamAXI,
      },
      teamB: {
        ...teams.teamB,
        controlMode: teams.teamB.controlMode || (teams.teamB.isUserTeam ? 'USER' : 'AI'),
        playingXI: teamBXI,
      },
    };

    // Initialize Empty Innings 1
    this.innings1 = this.createEmptyInnings(1, this.teams.teamA.name, this.teams.teamB.name);
  }

  // Get max legal overs per bowler for this match format
  public getBowlerOverLimit(): number {
    const format = this.config.format;
    if (format === 'TEST') return 999;
    if (format === 'SUPER_OVER') return 1;
    if (format === 'THE_HUNDRED') return 4;
    if (format === 'T20') return 4;
    if (format === 'ODI') return 10;
    return Math.max(1, Math.ceil(this.config.maxOversPerInnings / 5));
  }

  // Re-arrange batting order for a team
  public setBattingOrder(teamKey: 'teamA' | 'teamB', newOrder: MatchPlayerPerformance[]): void {
    if (newOrder.length !== 11) return;
    this.teams[teamKey].playingXI = newOrder.map((p, idx) => ({
      ...p,
      battingPosition: idx + 1,
    }));

    if (this.currentInningsNumber === 1 && this.battingTeamKey === teamKey) {
      this.innings1.batters = JSON.parse(JSON.stringify(this.teams[teamKey].playingXI));
    } else if (this.currentInningsNumber === 2 && this.battingTeamKey === teamKey && this.innings2) {
      this.innings2.batters = JSON.parse(JSON.stringify(this.teams[teamKey].playingXI));
    }
  }

  // Set opening pair for a team
  public setOpeningPair(teamKey: 'teamA' | 'teamB', opener1Id: string, opener2Id: string): void {
    const xi = [...this.teams[teamKey].playingXI];
    const op1Index = xi.findIndex((p) => p.playerId === opener1Id);
    const op2Index = xi.findIndex((p) => p.playerId === opener2Id);

    if (op1Index === -1 || op2Index === -1 || op1Index === op2Index) return;

    const op1 = xi.splice(op1Index, 1)[0];
    const adjustedOp2Index = xi.findIndex((p) => p.playerId === opener2Id);
    const op2 = xi.splice(adjustedOp2Index, 1)[0];

    const reordered = [op1, op2, ...xi];
    this.setBattingOrder(teamKey, reordered);
  }

  // Get eligible bowlers for the current bowling team
  public getEligibleBowlers(): Array<{
    index: number;
    player: MatchPlayerPerformance;
    oversBowled: number;
    maxOvers: number;
    isOverLimit: boolean;
    isConsecutiveOver: boolean;
    isEligible: boolean;
    isPureBatter: boolean;
    reason?: string;
  }> {
    const innings = this.getActiveInnings();
    const maxOvers = this.getBowlerOverLimit();
    const bowlingSquad = innings.bowlers;

    return bowlingSquad.map((player, idx) => {
      const prof = getPlayerTacticalProfile(player);
      const overs = player.oversBowled;
      const isOverLimit = overs >= maxOvers;
      const isConsecutiveOver = this.overIndex > 0 && idx === this.lastCompletedBowlerIndex;
      const isPureBatter = prof.isPureBatter && prof.bowlingAbility < 40;
      const isEligible = !isOverLimit && !isConsecutiveOver && !isPureBatter;

      let reason = '';
      if (isOverLimit) {
        reason = `Over limit reached (Max ${maxOvers} ov)`;
      } else if (isConsecutiveOver) {
        reason = 'Bowled previous over (Consecutive over rule)';
      } else if (isPureBatter) {
        reason = 'Pure batter (Specialist batters do not bowl)';
      }

      return {
        index: idx,
        player,
        oversBowled: overs,
        maxOvers,
        isOverLimit,
        isConsecutiveOver,
        isEligible,
        isPureBatter,
        reason,
      };
    });
  }

  // Intelligent AI recommendation for bowler selection
  public getRecommendedBowler(): {
    index: number;
    player: MatchPlayerPerformance;
    reason: string;
  } {
    const innings = this.getActiveInnings();
    const currentStriker = innings.batters[this.currentStrikerIndex] || innings.batters[0];

    // Calculate Required Run Rate if 2nd innings
    let rrr: number | undefined = undefined;
    if (this.currentInningsNumber === 2 && innings.target) {
      const runsRemaining = innings.target - innings.totalRuns;
      const ballsRemaining = Math.max(1, this.config.maxOversPerInnings * 6 - (this.overIndex * 6 + this.legalBallsInOver));
      rrr = Number(((runsRemaining / ballsRemaining) * 6).toFixed(2));
    }

    const aiChoice = selectAIBowlerForOver({
      bowlingXI: innings.bowlers,
      currentStriker,
      lastCompletedBowlerIndex: this.lastCompletedBowlerIndex,
      overIndex: this.overIndex,
      maxOversPerInnings: this.config.maxOversPerInnings,
      format: this.config.format,
      pitch: this.config.pitch,
      weather: this.config.weather,
      isSecondInnings: this.currentInningsNumber === 2,
      rrr,
      target: innings.target,
      currentScore: innings.totalRuns,
      wicketsLost: innings.totalWickets,
    });

    return {
      index: aiChoice.bowlerIndex,
      player: aiChoice.player,
      reason: aiChoice.tacticalReason,
    };
  }

  // Select bowler for the current over
  public selectBowler(bowlerIndex: number): void {
    const innings = this.getActiveInnings();
    if (bowlerIndex >= 0 && bowlerIndex < innings.bowlers.length) {
      this.currentBowlerIndex = bowlerIndex;
      this.isAwaitingBowlerSelection = false;
    }
  }

  private createEmptyInnings(
    num: 1 | 2,
    batTeamName: string,
    bowlTeamName: string,
    target?: number
  ): InningsScorecard {
    const batTeam = this.teams.teamA.name === batTeamName ? this.teams.teamA : this.teams.teamB;
    const bowlTeam = this.teams.teamA.name === bowlTeamName ? this.teams.teamA : this.teams.teamB;

    return {
      inningsNumber: num,
      battingTeamName: batTeamName,
      bowlingTeamName: bowlTeamName,
      totalRuns: 0,
      totalWickets: 0,
      totalOvers: 0,
      ballsInCurrentOver: 0,
      isAllOut: false,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
      currentRunRate: 0.0,
      target,
      batters: JSON.parse(JSON.stringify(batTeam.playingXI)),
      bowlers: JSON.parse(JSON.stringify(bowlTeam.playingXI)),
      fallOfWickets: [],
      partnerships: [],
      currentPartnership: {
        batter1Name: batTeam.playingXI[0]?.name || 'Batter 1',
        batter1Runs: 0,
        batter2Name: batTeam.playingXI[1]?.name || 'Batter 2',
        batter2Runs: 0,
        totalRuns: 0,
        balls: 0,
      },
    };
  }

  // Conduct Coin Toss
  public conductToss(userChoice?: 'HEADS' | 'TAILS', userDecision?: 'BAT' | 'BOWL'): {
    winner: 'teamA' | 'teamB';
    decision: 'BAT' | 'BOWL';
    summary: string;
  } {
    const tossRoll = Math.random() > 0.5;
    
    // Toss winner
    this.tossWinner = tossRoll ? 'teamA' : 'teamB';
    const winningTeam = this.teams[this.tossWinner];

    if (winningTeam.isUserTeam && userDecision) {
      this.tossDecision = userDecision;
    } else {
      // AI captain realistic decision based on pitch, weather & format
      this.tossDecision = getAICaptainTossDecision(
        this.config.pitch,
        this.config.weather,
        this.config.format,
        this.config.dayNight
      );
    }

    // Set active Batting / Bowling teams
    if (
      (this.tossWinner === 'teamA' && this.tossDecision === 'BAT') ||
      (this.tossWinner === 'teamB' && this.tossDecision === 'BOWL')
    ) {
      this.battingTeamKey = 'teamA';
      this.bowlingTeamKey = 'teamB';
    } else {
      this.battingTeamKey = 'teamB';
      this.bowlingTeamKey = 'teamA';
    }

    this.innings1 = this.createEmptyInnings(
      1,
      this.teams[this.battingTeamKey].name,
      this.teams[this.bowlingTeamKey].name
    );

    // Initial Bowler for Over 1 using Tactical AI
    const initBowler = this.getRecommendedBowler();
    this.currentBowlerIndex = initBowler.index;

    // Check if user controls bowling team (Dream Team / Manager) for initial over 1 selection
    const isUserBowlingTeam = this.teams[this.bowlingTeamKey]?.isUserTeam;
    const gameMode = this.config.gameMode;
    if (isUserBowlingTeam && (gameMode === 'dream_team' || gameMode === 'manager')) {
      this.isAwaitingBowlerSelection = true;
    }

    const summary = `${winningTeam.name} won the toss and elected to ${this.tossDecision === 'BAT' ? 'bat first' : 'bowl first'}.`;
    return {
      winner: this.tossWinner,
      decision: this.tossDecision,
      summary,
    };
  }

  // Get Current Active Innings Reference
  public getActiveInnings(): InningsScorecard {
    return this.currentInningsNumber === 1 ? this.innings1 : this.innings2!;
  }

  // Deliver next single ball
  public deliverNextBall(options?: {
    battingChoice?: BattingDecisionType;
    bowlingChoice?: BowlingDeliveryChoice;
  }): BallByBallEvent | null {
    if (this.isMatchOver || this.isInningsBreak) return null;

    const innings = this.getActiveInnings();
    const striker = innings.batters[this.currentStrikerIndex];
    const nonStriker = innings.batters[this.currentNonStrikerIndex];
    const bowler = innings.bowlers[this.currentBowlerIndex];

    const currentTotalOvers = this.config.maxOversPerInnings;
    const phase = getMatchPhase(this.config.format, this.overIndex, currentTotalOvers);

    // Calculate Required Run Rate if 2nd innings
    let rrr: number | undefined = undefined;
    if (this.currentInningsNumber === 2 && innings.target) {
      const runsRemaining = innings.target - innings.totalRuns;
      const ballsRemaining = Math.max(1, currentTotalOvers * 6 - (this.overIndex * 6 + this.legalBallsInOver));
      rrr = Number(((runsRemaining / ballsRemaining) * 6).toFixed(2));
    }

    // AI tactical choices if not provided by user
    const totalBallsRemaining = Math.max(1, currentTotalOvers * 6 - (this.overIndex * 6 + this.legalBallsInOver));
    const wicketsLeft = 10 - innings.totalWickets;

    const resolvedBattingChoice =
      options?.battingChoice ||
      getTacticalBattingChoice(striker, bowler, {
        phase,
        rrr,
        ballsRemaining: totalBallsRemaining,
        wicketsLeft,
      });

    const isDeathOvers = phase === 'DEATH_OVERS';
    const resolvedBowlingChoice =
      options?.bowlingChoice ||
      getTacticalBowlingDeliveryChoice(bowler, {
        phase,
        isDeathOvers,
      });

    // Run Physics Engine
    const ballResult = simulateBallPhysics({
      striker,
      bowler,
      fielders: innings.bowlers.filter((_, idx) => idx !== this.currentBowlerIndex),
      format: this.config.format,
      pitch: this.config.pitch,
      weather: this.config.weather,
      phase,
      battingChoice: resolvedBattingChoice,
      bowlingChoice: resolvedBowlingChoice,
      isFreeHit: this.isFreeHitActive,
      requiredRunRate: rrr,
      currentOver: this.overIndex,
      currentBallInOver: this.legalBallsInOver + 1,
      wicketsLost: innings.totalWickets,
      isSecondInnings: this.currentInningsNumber === 2,
      target: innings.target,
      currentScore: innings.totalRuns,
    });

    // Update Scores & Stats
    const extrasTotal =
      ballResult.extras.wides +
      ballResult.extras.noBalls +
      ballResult.extras.byes +
      ballResult.extras.legByes +
      ballResult.extras.penalty;

    const totalRunsOnBall = ballResult.runsScored + extrasTotal;

    // Update Innings Totals
    innings.totalRuns += totalRunsOnBall;
    innings.extras.wides += ballResult.extras.wides;
    innings.extras.noBalls += ballResult.extras.noBalls;
    innings.extras.byes += ballResult.extras.byes;
    innings.extras.legByes += ballResult.extras.legByes;
    innings.extras.total += extrasTotal;

    // Update Striker
    if (ballResult.isLegalDelivery || ballResult.extras.noBalls > 0) {
      striker.balls += 1;
    }
    striker.runs += ballResult.runsScored;
    if (ballResult.isBoundaryFour) striker.fours += 1;
    if (ballResult.isBoundarySix) striker.sixes += 1;
    striker.strikeRate = striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(1)) : 0;

    // Update Bowler
    bowler.runsConceded += totalRunsOnBall - (ballResult.extras.byes + ballResult.extras.legByes);
    if (ballResult.extras.wides > 0) bowler.wides += ballResult.extras.wides;
    if (ballResult.extras.noBalls > 0) bowler.noBalls += ballResult.extras.noBalls;
    if (ballResult.runsScored === 0 && extrasTotal === 0) bowler.dotBalls += 1;

    // Update Partnership
    innings.currentPartnership.totalRuns += totalRunsOnBall;
    innings.currentPartnership.balls += ballResult.isLegalDelivery ? 1 : 0;
    if (striker.name === innings.currentPartnership.batter1Name) {
      innings.currentPartnership.batter1Runs += ballResult.runsScored;
    } else {
      innings.currentPartnership.batter2Runs += ballResult.runsScored;
    }

    // Handle Wickets
    if (ballResult.isWicket && !this.isFreeHitActive) {
      innings.totalWickets += 1;
      striker.isOut = true;
      striker.dismissalType = ballResult.wicketType;
      striker.bowlerWhoDismissed = bowler.shortName;
      striker.fielderWhoAssisted = ballResult.fielderName;

      let dismissalText = `b ${bowler.shortName}`;
      if (ballResult.wicketType === 'CAUGHT') {
        dismissalText = `c ${ballResult.fielderName || 'sub'} b ${bowler.shortName}`;
      } else if (ballResult.wicketType === 'LBW') {
        dismissalText = `lbw b ${bowler.shortName}`;
      } else if (ballResult.wicketType === 'STUMPED') {
        dismissalText = `st †Keeper b ${bowler.shortName}`;
      } else if (ballResult.wicketType === 'RUN_OUT') {
        dismissalText = `run out (${ballResult.fielderName || 'direct'})`;
      }
      striker.dismissalText = dismissalText;

      // Credit Bowler Wicket (except run out)
      if (ballResult.wicketType !== 'RUN_OUT') {
        bowler.wickets += 1;
      }

      // Record Fall of Wicket
      innings.fallOfWickets.push({
        wicketNumber: innings.totalWickets,
        score: innings.totalRuns,
        overs: `${this.overIndex}.${this.legalBallsInOver + (ballResult.isLegalDelivery ? 1 : 0)}`,
        playerName: striker.name,
      });

      // Save Completed Partnership
      innings.partnerships.push({ ...innings.currentPartnership });

      // Bring in Next Batter if available
      if (innings.totalWickets < 10 && this.nextBatterIndex < innings.batters.length) {
        this.currentStrikerIndex = this.nextBatterIndex;
        const newBatter = innings.batters[this.currentStrikerIndex];
        this.nextBatterIndex += 1;

        // Reset partnership for new batter
        innings.currentPartnership = {
          batter1Name: nonStriker.name,
          batter1Runs: 0,
          batter2Name: newBatter.name,
          batter2Runs: 0,
          totalRuns: 0,
          balls: 0,
        };
      } else if (innings.totalWickets >= 10) {
        innings.isAllOut = true;
      }
    }

    // Advance Legal Balls / Overs
    if (ballResult.isLegalDelivery) {
      this.legalBallsInOver += 1;
      bowler.ballsBowledInOver += 1;

      if (bowler.ballsBowledInOver >= 6) {
        bowler.oversBowled += 1;
        bowler.ballsBowledInOver = 0;
      }
    }

    this.isFreeHitActive = ballResult.isNextFreeHit;

    // Calculate Economy
    const totalBowlerBalls = bowler.oversBowled * 6 + bowler.ballsBowledInOver;
    bowler.economyRate = totalBowlerBalls > 0 ? Number(((bowler.runsConceded / totalBowlerBalls) * 6).toFixed(2)) : 0;

    // Strike Rotation on odd runs (1, 3)
    if (ballResult.runsScored === 1 || ballResult.runsScored === 3) {
      const temp = this.currentStrikerIndex;
      this.currentStrikerIndex = this.currentNonStrikerIndex;
      this.currentNonStrikerIndex = temp;
    }

    // Over Completion Check (6 legal deliveries)
    if (this.legalBallsInOver >= 6) {
      this.overIndex += 1;
      this.legalBallsInOver = 0;
      innings.totalOvers = this.overIndex;
      innings.ballsInCurrentOver = 0;

      // Check Maiden Over
      if (bowler.ballsBowledInOver === 0 && bowler.runsConceded === 0) {
        bowler.maidens += 1;
      }

      // Record last completed bowler
      this.lastCompletedBowlerIndex = this.currentBowlerIndex;

      // Strike Changes at End of Over
      const temp = this.currentStrikerIndex;
      this.currentStrikerIndex = this.currentNonStrikerIndex;
      this.currentNonStrikerIndex = temp;

      // Rotate Bowler tactically if match is not over
      if (this.overIndex < this.config.maxOversPerInnings && !innings.isAllOut) {
        const nextRec = this.getRecommendedBowler();
        this.currentBowlerIndex = nextRec.index;

        // Check if user controls bowling team (Dream Team / Manager) to prompt selection
        const isUserBowlingTeam = this.teams[this.bowlingTeamKey]?.isUserTeam;
        const gameMode = this.config.gameMode;
        if (isUserBowlingTeam && (gameMode === 'dream_team' || gameMode === 'manager')) {
          this.isAwaitingBowlerSelection = true;
        }
      }
    } else {
      innings.ballsInCurrentOver = this.legalBallsInOver;
    }

    // Update Current Run Rate
    const totalLegalBalls = this.overIndex * 6 + this.legalBallsInOver;
    innings.currentRunRate = totalLegalBalls > 0 ? Number(((innings.totalRuns / totalLegalBalls) * 6).toFixed(2)) : 0;

    // Formulate Score Pill & Commentary
    let pill = String(ballResult.runsScored);
    if (ballResult.extras.wides > 0) pill = 'Wd';
    else if (ballResult.extras.noBalls > 0) pill = 'Nb';
    else if (ballResult.isWicket) pill = 'W';
    else if (ballResult.isBoundarySix) pill = '6';
    else if (ballResult.isBoundaryFour) pill = '4';

    this.recentBallPills.push(pill);
    if (this.recentBallPills.length > 8) this.recentBallPills.shift();

    const ballEvent: BallByBallEvent = {
      id: `ball_${Date.now()}_${Math.random()}`,
      ballNumberInMatch: this.ballHistory.length + 1,
      inningsNumber: this.currentInningsNumber,
      overIndex: this.overIndex,
      ballInOver: this.legalBallsInOver || 6,
      legalBallNumber: totalLegalBalls,
      bowler: { ...bowler },
      striker: { ...striker },
      nonStriker: { ...nonStriker },
      deliveryChoice: resolvedBowlingChoice,
      battingChoice: resolvedBattingChoice,
      runsScored: ballResult.runsScored,
      extras: ballResult.extras,
      totalRunsOnBall,
      isLegalDelivery: ballResult.isLegalDelivery,
      isBoundaryFour: ballResult.isBoundaryFour,
      isBoundarySix: ballResult.isBoundarySix,
      isFreeHit: this.isFreeHitActive,
      isNextFreeHit: ballResult.isNextFreeHit,
      isWicket: ballResult.isWicket,
      wicketType: ballResult.wicketType,
      dismissedPlayerName: striker.name,
      fielderName: ballResult.fielderName,
      drsEvent: ballResult.simulatedDRS,
      playerInjury: ballResult.injuryEvent,
      scoreAfterBall: {
        runs: innings.totalRuns,
        wickets: innings.totalWickets,
        oversString: `${this.overIndex}.${this.legalBallsInOver}`,
      },
      commentary: generateDeliveryCommentary({
        bowler,
        striker,
        runsScored: ballResult.runsScored,
        extras: ballResult.extras,
        isWicket: ballResult.isWicket,
        wicketType: ballResult.wicketType,
        isBoundaryFour: ballResult.isBoundaryFour,
        isBoundarySix: ballResult.isBoundarySix,
        isFreeHit: this.isFreeHitActive,
        dismissedPlayerName: striker.name,
        fielderName: ballResult.fielderName,
        overIndex: this.overIndex,
        ballInOver: this.legalBallsInOver || 6,
      }),
    };

    this.ballHistory.push(ballEvent);

    // Check for Innings 1 Completion or Match Completion
    this.checkInningsOrMatchTermination();

    return ballEvent;
  }

  // Check if Innings or Match has Concluded
  private checkInningsOrMatchTermination(): void {
    const innings = this.getActiveInnings();
    const maxOvers = this.config.maxOversPerInnings;

    // Innings 1 Completion
    if (this.currentInningsNumber === 1) {
      if (innings.totalWickets >= 10 || this.overIndex >= maxOvers) {
        this.isInningsBreak = true;
      }
    } else {
      // Innings 2 Completion: Target reached, All out, or Overs Completed
      if (innings.target && innings.totalRuns >= innings.target) {
        this.isMatchOver = true;
      } else if (innings.totalWickets >= 10 || this.overIndex >= maxOvers) {
        this.isMatchOver = true;
      }
    }
  }

  // Transition to 2nd Innings
  public startSecondInnings(): void {
    if (!this.isInningsBreak) return;

    this.currentInningsNumber = 2;
    this.isInningsBreak = false;
    this.overIndex = 0;
    this.legalBallsInOver = 0;
    this.recentBallPills = [];
    this.isFreeHitActive = false;

    // Swap Batting & Bowling Teams
    const nextBatTeamKey = this.battingTeamKey === 'teamA' ? 'teamB' : 'teamA';
    const nextBowlTeamKey = this.bowlingTeamKey === 'teamA' ? 'teamB' : 'teamA';

    this.battingTeamKey = nextBatTeamKey;
    this.bowlingTeamKey = nextBowlTeamKey;

    const target = this.innings1.totalRuns + 1;

    this.innings2 = this.createEmptyInnings(
      2,
      this.teams[this.battingTeamKey].name,
      this.teams[this.bowlingTeamKey].name,
      target
    );

    this.currentStrikerIndex = 0;
    this.currentNonStrikerIndex = 1;
    this.nextBatterIndex = 2;
    this.lastCompletedBowlerIndex = -1;

    // Initial Bowler for Innings 2
    const initBowler = this.getRecommendedBowler();
    this.currentBowlerIndex = initBowler.index;

    // Check if user controls bowling team (Dream Team / Manager) for initial over 1 bowler selection
    const isUserBowlingTeam = this.teams[this.bowlingTeamKey]?.isUserTeam;
    const gameMode = this.config.gameMode;
    if (isUserBowlingTeam && (gameMode === 'dream_team' || gameMode === 'manager')) {
      this.isAwaitingBowlerSelection = true;
    }
  }

  // Trigger DLS Rain Event
  public triggerRainInterruption(lostOversCount: number): RainInterruptionState {
    const originalOvers = this.config.maxOversPerInnings;
    const revisedOvers = Math.max(5, originalOvers - lostOversCount);
    const isAbandoned = revisedOvers < 5;

    const targetRes = calculateDLSTarget({
      team1Score: this.innings1.totalRuns,
      originalMaxOvers: originalOvers,
      revisedMaxOvers: revisedOvers,
      interruptedAtOverInnings2: this.overIndex,
      wicketsLostInnings2: this.innings2?.totalWickets || 0,
    });

    this.config.maxOversPerInnings = revisedOvers;
    if (this.innings2) {
      this.innings2.target = targetRes.revisedTarget;
    }

    this.rainState = {
      isInterrupted: true,
      rainIntensity: lostOversCount > 6 ? 'HEAVY' : 'MODERATE',
      originalTotalOvers: originalOvers,
      revisedOvers,
      oversLost: lostOversCount,
      originalTarget: this.innings1.totalRuns + 1,
      dlsRevisedTarget: targetRes.revisedTarget,
      statusMessage: targetRes.explanation,
      isAbandoned,
    };

    if (isAbandoned) {
      this.isMatchOver = true;
    }

    return this.rainState;
  }

  // Fast Simulate remaining deliveries in current innings or entire match
  public autoSimulateToEnd(): CompletedMatchReport {
    while (!this.isMatchOver) {
      if (this.isInningsBreak) {
        this.startSecondInnings();
      }
      this.deliverNextBall();
    }
    return this.generateFinalReport();
  }

  // Generate Final Match Summary Report
  public generateFinalReport(): CompletedMatchReport {
    const t1 = this.innings1;
    const t2 = this.innings2 || this.createEmptyInnings(2, this.teams.teamB.name, this.teams.teamA.name);

    let winnerName = 'Match Drawn / Tie';
    let isTie = false;
    let isNoResult = false;
    let marginText = '';

    if (this.rainState?.isAbandoned) {
      isNoResult = true;
      marginText = 'No Result (Match Abandoned due to Weather)';
    } else if (t2.target && t2.totalRuns >= t2.target) {
      winnerName = t2.battingTeamName;
      const wicketsLeft = 10 - t2.totalWickets;
      marginText = `${winnerName} won by ${wicketsLeft} wicket${wicketsLeft > 1 ? 's' : ''}`;
    } else if (t2.totalRuns < (t2.target ? t2.target - 1 : t1.totalRuns)) {
      winnerName = t1.battingTeamName;
      const runDiff = t1.totalRuns - t2.totalRuns;
      marginText = `${winnerName} won by ${runDiff} run${runDiff > 1 ? 's' : ''}`;
    } else {
      isTie = true;
      marginText = 'Scores Tied (Super Over Eligible)';
    }

    const allPlayers = [...t1.batters, ...t1.bowlers, ...t2.batters, ...t2.bowlers];
    const awards = calculateMatchAwards(allPlayers, winnerName, t1.batters, t2.batters);

    return {
      matchId: this.config.matchId,
      competition: this.config.competitionName,
      venue: this.config.venue,
      format: this.config.format,
      pitch: this.config.pitch,
      weather: this.config.weather,
      date: new Date().toISOString().split('T')[0],
      teams: {
        teamA: this.teams.teamA.name,
        teamB: this.teams.teamB.name,
      },
      toss: {
        winnerName: this.teams[this.tossWinner].name,
        decision: this.tossDecision,
      },
      innings1: this.innings1,
      innings2: this.innings2,
      result: {
        winnerName,
        isTie,
        isNoResult,
        marginText,
        summary: `${marginText}. ${awards.manOfTheMatch.player.name} named Player of the Match!`,
      },
      awards,
      processedAndSaved: false,
    };
  }
}
