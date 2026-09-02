import React from 'react';
import { motion } from 'motion/react';
import { WTCState } from '../../../types';
import { WTC_COUNTRIES } from '../../../services/wtcData';
import {
  Trophy,
  Award,
  Sparkles,
  Star,
  CheckCircle2,
  Crown,
  Medal,
  Shield,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface WTCFinalCelebrationModalProps {
  state: WTCState;
  onClose: () => void;
}

export const WTCFinalCelebrationModal: React.FC<WTCFinalCelebrationModalProps> = ({
  state,
  onClose,
}) => {
  const isChampion = state.isChampion ?? false;
  const userCountryInfo = WTC_COUNTRIES.find((c) => c.code === state.userCountry)!;
  const awards = state.awards;
  const teamStats = state.teamStats || {
    totalRuns: 0,
    totalWickets: 0,
    centuriesScored: 0,
    fiveWicketHauls: 0,
    highestTeamScore: 'N/A',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#0e1628] via-[#080d19] to-black p-6 sm:p-8 text-slate-100 shadow-2xl shadow-amber-500/20 space-y-6 my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Animated Trophy Banner */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black mx-auto shadow-2xl shadow-amber-400/50 ring-4 ring-amber-400/30">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <Sparkles className="w-6 h-6 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest inline-block">
              ICC World Test Championship 2025–27
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {isChampion
                ? `${userCountryInfo.name} Are World Test Champions!`
                : 'ICC World Test Championship Final Concluded'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              {isChampion
                ? `After a gruelling 2-year cycle across 6 Test series and the Grand Final at Lord's, ${userCountryInfo.name} lifts the prestigious ICC Test Mace!`
                : `The 2025–27 WTC cycle concludes at Lord's Cricket Ground. Remarkable journey through 6 multi-day Test series.`}
            </p>
          </div>
        </div>

        {/* Tournament Awards Grid */}
        {awards && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Official ICC Tournament Honors & Awards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Player of the Tournament */}
              {awards.playerOfTheTournament && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Player of Tournament
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{awards.playerOfTheTournament.flag}</span>
                    <span className="truncate">{awards.playerOfTheTournament.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-2">
                    {awards.playerOfTheTournament.reason}
                  </div>
                </div>
              )}

              {/* Best Batter */}
              {awards.bestBatter && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5 text-blue-400" /> Top Run Scorer
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{awards.bestBatter.flag}</span>
                    <span className="truncate">{awards.bestBatter.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {awards.bestBatter.runs} Runs (Avg: {awards.bestBatter.avg})
                  </div>
                </div>
              )}

              {/* Best Bowler */}
              {awards.bestBowler && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-400" /> Top Wicket Taker
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{awards.bestBowler.flag}</span>
                    <span className="truncate">{awards.bestBowler.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {awards.bestBowler.wickets} Wickets (Avg: {awards.bestBowler.avg})
                  </div>
                </div>
              )}

              {/* Player of the Final */}
              {awards.playerOfTheFinal && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-emerald-400" /> Player of the Final
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{awards.playerOfTheFinal.flag}</span>
                    <span className="truncate">{awards.playerOfTheFinal.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {awards.playerOfTheFinal.performance}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* National Team Tournament Campaign Summary */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Team Runs</div>
            <div className="text-xl font-black text-white">{teamStats.totalRuns}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Team Wickets</div>
            <div className="text-xl font-black text-amber-400">{teamStats.totalWickets}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Centuries Scored</div>
            <div className="text-xl font-black text-blue-400">{teamStats.centuriesScored}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">5-Wicket Hauls</div>
            <div className="text-xl font-black text-emerald-400">{teamStats.fiveWicketHauls}</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Return to Championship Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
