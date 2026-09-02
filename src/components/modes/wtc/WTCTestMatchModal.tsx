import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  StandardCountryCode,
  WTCFixture,
  GlobalCricketPlayer,
} from '../../../types';
import { WTC_COUNTRIES } from '../../../services/wtcData';
import {
  getAvailableWTCCountryPlayers,
  generateAIOpponentPlayingXI,
} from '../../../services/wtcEngine';
import {
  Trophy,
  Shield,
  Clock,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Users,
  ChevronRight,
  Activity,
  X,
  Sparkles,
  Zap,
  TrendingUp,
  Volume2,
  Crown,
  Eye,
  Radio,
  Flag,
  HelpCircle,
} from 'lucide-react';

interface WTCTestMatchModalProps {
  fixture: WTCFixture;
  userCountry: StandardCountryCode;
  userPlayingXIIds: string[];
  userBattingOrderIds?: string[];
  captainId?: string;
  wicketkeeperId?: string;
  onMatchComplete: (resultData: any) => void;
  onClose: () => void;
}

export type BattingIntent = 'DEFENSIVE' | 'BALANCED' | 'AGGRESSIVE' | 'BAZBALL';

export interface TestPlayerScore {
  id: string;
  name: string;
  role: string;
  rating: number;
  bowlingStyle: string;
  battingStyle: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissal: string;
  overs: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  spellOvers: number;
  stamina: number; // 0 to 100
}

export interface TestInnings {
  battingTeamCode: StandardCountryCode;
  bowlingTeamCode: StandardCountryCode;
  runs: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
  isDeclared: boolean;
  isAllOut: boolean;
  batters: TestPlayerScore[];
  bowlers: TestPlayerScore[];
  drsReviewsLeft: number;
  newBallTaken: boolean;
}

