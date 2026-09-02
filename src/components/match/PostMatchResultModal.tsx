import React from 'react';
import { motion } from 'motion/react';
import { CompletedMatchReport } from '../../services/matchEngine/types';
import { Trophy, Award, Zap, Shield, Star, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

interface PostMatchResultModalProps {
  isOpen: boolean;
  report: CompletedMatchReport;
  onContinue: () => void;
}

export const PostMatchResultModal: React.FC<PostMatchResultModalProps> = ({
  isOpen,
  report,
  onContinue,
}) => {
  if (!isOpen) return null;

  const potm = report.awards.manOfTheMatch;
  const bestBat = report.awards.bestBatter;
  const bestBowl = report.awards.bestBowler;
  const bestField = report.awards.bestFielder;

  const inn1 = report.innings1;
  const inn2 = report.innings2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#0b1021] via-[#121938] to-[#060914] p-6 sm:p-8 text-white shadow-2xl space-y-6 my-8"
      >
        {/* Victory Header */}
        <div className="text-center space-y-2 border-b border-white/10 pb-5">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="text-xs font-black uppercase tracking-widest text-amber-400">
            MATCH CONCLUDED — {report.competition}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {report.result.winnerName.toUpperCase()}
          </h1>

          <div className="text-sm font-bold text-emerald-400 font-mono">
            {report.result.marginText}
          </div>
        </div>

        {/* Both Innings Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Innings 1 */}
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">1st Innings</div>
            <div className="font-black text-base text-white truncate">{inn1.battingTeamName}</div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {inn1.totalRuns}/{inn1.totalWickets}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ({inn1.totalOvers}.{inn1.ballsInCurrentOver} overs) • CRR {inn1.currentRunRate}
            </div>
          </div>

          {/* Innings 2 */}
          {inn2 && (
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">2nd Innings</div>
              <div className="font-black text-base text-white truncate">{inn2.battingTeamName}</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {inn2.totalRuns}/{inn2.totalWickets}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ({inn2.totalOvers}.{inn2.ballsInCurrentOver} overs) • Target: {inn2.target || '-'}
              </div>
            </div>
          )}

        </div>

        {/* Man of the Match Spotlight */}
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900/90 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                PLAYER OF THE MATCH
              </span>
            </div>

            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-0.5 text-xs font-bold font-mono text-amber-300">
              {potm.points} Impact Rating
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-white">{potm.player.name}</div>
              <div className="text-xs text-slate-300">{potm.reason}</div>
            </div>
            <div className="text-right text-xs font-mono text-slate-300">
              <div>{potm.player.runs > 0 ? `${potm.player.runs} (${potm.player.balls}b)` : ''}</div>
              <div className="text-rose-400 font-bold">{potm.player.wickets > 0 ? `${potm.player.wickets}/${potm.player.runsConceded}` : ''}</div>
            </div>
          </div>
        </div>

        {/* Match Accolades Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          
          {/* Best Batter */}
          <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[9px] uppercase font-bold text-indigo-400">Best Batter</div>
            <div className="font-bold text-white truncate">{bestBat.player.name}</div>
            <div className="text-amber-400 font-mono font-bold">
              {bestBat.runs} runs (SR {bestBat.strikeRate})
            </div>
          </div>

          {/* Best Bowler */}
          <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[9px] uppercase font-bold text-rose-400">Best Bowler</div>
            <div className="font-bold text-white truncate">{bestBowl.player.name}</div>
            <div className="text-rose-300 font-mono font-bold">
              {bestBowl.wickets} wickets (Econ {bestBowl.economy})
            </div>
          </div>

          {/* Best Fielder */}
          <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
            <div className="text-[9px] uppercase font-bold text-emerald-400">Top Fielder</div>
            <div className="font-bold text-white truncate">{bestField.player.name}</div>
            <div className="text-emerald-300 font-mono font-bold">
              {bestField.catches} Catches
            </div>
          </div>

        </div>

        {/* Continue to mode button */}
        <button
          id="post-match-continue-btn"
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm uppercase tracking-wider shadow-xl transition-all active:scale-[0.99]"
        >
          <span>CONTINUE TO DASHBOARD</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </motion.div>
    </div>
  );
};
