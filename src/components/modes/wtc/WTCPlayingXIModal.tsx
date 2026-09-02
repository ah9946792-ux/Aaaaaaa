import React, { useState } from 'react';
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
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Crown,
  ChevronRight,
  Flame,
  Award,
  Layers,
  X,
  UserCheck,
  UserPlus,
  Trash2,
  Activity,
  Sparkles,
  Search,
  Check,
  Play,
  MapPin,
  Calendar,
  Sparkle,
  Trophy,
} from 'lucide-react';

interface WTCPlayingXIModalProps {
  fixture: WTCFixture;
  userCountry: StandardCountryCode;
  squadPlayerIds?: string[];
  preferredPlayingXI?: string[];
  preferredBattingOrder?: string[];
  captainId?: string;
  wicketkeeperId?: string;
  onConfirmPlayingXI: (data: {
    playingXIIds: string[];
    battingOrderIds: string[];
    captainId: string;
    wicketkeeperId: string;
  }) => void;
  onCancel: () => void;
}

type WizardStep = 'SELECT_XI' | 'BATTING_ORDER' | 'MATCH_PREVIEW';
type RoleFilter = 'ALL' | 'BAT' | 'AR' | 'WK' | 'BOWL';

export const WTCPlayingXIModal: React.FC<WTCPlayingXIModalProps> = ({
  fixture,
  userCountry,
  squadPlayerIds,
  preferredPlayingXI,
  preferredBattingOrder,
  captainId: initialCaptainId,
  wicketkeeperId: initialWkId,
  onConfirmPlayingXI,
  onCancel,
}) => {
  const allAvailablePlayers = getAvailableWTCCountryPlayers(userCountry);
  
  // Use tournament squad if provided, else all available national players
  const fullSquad = squadPlayerIds && squadPlayerIds.length >= 11
    ? allAvailablePlayers.filter((p) => squadPlayerIds.includes(p.player_id))
    : allAvailablePlayers;

  const userCountryInfo = WTC_COUNTRIES.find((c) => c.code === userCountry) || {
    code: userCountry,
    name: userCountry,
    flag: '🏏',
    rating: 85,
  };

  const oppCountryCode = fixture.homeTeam === userCountry ? fixture.awayTeam : fixture.homeTeam;
  const oppCountryInfo = WTC_COUNTRIES.find((c) => c.code === oppCountryCode) || {
    code: oppCountryCode,
    name: oppCountryCode,
    flag: '🏏',
    rating: 85,
  };

  // AI Playing XI for Opponent (for preview)
  const oppAI = generateAIOpponentPlayingXI(oppCountryCode, fixture.pitch);
  const oppFullSquad = getAvailableWTCCountryPlayers(oppCountryCode);

  // Active Wizard Step
  const [activeStep, setActiveStep] = useState<WizardStep>('SELECT_XI');
  
  // Filter & Search
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Player IDs (Must be exactly 11 for match)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (preferredPlayingXI && preferredPlayingXI.length === 11) {
      const valid = preferredPlayingXI.filter((id) => fullSquad.some((p) => p.player_id === id));
      if (valid.length === 11) return valid;
    }
    return [];
  });

  // Batting Order (1 to 11)
  const [battingOrder, setBattingOrder] = useState<string[]>(() => {
    if (preferredBattingOrder && preferredBattingOrder.length === 11) {
      const valid = preferredBattingOrder.filter((id) => fullSquad.some((p) => p.player_id === id));
      if (valid.length === 11) return valid;
    }
    if (preferredPlayingXI && preferredPlayingXI.length === 11) {
      return [...preferredPlayingXI];
    }
    return [];
  });

  // Designated Captain ID
  const [captainId, setCaptainId] = useState<string>(() => {
    if (initialCaptainId && fullSquad.some((p) => p.player_id === initialCaptainId)) {
      return initialCaptainId;
    }
    return fullSquad[0]?.player_id || '';
  });

  // Designated Wicketkeeper ID
  const [wicketkeeperId, setWicketkeeperId] = useState<string>(() => {
    if (initialWkId && fullSquad.some((p) => p.player_id === initialWkId)) {
      return initialWkId;
    }
    const wkPlayer = fullSquad.find((p) => p.primary_role === 'Wicketkeeper-Batter');
    return wkPlayer?.player_id || '';
  });

  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Toggle selection of a player
  const handleTogglePlayer = (playerId: string) => {
    setWarningMessage(null);
    if (selectedIds.includes(playerId)) {
      // Remove player
      const nextSelected = selectedIds.filter((id) => id !== playerId);
      setSelectedIds(nextSelected);
      setBattingOrder((prev) => prev.filter((id) => id !== playerId));
      if (captainId === playerId) {
        setCaptainId(nextSelected[0] || '');
      }
      if (wicketkeeperId === playerId) {
        const nextWk = fullSquad.find(
          (p) => nextSelected.includes(p.player_id) && p.primary_role === 'Wicketkeeper-Batter'
        );
        setWicketkeeperId(nextWk?.player_id || '');
      }
    } else {
      // Add player
      if (selectedIds.length >= 11) {
        setWarningMessage('Playing XI is full (11/11). Remove a player first before adding another.');
        return;
      }
      const nextSelected = [...selectedIds, playerId];
      setSelectedIds(nextSelected);
      setBattingOrder((prev) => [...prev, playerId]);

      const playerObj = fullSquad.find((p) => p.player_id === playerId);
      if (!captainId && playerObj) {
        setCaptainId(playerId);
      }
      if (!wicketkeeperId && playerObj?.primary_role === 'Wicketkeeper-Batter') {
        setWicketkeeperId(playerId);
      }
    }
  };

  // Explicit remove button
  const handleRemovePlayer = (playerId: string) => {
    setWarningMessage(null);
    const nextSelected = selectedIds.filter((id) => id !== playerId);
    setSelectedIds(nextSelected);
    setBattingOrder((prev) => prev.filter((id) => id !== playerId));
    if (captainId === playerId) {
      setCaptainId(nextSelected[0] || '');
    }
    if (wicketkeeperId === playerId) {
      const nextWk = fullSquad.find(
        (p) => nextSelected.includes(p.player_id) && p.primary_role === 'Wicketkeeper-Batter'
      );
      setWicketkeeperId(nextWk?.player_id || '');
    }
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedIds([]);
    setBattingOrder([]);
    setCaptainId('');
    setWicketkeeperId('');
    setWarningMessage(null);
  };

  // Quick Auto-fill 11 Best Players (for convenience, user can still edit)
  const handleAutoFillBestXI = () => {
    setWarningMessage(null);
    const keepers = fullSquad.filter((p) => p.primary_role === 'Wicketkeeper-Batter');
    const batters = fullSquad.filter((p) => p.primary_role === 'Batter');
    const allRounders = fullSquad.filter((p) => p.primary_role === 'All-Rounder');
    const bowlers = fullSquad.filter((p) => p.primary_role === 'Bowler');

    const selection: string[] = [];

    // 1-5 Top Batters
    batters.slice(0, 5).forEach((p) => selection.push(p.player_id));
    // 6-7 All-Rounders
    allRounders.slice(0, 2).forEach((p) => {
      if (selection.length < 7) selection.push(p.player_id);
    });
    // Wicketkeeper
    if (keepers.length > 0 && !selection.includes(keepers[0].player_id)) {
      selection.push(keepers[0].player_id);
    }
    // Bowlers to reach 11
    bowlers.forEach((p) => {
      if (selection.length < 11 && !selection.includes(p.player_id)) {
        selection.push(p.player_id);
      }
    });
    // If still < 11, add remaining highest rated
    fullSquad.forEach((p) => {
      if (selection.length < 11 && !selection.includes(p.player_id)) {
        selection.push(p.player_id);
      }
    });

    const final11 = selection.slice(0, 11);
    setSelectedIds(final11);
    setBattingOrder(final11);
    setCaptainId(final11[0]);
    const chosenWk = fullSquad.find((p) => final11.includes(p.player_id) && p.primary_role === 'Wicketkeeper-Batter');
    setWicketkeeperId(chosenWk?.player_id || final11[final11.length - 1]);
  };

  // Reorder Batting positions
  const handleMoveOrder = (index: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === battingOrder.length - 1) return;

    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    const nextOrder = [...battingOrder];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIdx];
    nextOrder[targetIdx] = temp;
    setBattingOrder(nextOrder);
  };

  // Move a player to Opener (Slot 1 or Slot 2)
  const handleSetOpener = (playerId: string, slot: 1 | 2) => {
    const currentIdx = battingOrder.indexOf(playerId);
    if (currentIdx === -1) return;
    const nextOrder = [...battingOrder];
    nextOrder.splice(currentIdx, 1);
    if (slot === 1) {
      nextOrder.unshift(playerId);
    } else {
      nextOrder.splice(1, 0, playerId);
    }
    setBattingOrder(nextOrder);
  };

  // Selected Players details
  const selectedPlayers = fullSquad.filter((p) => selectedIds.includes(p.player_id));
  const batterCount = selectedPlayers.filter((p) => p.primary_role === 'Batter').length;
  const wkCount = selectedPlayers.filter((p) => p.primary_role === 'Wicketkeeper-Batter').length;
  const arCount = selectedPlayers.filter((p) => p.primary_role === 'All-Rounder').length;
  const bowlerCount = selectedPlayers.filter((p) => p.primary_role === 'Bowler').length;
  const totalBowlingOptions = arCount + bowlerCount;

  // Filtered Squad List
  const filteredSquad = fullSquad.filter((p) => {
    const matchesFilter =
      roleFilter === 'ALL'
        ? true
        : roleFilter === 'BAT'
        ? p.primary_role === 'Batter'
        : roleFilter === 'AR'
        ? p.primary_role === 'All-Rounder'
        : roleFilter === 'WK'
        ? p.primary_role === 'Wicketkeeper-Batter'
        : p.primary_role === 'Bowler';

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primary_role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Transition: Step 1 -> Step 2
  const handleProceedToBattingOrder = () => {
    if (selectedIds.length !== 11) {
      setWarningMessage(`Playing XI must have exactly 11 players. Currently selected: ${selectedIds.length}/11.`);
      return;
    }

    // Ensure battingOrder contains all 11 selected
    let currentOrder = [...battingOrder];
    selectedIds.forEach((id) => {
      if (!currentOrder.includes(id)) currentOrder.push(id);
    });
    currentOrder = currentOrder.filter((id) => selectedIds.includes(id));
    if (currentOrder.length !== 11) {
      currentOrder = selectedIds;
    }
    setBattingOrder(currentOrder);

    // Auto-designate default keeper if not selected yet
    if (!wicketkeeperId || !selectedIds.includes(wicketkeeperId)) {
      const keeperPlayer = selectedPlayers.find((p) => p.primary_role === 'Wicketkeeper-Batter');
      if (keeperPlayer) setWicketkeeperId(keeperPlayer.player_id);
      else if (selectedIds.length > 0) setWicketkeeperId(selectedIds[selectedIds.length - 1]);
    }

    // Auto-designate captain if not selected yet
    if (!captainId || !selectedIds.includes(captainId)) {
      setCaptainId(selectedIds[0] || '');
    }

    setActiveStep('BATTING_ORDER');
    setWarningMessage(null);
  };

  // Transition: Step 2 -> Step 3
  const handleProceedToMatchPreview = () => {
    if (selectedIds.length !== 11 || battingOrder.length !== 11) {
      setWarningMessage('Invalid selection. Please ensure 11 players are selected.');
      return;
    }
    setActiveStep('MATCH_PREVIEW');
    setWarningMessage(null);
  };

  // Final Confirmation: Step 3 -> Start Match
  const handleFinalConfirmAndStart = () => {
    if (selectedIds.length !== 11) {
      setWarningMessage(`Cannot start match. Please select exactly 11 players (${selectedIds.length}/11).`);
      return;
    }

    const finalOrder = battingOrder.length === 11 ? battingOrder : selectedIds;
    const finalCaptain = captainId && finalOrder.includes(captainId) ? captainId : finalOrder[0];
    const finalKeeper =
      wicketkeeperId && finalOrder.includes(wicketkeeperId)
        ? wicketkeeperId
        : finalOrder.find((id) => {
            const p = fullSquad.find((item) => item.player_id === id);
            return p?.primary_role === 'Wicketkeeper-Batter';
          }) || finalOrder[finalOrder.length - 1];

    onConfirmPlayingXI({
      playingXIIds: selectedIds,
      battingOrderIds: finalOrder,
      captainId: finalCaptain,
      wicketkeeperId: finalKeeper,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-xl overflow-y-auto">
      <div
        id="wtc-squad-selection-modal"
        className="relative w-full max-w-6xl rounded-3xl border border-white/15 bg-[#070b14]/98 p-4 sm:p-7 text-slate-100 backdrop-blur-2xl shadow-2xl space-y-4 my-auto max-h-[96vh] flex flex-col justify-between overflow-y-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-base">{userCountryInfo.flag}</span> {userCountryInfo.name} National Team
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold">
                Pitch: {fixture.pitch} • {fixture.venue}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>WTC Test Squad & Lineup Selection</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-black">
                Official Playing XI
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP TABS & STATUS BANNER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveStep('SELECT_XI')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeStep === 'SELECT_XI'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <span>1. Select Playing XI</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedIds.length === 11 ? 'bg-emerald-600 text-white' : 'bg-black/40 text-amber-300'
                }`}
              >
                {selectedIds.length}/11
              </span>
            </button>

            <button
              type="button"
              onClick={handleProceedToBattingOrder}
              disabled={selectedIds.length !== 11}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeStep === 'BATTING_ORDER'
                  ? 'bg-amber-400 text-black shadow-md'
                  : selectedIds.length === 11
                  ? 'bg-white/5 text-slate-300 hover:text-white'
                  : 'opacity-40 cursor-not-allowed bg-white/5 text-slate-500'
              }`}
            >
              <span>2. Batting Order (1-11) & Roles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleProceedToMatchPreview}
              disabled={selectedIds.length !== 11}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeStep === 'MATCH_PREVIEW'
                  ? 'bg-amber-400 text-black shadow-md'
                  : selectedIds.length === 11
                  ? 'bg-white/5 text-slate-300 hover:text-white'
                  : 'opacity-40 cursor-not-allowed bg-white/5 text-slate-500'
              }`}
            >
              <span>3. Match Preview & Toss</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Real-time Indicator */}
          <div className="flex items-center gap-2">
            {selectedIds.length === 0 ? (
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-white/10">
                Playing XI: 0/11 (Select 11 Players)
              </span>
            ) : selectedIds.length < 11 ? (
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 animate-pulse">
                Playing XI: {selectedIds.length}/11 ({11 - selectedIds.length} more needed)
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Playing XI Ready (11/11)
              </span>
            )}
          </div>
        </div>

        {/* WARNING ALERT */}
        {warningMessage && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* STEP 1: SQUAD POOL & 11 PLAYERS SELECTION */}
        {activeStep === 'SELECT_XI' && (
          <div className="space-y-3 flex-1 overflow-y-auto">
            {/* Quick Balance Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div
                className={`p-2 rounded-xl border ${
                  selectedIds.length === 11
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                    : 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                }`}
              >
                <div className="text-[10px] uppercase">XI Selected</div>
                <div className="text-base font-black">{selectedIds.length} / 11</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase text-slate-400">Batters</div>
                <div className="text-base font-black text-white">{batterCount}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase text-slate-400">Wicketkeeper</div>
                <div className={`text-base font-black ${wkCount > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                  {wkCount}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase text-slate-400">All-Rounders</div>
                <div className="text-base font-black text-amber-400">{arCount}</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase text-slate-400">Bowlers</div>
                <div className="text-base font-black text-purple-400">{bowlerCount}</div>
              </div>
            </div>

            {/* Controls Bar: Search, Filters, Auto-fill, Clear */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-black/40 p-2.5 rounded-2xl border border-white/10">
              {/* Role Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'BAT', 'WK', 'AR', 'BOWL'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setRoleFilter(tab)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                      roleFilter === tab
                        ? 'bg-amber-400 text-black font-black shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {tab === 'ALL'
                      ? `ALL (${fullSquad.length})`
                      : tab === 'BAT'
                      ? `Batters (${fullSquad.filter((p) => p.primary_role === 'Batter').length})`
                      : tab === 'WK'
                      ? `WK (${fullSquad.filter((p) => p.primary_role === 'Wicketkeeper-Batter').length})`
                      : tab === 'AR'
                      ? `All-Rounders (${fullSquad.filter((p) => p.primary_role === 'All-Rounder').length})`
                      : `Bowlers (${fullSquad.filter((p) => p.primary_role === 'Bowler').length})`}
                  </button>
                ))}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search player..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillBestXI}
                  className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                  title="Auto-select highest rated players"
                >
                  <Sparkles className="w-3 h-3" /> Auto Best 11
                </button>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                    title="Clear Selection"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Squad List + Live Selected XI Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-h-[48vh] overflow-y-auto">
              {/* Squad Pool Cards (8 Cols) */}
              <div className="lg:col-span-8 space-y-2 pr-1 overflow-y-auto max-h-[46vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredSquad.map((p) => {
                    const isSelected = selectedIds.includes(p.player_id);
                    const isCapt = captainId === p.player_id;
                    const isWk = wicketkeeperId === p.player_id;

                    return (
                      <div
                        key={p.player_id}
                        onClick={() => handleTogglePlayer(p.player_id)}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 select-none cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-[#0b1720] border-emerald-400 shadow-md shadow-emerald-950/40'
                            : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Checkbox / Toggle Indicator */}
                          <div
                            className={`h-7 w-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50'
                                : 'border border-white/20 bg-black/40 text-slate-500 hover:border-white/40'
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <UserPlus className="w-3.5 h-3.5" />}
                          </div>

                          {/* Rating Badge */}
                          <div className="h-7 w-7 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-[11px] text-amber-300 shrink-0">
                            {p.overall_rating}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-white truncate">{p.name}</span>
                              {isCapt && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[9px] font-black">
                                  (C)
                                </span>
                              )}
                              {isWk && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white text-[9px] font-black">
                                  (WK)
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              <span className="text-amber-300 font-semibold">{p.primary_role}</span> • {p.batting_style}
                            </div>
                            {p.bowling_style && (
                              <div className="text-[9px] text-slate-500 truncate">
                                Bowling: {p.bowling_style}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button: SELECT / REMOVE */}
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePlayer(p.player_id);
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                            }`}
                          >
                            {isSelected ? 'Remove' : '+ Select'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Playing XI Summary Sidebar (4 Cols) */}
              <div className="lg:col-span-4 bg-black/50 border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between overflow-y-auto max-h-[46vh]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-black uppercase text-white tracking-wider">
                        Confirmed Playing XI
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-black ${selectedIds.length === 11 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedIds.length} / 11
                    </span>
                  </div>

                  {selectedPlayers.length === 0 ? (
                    <div className="py-10 text-center text-slate-500 space-y-2">
                      <Users className="w-8 h-8 mx-auto opacity-30" />
                      <p className="text-xs font-bold text-slate-400">No players selected yet</p>
                      <p className="text-[11px] text-slate-600">
                        Click &quot;+ Select&quot; on any 11 players from the squad pool on the left.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                      {selectedPlayers.map((p, idx) => (
                        <div
                          key={p.player_id}
                          className="p-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-slate-400 text-[10px] w-4 font-bold">{idx + 1}.</span>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-[11px] truncate flex items-center gap-1">
                                <span>{p.name}</span>
                                {captainId === p.player_id && (
                                  <span className="text-amber-400 text-[9px] font-black">(C)</span>
                                )}
                                {wicketkeeperId === p.player_id && (
                                  <span className="text-blue-400 text-[9px] font-black">(WK)</span>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-400 truncate">
                                {p.primary_role} • {p.overall_rating} OVR
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePlayer(p.player_id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                            title="Remove Player"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Balance validation */}
                {selectedIds.length === 11 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    {wkCount === 0 && (
                      <div className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 p-1.5 rounded-lg flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>No specialist keeper selected. Designate one in next step.</span>
                      </div>
                    )}
                    {totalBowlingOptions < 4 && (
                      <div className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 p-1.5 rounded-lg flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Only {totalBowlingOptions} bowling options. Consider another bowler.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BATTING ORDER & ROLES (1 TO 11) */}
        {activeStep === 'BATTING_ORDER' && (
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[52vh]">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Configure Test Batting Lineup (1 to 11)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Positions #1 and #2 walk out as Opening Batters. Use the Up/Down buttons or Opener shortcuts to arrange the order.
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-slate-300 font-bold">Captain:</span>
                  <select
                    value={captainId}
                    onChange={(e) => setCaptainId(e.target.value)}
                    className="bg-black/80 border border-white/20 rounded-lg px-2.5 py-1 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  >
                    {selectedPlayers.map((p) => (
                      <option key={p.player_id} value={p.player_id}>
                        {p.name} ({p.primary_role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] text-slate-300 font-bold">Wicketkeeper:</span>
                  <select
                    value={wicketkeeperId}
                    onChange={(e) => setWicketkeeperId(e.target.value)}
                    className="bg-black/80 border border-white/20 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-300 focus:outline-none focus:border-blue-400"
                  >
                    {selectedPlayers.map((p) => (
                      <option key={p.player_id} value={p.player_id}>
                        {p.name} {p.primary_role === 'Wicketkeeper-Batter' ? '★ (Specialist WK)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reorder List (1 to 11) */}
            <div className="space-y-1.5">
              {battingOrder.map((id, index) => {
                const player = fullSquad.find((p) => p.player_id === id);
                if (!player) return null;
                const isCapt = captainId === player.player_id;
                const isWk = wicketkeeperId === player.player_id;

                let positionLabel = `Middle Order #${index + 1}`;
                let positionBadgeClass = 'bg-white/10 text-slate-300';
                if (index === 0) {
                  positionLabel = 'OPENING BATTER 1';
                  positionBadgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black';
                } else if (index === 1) {
                  positionLabel = 'OPENING BATTER 2';
                  positionBadgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black';
                } else if (index === 2) {
                  positionLabel = 'NO. 3 (TOP ORDER)';
                  positionBadgeClass = 'bg-blue-500/20 text-blue-300 font-bold';
                } else if (index >= 7) {
                  positionLabel = `LOWER ORDER #${index + 1}`;
                  positionBadgeClass = 'bg-purple-500/20 text-purple-300';
                }

                return (
                  <div
                    key={id}
                    className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono font-black text-amber-400 w-6 text-sm">
                        #{index + 1}
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${positionBadgeClass}`}>
                        {positionLabel}
                      </span>

                      <div className="min-w-0">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{player.name}</span>
                          {isCapt && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[9px] font-black">
                              CAPTAIN
                            </span>
                          )}
                          {isWk && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white text-[9px] font-black">
                              WICKETKEEPER
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {player.primary_role} • Rating {player.overall_rating} • {player.batting_style}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {index > 1 && (
                        <button
                          type="button"
                          onClick={() => handleSetOpener(player.player_id, 1)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 text-[10px] font-bold transition-colors cursor-pointer"
                          title="Make Opening Batter 1"
                        >
                          Opener
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'UP')}
                        disabled={index === 0}
                        title="Move Up in Batting Order"
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 cursor-pointer transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'DOWN')}
                        disabled={index === battingOrder.length - 1}
                        title="Move Down in Batting Order"
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 cursor-pointer transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: MATCH PREVIEW & FINAL VALIDATION */}
        {activeStep === 'MATCH_PREVIEW' && (
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[52vh]">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-black border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Official WTC Test Match Preview
                </span>
                <span className="text-xs text-slate-300 font-mono">5-Day Multi-Day Format</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase">{fixture.seriesName}</h3>
              <div className="text-xs text-slate-300 flex items-center gap-3">
                <span>📍 {fixture.venue}</span>
                <span>•</span>
                <span>Pitch: {fixture.pitch}</span>
                <span>•</span>
                <span>Weather: {fixture.weather}</span>
              </div>
            </div>

            {/* Side-by-Side Team Sheets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* User Team Sheet */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{userCountryInfo.flag}</span>
                    <span className="font-black text-sm text-amber-300 uppercase">
                      {userCountryInfo.name} (Your XI)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">11 Confirmed</span>
                </div>

                <div className="space-y-1 max-h-[220px] overflow-y-auto text-xs pr-1">
                  {battingOrder.map((id, idx) => {
                    const p = fullSquad.find((item) => item.player_id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-300">
                          <strong className="text-amber-400 font-mono mr-1.5">#{idx + 1}</strong>
                          {p.name} {captainId === id && '(C)'} {wicketkeeperId === id && '(WK)'}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.primary_role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Opponent Team Sheet */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{oppCountryInfo.flag}</span>
                    <span className="font-black text-sm text-slate-200 uppercase">
                      {oppCountryInfo.name} (Opponent XI)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">AI Tactical XI</span>
                </div>

                <div className="space-y-1 max-h-[220px] overflow-y-auto text-xs pr-1">
                  {oppAI.battingOrderIds.map((id, idx) => {
                    const p = oppFullSquad.find((item) => item.player_id === id) || oppFullSquad[0];
                    return (
                      <div key={id} className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-slate-300">
                          <strong className="text-slate-400 font-mono mr-1.5">#{idx + 1}</strong>
                          {p.name} {oppAI.captainId === id && '(C)'} {oppAI.wicketkeeperId === id && '(WK)'}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.primary_role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <div className="font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pre-Match Validation Checks Passed</span>
              </div>
              <div className="text-[11px] text-slate-300">
                ✓ 11 unique players verified in Team A and Team B lineup.
                <br />
                ✓ User manual batting order locked in position. AI will not re-order your team.
              </div>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="text-xs text-slate-400">
            {selectedIds.length === 11 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                11 Players Selected.
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Select 11 players to proceed ({selectedIds.length}/11 selected).
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {activeStep !== 'SELECT_XI' && (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 'MATCH_PREVIEW') setActiveStep('BATTING_ORDER');
                  else if (activeStep === 'BATTING_ORDER') setActiveStep('SELECT_XI');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {activeStep === 'SELECT_XI' && (
              <button
                type="button"
                onClick={handleProceedToBattingOrder}
                disabled={selectedIds.length !== 11}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Set Batting Order (11/11)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {activeStep === 'BATTING_ORDER' && (
              <button
                type="button"
                onClick={handleProceedToMatchPreview}
                disabled={selectedIds.length !== 11}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Match Preview</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {activeStep === 'MATCH_PREVIEW' && (
              <button
                type="button"
                onClick={handleFinalConfirmAndStart}
                disabled={selectedIds.length !== 11}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Match & Toss</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
