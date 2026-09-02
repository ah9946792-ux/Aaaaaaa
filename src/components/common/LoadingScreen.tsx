import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

const CRICKET_TIPS = [
  'Tip: Pitch conditions dramatically affect seam and bounce on day one.',
  'Tip: Balance your fantasy XI with genuine all-rounders for maximum squad versatility.',
  'Tip: In Manager mode, rotate fast bowlers during high-intensity tournament weeks.',
  'Tip: Super-Over showdowns require high boundary-strike rate batsmen.',
  'Tip: Cloud profiles ensure your progress stays synchronized across all your devices.',
  'Tip: World Cup group stages reward consistent net run rate performance.',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'CONNECTING TO CRICKET UNIVERSE...',
  subMessage = 'Synchronizing player profile and arena data',
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CRICKET_TIPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="cricket-universe-loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] px-4 text-center select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e3a8a_0%,transparent_50%)] opacity-40" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Logo */}
        <Logo size="lg" showSubtitle={true} className="mb-8" />

        {/* Animated Cricket Ball Spinner with Spinning Seam */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Orbital glowing pulse ring */}
          <div className="absolute h-24 w-24 rounded-full border border-emerald-500/20 bg-emerald-500/5 animate-ping" />
          <div className="absolute h-20 w-20 rounded-full border border-emerald-500/40 animate-pulse" />

          {/* Rotating Ball */}
          <div className="relative h-16 w-16 animate-spin duration-1000">
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">
              <defs>
                <radialGradient id="spin-ball" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="45%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#7F1D1D" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="28" fill="url(#spin-ball)" />
              {/* Curved Seam */}
              <path d="M12 20 Q32 32 52 44" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
              {/* Seam Stitches */}
              <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round">
                <line x1="16" y1="18" x2="18" y2="24" />
                <line x1="24" y1="23" x2="26" y2="29" />
                <line x1="32" y1="28" x2="34" y2="34" />
                <line x1="40" y1="33" x2="42" y2="39" />
                <line x1="48" y1="38" x2="50" y2="44" />
              </g>
            </svg>
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-base sm:text-lg font-black tracking-widest text-white uppercase mb-1">
          {message}
        </h2>
        <p className="text-xs text-slate-400 mb-6">{subMessage}</p>

        {/* Progress Bar Animation */}
        <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10 mb-6">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 w-full animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Rotating Cricket Tip */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
          <p className="text-xs text-slate-300 italic transition-all duration-300">
            {CRICKET_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};
