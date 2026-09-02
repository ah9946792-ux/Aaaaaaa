import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CurrentScreen, GameModeId } from '../../types';
import { ModeIcon } from '../common/ModeIcons';
import {
  ChevronRight,
  Sparkles,
  Shield,
  ArrowRight,
  Trophy,
  Database,
  Globe,
  Smartphone,
  Download,
  CheckCircle,
} from 'lucide-react';

interface HomeScreenProps {
  onSelectMode: (mode: CurrentScreen) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenApkModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMode,
  onOpenProfile,
  onOpenApkModal,
}) => {
  const { user, lastLoginMessage } = useAuth();

  return (
    <div
      id="cricket-universe-home-screen"
      className="relative min-h-full w-full p-4 sm:p-8 flex flex-col justify-center gap-6 max-w-7xl mx-auto"
    >
      {/* Welcome & Player Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenProfile}
            className="relative shrink-0 group focus:outline-none"
            title="Open Profile"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/20 overflow-hidden ring-2 ring-emerald-500/40 transition-transform group-hover:scale-105">
              <img
                src={user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id}`}
                alt={user?.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-black ring-2 ring-black">
              ✓
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Welcome back, {user?.displayName || 'Player'}
              </h1>
              <span className="rounded bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {user?.gameProgress?.rankTitle || 'Rookie Cricketer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lastLoginMessage || 'Select a simulation arena to begin your match journey.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
          {onOpenApkModal && (
            <button
              id="home-get-apk-btn"
              onClick={onOpenApkModal}
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors shadow-sm"
              title="Download Android APK (v2.5.0)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download APK</span>
            </button>
          )}

          <button
            id="home-view-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/40 px-3.5 py-1.5 text-xs font-bold text-slate-200 transition-colors"
          >
            <span>Player ID: {user?.id}</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col mb-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[0.3em] text-blue-400 font-bold mb-1">
            Game Center
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Season 1 Active</span>
          </div>
        </div>
        <div className="h-[2px] w-12 bg-emerald-500 rounded-full" />
      </div>

      {/* Game Mode Cards Grid - Immersive UI Pattern */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: MY CAREER */}
        <button
          id="mode-card-career"
          onClick={() => onSelectMode('career')}
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 hover:border-emerald-500/50 hover:bg-white/15 transition-all text-left overflow-hidden cursor-pointer"
        >
          {/* Top watermark background */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <ModeIcon modeId="career" size={96} />
          </div>

          <div>
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 w-fit">
              <ModeIcon modeId="career" size={32} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold tracking-tight text-white uppercase">
                MY CAREER
              </h3>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Flagship
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
              Build your journey from rising club cricketer to an international legend.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors w-full">
            <span className="uppercase tracking-wider text-[11px]">Enter Career</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: DREAM TEAM */}
        <button
          id="mode-card-dream_team"
          onClick={() => onSelectMode('dream_team')}
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 hover:border-blue-500/50 hover:bg-white/15 transition-all text-left overflow-hidden cursor-pointer"
        >
          {/* Watermark */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <ModeIcon modeId="dream_team" size={96} />
          </div>

          <div>
            <div className="mb-6 p-3 rounded-xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30 w-fit">
              <ModeIcon modeId="dream_team" size={32} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold tracking-tight text-white uppercase">
                DREAM TEAM
              </h3>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Fantasy XI
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
              Recruit elite players, craft chemistry, and assemble the ultimate cricket squad.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors w-full">
            <span className="uppercase tracking-wider text-[11px]">Enter Dream Team</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: MANAGER MODE */}
        <button
          id="mode-card-manager"
          onClick={() => onSelectMode('manager')}
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 hover:border-amber-500/50 hover:bg-white/15 transition-all text-left overflow-hidden cursor-pointer"
        >
          {/* Watermark */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <ModeIcon modeId="manager" size={96} />
          </div>

          <div>
            <div className="mb-6 p-3 rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30 w-fit">
              <ModeIcon modeId="manager" size={32} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold tracking-tight text-white uppercase">
                MANAGER MODE
              </h3>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Tactical
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
              Mastermind world-class tactics, handle contracts, and manage franchise operations.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-amber-400 transition-colors w-full">
            <span className="uppercase tracking-wider text-[11px]">Enter Manager Mode</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 4: WORLDWIDE TOURNAMENT (Wide Featured 2-Column Banner) */}
        <button
          id="mode-card-worldwide_tournament"
          onClick={() => onSelectMode('worldwide_tournament')}
          className="col-span-1 md:col-span-2 group relative flex flex-col sm:flex-row items-start sm:items-center p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900/60 to-slate-950/80 border border-white/10 hover:border-blue-400/40 hover:bg-white/10 transition-all text-left overflow-hidden cursor-pointer shadow-lg"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 text-blue-400 mr-0 sm:mr-6 mb-4 sm:mb-0 shrink-0 ring-1 ring-white/10">
            <ModeIcon modeId="worldwide_tournament" size={48} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase italic text-white">
                Worldwide Tournament
              </h3>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase text-slate-400 border border-white/10">
                Standby
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              No tournaments are currently available. Check back soon for upcoming global championships and sanctioned international tours.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center text-slate-400 group-hover:text-white transition-colors shrink-0">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </button>

        {/* Card 5: UNIVERSE SPECIAL */}
        <button
          id="mode-card-universe_special"
          onClick={() => onSelectMode('universe_special')}
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-amber-950/20 via-slate-900 to-black border border-amber-500/30 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all text-left overflow-hidden cursor-pointer"
        >
          {/* Watermark */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <ModeIcon modeId="universe_special" size={96} />
          </div>

          <div>
            <div className="mb-6 p-3 rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30 w-fit">
              <ModeIcon modeId="universe_special" size={32} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold tracking-tight text-white uppercase">
                UNIVERSE SPECIAL
              </h3>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                WTC 2025–27
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-[240px]">
              ICC World Test Championship 2025–27: Lead your nation through 6 multi-day Test series to lift the Test Mace at Lord&apos;s.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-amber-400 transition-colors w-full">
            <span className="uppercase tracking-wider text-[11px]">Enter WTC 2025–27</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 6: GLOBAL PLAYER DATABASE */}
        <button
          id="mode-card-database"
          onClick={() => onSelectMode('database')}
          className="col-span-1 md:col-span-2 lg:col-span-3 group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-white/10 transition-all text-left overflow-hidden cursor-pointer shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0 ring-1 ring-emerald-500/40">
              <Database className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-black tracking-tight text-white uppercase italic">
                  GLOBAL PLAYER DATABASE
                </h3>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  700+ Players
                </span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  20 Countries
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Browse, search, and analyze verified player profiles, career records, attribute radars, and market valuations across all 20 international cricket nations.
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0">
            <span>EXPLORE ROSTERS</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Dedicated Android APK Download Banner */}
        {onOpenApkModal && (
          <div
            id="home-apk-download-banner"
            onClick={onOpenApkModal}
            className="col-span-1 md:col-span-2 lg:col-span-3 group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-slate-900/60 to-cyan-950/30 border border-emerald-500/40 hover:border-emerald-400 hover:bg-white/10 transition-all text-left overflow-hidden cursor-pointer shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0 ring-1 ring-emerald-500/40">
                <Smartphone className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                    CRICKET UNIVERSE MOBILE APP (ANDROID)
                  </h3>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ⚡ 1-Click Install
                  </span>
                  <span className="hidden sm:inline text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    No Parse Error
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  মোবাইল ফোনে সরাসরি ইনস্টল করুন (বাটন চাপলেই কোনো পার্সিং এরর ছাড়া অ্যাপ ইনস্টল হবে) অথবা স্ট্যান্ডঅ্যালোন APK ডাউনলোড করুন।
                </p>
              </div>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wide shrink-0 transition-colors shadow-sm">
              <Smartphone className="w-4 h-4 text-black" />
              <span>INSTALL / APK</span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Meta Guarantee */}
      <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            All 5 game modes are modularized and permanently bound to your authenticated Google account profile.
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 shrink-0">
          ENGINE: CRICKET_UNIVERSE_CORE_V1
        </span>
      </div>

    </div>
  );
};
