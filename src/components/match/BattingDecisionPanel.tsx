import React from 'react';
import { BattingDecisionType } from '../../services/matchEngine/types';
import { Shield, Zap, Flame, Compass, FastForward, Target, Sparkles } from 'lucide-react';

interface BattingDecisionPanelProps {
  onSelectShot: (shotType: BattingDecisionType) => void;
  strikerName: string;
  strikerRole?: string;
  strikerCondition?: string;
  bowlerName: string;
  bowlerRole?: string;
  isCareerPlayer?: boolean;
  disabled?: boolean;
}

export const BattingDecisionPanel: React.FC<BattingDecisionPanelProps> = ({
  onSelectShot,
  strikerName,
  strikerRole = 'Batter',
  strikerCondition = 'EXCELLENT',
  bowlerName,
  bowlerRole = 'Bowler',
  isCareerPlayer = false,
  disabled = false,
}) => {
  const options: Array<{
    type: BattingDecisionType;
    label: string;
    description: string;
    risk: 'Low' | 'Medium' | 'High' | 'Very High';
    reward: string;
    color: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'DEFEND',
      label: 'Solid Defense',
      description: 'Block down the line with full face of the bat. High safety against wicket-taking balls.',
      risk: 'Low',
      reward: '0 Runs (Safety)',
      color: 'border-slate-500/40 bg-slate-800/70 hover:bg-slate-700 text-slate-200',
      icon: <Shield className="w-4 h-4 text-slate-300" />,
    },
    {
      type: 'ROTATE_STRIKE',
      label: '1-2 Run Nudge',
      description: 'Soft hands drop-and-run into gaps to keep the scoreboard moving.',
      risk: 'Low',
      reward: '1 - 2 Runs',
      color: 'border-blue-500/40 bg-blue-950/50 hover:bg-blue-900/70 text-blue-200',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
    },
    {
      type: 'AGGRESSIVE_ATTACK',
      label: 'Gap Placement',
      description: 'Pierce the inner ring with placement and brisk running between wickets.',
      risk: 'Medium',
      reward: '2 - 3 Runs / Gap Drive',
      color: 'border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/70 text-cyan-200',
      icon: <Target className="w-4 h-4 text-cyan-400" />,
    },
    {
      type: 'DRIVE_FOUR',
      label: 'Power Boundary (4)',
      description: 'Step into the pitch with authority. Powerful drive over infield for four.',
      risk: 'Medium',
      reward: 'FOUR (4 Runs)',
      color: 'border-emerald-500/40 bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-200',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
    },
    {
      type: 'LOFTED_SIX',
      label: 'Lofted Maximum (6)',
      description: 'Full swing through the line to clear the ropes into the stands!',
      risk: 'Very High',
      reward: 'SIX (6 Runs)',
      color: 'border-purple-500/40 bg-purple-950/50 hover:bg-purple-900/70 text-purple-200',
      icon: <Flame className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <div
      id="batting-decision-panel"
      className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-md space-y-3 transition-all ${
        isCareerPlayer
          ? 'border-amber-500/50 bg-gradient-to-b from-slate-900/95 via-amber-950/20 to-slate-900/95 ring-1 ring-amber-500/30'
          : 'border-white/10 bg-slate-900/90'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {isCareerPlayer && (
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                isCareerPlayer ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {isCareerPlayer ? 'YOUR CAREER PLAYER AT CREASE' : 'BATTER SHOT EXECUTION'}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                {strikerCondition}
              </span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{strikerName}</span>
              <span className="text-xs text-slate-400 font-normal">facing {bowlerName} ({bowlerRole})</span>
            </h3>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">Select Shot Execution</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.type}
            disabled={disabled}
            onClick={() => onSelectShot(opt.type)}
            className={`flex flex-col items-start justify-between p-3 rounded-xl border transition-all text-left group hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md ${opt.color}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="p-1.5 rounded-lg bg-white/10">{opt.icon}</span>
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  opt.risk === 'Low'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : opt.risk === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {opt.risk}
              </span>
            </div>

            <div className="font-bold text-xs sm:text-sm text-white mt-1 group-hover:text-amber-300 transition-colors">
              {opt.label}
            </div>

            <div className="text-[10px] text-slate-300 line-clamp-2 mt-1 leading-tight">
              {opt.description}
            </div>

            <div className="mt-2 text-[10px] font-bold text-amber-300 font-mono">
              {opt.reward}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
