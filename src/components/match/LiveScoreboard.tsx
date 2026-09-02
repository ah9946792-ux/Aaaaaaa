import React from 'react';
import { InningsScorecard, MatchContextConfig, MatchFormat } from '../../services/matchEngine/types';
import { Shield, Zap, Flame, Award, CloudRain, Clock } from 'lucide-react';

interface LiveScoreboardProps {
  config: MatchContextConfig;
  currentInnings: InningsScorecard;
  otherInnings?: InningsScorecard;
  isSecondInnings: boolean;
  recentBalls: string[];
  isFreeHit: boolean;
  reviewsRemaining: number;
}

export const LiveScoreboard: React.FC<LiveScoreboardProps> = ({
  config,
  currentInnings,
  otherInnings,
  isSecondInnings,
  recentBalls,
  isFreeHit,
  reviewsRemaining,
}) => {
  const currentTotalLegalBalls = currentInnings.totalOvers * 6 + currentInnings.ballsInCurrentOver;
  const oversFormatted = `${currentInnings.totalOvers}.${currentInnings.ballsInCurrentOver}`;
  const maxOvers = config.maxOversPerInnings;

  const runsNeeded = currentInnings.target ? Math.max(0, currentInnings.target - currentInnings.totalRuns) : 0;
  const ballsRemaining = Math.max(0, maxOvers * 6 - currentTotalLegalBalls);
  const rrr = currentInnings.target && ballsRemaining > 0
    ? Number(((runsNeeded / ballsRemaining) * 6).toFixed(2))
    : 0;

  return (
    <div
      id="live-match-scoreboard"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0b0f19] p-4 sm:p-5 text-white shadow-2xl backdrop-blur-md"
    >
      {/* Top Banner: Match Metadata & Free Hit Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 font-bold uppercase text-[10px] text-indigo-300">
            {config.format} CRICKET
          </span>
          <span className="font-semibold text-slate-300 truncate max-w-xs sm:max-w-md">
            {config.competitionName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFreeHit && (
            <span className="animate-pulse rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-extrabold text-[10px] text-amber-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              FREE HIT
            </span>
          )}

          <span className="rounded bg-slate-800/80 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300">
            DRS: {reviewsRemaining} Left
          </span>

          <span className="text-[10px] text-slate-400 font-mono">
            {config.venue ? config.venue.split(',')[0] : 'Stadium'}
          </span>
        </div>
      </div>

      {/* Main Score & Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Batting Team & Big Score */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase truncate">
              {currentInnings.battingTeamName}
            </h2>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight font-mono">
              {currentInnings.totalRuns}/{currentInnings.totalWickets}
            </span>
            <span className="text-slate-300 text-sm font-semibold">
              ({oversFormatted} / {maxOvers} ov)
            </span>
          </div>
        </div>

        {/* Center: Match Situation / Chase Equation */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-center space-y-1">
          {isSecondInnings && currentInnings.target ? (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Target: {currentInnings.target} Runs
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">
                Need <span className="text-emerald-400 font-mono text-base">{runsNeeded}</span> runs in <span className="text-indigo-400 font-mono text-base">{ballsRemaining}</span> balls
              </div>
              <div className="flex justify-center gap-4 text-[10px] text-slate-400 font-mono mt-1">
                <span>CRR: {currentInnings.currentRunRate}</span>
                <span className="text-amber-400 font-bold">RRR: {rrr}</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                1st Innings — Setting Target
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Projected: <span className="font-bold text-white font-mono">{Math.round(currentInnings.currentRunRate * maxOvers)}</span> runs
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Current Run Rate: <span className="text-emerald-400 font-bold">{currentInnings.currentRunRate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Bowling Team & Recent Over Timeline */}
        <div className="flex flex-col items-start md:items-end space-y-2">
          <div className="text-xs text-slate-400">
            Fielding: <span className="font-bold text-slate-200">{currentInnings.bowlingTeamName}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">This Over:</span>
            {recentBalls.length === 0 ? (
              <span className="text-[10px] text-slate-500 italic">Starting over...</span>
            ) : (
              recentBalls.map((b, idx) => {
                const isW = b === 'W';
                const isSix = b === '6';
                const isFour = b === '4';
                const isExtra = b === 'Wd' || b === 'Nb';

                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-black font-mono shadow-sm transition-transform ${
                      isW
                        ? 'bg-rose-600 text-white animate-bounce'
                        : isSix
                        ? 'bg-purple-600 text-white ring-1 ring-purple-400'
                        : isFour
                        ? 'bg-emerald-600 text-white'
                        : isExtra
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-200 border border-white/10'
                    }`}
                  >
                    {b}
                  </span>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
