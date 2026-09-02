import React from 'react';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { CurrentScreen } from '../../types';
import { Coins, Gem, Settings, User, LogOut, Shield, Database, Smartphone, Download } from 'lucide-react';

interface HeaderProps {
  currentScreen: CurrentScreen;
  onNavigate: (screen: CurrentScreen) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenApkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenSettings,
  onOpenProfile,
  onOpenApkModal,
}) => {
  const { user, logout } = useAuth();

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/40 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Logo (clickable to return home) */}
        <button
          id="header-home-btn"
          onClick={() => onNavigate('home')}
          className="group flex items-center transition-transform hover:scale-[1.02] focus:outline-none text-left"
          title="Return to Cricket Universe Home"
        >
          <Logo size="sm" showSubtitle={false} className="sm:hidden" />
          <Logo size="md" showSubtitle={true} className="hidden sm:inline-flex" />
        </button>

        {/* Center/Right: User Status & Quick Actions */}
        {user ? (
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Currency Pill: Coins & Gems */}
            <div className="hidden lg:flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.currency?.coins?.toLocaleString() ?? 1000}</span>
              </div>
              <div className="h-3 w-[1px] bg-white/10" />
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Gem className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.currency?.gems?.toLocaleString() ?? 50}</span>
              </div>
            </div>

            {/* Database Browser Button */}
            <button
              id="header-database-btn"
              onClick={() => onNavigate('database')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                currentScreen === 'database'
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:border-emerald-500/40 hover:text-white'
              }`}
              title="Global Player Database (700+ Cricketers)"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">PLAYERS DB</span>
            </button>

            {/* Android APK Download Button */}
            <button
              id="header-apk-download-btn"
              onClick={onOpenApkModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all shadow-sm"
              title="Download Cricket Universe Android APK (v2.5.0)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">GET APK</span>
              <span className="sm:hidden">APK</span>
            </button>

            {/* Immersive User Profile Pill with Online Pulse */}
            <button
              id="header-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-full pl-1.5 pr-3.5 py-1 transition-all text-left group shadow-sm focus:outline-none"
              title="View Player Profile"
            >
              <div className="relative w-8 h-8 rounded-full bg-slate-800 border border-white/20 overflow-hidden shrink-0">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col min-w-0 max-w-[140px]">
                <span className="text-xs font-bold text-slate-100 truncate group-hover:text-emerald-400 transition-colors">
                  {user.displayName}
                </span>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider truncate">
                  {user.gameProgress?.rankTitle || 'Rookie'} • LVL {user.gameProgress?.level ?? 1}
                </span>
              </div>
              <div className="ml-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </button>

            {/* Settings Button */}
            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
              title="Game Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <button
              id="header-logout-btn"
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300"
              title="Log out of Cricket Universe"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Guest Session</span>
          </div>
        )}
      </div>
    </header>
  );
};
