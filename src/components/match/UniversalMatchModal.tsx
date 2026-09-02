import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MatchContextConfig,
  MatchTeamsSetup,
  MatchPlayerPerformance,
  BallByBallEvent,
  CompletedMatchReport,
  DRSReviewState,
  RainInterruptionState,
  BattingDecisionType,
  BowlingDeliveryChoice,
  FieldingEventAction,
} from '../../services/matchEngine/types';
import { CricketMatchSimulator } from '../../services/matchEngine/simulationEngine';
import { LiveScoreboard } from './LiveScoreboard';
import { MatchPreviewPanel } from './MatchPreviewPanel';
import { SquadSelectionPanel } from './SquadSelectionPanel';
import { TossAnimationPanel } from './TossAnimationPanel';
import { BattingDecisionPanel } from './BattingDecisionPanel';
import { BowlingDecisionPanel } from './BowlingDecisionPanel';
import { BowlerSelectionModal } from './BowlerSelectionModal';
import { DRSReviewModal } from './DRSReviewModal';
import { FieldingDecisionModal } from './FieldingDecisionModal';
import { MatchScorecardModal } from './MatchScorecardModal';
import { PostMatchResultModal } from './PostMatchResultModal';
import {
  Shield,
  Zap,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Trophy,
  X,
  Award,
  CloudRain,
  Eye,
  Activity,
  Flame,
  User,
  Users,
  Briefcase,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export interface UniversalMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MatchContextConfig;
  teams: MatchTeamsSetup;
  onMatchCompleted: (report: CompletedMatchReport) => void;
}

