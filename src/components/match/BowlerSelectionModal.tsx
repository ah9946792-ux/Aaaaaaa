import React from 'react';
import { motion } from 'motion/react';
import { MatchPlayerPerformance } from '../../services/matchEngine/types';
import { Target, Zap, Shield, Sparkles, CheckCircle2, AlertCircle, Award } from 'lucide-react';

export interface BowlerEligibilityInfo {
  index: number;
  player: MatchPlayerPerformance;
  oversBowled: number;
  maxOvers: number;
  isOverLimit: boolean;
  isConsecutiveOver: boolean;
  isEligible: boolean;
  reason?: string;
}

interface BowlerSelectionModalProps {
  isOpen: boolean;
  overNumber: number;
  bowlers: BowlerEligibilityInfo[];
  recommendedBowler?: {
    index: number;
    player: MatchPlayerPerformance;
    reason: string;
  };
  onSelectBowler: (bowlerIndex: number) => void;
}

export const BowlerSelectionModal: React.FC<BowlerSelectionModalProps> = ({
  isOpen,
  overNumber,
  bowlers,
  recommendedBowler,
  onSelectBowler,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="bowler-selection-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#0b1021] via-[#101733] to-[#060a17] text-white shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                BOWLING ROTATION & TACTICS
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
                SELECT BOWLER FOR OVER {overNumber}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-xs font-mono text-slate-300">
              Max {bowlers[0]?.maxOvers || 4} Overs / Bowler
            </span>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {recommendedBowler && (
          <div className="p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    AI TACTICAL RECOMMENDATION
                  </span>
                  <span className="text-xs font-bold text-white">
                    {recommendedBowler.player.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Rating {recommendedBowler.player.overallRating}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {recommendedBowler.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectBowler(recommendedBowler.index)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shrink-0 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>USE RECOMMENDATION</span>
            </button>
          </div>
        )}

        {/* Bowler Selection Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Playing XI Bowling Options ({bowlers.filter((b) => b.isEligible).length} Available)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bowlers.map((b) => {
              const oversLeft = b.maxOvers - b.oversBowled;
              const isPacer = !b.player.role.includes('Spin');

              return (
                <div
                  key={b.player.playerId}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    b.isEligible
                      ? 'border-white/10 bg-slate-900/60 hover:border-indigo-500/60 hover:bg-slate-800/80 cursor-pointer shadow-md'
                      : 'border-white/5 bg-slate-950/40 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (b.isEligible) {
                      onSelectBowler(b.index);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        b.isEligible ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {b.player.overallRating}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{b.player.name}</span>
                          {b.player.isCaptain && (
                            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded">
                              C
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                          <span className={isPacer ? 'text-amber-400' : 'text-indigo-400'}>
                            {b.player.role}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{b.player.condition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        b.isEligible
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {b.oversBowled} / {b.maxOvers} ov
                      </span>
                    </div>
                  </div>

                  {/* Stats & Spell Summary */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="text-[11px] font-mono text-slate-300 flex items-center gap-2">
                      <span>
                        Wkts: <strong className="text-white">{b.player.wickets}</strong>
                      </span>
                      <span>
                        Runs: <strong className="text-white">{b.player.runsConceded}</strong>
                      </span>
                      <span>
                        Econ:{' '}
                        <strong className="text-indigo-300">
                          {b.player.economyRate ? b.player.economyRate.toFixed(1) : '0.0'}
                        </strong>
                      </span>
                    </div>

                    {b.isEligible ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBowler(b.index);
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
                      >
                        SELECT
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{b.reason}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
