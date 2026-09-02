import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Shield, Sparkles, Activity } from 'lucide-react';

interface AndroidSplashScreenProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export const AndroidSplashScreen: React.FC<AndroidSplashScreenProps> = ({
  onComplete,
  minDurationMs = 1800,
}) => {
  const [progress, setProgress] = useState(15);
  const [loadingText, setLoadingText] = useState('Initializing Cricket Engine...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setLoadingText('Loading Player Database & Stats...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(80);
      setLoadingText('Syncing WTC Tournaments & Profiles...');
    }, 900);

    const t3 = setTimeout(() => {
      setProgress(100);
      setLoadingText('Ready for First Ball!');
    }, 1400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, minDurationMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(completeTimer);
    };
  }, [minDurationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#020617] text-white p-6 select-none overflow-hidden pt-[env(safe-area-inset-top,24px)] pb-[env(safe-area-inset-bottom,24px)]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 pt-4"
      >
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Android Native Edition • v2.5.0</span>
        </span>
      </motion.div>

      {/* Center Hero Icon & Title */}
      <div className="flex flex-col items-center text-center space-y-5 my-auto">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="relative group"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0b1329] border-2 border-amber-400/60 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/src/assets/images/cricket_app_icon_1788190504464.jpg"
              alt="Cricket Universe App Icon"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent">
            Cricket Universe
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Realistic Match Physics • WTC Special • Dream Team • Manager Mode
          </p>
        </motion.div>
      </div>

      {/* Bottom Loading Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-xs space-y-2.5 pb-6 text-center"
      >
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            {loadingText}
          </span>
          <span className="font-mono text-slate-300">{progress}%</span>
        </div>

        {/* Progress Track */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        <div className="text-[10px] text-slate-500">
          Powered by Deep Physics Engine & ICC Test Rules
        </div>
      </motion.div>
    </div>
  );
};
