import React from 'react';
import { ManagerClubData } from '../../types';
import {
  Trophy,
  Award,
  Crown,
  Flame,
  Medal,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface ClubHistoryTabProps {
  club: ManagerClubData;
}

export const ClubHistoryTab: React.FC<ClubHistoryTabProps> = ({ club }) => {
  return (
    <div id="club-history-tab" className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            CLUB HERITAGE & RECORDS
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic">
            TROPHY CABINET & HONORS
          </h2>
          <p className="text-xs text-slate-300">
            Historical milestones, all-time individual stats, and career silverware.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 shrink-0">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Silverware</div>
            <div className="text-lg font-black text-white">{club.trophies.length} Trophies</div>
          </div>
        </div>
      </div>

      {/* Trophy Showcase */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-black text-white uppercase italic flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>OFFICIAL TROPHY CABINET</span>
        </h3>

        {club.trophies.length === 0 ? (
          <div className="py-10 text-center text-slate-400 rounded-xl bg-slate-900/40 border border-dashed border-white/10 space-y-2">
            <Trophy className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-xs font-semibold">Trophy cabinet awaiting inaugural silverware.</p>
            <p className="text-[11px] text-slate-500">
              Win Division League Titles and Global Multiplayer Cups to fill the cabinet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {club.trophies.map((trophy, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-center space-y-2"
              >
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="font-bold text-white text-sm">{trophy.title}</div>
                <div className="text-xs text-amber-300">{trophy.competition}</div>
                <div className="text-[10px] text-slate-400">{trophy.season}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All-Time Club Records */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-black text-white uppercase italic flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>ALL-TIME CLUB MILESTONES & RECORDS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">All-Time Top Run Scorer</div>
            <div className="text-base font-black text-amber-400">
              {club.records.allTimeTopScorer}
            </div>
            <div className="text-xs text-slate-400">
              {club.records.allTimeTopScorerRuns} Total Career Runs
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">All-Time Top Wicket Taker</div>
            <div className="text-base font-black text-emerald-400">
              {club.records.allTimeTopBowler}
            </div>
            <div className="text-xs text-slate-400">
              {club.records.allTimeTopBowlerWickets} Total Career Wickets
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Longest Win Streak</div>
            <div className="text-base font-black text-purple-400">
              {club.records.longestWinStreak} Consecutive Victories
            </div>
            <div className="text-xs text-slate-400">Across all competitive matches</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Manager Career Record</div>
            <div className="text-base font-black text-white">
              {club.managerStats.totalWins}W - {club.managerStats.totalLosses}L
            </div>
            <div className="text-xs text-slate-400">
              {club.managerStats.winPercentage}% Win Rate ({club.managerStats.totalMatches} Matches)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Boardroom Confidence</div>
            <div className="text-base font-black text-emerald-400">
              {club.managerStats.boardConfidence}%
            </div>
            <div className="text-xs text-slate-400">Directorate Rating: Secure</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Pyramid Reputation</div>
            <div className="text-base font-black text-amber-400">
              {club.reputation} REP
            </div>
            <div className="text-xs text-slate-400">Tier {club.tierLevel} Classification</div>
          </div>
        </div>
      </div>

    </div>
  );
};
