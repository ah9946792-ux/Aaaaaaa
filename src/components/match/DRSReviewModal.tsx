import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DRSReviewState } from '../../services/matchEngine/types';
import { Shield, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';

interface DRSReviewModalProps {
  drs: DRSReviewState;
  isOpen: boolean;
  onComplete: (isOut: boolean) => void;
}

export const DRSReviewModal: React.FC<DRSReviewModalProps> = ({
  drs,
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState<'intro' | 'pitching' | 'impact' | 'wickets' | 'decision'>('intro');

  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      const t1 = setTimeout(() => setStep('pitching'), 1000);
      const t2 = setTimeout(() => setStep('impact'), 2200);
      const t3 = setTimeout(() => setStep('wickets'), 3400);
      const t4 = setTimeout(() => setStep('decision'), 4600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFinalOut = drs.finalDecision === 'OUT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-[#0a0f1d] via-[#111827] to-[#05070e] text-white shadow-2xl p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Eye className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-indigo-400">
                BALL-TRACKING SYSTEM
              </div>
              <h2 className="text-xl font-black uppercase text-white">
                DRS DECISION REVIEW
              </h2>
            </div>
          </div>

          <div className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono text-slate-300 border border-white/10">
            {drs.reviewType}
          </div>
        </div>

        {/* 3D Simulation Pitch Visual */}
        <div className="relative h-44 w-full rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/90 overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Pitch markings */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-16 border-y border-dashed border-indigo-400/30 bg-emerald-950/20 rounded" />
          
          {/* Stumps */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <div className="w-1.5 h-12 bg-amber-400 rounded-t shadow-lg" />
            <div className="w-1.5 h-12 bg-amber-400 rounded-t shadow-lg" />
            <div className="w-1.5 h-12 bg-amber-400 rounded-t shadow-lg" />
          </div>

          {/* Trajectory Pulse */}
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              animate={{ x: [0, 80, 160], opacity: [0.4, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="h-4 w-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] border border-white"
            />
          </div>

          <div className="absolute bottom-2 inset-x-4 flex justify-between text-[10px] font-mono text-slate-400">
            <span>RELEASE</span>
            <span>PITCHING ZONE</span>
            <span>IMPACT POINT</span>
            <span>STUMPS</span>
          </div>
        </div>

        {/* 3-Point Hawk-Eye Status Cards */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* 1. Pitching */}
          <div className={`p-3 rounded-xl border text-center transition-all ${
            step !== 'intro'
              ? 'border-indigo-500/40 bg-indigo-950/40 text-white'
              : 'border-white/5 bg-slate-900/40 text-slate-500'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">1. Pitching</div>
            <div className="text-xs font-black mt-1 font-mono">
              {step === 'intro' ? '...' : drs.pitching.replace('_', ' ')}
            </div>
            {step !== 'intro' && (
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400">
                VALID
              </span>
            )}
          </div>

          {/* 2. Impact */}
          <div className={`p-3 rounded-xl border text-center transition-all ${
            step === 'impact' || step === 'wickets' || step === 'decision'
              ? 'border-indigo-500/40 bg-indigo-950/40 text-white'
              : 'border-white/5 bg-slate-900/40 text-slate-500'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">2. Impact</div>
            <div className="text-xs font-black mt-1 font-mono">
              {step === 'intro' || step === 'pitching' ? '...' : drs.impact.replace('_', ' ')}
            </div>
            {(step === 'impact' || step === 'wickets' || step === 'decision') && (
              <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400">
                IN LINE
              </span>
            )}
          </div>

          {/* 3. Wickets */}
          <div className={`p-3 rounded-xl border text-center transition-all ${
            step === 'wickets' || step === 'decision'
              ? isFinalOut
                ? 'border-rose-500/40 bg-rose-950/40 text-rose-200'
                : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
              : 'border-white/5 bg-slate-900/40 text-slate-500'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">3. Wickets</div>
            <div className="text-xs font-black mt-1 font-mono">
              {step === 'wickets' || step === 'decision' ? drs.wickets : '...'}
            </div>
            {(step === 'wickets' || step === 'decision') && (
              <span className={`inline-block mt-1 text-[9px] font-bold ${
                isFinalOut ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {drs.wickets}
              </span>
            )}
          </div>

        </div>

        {/* Final Decision Outcome Banner */}
        <AnimatePresence>
          {step === 'decision' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-2xl border text-center space-y-2 ${
                isFinalOut
                  ? 'border-rose-500/60 bg-rose-950/60 text-white'
                  : 'border-emerald-500/60 bg-emerald-950/60 text-white'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-widest text-slate-300">
                THIRD UMPIRE OFFICIAL RULING
              </div>
              <div className="text-3xl font-black font-mono tracking-tight">
                {drs.finalDecision}
              </div>
              <p className="text-xs text-slate-200">{drs.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
        <button
          disabled={step !== 'decision'}
          onClick={() => onComplete(isFinalOut)}
          className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none text-white shadow-lg transition-all"
        >
          {step === 'decision' ? 'CONFIRM DRS DECISION' : 'ANALYZING TRAJECTORY...'}
        </button>

      </motion.div>
    </div>
  );
};
