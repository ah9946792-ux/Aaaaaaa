import React from 'react';
import { motion } from 'motion/react';
import { FieldingEventAction } from '../../services/matchEngine/types';
import { Shield, Zap, Target, Sparkles, Compass } from 'lucide-react';

interface FieldingDecisionModalProps {
  isOpen: boolean;
  fielderName: string;
  batterName: string;
  eventType: 'CATCH' | 'RUN_OUT' | 'BOUNDARY_SAVE';
  difficulty: 'EASY' | 'MEDIUM' | 'DIFFICULT' | 'SPECTACULAR';
  onSelectAction: (action: FieldingEventAction) => void;
}

export const FieldingDecisionModal: React.FC<FieldingDecisionModalProps> = ({
  isOpen,
  fielderName,
  batterName,
  eventType,
  difficulty,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#0a0f1d] via-[#151c2e] to-[#080d1a] p-6 text-white shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                LIVE FIELDING EVENT
              </div>
              <h3 className="text-lg font-bold text-white uppercase">
                {eventType === 'CATCH' ? 'CATCH OPPORTUNITY!' : 'RUN-OUT CHANCE!'}
              </h3>
            </div>
          </div>

          <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-[10px] font-bold text-amber-300">
            {difficulty} DIFFICULTY
          </span>
        </div>

        {/* Situation description */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5 text-xs text-slate-200 leading-relaxed">
          <strong className="text-white">{batterName}</strong> mistimes an aerial shot towards{' '}
          <strong className="text-amber-400">{fielderName}</strong> in the deep! Choose your fielding action to secure the wicket or limit damage:
        </div>

        {/* Choice buttons */}
        <div className="space-y-2.5">
          {eventType === 'CATCH' ? (
            <>
              <button
                onClick={() => onSelectAction('SAFE_CATCH_POSITION')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-emerald-300">
                    Safe 2-Handed Cup Catch
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Settle feet underneath the high ball with standard technique.
                  </div>
                </div>
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              </button>

              <button
                onClick={() => onSelectAction('ATTEMPT_SPECTACULAR_CATCH')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-amber-300">
                    Full-Length Diving Catch
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Leap forward horizontally to snatch a half-chance off the turf!
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectAction('AGGRESSIVE_DIRECT_HIT')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-rose-300">
                    Fast Direct Hit at Stumps
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Bullet throw aimed at single stump. Big run-out reward!
                  </div>
                </div>
                <Target className="w-5 h-5 text-rose-400 shrink-0" />
              </button>

              <button
                onClick={() => onSelectAction('SAFE_THROW_TO_KEEPER')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-left transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-blue-300">
                    Controlled Throw to Keeper
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Safe chest-height return to prevent overthrows.
                  </div>
                </div>
                <Compass className="w-5 h-5 text-blue-400 shrink-0" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
