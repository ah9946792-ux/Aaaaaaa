import React, { useState } from 'react';
import { MatchPlayerPerformance } from '../../services/matchEngine/types';
import {
  Shield,
  Zap,
  Flame,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ListOrdered,
  Users,
  Target,
  Sparkles,
} from 'lucide-react';

interface SquadSelectionPanelProps {
  teamName: string;
  squad: MatchPlayerPerformance[];
  playingXI: MatchPlayerPerformance[];
  gameMode?: 'career' | 'dream_team' | 'manager' | 'worldwide_tournament' | 'universe_special' | 'friendly';
  careerPlayerName?: string;
  onUpdatePlayingXI: (newXI: MatchPlayerPerformance[]) => void;
  onProceed: () => void;
}

export const SquadSelectionPanel: React.FC<SquadSelectionPanelProps> = ({
  teamName,
  squad,
  playingXI,
  gameMode = 'manager',
  careerPlayerName,
  onUpdatePlayingXI,
  onProceed,
}) => {
  const isCareerMode = gameMode === 'career';

  // Sub-tabs for team modes: 'SELECT_XI' vs 'BATTING_ORDER'
  const [activeTab, setActiveTab] = useState<'SELECT_XI' | 'BATTING_ORDER'>('BATTING_ORDER');

  // Currently selected player IDs
  const [selectedIds, setSelectedIds] = useState<string[]>(
    playingXI.map((p) => p.playerId)
  );

  // Ordered list of 11 players for batting order
  const [orderedXI, setOrderedXI] = useState<MatchPlayerPerformance[]>(() => {
    return [...playingXI];
  });

  const togglePlayer = (playerId: string) => {
    if (isCareerMode) return; // Career mode squad is locked by AI

    if (selectedIds.includes(playerId)) {
      if (selectedIds.length > 1) {
        const nextIds = selectedIds.filter((id) => id !== playerId);
        setSelectedIds(nextIds);
        setOrderedXI(orderedXI.filter((p) => p.playerId !== playerId));
      }
    } else {
      if (selectedIds.length < 11) {
        const nextIds = [...selectedIds, playerId];
        setSelectedIds(nextIds);
        const playerToAdd = squad.find((p) => p.playerId === playerId);
        if (playerToAdd) {
          setOrderedXI([...orderedXI, playerToAdd]);
        }
      }
    }
  };

  const movePlayer = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedXI.length) return;

    const updated = [...orderedXI];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update batting positions
    const reordered = updated.map((p, idx) => ({
      ...p,
      battingPosition: idx + 1,
    }));
    setOrderedXI(reordered);
  };

  const handleSetOpener = (playerId: string, openerSlot: 1 | 2) => {
    const playerIndex = orderedXI.findIndex((p) => p.playerId === playerId);
    if (playerIndex === -1) return;

    const updated = [...orderedXI];
    const player = updated.splice(playerIndex, 1)[0];
    if (openerSlot === 1) {
      updated.unshift(player);
    } else {
      // Slot 2
      updated.splice(1, 0, player);
    }

    const reordered = updated.map((p, idx) => ({
      ...p,
      battingPosition: idx + 1,
    }));
    setOrderedXI(reordered);
  };

  const handleSaveAndProceed = () => {
    if (isCareerMode) {
      onProceed();
      return;
    }

    // Ensure XI has 11 players
    if (orderedXI.length === 11) {
      onUpdatePlayingXI(orderedXI);
    } else {
      const fallbackXI = squad.filter((p) => selectedIds.includes(p.playerId));
      onUpdatePlayingXI(fallbackXI);
    }
    onProceed();
  };

  const isValid = selectedIds.length === 11 || isCareerMode;

  return (
    <div
      id="squad-selection-panel"
      className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1021] via-[#101733] to-[#060a17] p-6 sm:p-8 text-white shadow-2xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
            {isCareerMode ? 'CAREER SQUAD PREVIEW' : 'LINEUP & BATTING ORDER MANAGEMENT'}
          </span>
          <h2 className="text-2xl font-black uppercase text-white">
            {teamName} — {isCareerMode ? 'MATCH PLAYING XI' : 'PLAYING XI & ORDER'}
          </h2>
        </div>

        {!isCareerMode && (
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('BATTING_ORDER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'BATTING_ORDER'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Batting Order (1-11)</span>
            </button>

            <button
              onClick={() => setActiveTab('SELECT_XI')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'SELECT_XI'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Select Squad ({selectedIds.length}/11)</span>
            </button>
          </div>
        )}
      </div>

      {/* Career Mode Context Banner */}
      {isCareerMode && (
        <div className="p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900/40 flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              MY CAREER MODE — SINGLE PLAYER CONTROL
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              You are playing as <strong className="text-white">{careerPlayerName || 'Career Player'}</strong>. Team tactics, batting order, and other player selections are managed by the club's AI management.
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: BATTING ORDER (For Team Modes or Career Display) */}
      {(activeTab === 'BATTING_ORDER' || isCareerMode) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>POSITION & BATTER</span>
            <span>ROLE & ATTRIBUTES</span>
            {!isCareerMode && <span>REORDER CONTROLS</span>}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {orderedXI.map((player, idx) => {
              const isOpener = idx === 0 || idx === 1;
              const isUserPlayer = player.isUserPlayer;

              return (
                <div
                  key={player.playerId}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isUserPlayer
                      ? 'border-amber-500/60 bg-amber-950/30 ring-1 ring-amber-500/40'
                      : 'border-white/10 bg-slate-900/60 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isOpener ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white flex items-center gap-2 truncate">
                        <span>{player.name}</span>
                        {isOpener && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            OPENER {idx + 1}
                          </span>
                        )}
                        {player.isCaptain && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            CAPT
                          </span>
                        )}
                        {player.isWicketkeeper && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            WK
                          </span>
                        )}
                        {isUserPlayer && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{player.role}</span>
                        <span>•</span>
                        <span>Rating: {player.overallRating}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{player.condition}</span>
                      </div>
                    </div>
                  </div>

                  {!isCareerMode && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => movePlayer(idx, 'UP')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-colors"
                        title="Move Up in Batting Order"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        disabled={idx === orderedXI.length - 1}
                        onClick={() => movePlayer(idx, 'DOWN')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-colors"
                        title="Move Down in Batting Order"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {!isOpener && (
                        <button
                          onClick={() => handleSetOpener(player.playerId, 1)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-600 text-[10px] font-bold text-slate-300 hover:text-white transition-colors"
                          title="Promote to Opener 1"
                        >
                          Make Opener
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SELECT XI PLAYERS FROM SQUAD */}
      {activeTab === 'SELECT_XI' && !isCareerMode && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Select 11 players for the match Playing XI</span>
            <span className="font-mono font-bold text-indigo-400">
              {selectedIds.length} / 11 Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {squad.map((player) => {
              const isSelected = selectedIds.includes(player.playerId);

              return (
                <div
                  key={player.playerId}
                  onClick={() => togglePlayer(player.playerId)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between select-none ${
                    isSelected
                      ? 'border-indigo-500/60 bg-indigo-950/40 shadow-md ring-1 ring-indigo-500/30'
                      : 'border-white/5 bg-slate-900/40 opacity-70 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {player.overallRating}
                    </div>

                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {player.isWicketkeeper && (
                          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded">
                            WK
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{player.role}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{player.condition}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-white/20'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {!isValid && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please select exactly 11 players to finalize your Playing XI.</span>
        </div>
      )}

      {/* Action Button */}
      <button
        disabled={!isValid}
        onClick={handleSaveAndProceed}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:pointer-events-none text-white font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>{isCareerMode ? 'CONFIRM LINEUP & ENTER MATCH' : 'LOCK PLAYING XI & BATTING ORDER'}</span>
      </button>
    </div>
  );
};
