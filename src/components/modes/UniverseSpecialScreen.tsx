import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  StandardCountryCode,
  WTCState,
  WTCFixture,
} from '../../types';
import { WTC_COUNTRIES } from '../../services/wtcData';
import {
  createInitialWTCState,
  loadWTCState,
  saveWTCState,
  resetWTCState,
  recordCompletedUserWTCFixture,
  advanceToNextUserFixture,
  getAvailableWTCCountryPlayers,
} from '../../services/wtcEngine';
import { WTCSelectCountryModal } from './wtc/WTCSelectCountryModal';
import { WTCPlayingXIModal } from './wtc/WTCPlayingXIModal';
import { WTCTestMatchModal } from './wtc/WTCTestMatchModal';
import { WTCFinalCelebrationModal } from './wtc/WTCFinalCelebrationModal';
import {
  Trophy,
  Calendar,
  BarChart3,
  Users,
  Crown,
  Play,
  ArrowLeft,
  RefreshCw,
  Clock,
  MapPin,
  Sparkles,
  FastForward,
  CheckCircle2,
  Shield,
  Award,
  Zap,
  Search,
  UserPlus,
  UserCheck,
  Check,
  X,
  Trash2,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface UniverseSpecialScreenProps {
  onBack: () => void;
}

type TabType = 'OVERVIEW' | 'FIXTURES' | 'STANDINGS' | 'SQUAD' | 'FINALS';

export const UniverseSpecialScreen: React.FC<UniverseSpecialScreenProps> = ({ onBack }) => {
  const [wtcState, setWtcState] = useState<WTCState | null>(() => loadWTCState());

  // Setup Flow Steps (when no saved state exists)
  const [setupStep, setSetupStep] = useState<'SELECT_COUNTRY' | 'READY'>('SELECT_COUNTRY');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');

  // Match Flow Modals
  const [isXIModalOpen, setIsXIModalOpen] = useState(false);
  const [isTestMatchModalOpen, setIsTestMatchModalOpen] = useState(false);
  const [selectedXIIds, setSelectedXIIds] = useState<string[]>([]);
  const [selectedBattingOrderIds, setSelectedBattingOrderIds] = useState<string[]>([]);
  const [selectedCaptainId, setSelectedCaptainId] = useState<string | undefined>(undefined);
  const [selectedWicketkeeperId, setSelectedWicketkeeperId] = useState<string | undefined>(undefined);
  const [activeMatchFixture, setActiveMatchFixture] = useState<WTCFixture | null>(null);
  const [isFinalCelebrationOpen, setIsFinalCelebrationOpen] = useState(false);

  // Squad Management Filters
  const [squadRoleFilter, setSquadRoleFilter] = useState<'ALL' | 'BAT' | 'WK' | 'AR' | 'BOWL'>('ALL');
  const [squadSearchQuery, setSquadSearchQuery] = useState('');

  // Toast / notification
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // When country is selected during setup - Directly initialize Full National Team state
  const handleCountrySelected = (code: StandardCountryCode) => {
    const newState = createInitialWTCState(code);
    setWtcState(newState);
    setSetupStep('READY');
    const cInfo = WTC_COUNTRIES.find((c) => c.code === code);
    showToast(`Welcome to the ICC World Test Championship 2025–27 with ${cInfo?.name || code}!`);
  };

  // Reset Campaign
  const handleResetCampaign = () => {
    if (window.confirm('Are you sure you want to reset your WTC 2025–27 campaign? Current progress will be cleared.')) {
      resetWTCState();
      setWtcState(null);
      setSetupStep('SELECT_COUNTRY');
    }
  };

  // Next user fixture
  const nextUserFixture = wtcState?.fixtures.find(
    (f) => f.isUserMatch && f.status === 'scheduled'
  );

  // Start Next Match Flow
  const handleStartNextMatch = (fixture?: WTCFixture) => {
    const target = fixture || nextUserFixture || wtcState?.fixtures.find(f => f.homeTeam === wtcState.userCountry || f.awayTeam === wtcState.userCountry) || wtcState?.fixtures[0];
    if (!target) return;
    setActiveMatchFixture(target);
    setIsXIModalOpen(true);
  };

  // Toggle player into / out of Playing XI from SQUAD tab
  const handleTogglePlayerInXI = (playerId: string) => {
    if (!wtcState) return;
    const currentXI = wtcState.preferredPlayingXI ? [...wtcState.preferredPlayingXI] : [];
    let nextXI: string[];

    if (currentXI.includes(playerId)) {
      nextXI = currentXI.filter((id) => id !== playerId);
    } else {
      if (currentXI.length >= 11) {
        showToast('Playing XI already has 11 players. Remove a player first.');
        return;
      }
      nextXI = [...currentXI, playerId];
    }

    const updatedState: WTCState = {
      ...wtcState,
      preferredPlayingXI: nextXI,
      preferredBattingOrder: nextXI,
    };
    saveWTCState(updatedState);
    setWtcState(updatedState);
  };

  // Set Captain directly from SQUAD tab
  const handleSetCaptain = (playerId: string) => {
    if (!wtcState) return;
    const updatedState: WTCState = {
      ...wtcState,
      captainId: playerId,
    };
    saveWTCState(updatedState);
    setWtcState(updatedState);
    showToast('Captain updated!');
  };

  // Set Wicketkeeper directly from SQUAD tab
  const handleSetWicketkeeper = (playerId: string) => {
    if (!wtcState) return;
    const updatedState: WTCState = {
      ...wtcState,
      wicketkeeperId: playerId,
    };
    saveWTCState(updatedState);
    setWtcState(updatedState);
    showToast('Wicketkeeper updated!');
  };

  // Auto-fill Best 11 from SQUAD tab
  const handleAutoSelectBest11 = () => {
    if (!wtcState) return;
    const squad = getAvailableWTCCountryPlayers(wtcState.userCountry);
    const keepers = squad.filter((p) => p.primary_role === 'Wicketkeeper-Batter');
    const batters = squad.filter((p) => p.primary_role === 'Batter');
    const allRounders = squad.filter((p) => p.primary_role === 'All-Rounder');
    const bowlers = squad.filter((p) => p.primary_role === 'Bowler');

    const selection: string[] = [];
    batters.slice(0, 5).forEach((p) => selection.push(p.player_id));
    allRounders.slice(0, 2).forEach((p) => {
      if (selection.length < 7) selection.push(p.player_id);
    });
    if (keepers.length > 0 && !selection.includes(keepers[0].player_id)) {
      selection.push(keepers[0].player_id);
    }
    bowlers.forEach((p) => {
      if (selection.length < 11 && !selection.includes(p.player_id)) {
        selection.push(p.player_id);
      }
    });
    squad.forEach((p) => {
      if (selection.length < 11 && !selection.includes(p.player_id)) {
        selection.push(p.player_id);
      }
    });

    const final11 = selection.slice(0, 11);
    const updatedState: WTCState = {
      ...wtcState,
      preferredPlayingXI: final11,
      preferredBattingOrder: final11,
      captainId: wtcState.captainId || final11[0],
      wicketkeeperId: wtcState.wicketkeeperId || keepers[0]?.player_id || final11[final11.length - 1],
    };
    saveWTCState(updatedState);
    setWtcState(updatedState);
    showToast('Auto-selected 11 best players for Playing XI!');
  };

  // Clear XI from SQUAD tab
  const handleClearXI = () => {
    if (!wtcState) return;
    const updatedState: WTCState = {
      ...wtcState,
      preferredPlayingXI: [],
      preferredBattingOrder: [],
    };
    saveWTCState(updatedState);
    setWtcState(updatedState);
    showToast('Cleared Playing XI selections.');
  };

  // Confirm XI and open Live Test Match Engine
  const handleConfirmPlayingXI = (data: {
    playingXIIds: string[];
    battingOrderIds: string[];
    captainId?: string;
    wicketkeeperId?: string;
  }) => {
    setSelectedXIIds(data.playingXIIds);
    setSelectedBattingOrderIds(data.battingOrderIds);
    setSelectedCaptainId(data.captainId);
    setSelectedWicketkeeperId(data.wicketkeeperId);

    // Save preferences to WTC campaign state
    if (wtcState) {
      const updatedState: WTCState = {
        ...wtcState,
        preferredPlayingXI: data.playingXIIds,
        preferredBattingOrder: data.battingOrderIds,
        captainId: data.captainId,
        wicketkeeperId: data.wicketkeeperId,
      };
      saveWTCState(updatedState);
      setWtcState(updatedState);
    }

    setIsXIModalOpen(false);
    setIsTestMatchModalOpen(true);
  };

  // Match Completed from modal
  const handleMatchCompleted = (resultData: any) => {
    if (!wtcState || !activeMatchFixture) return;
    const updated = recordCompletedUserWTCFixture(wtcState, activeMatchFixture.id, resultData);
    setWtcState(updated);
    setIsTestMatchModalOpen(false);
    setActiveMatchFixture(null);

    if (updated.status === 'final_completed') {
      setIsFinalCelebrationOpen(true);
    } else {
      showToast(`Test Match Concluded! Result: ${resultData.margin}`);
    }
  };

  // Advance AI matches
  const handleAdvanceAITournament = () => {
    if (!wtcState) return;
    const updated = advanceToNextUserFixture(wtcState);
    setWtcState(updated);
    showToast('Simulated upcoming non-user WTC fixtures across the world.');
  };

  // If no campaign exists, show setup wizard
  if (!wtcState) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between">
        {/* Navigation Top Bar */}
        <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between border-b border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Exit to Main Menu
          </button>

          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-black text-white uppercase tracking-wider">
              Universe Special • WTC 2025–27
            </span>
          </div>
        </div>

        {/* Wizard Container */}
        <div className="flex-1 flex items-center justify-center py-6">
          <WTCSelectCountryModal onSelectCountry={handleCountrySelected} />
        </div>
      </div>
    );
  }

  const userCountryInfo = WTC_COUNTRIES.find((c) => c.code === wtcState.userCountry)!;
  const userRankEntry = wtcState.standings.find((s) => s.countryCode === wtcState.userCountry);
  const nationalSquad = getAvailableWTCCountryPlayers(wtcState.userCountry);
  const teamStats = wtcState.teamStats || {
    matches: 0,
    won: 0,
    lost: 0,
    drawn: 0,
    tied: 0,
    runsScored: 0,
    wicketsTaken: 0,
    highestTeamScore: 0,
    lowestTeamScore: 0,
    centuriesScored: 0,
    fiveWicketHauls: 0,
    potmCount: 0,
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header & Campaign Banner */}
      <header className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-[#0a1020] to-slate-950 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                    ICC World Test Championship 2025–27
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] uppercase border border-amber-500/30">
                    Full National Team
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{userCountryInfo.flag} {userCountryInfo.name} National Team</span>
                  <span>•</span>
                  <span>Rank #{userRankEntry?.rank || 1} ({userRankEntry?.pct || 0}% PCT)</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">Series: {userRankEntry?.seriesPlayed || 0}/6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdvanceAITournament}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5 text-blue-400" /> Sim Global AI Matches
            </button>
            <button
              type="button"
              onClick={handleResetCampaign}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[11px] font-bold text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-white/5 pt-1">
          {[
            { id: 'OVERVIEW', label: 'Overview & Next Test', icon: Play },
            { id: 'FIXTURES', label: '2025–27 Schedule', icon: Calendar },
            { id: 'STANDINGS', label: 'Official Points Table', icon: BarChart3 },
            { id: 'SQUAD', label: 'National Squad & XI', icon: Users },
            { id: 'FINALS', label: "Road to Lord's Final", icon: Crown },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-amber-400 border-amber-400 bg-amber-500/5'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Hero: Next Test Match Card */}
            {nextUserFixture ? (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0c162b] to-black border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Next Test Series Fixture</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      {nextUserFixture.seriesName}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" /> {nextUserFixture.venue}
                      </span>
                      <span>•</span>
                      <span>📅 {nextUserFixture.startDate} to {nextUserFixture.endDate}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px]">
                        Pitch: {nextUserFixture.pitch}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Manage the entire national team across 5 days of Test cricket. Full team batting lineup, customized bowling rotations, declaration tactics, and DRS reviews.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => handleStartNextMatch(nextUserFixture)}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" /> Select Playing XI & Play Test
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-3">
                <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-xl font-black text-white uppercase">All League Fixtures Completed</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your nation has finished all 6 series in the WTC 2025–27 cycle. Check the &apos;Road to Lord&apos;s Final&apos; tab to see if you qualified in the Top 2!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('FINALS')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase cursor-pointer"
                >
                  View Lord&apos;s Final Status
                </button>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">WTC Table Rank</div>
                <div className="text-2xl font-black text-amber-400">#{userRankEntry?.rank || 1}</div>
                <div className="text-[11px] text-slate-300 font-semibold">{userRankEntry?.pct || 0}% Points PCT</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Series Played</div>
                <div className="text-2xl font-black text-white">{userRankEntry?.seriesPlayed || 0} / 6</div>
                <div className="text-[11px] text-slate-300 font-semibold">{userRankEntry?.won || 0} Wins, {userRankEntry?.drawn || 0} Draws</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Team Total Runs</div>
                <div className="text-2xl font-black text-emerald-400">{teamStats.runsScored ?? 0}</div>
                <div className="text-[11px] text-slate-300 font-semibold">{teamStats.centuriesScored ?? 0} Team Centuries</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Team Total Wickets</div>
                <div className="text-2xl font-black text-blue-400">{teamStats.wicketsTaken ?? 0}</div>
                <div className="text-[11px] text-slate-300 font-semibold">{teamStats.fiveWicketHauls ?? 0} Five-Wicket Hauls</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FIXTURES */}
        {activeTab === 'FIXTURES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white uppercase">Official WTC 2025–27 Schedule</h3>
                <p className="text-xs text-slate-400">
                  Chronological multi-day Test series calendar across the 9 competing nations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {wtcState.fixtures.map((fix) => {
                const home = WTC_COUNTRIES.find((c) => c.code === fix.homeTeam)!;
                const away = WTC_COUNTRIES.find((c) => c.code === fix.awayTeam)!;

                return (
                  <div
                    key={fix.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      fix.isUserMatch
                        ? 'bg-gradient-to-r from-amber-950/20 via-slate-900 to-black border-amber-500/40'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400">{fix.seriesName}</span>
                        {fix.isUserMatch && (
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                            MY TEAM
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          fix.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {fix.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm font-black text-white">
                        <span>{home.flag} {home.name}</span>
                        <span className="text-xs text-slate-500 font-mono">VS</span>
                        <span>{away.flag} {away.name}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>📍 {fix.venue}</span>
                        <span>📅 {fix.startDate}</span>
                      </div>

                      {fix.result && (
                        <div className="text-xs text-emerald-400 font-semibold pt-1">
                          Result: {fix.result.summary}
                        </div>
                      )}
                    </div>

                    {fix.isUserMatch && fix.status === 'scheduled' && (
                      <button
                        type="button"
                        onClick={() => handleStartNextMatch(fix)}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Play Test
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STANDINGS (PCT% TABLE) */}
        {activeTab === 'STANDINGS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white uppercase">Official WTC Points Table</h3>
                <p className="text-xs text-slate-400">
                  Ranked by Points Percentage (PCT%). Top 2 nations qualify for the WTC Final at Lord&apos;s. (Win: 12 pts, Tie: 6 pts, Draw: 4 pts).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase font-bold text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Team</th>
                    <th className="p-3 text-center">Played</th>
                    <th className="p-3 text-center">Won</th>
                    <th className="p-3 text-center">Lost</th>
                    <th className="p-3 text-center">Drawn</th>
                    <th className="p-3 text-center">Points</th>
                    <th className="p-3 text-center">Max Pts</th>
                    <th className="p-3 text-right font-black text-amber-400">PCT %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {wtcState.standings.map((entry, idx) => {
                    const isTop2 = idx < 2;
                    const isUser = entry.countryCode === wtcState.userCountry;

                    return (
                      <tr
                        key={entry.countryCode}
                        className={`${
                          isUser ? 'bg-amber-500/10 font-bold' : isTop2 ? 'bg-emerald-950/10' : ''
                        }`}
                      >
                        <td className="p-3 font-mono">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            isTop2 ? 'bg-emerald-500 text-black' : 'text-slate-400'
                          }`}>
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{entry.flag}</span>
                            <span className={isUser ? 'text-amber-300 font-black' : 'text-white'}>
                              {entry.countryName} {isUser && '(YOU)'}
                            </span>
                            {isTop2 && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold">
                                Finals Zone
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center text-slate-300">{entry.matchesPlayed}</td>
                        <td className="p-3 text-center text-emerald-400 font-bold">{entry.won}</td>
                        <td className="p-3 text-center text-red-400">{entry.lost}</td>
                        <td className="p-3 text-center text-slate-400">{entry.drawn}</td>
                        <td className="p-3 text-center font-bold text-white">{entry.points}</td>
                        <td className="p-3 text-center text-slate-500">{entry.maxPossiblePoints}</td>
                        <td className="p-3 text-right font-mono font-black text-amber-400 text-sm">
                          {entry.pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SQUAD & XI */}
        {activeTab === 'SQUAD' && (
          <div className="space-y-4">
            {/* Header with Squad & XI Summary */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{userCountryInfo.flag}</span>
                  <h3 className="text-lg font-black text-white uppercase">{userCountryInfo.name} National Test Squad</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Manage your official tournament squad pool and match-day Playing XI. All selections persist across matches.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleAutoSelectBest11}
                  className="px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Select Best 11
                </button>
                <button
                  type="button"
                  onClick={handleClearXI}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear XI
                </button>
                <button
                  type="button"
                  onClick={() => handleStartNextMatch()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Users className="w-4 h-4" /> Configure Playing XI & Batting Lineup
                </button>
              </div>
            </div>

            {/* Current Playing XI Status Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">Playing XI:</span>
                  <span
                    className={`font-mono font-black px-2 py-0.5 rounded text-xs ${
                      (wtcState.preferredPlayingXI?.length || 0) === 11
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {wtcState.preferredPlayingXI?.length || 0} / 11 Selected
                  </span>
                </div>
                {wtcState.captainId && (
                  <div className="flex items-center gap-1 text-slate-300">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Captain: <strong className="text-amber-300">{nationalSquad.find(p => p.player_id === wtcState.captainId)?.name || wtcState.captainId}</strong></span>
                  </div>
                )}
                {wtcState.wicketkeeperId && (
                  <div className="flex items-center gap-1 text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>WK: <strong className="text-blue-300">{nationalSquad.find(p => p.player_id === wtcState.wicketkeeperId)?.name || wtcState.wicketkeeperId}</strong></span>
                  </div>
                )}
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={squadSearchQuery}
                    onChange={(e) => setSquadSearchQuery(e.target.value)}
                    placeholder="Search squad..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-1">
                  {(['ALL', 'BAT', 'WK', 'AR', 'BOWL'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSquadRoleFilter(tab)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        squadRoleFilter === tab
                          ? 'bg-amber-400 text-black font-black'
                          : 'text-slate-400 hover:text-slate-200 bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Squad Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {nationalSquad
                .filter((player) => {
                  const matchRole =
                    squadRoleFilter === 'ALL'
                      ? true
                      : squadRoleFilter === 'BAT'
                      ? player.primary_role === 'Batter'
                      : squadRoleFilter === 'WK'
                      ? player.primary_role === 'Wicketkeeper-Batter'
                      : squadRoleFilter === 'AR'
                      ? player.primary_role === 'All-Rounder'
                      : player.primary_role === 'Bowler';
                  const matchSearch =
                    squadSearchQuery.trim() === '' ||
                    player.name.toLowerCase().includes(squadSearchQuery.toLowerCase()) ||
                    player.primary_role.toLowerCase().includes(squadSearchQuery.toLowerCase());
                  return matchRole && matchSearch;
                })
                .map((player) => {
                  const isCaptain = wtcState.captainId === player.player_id;
                  const isWk = wtcState.wicketkeeperId === player.player_id;
                  const isInPreferredXI = wtcState.preferredPlayingXI?.includes(player.player_id);

                  return (
                    <div
                      key={player.player_id}
                      className={`p-4 rounded-2xl border space-y-3 transition-all ${
                        isInPreferredXI
                          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0b1720] border-emerald-500/50 shadow-md'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[9px] font-bold uppercase">
                            {player.category}
                          </span>
                          {isCaptain && (
                            <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                              CAPTAIN
                            </span>
                          )}
                          {isWk && (
                            <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[9px] font-black uppercase">
                              WK
                            </span>
                          )}
                          {isInPreferredXI && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase">
                              PLAYING XI
                            </span>
                          )}
                        </div>
                        <span className="text-amber-400 font-bold text-sm">Rating {player.overall_rating}</span>
                      </div>

                      <div>
                        <div className="text-base font-bold text-white">{player.name}</div>
                        <div className="text-xs text-slate-400 space-y-0.5 mt-1">
                          <div>Role: <span className="text-slate-200 font-semibold">{player.primary_role}</span></div>
                          <div>Batting: <span className="text-slate-300">{player.batting_style}</span></div>
                          {player.bowling_style && (
                            <div>Bowling: <span className="text-slate-300">{player.bowling_style}</span></div>
                          )}
                        </div>
                      </div>

                      {/* Working Action Buttons */}
                      <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePlayerInXI(player.player_id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                            isInPreferredXI
                              ? 'bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                          }`}
                        >
                          {isInPreferredXI ? (
                            <>
                              <X className="w-3.5 h-3.5" /> Remove from XI
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" /> + Select for XI
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleSetCaptain(player.player_id)}
                            disabled={isCaptain}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isCaptain
                                ? 'bg-amber-400 text-black cursor-default'
                                : 'bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300'
                            }`}
                            title="Set as Team Captain"
                          >
                            <Crown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetWicketkeeper(player.player_id)}
                            disabled={isWk}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isWk
                                ? 'bg-blue-500 text-white cursor-default'
                                : 'bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-300'
                            }`}
                            title="Set as Team Wicketkeeper"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 5: ROAD TO LORD'S FINAL */}
        {activeTab === 'FINALS' && (
          <div className="space-y-6 max-w-3xl mx-auto text-center py-6">
            <div className="h-20 w-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Crown className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">The Holy Grail of Test Cricket</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
                World Test Championship Final • Lord&apos;s 2027
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Only the top 2 teams in the official WTC table qualify for the Grand Final at Lord&apos;s Cricket Ground, London to battle for the ICC Test Mace.
              </p>
            </div>

            {wtcState.status === 'final_ready' && wtcState.finalFixture ? (
              <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-400 shadow-2xl space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-wider">
                  🔥 FINAL UNLOCKED!
                </span>
                <h4 className="text-xl font-black text-white">{wtcState.finalFixture.seriesName}</h4>
                <div className="text-xs text-slate-300">Venue: {wtcState.finalFixture.venue}</div>
                <button
                  type="button"
                  onClick={() => handleStartNextMatch(wtcState.finalFixture)}
                  className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  Play Lord&apos;s Grand Final
                </button>
              </div>
            ) : wtcState.status === 'final_completed' ? (
              <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-black text-white">
                  {wtcState.isChampion ? '🏆 World Champions Trophy Lifted!' : 'Final Concluded'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFinalCelebrationOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase"
                >
                  View Presentation Ceremony & Awards
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs text-slate-400">
                  Current Position: Rank #{userRankEntry?.rank || 1} ({userRankEntry?.pct || 0}% PCT)
                </div>
                <p className="text-xs text-slate-300">
                  Complete all 6 scheduled Test series to determine the final qualification standings.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: SQUAD & PLAYING XI SELECTOR */}
      {isXIModalOpen && activeMatchFixture && (
        <WTCPlayingXIModal
          fixture={activeMatchFixture}
          userCountry={wtcState.userCountry}
          squadPlayerIds={wtcState.squadPlayerIds}
          preferredPlayingXI={wtcState.preferredPlayingXI}
          preferredBattingOrder={wtcState.preferredBattingOrder}
          captainId={wtcState.captainId}
          wicketkeeperId={wtcState.wicketkeeperId}
          onConfirmPlayingXI={handleConfirmPlayingXI}
          onCancel={() => {
            setIsXIModalOpen(false);
            setActiveMatchFixture(null);
          }}
        />
      )}

      {/* MODAL 2: LIVE TEST MATCH ENGINE */}
      {isTestMatchModalOpen && activeMatchFixture && (
        <WTCTestMatchModal
          fixture={activeMatchFixture}
          userCountry={wtcState.userCountry}
          userPlayingXIIds={selectedXIIds}
          userBattingOrderIds={selectedBattingOrderIds}
          captainId={selectedCaptainId}
          wicketkeeperId={selectedWicketkeeperId}
          onMatchComplete={handleMatchCompleted}
          onClose={() => {
            setIsTestMatchModalOpen(false);
            setActiveMatchFixture(null);
          }}
        />
      )}

      {/* MODAL 3: CHAMPIONSHIP CELEBRATION CEREMONY */}
      {isFinalCelebrationOpen && (
        <WTCFinalCelebrationModal
          state={wtcState}
          onClose={() => setIsFinalCelebrationOpen(false)}
        />
      )}
    </div>
  );
};
