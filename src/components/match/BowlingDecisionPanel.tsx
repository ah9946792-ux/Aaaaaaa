import React from 'react';
import { BowlingDeliveryChoice, FastBowlingDelivery, SpinBowlingDelivery } from '../../services/matchEngine/types';
import { Target, Zap, Shield, Sparkles, Wind, RotateCcw, ArrowDownRight, Compass } from 'lucide-react';

interface BowlingDecisionPanelProps {
  onSelectDelivery: (delivery: BowlingDeliveryChoice) => void;
  bowlerName: string;
  bowlerRole: string;
  bowlerCondition?: string;
  strikerName: string;
  isCareerPlayer?: boolean;
  disabled?: boolean;
}

export const BowlingDecisionPanel: React.FC<BowlingDecisionPanelProps> = ({
  onSelectDelivery,
  bowlerName,
  bowlerRole,
  bowlerCondition = 'EXCELLENT',
  strikerName,
  isCareerPlayer = false,
  disabled = false,
}) => {
  const isSpinner = bowlerRole.includes('Spin') || bowlerRole.includes('Orthodox');

  const fastOptions: Array<{
    type: FastBowlingDelivery;
    label: string;
    description: string;
    attributeEffect: string;
    color: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'YORKER',
      label: 'Toe-Crushing Yorker',
      description: 'Pin-point base of the stumps. High clean bowled / LBW potential.',
      attributeEffect: '+Accuracy / Clean Bowled',
      color: 'border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200',
      icon: <Target className="w-4 h-4 text-rose-400" />,
    },
    {
      type: 'GOOD_LENGTH',
      label: 'Corridor of Uncertainty',
      description: 'Test top of off-stump with tight discipline and seam movement.',
      attributeEffect: '+Control / Dot Ball & Edge',
      color: 'border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-blue-200',
      icon: <Shield className="w-4 h-4 text-blue-400" />,
    },
    {
      type: 'SLOWER_BALL',
      label: 'Deceptive Slower Ball',
      description: 'Disrupt batter timing. High false shot & caught opportunity.',
      attributeEffect: '+Variation / Mistimed Shot',
      color: 'border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    },
    {
      type: 'BOUNCER',
      label: 'Aggressive Bouncer',
      description: 'Hurried into ribs and helmet. Forces awkward pull/hook.',
      attributeEffect: '+Pace / Top Edge Catch',
      color: 'border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200',
      icon: <Wind className="w-4 h-4 text-amber-400" />,
    },
    {
      type: 'OUTSWINGER',
      label: 'Late Outswinger',
      description: 'Shape away from the right-hander towards slips cordon.',
      attributeEffect: '+Swing / Nick Behind',
      color: 'border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200',
      icon: <ArrowDownRight className="w-4 h-4 text-cyan-400" />,
    },
  ];

  const spinOptions: Array<{
    type: SpinBowlingDelivery;
    label: string;
    description: string;
    attributeEffect: string;
    color: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'OFF_BREAK',
      label: 'Standard Stock Turn',
      description: 'Sharp bite off the turf into right-handers.',
      attributeEffect: '+Turn / Bowled & LBW',
      color: 'border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-200',
      icon: <RotateCcw className="w-4 h-4 text-indigo-400" />,
    },
    {
      type: 'FLIGHTED_BALL',
      label: 'Tempting Flighted Loop',
      description: 'Give it air to draw batter out of the crease.',
      attributeEffect: '+Drift / Stumping & Caught',
      color: 'border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
    {
      type: 'GOOGLY',
      label: 'Hidden Googly / Carrom',
      description: 'Turn away unexpectedly from the original spin angle.',
      attributeEffect: '+Deception / Clean Bowled',
      color: 'border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
    },
    {
      type: 'ARM_BALL',
      label: 'Skidding Arm Ball',
      description: 'Fast straight dart sliding on with the arm.',
      attributeEffect: '+Pace Skid / LBW Plumb',
      color: 'border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200',
      icon: <Target className="w-4 h-4 text-cyan-400" />,
    },
    {
      type: 'LEG_BREAK',
      label: 'Ripping Leg Break',
      description: 'High revolutions producing fizzing drift and sharp turn.',
      attributeEffect: '+Turn / Slip Catcher',
      color: 'border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200',
      icon: <Compass className="w-4 h-4 text-rose-400" />,
    },
  ];

  const activeOptions = isSpinner ? spinOptions : fastOptions;

  return (
    <div
      id="bowling-decision-panel"
      className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-md space-y-3 transition-all ${
        isCareerPlayer
          ? 'border-indigo-500/50 bg-gradient-to-b from-slate-900/95 via-indigo-950/20 to-slate-900/95 ring-1 ring-indigo-500/30'
          : 'border-white/10 bg-slate-900/90'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {isCareerPlayer && (
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-ping" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                isCareerPlayer ? 'text-amber-400' : 'text-indigo-400'
              }`}>
                {isCareerPlayer ? 'YOUR CAREER BOWLER IN ATTACK' : `BOWLER EXECUTION (${isSpinner ? 'SPIN' : 'PACE'})`}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                {bowlerCondition}
              </span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{bowlerName} ({bowlerRole})</span>
              <span className="text-xs text-slate-400 font-normal">bowling to {strikerName}</span>
            </h3>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">Select Delivery Length & Variation</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {activeOptions.map((opt) => (
          <button
            key={opt.type}
            disabled={disabled}
            onClick={() => onSelectDelivery(opt.type as BowlingDeliveryChoice)}
            className={`flex flex-col items-start justify-between p-3 rounded-xl border transition-all text-left group hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-md ${opt.color}`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="p-1.5 rounded-lg bg-white/10">{opt.icon}</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                Active
              </span>
            </div>

            <div className="font-bold text-xs sm:text-sm text-white mt-1 group-hover:text-amber-300 transition-colors">
              {opt.label}
            </div>

            <div className="text-[10px] text-slate-300 line-clamp-2 mt-1 leading-tight">
              {opt.description}
            </div>

            <div className="mt-2 text-[10px] font-bold text-indigo-300 font-mono">
              {opt.attributeEffect}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
