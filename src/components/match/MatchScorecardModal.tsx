import React, { useState } from 'react';
import { motion } from 'motion/react';
import { InningsScorecard } from '../../services/matchEngine/types';
import { X, Trophy, Shield, Zap, Flame } from 'lucide-react';

interface MatchScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  innings1: InningsScorecard;
  innings2?: InningsScorecard;
}

export const MatchScorecardModal: React.FC<MatchScorecardModalProps> = ({
  isOpen,
  onClose,
  innings1,
  innings2,
}) => {
  const [activeTab, setActiveTab] = useState<'innings1' | 'innings2'>('innings1');

  if (!isOpen) return null;

  const currentInnings = activeTab === 'innings1' ? innings1 : (innings2 || innings1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1021] via-[#101733] to-[#060a17] p-6 text-white shadow-2xl flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                OFFICIAL MATCH SCORECARD
              </div>
              <h2 className="text-xl font-black uppercase text-white">
                {currentInnings.battingTeamName} vs {currentInnings.bowlingTeamName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('innings1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'innings1'
                ? 'border border-indigo-500/40 bg-indigo-600 text-white shadow-md'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            1st Innings: {innings1.battingTeamName} ({innings1.totalRuns}/{innings1.totalWickets})
          </button>

          {innings2 && (
            <button
              onClick={() => setActiveTab('innings2')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'innings2'
                  ? 'border border-indigo-500/40 bg-indigo-600 text-white shadow-md'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              2nd Innings: {innings2.battingTeamName} ({innings2.totalRuns}/{innings2.totalWickets})
            </button>
          )}
        </div>

        {/* Scrollable scorecard content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
          
          {/* Batting Table */}
          <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
            <div className="bg-white/5 px-4 py-2.5 font-bold uppercase text-[11px] text-indigo-300 flex justify-between">
              <span>Batting Scorecard</span>
              <span>R (B) 4s 6s SR</span>
            </div>

            <div className="divide-y divide-white/5">
              {currentInnings.batters.map((b) => (
                <div key={b.playerId} className="px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{b.name}</span>
                      {b.isCaptain && <span className="text-[9px] text-amber-400 font-mono">(c)</span>}
                      {b.isWicketkeeper && <span className="text-[9px] text-indigo-400 font-mono">(wk)</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {b.dismissalText || (b.isOut ? 'out' : 'not out')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right font-mono">
                    <span className="font-black text-amber-400 text-sm">{b.runs}</span>
                    <span className="text-slate-400">({b.balls})</span>
                    <span className="text-slate-300">{b.fours}</span>
                    <span className="text-slate-300">{b.sixes}</span>
                    <span className="text-emerald-400 font-bold w-12">{b.strikeRate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Extras and Totals */}
            <div className="bg-white/5 px-4 py-2.5 border-t border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">
                Extras: <strong className="text-white">{currentInnings.extras.total}</strong> (w {currentInnings.extras.wides}, nb {currentInnings.extras.noBalls}, b {currentInnings.extras.byes}, lb {currentInnings.extras.legByes})
              </span>
              <span className="font-black text-white text-sm">
                Total: {currentInnings.totalRuns}/{currentInnings.totalWickets} ({currentInnings.totalOvers}.{currentInnings.ballsInCurrentOver} Ov)
              </span>
            </div>
          </div>

          {/* Bowling Table */}
          <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
            <div className="bg-white/5 px-4 py-2.5 font-bold uppercase text-[11px] text-indigo-300 flex justify-between">
              <span>Bowling Figures</span>
              <span>O M R W ECON</span>
            </div>

            <div className="divide-y divide-white/5">
              {currentInnings.bowlers
                .filter((bowler) => bowler.oversBowled > 0 || bowler.ballsBowledInOver > 0)
                .map((bw) => (
                  <div key={bw.playerId} className="px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="font-bold text-white">
                      {bw.name}
                    </div>

                    <div className="flex items-center gap-4 text-right font-mono">
                      <span className="text-slate-300">{bw.oversBowled}.{bw.ballsBowledInOver}</span>
                      <span className="text-slate-400">{bw.maidens}</span>
                      <span className="text-slate-300">{bw.runsConceded}</span>
                      <span className="font-black text-rose-400 text-sm">{bw.wickets}</span>
                      <span className="text-emerald-400 font-bold w-12">{bw.economyRate}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Fall of Wickets */}
          {currentInnings.fallOfWickets.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Fall of Wickets
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                {currentInnings.fallOfWickets.map((fow) => (
                  <span key={fow.wicketNumber} className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                    {fow.wicketNumber}-{fow.score} ({fow.playerName}, {fow.overs} ov)
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