export const WTCTestMatchModal: React.FC<WTCTestMatchModalProps> = ({
  fixture,
  userCountry,
  userPlayingXIIds,
  userBattingOrderIds,
  captainId,
  wicketkeeperId,
  onMatchComplete,
  onClose,
}) => {
  const isHome = fixture.homeTeam === userCountry;
  const oppCountryCode = isHome ? fixture.awayTeam : fixture.homeTeam;
  const userCountryInfo = WTC_COUNTRIES.find((c) => c.code === userCountry)!;
  const oppCountryInfo = WTC_COUNTRIES.find((c) => c.code === oppCountryCode)!;

  // Real squads from DB
  const rawUserSquad = getAvailableWTCCountryPlayers(userCountry);
  const rawOppSquad = getAvailableWTCCountryPlayers(oppCountryCode);

  // Opponent AI-selected XI
  const oppAITeam = generateAIOpponentPlayingXI(oppCountryCode, fixture.pitch);

  // Separate control configurations
  const userTeamControl = {
    controlMode: 'USER' as const,
    countryCode: userCountry,
    playingXIIds: userPlayingXIIds,
    battingOrderIds: userBattingOrderIds && userBattingOrderIds.length === 11 ? userBattingOrderIds : userPlayingXIIds,
    captainId: captainId || userPlayingXIIds[0],
    wicketkeeperId: wicketkeeperId,
  };

  const opponentTeamControl = {
    controlMode: 'AI' as const,
    countryCode: oppCountryCode,
    playingXIIds: oppAITeam.playingXIIds,
    battingOrderIds: oppAITeam.battingOrderIds,
    captainId: oppAITeam.captainId,
    wicketkeeperId: oppAITeam.wicketkeeperId,
  };

  // Match Flow Stages: TOSS -> TOSS_USER_DECISION -> LIVE -> RESULT
  const [matchStage, setMatchStage] = useState<'TOSS' | 'TOSS_USER_DECISION' | 'LIVE' | 'RESULT'>('TOSS');
  const [tossWinner, setTossWinner] = useState<StandardCountryCode | null>(null);
  const [tossDecision, setTossDecision] = useState<'BAT' | 'BOWL' | null>(null);
  const [tossSummary, setTossSummary] = useState('');
  const [isTossFlipping, setIsTossFlipping] = useState(false);

  // 4 Test Innings
  const [currentInningsNum, setCurrentInningsNum] = useState<1 | 2 | 3 | 4>(1);
  const [innings1, setInnings1] = useState<TestInnings | null>(null);
  const [innings2, setInnings2] = useState<TestInnings | null>(null);
  const [innings3, setInnings3] = useState<TestInnings | null>(null);
  const [innings4, setInnings4] = useState<TestInnings | null>(null);

  // Day & Session Tracking (5 Days, 90 overs per day, 30 overs per session)
  const [day, setDay] = useState(1);
  const [session, setSession] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [totalMatchOvers, setTotalMatchOvers] = useState(0);

  // Tactical Controls (User Team)
  const [userBattingIntent, setUserBattingIntent] = useState<BattingIntent>('BALANCED');
  const [selectedBowlerId, setSelectedBowlerId] = useState<string | null>(null);
  const [previousBowlerId, setPreviousBowlerId] = useState<string | null>(null);
  const [isDeclareConfirmOpen, setIsDeclareConfirmOpen] = useState(false);
  const [isFollowOnModalOpen, setIsFollowOnModalOpen] = useState(false);
  const [isBowlerSelectModalOpen, setIsBowlerSelectModalOpen] = useState(false);

  // DRS Decision System
  const [isDRSPending, setIsDRSPending] = useState(false);
  const [isDRSResultOpen, setIsDRSResultOpen] = useState(false);
  const [drsPendingDetails, setDrsPendingDetails] = useState<{
    type: 'LBW' | 'CAUGHT';
    batterId: string;
    batterName: string;
    bowlerId: string;
    bowlerName: string;
    originalCall: 'OUT' | 'NOT OUT';
    isUserTeamBatting: boolean;
  } | null>(null);
  const [drsVerdict, setDrsVerdict] = useState<{
    finalCall: 'OUT' | 'NOT OUT';
    verdictText: string;
    isOverturned: boolean;
  } | null>(null);

  // Simulation Speeds & Handlers
  const [simSpeed, setSimSpeed] = useState<'PAUSED' | '1X' | '3X' | 'MAX'>('PAUSED');
  const autoPlayRef = useRef<any>(null);

  // Commentary & Ball Reel
  const [recentBalls, setRecentBalls] = useState<string[]>([]);
  const [commentary, setCommentary] = useState<string[]>([]);
  const [activeScorecardTab, setActiveScorecardTab] = useState<'LIVE' | 'INN1' | 'INN2' | 'INN3' | 'INN4'>('LIVE');

  // Match Outcome
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [finalWinner, setFinalWinner] = useState<StandardCountryCode | 'DRAW' | 'TIE' | null>(null);
  const [finalMargin, setFinalMargin] = useState('');
  const [playerOfTheMatch, setPlayerOfTheMatch] = useState<string>('');

  // Build 11-player squad strictly from confirmed IDs and order
  const buildTeamPlayers = (code: StandardCountryCode): TestPlayerScore[] => {
    if (code === userCountry) {
      // Use user's manual batting order
      const orderedIds = userTeamControl.battingOrderIds;
      return orderedIds.map((id) => {
        const p = rawUserSquad.find((item) => item.player_id === id) || rawUserSquad[0];
        return {
          id: p.player_id,
          name: p.name,
          role: p.primary_role,
          rating: p.overall_rating,
          bowlingStyle: p.bowling_style || 'Right-arm medium',
          battingStyle: p.batting_style || 'Right-hand bat',
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isOut: false,
          dismissal: 'not out',
          overs: 0,
          maidens: 0,
          runsConceded: 0,
          wickets: 0,
          spellOvers: 0,
          stamina: 100,
        };
      });
    } else {
      // Opponent team (AI selected)
      const oppIds = opponentTeamControl.battingOrderIds;
      return oppIds.map((id) => {
        const p = rawOppSquad.find((item) => item.player_id === id) || rawOppSquad[0];
        return {
          id: p.player_id,
          name: p.name,
          role: p.primary_role,
          rating: p.overall_rating,
          bowlingStyle: p.bowling_style || 'Right-arm medium',
          battingStyle: p.batting_style || 'Right-hand bat',
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isOut: false,
          dismissal: 'not out',
          overs: 0,
          maidens: 0,
          runsConceded: 0,
          wickets: 0,
          spellOvers: 0,
          stamina: 100,
        };
      });
    }
  };

  // Toss Execution
  const handlePerformToss = () => {
    setIsTossFlipping(true);
    setTimeout(() => {
      setIsTossFlipping(false);
      const userWon = Math.random() > 0.5;
      const winner = userWon ? userCountry : oppCountryCode;
      setTossWinner(winner);

      if (userWon) {
        // User won the toss: Prompt user to choose BAT or BOWL!
        setMatchStage('TOSS_USER_DECISION');
      } else {
        // AI won toss: AI chooses based on pitch
        const isGreen = fixture.pitch.toLowerCase().includes('green') || fixture.pitch.toLowerCase().includes('pace');
        const aiChoice = isGreen ? 'BOWL' : 'BAT';
        setTossDecision(aiChoice);

        const summary = `${oppCountryInfo.name} won the toss and elected to ${aiChoice === 'BAT' ? 'bat first' : 'bowl first'}.`;
        setTossSummary(summary);

        const batTeam = aiChoice === 'BAT' ? oppCountryCode : userCountry;
        const bowlTeam = batTeam === userCountry ? oppCountryCode : userCountry;

        initializeFirstInnings(batTeam, bowlTeam, summary);
      }
    }, 1200);
  };

  // User chooses after winning toss
  const handleUserTossDecision = (choice: 'BAT' | 'BOWL') => {
    setTossDecision(choice);
    const summary = `${userCountryInfo.name} won the toss and elected to ${choice === 'BAT' ? 'bat first' : 'bowl first'}.`;
    setTossSummary(summary);

    const batTeam = choice === 'BAT' ? userCountry : oppCountryCode;
    const bowlTeam = batTeam === userCountry ? oppCountryCode : userCountry;

    initializeFirstInnings(batTeam, bowlTeam, summary);
  };

  // Initialize Innings 1
  const initializeFirstInnings = (batTeam: StandardCountryCode, bowlTeam: StandardCountryCode, summary: string) => {
    const initialInnings: TestInnings = {
      battingTeamCode: batTeam,
      bowlingTeamCode: bowlTeam,
      runs: 0,
      wickets: 0,
      overs: 0,
      ballsInOver: 0,
      isDeclared: false,
      isAllOut: false,
      batters: buildTeamPlayers(batTeam),
      bowlers: buildTeamPlayers(bowlTeam),
      drsReviewsLeft: 3,
      newBallTaken: false,
    };

    setInnings1(initialInnings);
    setMatchStage('LIVE');
    setCommentary([`${summary} Welcome to Day 1 of this ICC World Test Championship clash at ${fixture.venue}!`]);
  };

  const getActiveInnings = (): TestInnings | null => {
    if (currentInningsNum === 1) return innings1;
    if (currentInningsNum === 2) return innings2;
    if (currentInningsNum === 3) return innings3;
    return innings4;
  };

  // Step 1 Single Ball in the Test Match Engine
  const handleStepBall = (forcedShotType?: 'DEFEND' | 'STRIKE' | 'FOUR' | 'SIX') => {
    if (isMatchOver || isDRSPending) return;
    const active = getActiveInnings();
    if (!active || active.isAllOut || active.isDeclared) return;

    const notOutBatters = active.batters.filter((b) => !b.isOut);
    if (notOutBatters.length < 2 && active.wickets < 10) {
      active.isAllOut = true;
      advanceToNextInnings();
      return;
    }

    const striker = notOutBatters[0];
    const nonStriker = notOutBatters[1];

    // Bowler Determination
    let bowler: TestPlayerScore | undefined;
    const isUserBowling = active.bowlingTeamCode === userCountry;

    if (isUserBowling) {
      // User manual bowling selection
      if (selectedBowlerId) {
        bowler = active.bowlers.find((b) => b.id === selectedBowlerId);
      }
      if (!bowler) {
        // Pick primary bowler
        const eligibleBowlers = active.bowlers.filter((b) => b.id !== previousBowlerId && (b.role === 'Bowler' || b.role === 'All-Rounder'));
        bowler = eligibleBowlers[0] || active.bowlers[Math.min(9, active.bowlers.length - 1)];
        setSelectedBowlerId(bowler.id);
      }
    } else {
      // AI bowler rotation
      const eligible = active.bowlers.filter((b) => b.id !== previousBowlerId && (b.role === 'Bowler' || b.role === 'All-Rounder'));
      bowler = eligible.length > 0 ? eligible[Math.floor(Math.random() * eligible.length)] : active.bowlers[8];
    }

    if (!bowler) bowler = active.bowlers[0];

    // Pitch & Ball Condition modifiers
    const isDay4or5 = day >= 4;
    const isSpinPitch = fixture.pitch.toLowerCase().includes('spin') || fixture.pitch.toLowerCase().includes('dry');
    const isPacePitch = fixture.pitch.toLowerCase().includes('green') || fixture.pitch.toLowerCase().includes('pace');

    let wicketProbability = 0.035;
    let runMultiplier = 1.0;

    // Batting Intent Modifiers
    const isUserBatting = active.battingTeamCode === userCountry;
    if (isUserBatting) {
      if (forcedShotType === 'DEFEND') {
        wicketProbability *= 0.4;
        runMultiplier = 0.1;
      } else if (forcedShotType === 'STRIKE') {
        wicketProbability *= 0.8;
        runMultiplier = 0.9;
      } else if (forcedShotType === 'FOUR') {
        wicketProbability *= 1.6;
        runMultiplier = 1.6;
      } else if (forcedShotType === 'SIX') {
        wicketProbability *= 2.2;
        runMultiplier = 2.0;
      } else {
        if (userBattingIntent === 'DEFENSIVE') {
          wicketProbability *= 0.6;
          runMultiplier = 0.5;
        } else if (userBattingIntent === 'AGGRESSIVE') {
          wicketProbability *= 1.4;
          runMultiplier = 1.35;
        } else if (userBattingIntent === 'BAZBALL') {
          wicketProbability *= 1.85;
          runMultiplier = 1.8;
        }
      }
    }

    if (isDay4or5 && isSpinPitch && bowler.bowlingStyle.toLowerCase().includes('spin')) {
      wicketProbability += 0.02;
    }
    if (active.newBallTaken && (bowler.bowlingStyle.toLowerCase().includes('fast') || bowler.bowlingStyle.toLowerCase().includes('medium'))) {
      wicketProbability += 0.015;
    }

    // Roll ball outcome
    const roll = Math.random();
    let isWicket = roll < wicketProbability;
    let runs = 0;

    if (!isWicket) {
      const runRoll = Math.random() * runMultiplier;
      if (runRoll > 0.94) runs = 6;
      else if (runRoll > 0.80) runs = 4;
      else if (runRoll > 0.65) runs = 1;
      else if (runRoll > 0.55) runs = 2;
      else if (runRoll > 0.52) runs = 3;
      else runs = 0;
    }

    // DRS Trigger check
    const isDRSIncident = (isWicket && Math.random() < 0.15) || (!isWicket && Math.random() < 0.04);
    if (isDRSIncident && active.drsReviewsLeft > 0 && simSpeed === 'PAUSED') {
      const callType: 'LBW' | 'CAUGHT' = Math.random() > 0.5 ? 'LBW' : 'CAUGHT';
      const onFieldCall = isWicket ? 'OUT' : 'NOT OUT';

      if (isUserBatting || isUserBowling) {
        // Prompt the user to Review!
        setDrsPendingDetails({
          type: callType,
          batterId: striker.id,
          batterName: striker.name,
          bowlerId: bowler.id,
          bowlerName: bowler.name,
          originalCall: onFieldCall,
          isUserTeamBatting: isUserBatting,
        });
        setIsDRSPending(true);
        return; // Halt and wait for user's DRS decision!
      }
    }

    // Execute Ball
    executeBallOutcome(active, striker, nonStriker, bowler, isWicket, runs);
  };

  // Execute Ball outcome on scores and statistics
  const executeBallOutcome = (
    active: TestInnings,
    striker: TestPlayerScore,
    nonStriker: TestPlayerScore,
    bowler: TestPlayerScore,
    isWicket: boolean,
    runs: number
  ) => {
    let pill = String(runs);
    if (isWicket) {
      pill = 'W';
      active.wickets += 1;
      striker.isOut = true;
      const dismissalText =
        Math.random() > 0.6
          ? `c Fielder b ${bowler.name}`
          : Math.random() > 0.4
          ? `lbw b ${bowler.name}`
          : `b ${bowler.name}`;
      striker.dismissal = dismissalText;
      striker.balls += 1;
      bowler.wickets += 1;
    } else {
      striker.runs += runs;
      striker.balls += 1;
      if (runs === 4) striker.fours += 1;
      if (runs === 6) striker.sixes += 1;
      bowler.runsConceded += runs;
      active.runs += runs;
    }

    // Advance over balls
    active.ballsInOver += 1;
    if (active.ballsInOver >= 6) {
      active.overs += 1;
      active.ballsInOver = 0;
      bowler.overs += 1;
      bowler.spellOvers += 1;
      bowler.stamina = Math.max(10, bowler.stamina - 4);
      setPreviousBowlerId(bowler.id);
    }

    setRecentBalls((prev) => [pill, ...prev.slice(0, 7)]);

    // Commentary
    const commText = `${active.overs}.${active.ballsInOver} - ${bowler.name} to ${striker.name}: ${
      isWicket
        ? `WICKET! ${striker.name} departs (${striker.dismissal})!`
        : runs === 4
        ? 'FOUR! Beautifully timed drive through the gap!'
        : runs === 6
        ? 'SIX! Dispatched over deep midwicket into the stands!'
        : runs === 0
        ? 'No run, defended solidly with the full face of the bat.'
        : `${runs} run(s) taken.`
    }`;

    setCommentary((prev) => [commText, ...prev.slice(0, 40)]);

    // Time & Day Progression
    const newTotalOvers = totalMatchOvers + 1 / 6;
    setTotalMatchOvers(newTotalOvers);
    const dayCalc = Math.min(5, Math.floor(newTotalOvers / 90) + 1);
    setDay(dayCalc);

    const overInDay = Math.floor(newTotalOvers % 90);
    if (overInDay < 30) setSession('Morning');
    else if (overInDay < 60) setSession('Afternoon');
    else setSession('Evening');

    // Check 4th Innings Chase / Target
    if (currentInningsNum === 4 && innings1 && innings2 && innings3) {
      const target = innings1.runs + innings3.runs - innings2.runs + 1;
      if (active.runs >= target) {
        concludeMatch(
          active.battingTeamCode,
          `${active.battingTeamCode === userCountry ? userCountryInfo.name : oppCountryInfo.name} won by ${10 - active.wickets} wickets`
        );
        return;
      }
    }

    // Check All Out
    if (active.wickets >= 10 || active.overs >= 170) {
      active.isAllOut = true;
      advanceToNextInnings();
    }

    // Check Day 5 Stumps Draw
    if (newTotalOvers >= 450 && !isMatchOver) {
      concludeMatch('DRAW', 'Match Drawn on Day 5 (Stumps called)');
    }
  };

  // User DRS Choice: REVIEW or DON'T REVIEW
  const handleUserDRSDecision = (takeReview: boolean) => {
    if (!drsPendingDetails) return;
    const active = getActiveInnings();
    if (!active) return;

    const notOutBatters = active.batters.filter((b) => !b.isOut);
    const striker = notOutBatters[0] || active.batters[0];
    const nonStriker = notOutBatters[1] || active.batters[1];
    const bowler = active.bowlers.find((b) => b.id === drsPendingDetails.bowlerId) || active.bowlers[0];

    setIsDRSPending(false);

    if (!takeReview) {
      // Accepted on-field call
      const isWicket = drsPendingDetails.originalCall === 'OUT';
      executeBallOutcome(active, striker, nonStriker, bowler, isWicket, 0);
      setDrsPendingDetails(null);
      return;
    }

    // User took review!
    const isOverturned = Math.random() < 0.35;
    const finalDecision = isOverturned
      ? drsPendingDetails.originalCall === 'OUT' ? 'NOT OUT' : 'OUT'
      : drsPendingDetails.originalCall;

    if (!isOverturned) {
      active.drsReviewsLeft = Math.max(0, active.drsReviewsLeft - 1);
    }

    const verdictText = isOverturned
      ? `DRS Review Successful! Decision OVERTURNED to ${finalDecision}. (${drsPendingDetails.type === 'LBW' ? 'Ball missing leg stump' : 'No spike on UltraEdge'})`
      : `DRS Review Unsuccessful! Decision UPHELD as ${finalDecision}. (3 Reds on Ball Tracking)`;

    setDrsVerdict({
      finalCall: finalDecision,
      verdictText,
      isOverturned,
    });
    setIsDRSResultOpen(true);

    const isWicketFinal = finalDecision === 'OUT';
    executeBallOutcome(active, striker, nonStriker, bowler, isWicketFinal, 0);
  };

  // Advance Innings (Test Match 4 Innings progression + Follow-On Check)
  const advanceToNextInnings = () => {
    if (currentInningsNum === 1 && innings1) {
      setCurrentInningsNum(2);
      const nextInnings: TestInnings = {
        battingTeamCode: innings1.bowlingTeamCode,
        bowlingTeamCode: innings1.battingTeamCode,
        runs: 0,
        wickets: 0,
        overs: 0,
        ballsInOver: 0,
        isDeclared: false,
        isAllOut: false,
        batters: buildTeamPlayers(innings1.bowlingTeamCode),
        bowlers: buildTeamPlayers(innings1.battingTeamCode),
        drsReviewsLeft: 3,
        newBallTaken: false,
      };
      setInnings2(nextInnings);
      setCommentary((prev) => [
        `End of 1st Innings: ${innings1.battingTeamCode === userCountry ? userCountryInfo.name : oppCountryInfo.name} scored ${innings1.runs}/${innings1.wickets}. 2nd Innings begins!`,
        ...prev,
      ]);
    } else if (currentInningsNum === 2 && innings1 && innings2) {
      const lead = innings1.runs - innings2.runs;

      // Follow-On Rule (200+ runs deficit in Test Cricket)
      if (lead >= 200) {
        if (innings1.battingTeamCode === userCountry) {
          // User team holds 200+ run lead -> Prompt user to enforce follow-on!
          setIsFollowOnModalOpen(true);
          return;
        } else {
          // AI holds 200+ run lead -> AI decides
          const aiEnforces = Math.random() > 0.4;
          if (aiEnforces) {
            startInnings3(innings2.battingTeamCode, innings2.bowlingTeamCode, true);
            return;
          }
        }
      }

      startInnings3(innings1.battingTeamCode, innings1.bowlingTeamCode, false);
    } else if (currentInningsNum === 3 && innings1 && innings2 && innings3) {
      setCurrentInningsNum(4);
      const nextInnings: TestInnings = {
        battingTeamCode: innings3.bowlingTeamCode,
        bowlingTeamCode: innings3.battingTeamCode,
        runs: 0,
        wickets: 0,
        overs: 0,
        ballsInOver: 0,
        isDeclared: false,
        isAllOut: false,
        batters: buildTeamPlayers(innings3.bowlingTeamCode),
        bowlers: buildTeamPlayers(innings3.battingTeamCode),
        drsReviewsLeft: 3,
        newBallTaken: false,
      };
      setInnings4(nextInnings);
      const target = innings1.runs + innings3.runs - innings2.runs + 1;
      setCommentary((prev) => [
        `3rd Innings concluded. Target for final chase: ${Math.max(1, target)} runs! 4th Innings underway!`,
        ...prev,
      ]);
    } else if (currentInningsNum === 4 && innings1 && innings2 && innings3 && innings4) {
      // 4th innings finished
      const target = innings1.runs + innings3.runs - innings2.runs + 1;
      if (innings4.runs >= target) {
        concludeMatch(
          innings4.battingTeamCode,
          `${innings4.battingTeamCode === userCountry ? userCountryInfo.name : oppCountryInfo.name} won by ${10 - innings4.wickets} wickets`
        );
      } else {
        const margin = target - 1 - innings4.runs;
        concludeMatch(
          innings4.bowlingTeamCode,
          `${innings4.bowlingTeamCode === userCountry ? userCountryInfo.name : oppCountryInfo.name} won by ${margin} runs`
        );
      }
    }
  };

  // Start 3rd Innings (with or without follow-on)
  const startInnings3 = (batTeam: StandardCountryCode, bowlTeam: StandardCountryCode, isFollowOn: boolean) => {
    setIsFollowOnModalOpen(false);
    setCurrentInningsNum(3);
    const nextInnings: TestInnings = {
      battingTeamCode: batTeam,
      bowlingTeamCode: bowlTeam,
      runs: 0,
      wickets: 0,
      overs: 0,
      ballsInOver: 0,
      isDeclared: false,
      isAllOut: false,
      batters: buildTeamPlayers(batTeam),
      bowlers: buildTeamPlayers(bowlTeam),
      drsReviewsLeft: 3,
      newBallTaken: false,
    };
    setInnings3(nextInnings);
    setCommentary((prev) => [
      isFollowOn
        ? `FOLLOW-ON ENFORCED! ${batTeam === userCountry ? userCountryInfo.name : oppCountryInfo.name} is asked to bat again in the 3rd Innings!`
        : `2nd Innings concluded. 3rd Innings begins!`,
      ...prev,
    ]);
  };

  // User Inning Declaration
  const handleDeclareInnings = () => {
    const active = getActiveInnings();
    if (!active || active.battingTeamCode !== userCountry) return;
    active.isDeclared = true;
    setIsDeclareConfirmOpen(false);
    setCommentary((prev) => [
      `DECLARATION! ${userCountryInfo.name} has declared their innings at ${active.runs}/${active.wickets} (${active.overs} overs)!`,
      ...prev,
    ]);
    advanceToNextInnings();
  };

  // Conclude Test Match
  const concludeMatch = (winnerCode: StandardCountryCode | 'DRAW' | 'TIE', margin: string) => {
    setIsMatchOver(true);
    setSimSpeed('PAUSED');
    setFinalWinner(winnerCode);
    setFinalMargin(margin);

    const allBatters = [
      ...(innings1?.batters || []),
      ...(innings2?.batters || []),
      ...(innings3?.batters || []),
      ...(innings4?.batters || []),
    ];
    allBatters.sort((a, b) => b.runs - a.runs);
    const topScorer = allBatters[0]?.name || 'Player of the Match';
    setPlayerOfTheMatch(topScorer);

    setMatchStage('RESULT');
  };

  // Auto-play interval for simulation speeds
  useEffect(() => {
    if (simSpeed === 'PAUSED' || isMatchOver || isDRSPending) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    const intervalMs = simSpeed === '1X' ? 650 : simSpeed === '3X' ? 180 : 25;
    autoPlayRef.current = setInterval(() => {
      handleStepBall();
    }, intervalMs);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [simSpeed, isMatchOver, isDRSPending, currentInningsNum, innings1, innings2, innings3, innings4, selectedBowlerId, userBattingIntent]);

  // Active Innings details
  const activeInnings = getActiveInnings();
  const currentBatters = activeInnings?.batters.filter((b) => !b.isOut) || [];
  const striker = currentBatters[0];
  const nonStriker = currentBatters[1];
  const activeBowler = activeInnings?.bowlers.find((b) => b.id === selectedBowlerId) || activeInnings?.bowlers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-3xl border border-white/15 bg-[#070b14]/98 p-5 sm:p-7 text-slate-100 backdrop-blur-2xl shadow-2xl space-y-5 my-auto max-h-[95vh] flex flex-col justify-between overflow-y-auto">
        
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {fixture.seriesName} • Match {fixture.matchNumber} of {fixture.totalMatchesInSeries}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-bold">
                  {fixture.venue}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>{userCountryInfo.flag} {userCountryInfo.name}</span>
                <span className="text-slate-500 text-xs font-normal">vs</span>
                <span>{oppCountryInfo.flag} {oppCountryInfo.name}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Playing XI Confirmed (11/11)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STAGE 1: TOSS PRESENTATION */}
        {matchStage === 'TOSS' && (
          <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-300 shadow-2xl flex items-center justify-center text-slate-950 font-black text-2xl mx-auto animate-bounce">
              🪙
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Official Match Coin Toss
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                Captains at the Crease
              </h3>
              <p className="text-xs text-slate-400">
                Pitch Condition: <span className="text-white font-bold">{fixture.pitch}</span>.
                Spinners and pacers ready to take the field.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePerformToss}
              disabled={isTossFlipping}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isTossFlipping ? 'Spinning Coin...' : 'Spin the Coin (Toss)'}</span>
            </button>
          </div>
        )}

        {/* STAGE 2: USER TOSS DECISION MODAL */}
        {matchStage === 'TOSS_USER_DECISION' && (
          <div className="py-10 px-4 max-w-xl mx-auto text-center space-y-6 bg-amber-950/20 border border-amber-500/40 rounded-3xl p-6 shadow-2xl">
            <div className="h-16 w-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-black text-xl mx-auto">
              👑
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-wider">
                🎉 YOU WON THE TOSS!
              </span>
              <h3 className="text-2xl font-black text-white uppercase">
                What is your match decision?
              </h3>
              <p className="text-xs text-slate-300">
                Venue: <span className="font-bold text-white">{fixture.venue}</span> • Pitch: <span className="font-bold text-amber-300">{fixture.pitch}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleUserTossDecision('BAT')}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 border border-emerald-400 text-white font-black text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer flex flex-col items-center gap-2"
              >
                <span className="text-2xl">🏏</span>
                <span>BAT FIRST</span>
                <span className="text-[10px] font-normal text-emerald-200">Set a formidable 1st innings total</span>
              </button>

              <button
                type="button"
                onClick={() => handleUserTossDecision('BOWL')}
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border border-blue-400 text-white font-black text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer flex flex-col items-center gap-2"
              >
                <span className="text-2xl">⚾</span>
                <span>BOWL FIRST</span>
                <span className="text-[10px] font-normal text-blue-200">Exploit fresh pitch conditions & seam</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: LIVE TEST MATCH ENGINE */}
        {matchStage === 'LIVE' && activeInnings && (
          <div className="space-y-4 flex-1 overflow-y-auto">
            
            {/* SCOREBOARD HERO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 bg-gradient-to-r from-[#0b1426] via-slate-900 to-[#0b1426] p-4 rounded-3xl border border-white/10">
              {/* Main Score (6 Cols) */}
              <div className="lg:col-span-6 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    {activeInnings.battingTeamCode === userCountry ? `${userCountryInfo.flag} ${userCountryInfo.name}` : `${oppCountryInfo.flag} ${oppCountryInfo.name}`} (Innings {currentInningsNum})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-mono">
                    Day {day} • {session} Session
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {activeInnings.runs}/{activeInnings.wickets}
                  </span>
                  <span className="text-sm font-mono text-slate-400">
                    ({activeInnings.overs}.{activeInnings.ballsInOver} ov)
                  </span>
                  <span className="text-xs font-mono text-amber-300">
                    CRR: {activeInnings.overs > 0 ? (activeInnings.runs / (activeInnings.overs + activeInnings.ballsInOver / 6)).toFixed(2) : '0.00'}
                  </span>
                </div>

                {/* Lead / Target Calculation */}
                {currentInningsNum === 2 && innings1 && (
                  <div className="text-xs text-slate-300 font-semibold">
                    {activeInnings.runs >= innings1.runs
                      ? `Lead: ${activeInnings.runs - innings1.runs} runs`
                      : `Trail: ${innings1.runs - activeInnings.runs} runs`}
                  </div>
                )}
                {currentInningsNum === 3 && innings1 && innings2 && (
                  <div className="text-xs text-slate-300 font-semibold">
                    Lead: {innings1.runs + activeInnings.runs - innings2.runs} runs
                  </div>
                )}
                {currentInningsNum === 4 && innings1 && innings2 && innings3 && (
                  <div className="text-xs text-amber-400 font-bold">
                    Target: {innings1.runs + innings3.runs - innings2.runs + 1} runs (Need {Math.max(0, innings1.runs + innings3.runs - innings2.runs + 1 - activeInnings.runs)} runs to win)
                  </div>
                )}
              </div>

              {/* Batters at Crease (6 Cols) */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-2xl border border-white/5 text-xs">
                {striker && (
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">
                      ★ Striker (Opener 1 / Current)
                    </span>
                    <div className="font-bold text-white truncate">{striker.name}</div>
                    <div className="font-mono text-amber-300">
                      {striker.runs}* ({striker.balls}b) • {striker.fours}x4 {striker.sixes}x6
                    </div>
                  </div>
                )}
                {nonStriker && (
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Non-Striker (Opener 2 / Partner)
                    </span>
                    <div className="font-bold text-white truncate">{nonStriker.name}</div>
                    <div className="font-mono text-slate-300">
                      {nonStriker.runs}* ({nonStriker.balls}b) • {nonStriker.fours}x4
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BALL REEL & RECENT DELIVERIES */}
            <div className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">This Over:</span>
                {recentBalls.length === 0 ? (
                  <span className="text-slate-500 text-[11px]">Ready for first ball...</span>
                ) : (
                  recentBalls.map((b, i) => (
                    <span
                      key={i}
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                        b === 'W'
                          ? 'bg-rose-500 text-white shadow-md'
                          : b === '4'
                          ? 'bg-blue-500 text-white'
                          : b === '6'
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-slate-200'
                      }`}
                    >
                      {b}
                    </span>
                  ))
                )}
              </div>

              {/* DRS Reviews status */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400">DRS:</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
                  {activeInnings.drsReviewsLeft} Reviews Left
                </span>
              </div>
            </div>

            {/* TACTICAL USER CONTROLS PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* User Team Tactical Actions (7 Cols) */}
              <div className="lg:col-span-7 bg-[#0b1426]/80 p-4 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      {activeInnings.battingTeamCode === userCountry ? 'User Batting Tactical Intent' : 'User Bowling Selection & Field'}
                    </span>
                  </div>

                  {activeInnings.battingTeamCode === userCountry && (
                    <button
                      type="button"
                      onClick={() => setIsDeclareConfirmOpen(true)}
                      className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Flag className="w-3 h-3" /> Declare Innings
                    </button>
                  )}
                </div>

                {/* When User is Batting: Intent options */}
                {activeInnings.battingTeamCode === userCountry ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['DEFENSIVE', 'BALANCED', 'AGGRESSIVE', 'BAZBALL'] as BattingIntent[]).map((intent) => (
                        <button
                          key={intent}
                          type="button"
                          onClick={() => setUserBattingIntent(intent)}
                          className={`p-2.5 rounded-2xl border text-xs font-bold uppercase transition-all cursor-pointer text-center ${
                            userBattingIntent === intent
                              ? 'bg-amber-400 text-black border-amber-300 shadow-md font-black'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-[10px]">{intent === 'DEFENSIVE' ? '🛡️ Leave & Block' : intent === 'BALANCED' ? '⚖️ Standard Test' : intent === 'AGGRESSIVE' ? '⚡ Boundary Hunt' : '🔥 Max Bazball'}</div>
                          <div className="text-[11px]">{intent}</div>
                        </button>
                      ))}
                    </div>

                    {/* Interactive Shot Controls */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleStepBall('DEFEND')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/10 transition-colors cursor-pointer"
                      >
                        🛡️ Defend / Leave
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepBall('STRIKE')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/10 transition-colors cursor-pointer"
                      >
                        🏃 Push for 1-2
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepBall('FOUR')}
                        className="px-3 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 text-xs font-bold text-blue-200 border border-blue-500/30 transition-colors cursor-pointer"
                      >
                        ⚡ Drive for 4
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepBall('SIX')}
                        className="px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-xs font-bold text-purple-200 border border-purple-500/30 transition-colors cursor-pointer"
                      >
                        💥 Loft for 6
                      </button>
                    </div>
                  </div>
                ) : (
                  /* When User is Bowling: Manual Bowler Selection */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-300">
                        Active Bowler: <span className="font-bold text-white">{activeBowler?.name}</span> ({activeBowler?.bowlingStyle})
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsBowlerSelectModalOpen(true)}
                        className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        🔄 Select / Change Bowler
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Overs</span>
                        <span className="font-bold text-white">{activeBowler?.overs}.{activeInnings.ballsInOver}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Maidens</span>
                        <span className="font-bold text-white">{activeBowler?.maidens}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Runs</span>
                        <span className="font-bold text-white">{activeBowler?.runsConceded}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Wickets</span>
                        <span className="font-bold text-emerald-400">{activeBowler?.wickets}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulation Speeds & Controls (5 Cols) */}
              <div className="lg:col-span-5 bg-white/5 p-4 rounded-3xl border border-white/10 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-black uppercase text-white tracking-wider">
                    Match Controls & Speeds
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Test Mode (No 4-Over Limit)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {(['PAUSED', '1X', '3X', 'MAX'] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setSimSpeed(spd)}
                      className={`p-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer text-center ${
                        simSpeed === spd
                          ? 'bg-amber-400 text-black shadow-md font-black'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {spd === 'PAUSED' ? '⏸️ PAUSE' : spd === '1X' ? '▶️ 1X' : spd === '3X' ? '⏩ 3X' : '⚡ MAX'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStepBall()}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-white uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Step 1 Ball
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      for (let i = 0; i < 6; i++) handleStepBall();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Sim Over (6b)
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE COMMENTARY FEED */}
            <div className="bg-black/40 rounded-2xl border border-white/10 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400" /> Ball-by-Ball Live Commentary
                </span>
                <span className="text-[10px] text-slate-500">Day {day} • Pitch: {fixture.pitch}</span>
              </div>

              <div className="space-y-1.5 max-h-[120px] overflow-y-auto text-xs pr-1 font-mono">
                {commentary.map((c, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded-lg ${
                      idx === 0 ? 'bg-white/10 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STAGE 4: MATCH RESULT & PRESENTATION */}
        {matchStage === 'RESULT' && (
          <div className="py-10 px-4 max-w-2xl mx-auto text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold mx-auto">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                Test Match Concluded • WTC 2025–27
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                {finalMargin}
              </h3>
              <p className="text-xs text-slate-300">
                Player of the Match: <span className="font-bold text-amber-300">{playerOfTheMatch}</span>
              </p>
            </div>

            {/* Innings Summary Recap */}
            <div className="grid grid-cols-2 gap-3 text-xs text-left bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">{userCountryInfo.name}</span>
                <div>1st Inn: {innings1?.battingTeamCode === userCountry ? `${innings1?.runs}/${innings1?.wickets}` : `${innings2?.runs}/${innings2?.wickets}`}</div>
                <div>2nd Inn: {innings3?.battingTeamCode === userCountry ? `${innings3?.runs}/${innings3?.wickets}` : innings4?.battingTeamCode === userCountry ? `${innings4?.runs}/${innings4?.wickets}` : 'DNB'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">{oppCountryInfo.name}</span>
                <div>1st Inn: {innings1?.battingTeamCode === oppCountryCode ? `${innings1?.runs}/${innings1?.wickets}` : `${innings2?.runs}/${innings2?.wickets}`}</div>
                <div>2nd Inn: {innings3?.battingTeamCode === oppCountryCode ? `${innings3?.runs}/${innings3?.wickets}` : innings4?.battingTeamCode === oppCountryCode ? `${innings4?.runs}/${innings4?.wickets}` : 'DNB'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onMatchComplete({
                  winnerCode: finalWinner,
                  margin: finalMargin,
                  manOfTheMatch: playerOfTheMatch,
                  user1stInnings: innings1?.battingTeamCode === userCountry ? innings1.runs : innings2?.runs || 0,
                  user2ndInnings: innings3?.battingTeamCode === userCountry ? innings3.runs : innings4?.runs || 0,
                  opp1stInnings: innings1?.battingTeamCode === oppCountryCode ? innings1.runs : innings2?.runs || 0,
                  opp2ndInnings: innings3?.battingTeamCode === oppCountryCode ? innings3.runs : innings4?.runs || 0,
                });
              }}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer"
            >
              Update WTC Table & Return to Hub
            </button>
          </div>
        )}

        {/* DRS REVIEW MODAL PROMPT */}
        {isDRSPending && drsPendingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="max-w-md w-full rounded-3xl bg-[#0a1120] border border-blue-500/50 p-6 space-y-4 text-center shadow-2xl">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-400 mx-auto">
                <Radio className="w-7 h-7 animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                  Decision Review System (DRS)
                </span>
                <h4 className="text-lg font-black text-white uppercase">
                  {drsPendingDetails.type} Appeal!
                </h4>
                <p className="text-xs text-slate-300">
                  On-field Call: <span className="font-bold text-amber-300">{drsPendingDetails.originalCall}</span>
                  <br />
                  Batter: <span className="text-white font-semibold">{drsPendingDetails.batterName}</span> • Bowler: <span className="text-white font-semibold">{drsPendingDetails.bowlerName}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleUserDRSDecision(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  Request DRS Review
                </button>
                <button
                  type="button"
                  onClick={() => handleUserDRSDecision(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase transition-all cursor-pointer"
                >
                  Accept On-Field Call
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DRS VERDICT POPUP */}
        {isDRSResultOpen && drsVerdict && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="max-w-md w-full rounded-3xl bg-[#0a1120] border border-emerald-500/50 p-6 space-y-4 text-center shadow-2xl">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mx-auto ${
                drsVerdict.finalCall === 'OUT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                  Third Umpire Verdict
                </span>
                <h4 className="text-xl font-black text-white">
                  DECISION: {drsVerdict.finalCall}
                </h4>
                <p className="text-xs text-slate-300">{drsVerdict.verdictText}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDRSResultOpen(false);
                  setDrsVerdict(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase cursor-pointer"
              >
                Resume Match
              </button>
            </div>
          </div>
        )}

        {/* USER BOWLER SELECTION MODAL */}
        {isBowlerSelectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="max-w-lg w-full rounded-3xl bg-[#0a1120] border border-white/20 p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <span>Select Bowler for Next Over</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsBowlerSelectModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {activeInnings?.bowlers.map((b) => {
                  const isPrevious = b.id === previousBowlerId;
                  const isSelected = b.id === selectedBowlerId;

                  return (
                    <div
                      key={b.id}
                      onClick={() => {
                        if (!isPrevious) {
                          setSelectedBowlerId(b.id);
                          setIsBowlerSelectModalOpen(false);
                        }
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                          : isPrevious
                          ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed text-slate-500'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{b.name}</span>
                          {isPrevious && <span className="text-[9px] text-rose-400">(Bowled Last Over)</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">{b.role} • {b.bowlingStyle}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-white font-bold">{b.wickets}/{b.runsConceded} ({b.overs} ov)</div>
                        <div className="text-[10px] text-emerald-400">Stamina: {b.stamina}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FOLLOW-ON ENFORCEMENT MODAL */}
        {isFollowOnModalOpen && innings1 && innings2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="max-w-md w-full rounded-3xl bg-[#0a1120] border border-amber-500/50 p-6 space-y-4 text-center shadow-2xl">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mx-auto text-2xl font-black">
                ⚡
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Follow-On Eligible
                </span>
                <h4 className="text-xl font-black text-white uppercase">
                  Enforce Follow-On?
                </h4>
                <p className="text-xs text-slate-300">
                  Your team holds a 1st innings lead of <span className="text-amber-300 font-bold">{innings1.runs - innings2.runs} runs</span> over {oppCountryInfo.name}.
                  Would you like to send them in to bat again in the 3rd Innings?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startInnings3(innings2.battingTeamCode, innings2.bowlingTeamCode, true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  Yes, Enforce Follow-On
                </button>
                <button
                  type="button"
                  onClick={() => startInnings3(innings1.battingTeamCode, innings1.bowlingTeamCode, false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase transition-all cursor-pointer"
                >
                  No, Bat 2nd Innings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DECLARATION CONFIRMATION MODAL */}
        {isDeclareConfirmOpen && activeInnings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="max-w-md w-full rounded-3xl bg-[#0a1120] border border-rose-500/50 p-6 space-y-4 text-center shadow-2xl">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 mx-auto text-2xl font-black">
                🚩
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-rose-400 tracking-wider">
                  Tactical Innings Declaration
                </span>
                <h4 className="text-xl font-black text-white uppercase">
                  Declare at {activeInnings.runs}/{activeInnings.wickets}?
                </h4>
                <p className="text-xs text-slate-300">
                  This will immediately conclude your current innings at ({activeInnings.overs}.{activeInnings.ballsInOver} overs) and invite {oppCountryInfo.name} to bat.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDeclareInnings}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  Confirm Declaration
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeclareConfirmOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase transition-all cursor-pointer"
                >
                  Continue Batting
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