export const UniversalMatchModal: React.FC<UniversalMatchModalProps> = ({
  isOpen,
  onClose,
  config,
  teams,
  onMatchCompleted,
}) => {
  const gameMode = config.gameMode || 'friendly';
  const isCareerMode = gameMode === 'career';
  const isDreamTeamMode = gameMode === 'dream_team';
  const isManagerMode = gameMode === 'manager';

  const [stage, setStage] = useState<'PREVIEW' | 'SQUAD_SELECTION' | 'TOSS' | 'LIVE_MATCH' | 'RESULT'>('PREVIEW');
  const [activeTeams, setActiveTeams] = useState<MatchTeamsSetup>(teams);

  // Simulator Instance
  const simRef = useRef<CricketMatchSimulator | null>(null);

  // Live UI States
  const [currentInningsData, setCurrentInningsData] = useState<any>(null);
  const [innings1Data, setInnings1Data] = useState<any>(null);
  const [innings2Data, setInnings2Data] = useState<any>(null);
  const [recentPills, setRecentPills] = useState<string[]>([]);
  const [commentaryLogs, setCommentaryLogs] = useState<BallByBallEvent[]>([]);
  const [isFreeHit, setIsFreeHit] = useState(false);
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [isInningsBreak, setIsInningsBreak] = useState(false);

  // Bowler Selection Modal State
  const [showBowlerModal, setShowBowlerModal] = useState(false);

  // Modals & Panels
  const [showScorecardModal, setShowScorecardModal] = useState(false);
  const [activeDRSReview, setActiveDRSReview] = useState<DRSReviewState | null>(null);
  const [activeFieldingEvent, setActiveFieldingEvent] = useState<{
    fielderName: string;
    batterName: string;
    difficulty: 'EASY' | 'MEDIUM' | 'DIFFICULT' | 'SPECTACULAR';
  } | null>(null);

  const [finalReport, setFinalReport] = useState<CompletedMatchReport | null>(null);

  // Auto-play interval
  const [simSpeed, setSimSpeed] = useState<'PAUSED' | '1X' | '2X' | 'MAX'>('PAUSED');
  const autoPlayTimerRef = useRef<any>(null);

  // Career Player info
  const careerPlayer = activeTeams.teamA.playingXI.find(
    (p) => p.isUserPlayer || (config.userPlayerId && p.playerId === config.userPlayerId)
  ) || activeTeams.teamA.playingXI[0];

  // Initialize Simulator on open
  useEffect(() => {
    if (isOpen) {
      simRef.current = new CricketMatchSimulator(config, activeTeams);
      setStage('PREVIEW');
      setSimSpeed('PAUSED');
      setIsMatchOver(false);
      setIsInningsBreak(false);
      setShowBowlerModal(false);
      setCommentaryLogs([]);
      setRecentPills([]);
    }
  }, [isOpen, config]);

  // Sync Live State from Simulator
  const syncLiveState = () => {
    if (!simRef.current) return;
    const sim = simRef.current;
    setCurrentInningsData(JSON.parse(JSON.stringify(sim.getActiveInnings())));
    setInnings1Data(JSON.parse(JSON.stringify(sim.innings1)));
    if (sim.innings2) {
      setInnings2Data(JSON.parse(JSON.stringify(sim.innings2)));
    }
    setRecentPills([...sim.recentBallPills]);
    setIsFreeHit(sim.isFreeHitActive);
    setIsInningsBreak(sim.isInningsBreak);
    setIsMatchOver(sim.isMatchOver);

    // Check if bowler selection is needed in team modes
    if (sim.isAwaitingBowlerSelection) {
      setShowBowlerModal(true);
      setSimSpeed('PAUSED');
    }

    if (sim.isMatchOver && !finalReport) {
      const rep = sim.generateFinalReport();
      setFinalReport(rep);
      setStage('RESULT');
      setSimSpeed('PAUSED');
      onMatchCompleted(rep);
    }
  };

  // Toss Completion Handler
  const handleTossComplete = (winner: 'teamA' | 'teamB', decision: 'BAT' | 'BOWL') => {
    if (!simRef.current) return;
    simRef.current.conductToss(winner === 'teamA' ? 'HEADS' : 'TAILS', decision);
    syncLiveState();

    // Check if user is bowling first in team mode to select opening bowler
    const isUserBowlingTeam = simRef.current.teams[simRef.current.bowlingTeamKey]?.isUserTeam;
    if (isUserBowlingTeam && (isDreamTeamMode || isManagerMode)) {
      setShowBowlerModal(true);
      setSimSpeed('PAUSED');
    }

    setStage('LIVE_MATCH');
  };

  // Step next ball
  const handleStepDelivery = (options?: {
    battingChoice?: BattingDecisionType;
    bowlingChoice?: BowlingDeliveryChoice;
  }) => {
    if (!simRef.current || isMatchOver) return;

    if (simRef.current.isInningsBreak) {
      simRef.current.startSecondInnings();
      syncLiveState();
      return;
    }

    const currentInnings = simRef.current.getActiveInnings();
    const currentStriker = currentInnings.batters[simRef.current.currentStrikerIndex];
    const currentBowler = currentInnings.bowlers[simRef.current.currentBowlerIndex];

    const isCareerPlayerStriker = isCareerMode && (currentStriker?.isUserPlayer || currentStriker?.playerId === config.userPlayerId);
    const isCareerPlayerBowler = isCareerMode && (currentBowler?.isUserPlayer || currentBowler?.playerId === config.userPlayerId);

    const ball = simRef.current.deliverNextBall(options);
    if (ball) {
      setCommentaryLogs((prev) => [ball, ...prev.slice(0, 40)]);

      // Check DRS Trigger
      if (ball.drsEvent && Math.random() < 0.25) {
        if (!isCareerMode || isCareerPlayerStriker || isCareerPlayerBowler) {
          setSimSpeed('PAUSED');
          setActiveDRSReview(ball.drsEvent);
        }
      }

      // Check Catch / Fielding Opportunity Trigger
      if (ball.isWicket && ball.wicketType === 'CAUGHT' && Math.random() < 0.3) {
        const isFielderCareerPlayer = isCareerMode && (ball.fielderName === careerPlayer.name || ball.fielderName === careerPlayer.shortName);
        if (!isCareerMode || isFielderCareerPlayer) {
          setSimSpeed('PAUSED');
          setActiveFieldingEvent({
            fielderName: ball.fielderName || 'Fielder',
            batterName: ball.striker.name,
            difficulty: 'MEDIUM',
          });
        }
      }
    }

    syncLiveState();

    // In Career Mode, check if the next state requires user action
    if (isCareerMode && simRef.current && !simRef.current.isMatchOver) {
      const nextInnings = simRef.current.getActiveInnings();
      const nextStriker = nextInnings.batters[simRef.current.currentStrikerIndex];
      const nextBowler = nextInnings.bowlers[simRef.current.currentBowlerIndex];

      const isNextStrikerUser = nextStriker?.isUserPlayer || nextStriker?.playerId === config.userPlayerId;
      const isNextBowlerUser = nextBowler?.isUserPlayer || nextBowler?.playerId === config.userPlayerId;

      if (isNextStrikerUser || isNextBowlerUser) {
        // Automatically pause when Career player is active
        setSimSpeed('PAUSED');
      }
    }
  };

  // Auto-play loop
  useEffect(() => {
    if (stage !== 'LIVE_MATCH' || simSpeed === 'PAUSED' || isMatchOver || showBowlerModal) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    const intervalMs = simSpeed === '1X' ? 1200 : simSpeed === '2X' ? 600 : 120;
    autoPlayTimerRef.current = setInterval(() => {
      // In Career Mode, if Career player is batting or bowling, pause auto-play for user input
      if (isCareerMode && simRef.current) {
        const activeInnings = simRef.current.getActiveInnings();
        const striker = activeInnings.batters[simRef.current.currentStrikerIndex];
        const bowler = activeInnings.bowlers[simRef.current.currentBowlerIndex];

        const isUserStriker = striker?.isUserPlayer || striker?.playerId === config.userPlayerId;
        const isUserBowler = bowler?.isUserPlayer || bowler?.playerId === config.userPlayerId;

        if (isUserStriker || isUserBowler) {
          setSimSpeed('PAUSED');
          return;
        }
      }

      handleStepDelivery();
    }, intervalMs);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [stage, simSpeed, isMatchOver, showBowlerModal]);

  // Handle Bowler Selection from Modal
  const handleSelectBowler = (bowlerIndex: number) => {
    if (!simRef.current) return;
    simRef.current.selectBowler(bowlerIndex);
    setShowBowlerModal(false);
    syncLiveState();
  };

  // Instant simulate to end
  const handleInstantSimulateToEnd = () => {
    if (!simRef.current) return;
    setSimSpeed('PAUSED');
    const rep = simRef.current.autoSimulateToEnd();
    syncLiveState();
    setFinalReport(rep);
    setStage('RESULT');
    onMatchCompleted(rep);
  };

  // Rain interruption test
  const handleSimulateRainDLS = () => {
    if (!simRef.current) return;
    setSimSpeed('PAUSED');
    simRef.current.triggerRainInterruption(3);
    syncLiveState();
  };

  if (!isOpen) return null;

  const currentInnings = currentInningsData || simRef.current?.innings1;
  const striker = currentInnings?.batters[simRef.current?.currentStrikerIndex || 0];
  const nonStriker = currentInnings?.batters[simRef.current?.currentNonStrikerIndex || 1];
  const bowler = currentInnings?.bowlers[simRef.current?.currentBowlerIndex || 0];

  const isUserTeamBatting = simRef.current?.battingTeamKey === 'teamA' && activeTeams.teamA.isUserTeam;
  const isUserTeamBowling = simRef.current?.bowlingTeamKey === 'teamA' && activeTeams.teamA.isUserTeam;

  // Specific Career Player status
  const isCareerPlayerStriker = isCareerMode && (striker?.isUserPlayer || striker?.playerId === config.userPlayerId);
  const isCareerPlayerBowler = isCareerMode && (bowler?.isUserPlayer || bowler?.playerId === config.userPlayerId);
  const isCareerPlayerActive = isCareerPlayerStriker || isCareerPlayerBowler;

  return (
    <div
      id="universal-match-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto"
    >
      <div className="w-full max-w-6xl my-auto space-y-4">
        
        {/* STAGE 1: MATCH PREVIEW */}
        {stage === 'PREVIEW' && (
          <MatchPreviewPanel
            config={config}
            teams={activeTeams}
            onProceed={() => setStage('SQUAD_SELECTION')}
          />
        )}

        {/* STAGE 2: SQUAD SELECTION & BATTING ORDER */}
        {stage === 'SQUAD_SELECTION' && (
          <SquadSelectionPanel
            teamName={activeTeams.teamA.name}
            squad={activeTeams.teamA.fullSquad && activeTeams.teamA.fullSquad.length >= 11 ? activeTeams.teamA.fullSquad : activeTeams.teamA.playingXI}
            playingXI={activeTeams.teamA.playingXI}
            gameMode={gameMode}
            careerPlayerName={careerPlayer?.name}
            onUpdatePlayingXI={(newXI) => {
              const updated = {
                ...activeTeams,
                teamA: { ...activeTeams.teamA, playingXI: newXI },
              };
              setActiveTeams(updated);
              if (simRef.current) {
                simRef.current.setBattingOrder('teamA', newXI);
              }
            }}
            onProceed={() => setStage('TOSS')}
          />
        )}

        {/* STAGE 3: TOSS */}
        {stage === 'TOSS' && (
          <TossAnimationPanel
            teamAName={activeTeams.teamA.name}
            teamBName={activeTeams.teamB.name}
            isUserTeamA={activeTeams.teamA.isUserTeam}
            onTossCompleted={handleTossComplete}
          />
        )}

        {/* STAGE 4: LIVE MATCH SIMULATION */}
        {stage === 'LIVE_MATCH' && currentInnings && (
          <div className="space-y-4">
            
            {/* Mode Identity & Active Status Bar */}
            <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg ${
              isCareerMode
                ? 'border-amber-500/40 bg-gradient-to-r from-[#14120a] via-[#1f190e] to-[#0d0f17]'
                : isDreamTeamMode
                ? 'border-indigo-500/40 bg-gradient-to-r from-[#0b1021] via-[#101733] to-[#060a17]'
                : 'border-emerald-500/40 bg-gradient-to-r from-[#071912] via-[#0c241b] to-[#060a17]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black ${
                  isCareerMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : isDreamTeamMode ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isCareerMode ? <User className="w-5 h-5" /> : isDreamTeamMode ? <Users className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {isCareerMode ? 'MY CAREER MATCH ENGINE' : isDreamTeamMode ? 'MY DREAM CRICKET TEAM ENGINE' : 'MY MANAGER CAREER ENGINE'}
                  </div>
                  <div className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>
                      {isCareerMode
                        ? `YOU ARE PLAYING AS: ${careerPlayer.name.toUpperCase()}`
                        : isDreamTeamMode
                        ? `YOU CONTROL: ${activeTeams.teamA.name.toUpperCase()}`
                        : `YOU MANAGE: ${activeTeams.teamA.name.toUpperCase()}`}
                    </span>
                    {isCareerMode && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                        {careerPlayer.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isCareerMode ? (
                  isCareerPlayerActive ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span>YOUR DECISION REQUIRED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 text-xs font-mono">
                      <Activity className="w-3.5 h-3.5 text-indigo-400" />
                      <span>AI SIMULATION ACTIVE (Observing)</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    <span>{isUserTeamBatting ? 'TEAM BATTING CONTROL' : 'TEAM BOWLING CONTROL'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Broadcast Scoreboard */}
            <LiveScoreboard
              config={config}
              currentInnings={currentInnings}
              otherInnings={innings1Data}
              isSecondInnings={simRef.current?.currentInningsNumber === 2}
              recentBalls={recentPills}
              isFreeHit={isFreeHit}
              reviewsRemaining={2}
            />

            {/* Middle Grid: Active Players & Match Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Batting Striker & Non-Striker Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3 shadow-lg">
                <div className="text-[10px] font-bold uppercase text-emerald-400 flex items-center justify-between">
                  <span>BATTERS AT CREASE</span>
                  {isCareerPlayerStriker && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                      YOU ARE ON STRIKE
                    </span>
                  )}
                </div>

                {/* Striker */}
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isCareerPlayerStriker
                    ? 'border-amber-500/50 bg-amber-950/30 ring-1 ring-amber-500/40'
                    : 'border-emerald-500/30 bg-emerald-950/30'
                }`}>
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{striker?.name || 'Striker'}</span>
                      <span className="text-amber-400 font-bold">*</span>
                      {striker?.isUserPlayer && (
                        <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-300">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      {striker?.role} • Rating {striker?.overallRating}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-lg font-black text-amber-400">
                      {striker?.runs || 0} <span className="text-xs text-slate-300">({striker?.balls || 0})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {striker?.fours || 0}x4 • {striker?.sixes || 0}x6 • SR {striker?.strikeRate || 0}
                    </div>
                  </div>
                </div>

                {/* Non-Striker */}
                <div className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-200">
                      {nonStriker?.name || 'Non-Striker'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {nonStriker?.role}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-slate-200">
                      {nonStriker?.runs || 0} <span className="text-xs text-slate-400">({nonStriker?.balls || 0})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      SR {nonStriker?.strikeRate || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Current Partnership & Simulation Controls */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="text-[10px] font-bold uppercase text-indigo-400">
                    CURRENT PARTNERSHIP
                  </div>
                  <div className="text-center py-2">
                    <div className="text-2xl font-black text-white font-mono">
                      {currentInnings.currentPartnership?.totalRuns || 0} Runs
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      from {currentInnings.currentPartnership?.balls || 0} deliveries
                    </div>
                  </div>
                </div>

                {/* Speed & Sim Controls */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Engine Control:</span>
                    <span className="font-mono text-amber-400 font-bold">{simSpeed}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => setSimSpeed('PAUSED')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        simSpeed === 'PAUSED' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Pause className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button
                      onClick={() => setSimSpeed('1X')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        simSpeed === '1X' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      1X
                    </button>
                    <button
                      onClick={() => setSimSpeed('2X')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        simSpeed === '2X' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      2X
                    </button>
                    <button
                      onClick={() => setSimSpeed('MAX')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        simSpeed === 'MAX' ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      FAST
                    </button>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setShowScorecardModal(true)}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trophy className="w-3.5 h-3.5 text-indigo-400" />
                      <span>SCORECARD</span>
                    </button>

                    <button
                      onClick={handleInstantSimulateToEnd}
                      className="flex-1 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>SIM TO END</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bowler Figure Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3 shadow-lg">
                <div className="text-[10px] font-bold uppercase text-rose-400 flex items-center justify-between">
                  <span>CURRENT BOWLER</span>
                  {isCareerPlayerBowler && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500 text-white">
                      YOU ARE BOWLING
                    </span>
                  )}
                </div>

                <div className={`p-3 rounded-xl border space-y-2 ${
                  isCareerPlayerBowler
                    ? 'border-indigo-500/50 bg-indigo-950/30 ring-1 ring-indigo-500/40'
                    : 'border-rose-500/30 bg-rose-950/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{bowler?.name || 'Bowler'}</span>
                        {bowler?.isUserPlayer && (
                          <span className="text-[9px] font-bold px-1 rounded bg-indigo-500/20 text-indigo-300">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono">
                        {bowler?.role} • Rating {bowler?.overallRating}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-lg font-black text-rose-400">
                        {bowler?.wickets || 0}/{bowler?.runsConceded || 0}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {bowler?.oversBowled || 0}.{bowler?.ballsBowledInOver || 0} ov
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-300 font-mono pt-1 border-t border-white/10">
                    <span>Econ: {bowler?.economyRate || 0}</span>
                    <span>Dots: {bowler?.dotBalls || 0}</span>
                    <span>Wd/Nb: {bowler?.wides || 0}/{bowler?.noBalls || 0}</span>
                  </div>
                </div>

                {/* Bowler Change Button in Team Modes */}
                {!isCareerMode && isUserTeamBowling && (
                  <button
                    onClick={() => setShowBowlerModal(true)}
                    className="w-full py-2 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>CHANGE / ROTATE BOWLER</span>
                  </button>
                )}

                {/* Rain Interruption Trigger */}
                <button
                  onClick={handleSimulateRainDLS}
                  className="w-full py-1.5 rounded-xl border border-white/5 bg-slate-950/40 hover:bg-slate-900/60 text-slate-400 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CloudRain className="w-3 h-3 text-blue-400" />
                  <span>SIMULATE RAIN DLS REVISION</span>
                </button>
              </div>

            </div>

            {/* Innings Break Notification */}
            {isInningsBreak && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-5 text-center space-y-3 shadow-xl">
                <div className="text-xs uppercase font-bold text-amber-300">INNINGS BREAK</div>
                <h3 className="text-xl font-black text-white">
                  {currentInnings.battingTeamName} scored {currentInnings.totalRuns}/{currentInnings.totalWickets} ({currentInnings.totalOvers}.{currentInnings.ballsInCurrentOver} ov)
                </h3>
                <p className="text-xs text-slate-300">
                  Target for {simRef.current?.bowlingTeamKey === 'teamA' ? activeTeams.teamA.name : activeTeams.teamB.name}: <strong className="text-amber-400">{currentInnings.totalRuns + 1} Runs</strong>
                </p>
                <button
                  onClick={() => {
                    simRef.current?.startSecondInnings();
                    syncLiveState();
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 font-black text-xs uppercase tracking-wider text-slate-950 shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  START 2ND INNINGS CHASE
                </button>
              </div>
            )}

            {/* Decision Panels & AI Live Observation Bar */}
            {!isInningsBreak && (
              <div>
                {isCareerMode ? (
                  // CAREER MODE: Only prompt when user is striker or bowler
                  isCareerPlayerStriker ? (
                    <BattingDecisionPanel
                      onSelectShot={(shot) => handleStepDelivery({ battingChoice: shot })}
                      strikerName={striker?.name || 'Career Player'}
                      strikerRole={striker?.role}
                      strikerCondition={striker?.condition}
                      bowlerName={bowler?.name || 'Bowler'}
                      bowlerRole={bowler?.role}
                      isCareerPlayer={true}
                      disabled={simSpeed !== 'PAUSED'}
                    />
                  ) : isCareerPlayerBowler ? (
                    <BowlingDecisionPanel
                      onSelectDelivery={(delivery) => handleStepDelivery({ bowlingChoice: delivery })}
                      bowlerName={bowler?.name || 'Career Player'}
                      bowlerRole={bowler?.role || 'Fast Bowler'}
                      bowlerCondition={bowler?.condition}
                      strikerName={striker?.name || 'Batter'}
                      isCareerPlayer={true}
                      disabled={simSpeed !== 'PAUSED'}
                    />
                  ) : (
                    // AI Match Observation bar when user is not directly involved
                    <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            AI Simulation Active — Watching {striker?.name} & {nonStriker?.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Simulation will automatically pause when {careerPlayer.name} comes to bat, bowl, or field.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStepDelivery()}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5"
                        >
                          <span>Step Next Ball</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        {simSpeed === 'PAUSED' && (
                          <button
                            onClick={() => setSimSpeed('1X')}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-xs font-black uppercase tracking-wider text-white transition-all shadow-md flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Resume Simulation</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  // TEAM MODES (Dream Team / Manager): Full tactical controls
                  isUserTeamBowling ? (
                    <BowlingDecisionPanel
                      onSelectDelivery={(delivery) => handleStepDelivery({ bowlingChoice: delivery })}
                      bowlerName={bowler?.name || 'Bowler'}
                      bowlerRole={bowler?.role || 'Fast Bowler'}
                      bowlerCondition={bowler?.condition}
                      strikerName={striker?.name || 'Batter'}
                      disabled={simSpeed !== 'PAUSED'}
                    />
                  ) : (
                    <BattingDecisionPanel
                      onSelectShot={(shot) => handleStepDelivery({ battingChoice: shot })}
                      strikerName={striker?.name || 'Batter'}
                      strikerRole={striker?.role}
                      strikerCondition={striker?.condition}
                      bowlerName={bowler?.name || 'Bowler'}
                      bowlerRole={bowler?.role}
                      disabled={simSpeed !== 'PAUSED'}
                    />
                  )
                )}
              </div>
            )}

            {/* Commentary Feed */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 space-y-2 shadow-lg">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                LIVE BALL-BY-BALL COMMENTARY
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {commentaryLogs.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">
                    Match underway. Deliveries will stream here live...
                  </div>
                ) : (
                  commentaryLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2 rounded-xl bg-white/5 text-xs text-slate-200 flex items-start gap-2.5 font-mono"
                    >
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        log.isWicket
                          ? 'bg-rose-600 text-white'
                          : log.isBoundarySix
                          ? 'bg-purple-600 text-white'
                          : log.isBoundaryFour
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.overIndex}.{log.ballInOver}
                      </span>
                      <span className="flex-1 text-slate-300 leading-snug">{log.commentary}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* STAGE 5: POST-MATCH RESULT */}
        {stage === 'RESULT' && finalReport && (
          <PostMatchResultModal
            isOpen={true}
            report={finalReport}
            onContinue={() => {
              onClose();
            }}
          />
        )}

        {/* Bowler Selection Modal (Between Overs) */}
        {showBowlerModal && simRef.current && (
          <BowlerSelectionModal
            isOpen={showBowlerModal}
            overNumber={simRef.current.overIndex + 1}
            bowlers={simRef.current.getEligibleBowlers()}
            recommendedBowler={simRef.current.getRecommendedBowler()}
            onSelectBowler={handleSelectBowler}
          />
        )}

        {/* DRS Review Modal */}
        {activeDRSReview && (
          <DRSReviewModal
            isOpen={true}
            drs={activeDRSReview}
            onComplete={() => setActiveDRSReview(null)}
          />
        )}

        {/* Fielding Catch Event Modal */}
        {activeFieldingEvent && (
          <FieldingDecisionModal
            isOpen={true}
            fielderName={activeFieldingEvent.fielderName}
            batterName={activeFieldingEvent.batterName}
            eventType="CATCH"
            difficulty={activeFieldingEvent.difficulty}
            onSelectAction={() => setActiveFieldingEvent(null)}
          />
        )}

        {/* In-Match Scorecard Modal */}
        {showScorecardModal && (
          <MatchScorecardModal
            isOpen={showScorecardModal}
            onClose={() => setShowScorecardModal(false)}
            innings1={innings1Data || simRef.current?.innings1}
            innings2={innings2Data || simRef.current?.innings2}
          />
        )}

      </div>
    </div>
  );
};
