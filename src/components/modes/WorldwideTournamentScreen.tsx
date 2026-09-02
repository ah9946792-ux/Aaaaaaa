import React from 'react';
import { ArrowLeft, Globe, Shield, Calendar, Sparkles, Trophy, Info } from 'lucide-react';

interface WorldwideTournamentScreenProps {
  onBack: () => void;
}

export const WorldwideTournamentScreen: React.FC<WorldwideTournamentScreenProps> = ({
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-[#0a1020] to-slate-950 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Menu
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
            <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
              Worldwide Tournament
            </h1>
          </div>
        </div>
      </header>

      {/* Empty State Hub Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center my-auto">
        <div className="relative mb-6">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500/20 via-slate-900 to-black border border-white/10 flex items-center justify-center text-blue-400 mx-auto shadow-2xl">
            <Globe className="w-12 h-12 stroke-[1.5]" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-slate-400">
            <Info className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2 max-w-lg mb-8">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[11px] font-bold uppercase tracking-wider inline-block">
            Worldwide Circuit
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            No tournaments are currently available.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            No tournaments have been scheduled in the Worldwide Tournament circuit yet. Check back soon for upcoming global championships and sanctioned international tours.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md w-full text-left space-y-2 text-xs text-slate-400">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" /> Mode Status
          </div>
          <p className="leading-snug">
            All unauthorized demo events and placeholder tournaments have been cleared. Tournament schedules will unlock when official worldwide competitions are announced.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-8 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
        >
          Return to Main Menu
        </button>
      </main>
    </div>
  );
};
