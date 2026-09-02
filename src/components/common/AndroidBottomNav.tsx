import React from 'react';
import { CurrentScreen } from '../../types';
import {
  Home,
  Trophy,
  Shield,
  Briefcase,
  Layers,
  Database,
  Flame,
} from 'lucide-react';

interface AndroidBottomNavProps {
  currentScreen: CurrentScreen;
  onNavigate: (screen: CurrentScreen) => void;
}

interface NavItem {
  id: CurrentScreen;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    shortLabel: 'Home',
    icon: Home,
    accentColor: 'text-amber-400',
  },
  {
    id: 'universe_special',
    label: 'WTC Special',
    shortLabel: 'WTC 25-27',
    icon: Trophy,
    accentColor: 'text-amber-400',
    highlight: true,
  },
  {
    id: 'dream_team',
    label: 'Dream Team',
    shortLabel: 'Dream XI',
    icon: Layers,
    accentColor: 'text-cyan-400',
  },
  {
    id: 'career',
    label: 'My Career',
    shortLabel: 'Career',
    icon: Shield,
    accentColor: 'text-emerald-400',
  },
  {
    id: 'manager',
    label: 'Manager Mode',
    shortLabel: 'Manager',
    icon: Briefcase,
    accentColor: 'text-purple-400',
  },
  {
    id: 'database',
    label: 'Player Database',
    shortLabel: 'Database',
    icon: Database,
    accentColor: 'text-blue-400',
  },
];

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentScreen,
  onNavigate,
}) => {
  return (
    <nav
      id="android-bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#050b18]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,8px)] pt-1 px-1 sm:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.7)]"
      aria-label="Android Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[52px] min-h-[50px] py-1 px-1.5 rounded-2xl transition-all select-none active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-white shadow-inner font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Highlight pill indicator */}
              {item.highlight && (
                <span className="absolute -top-1 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}

              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 scale-110 shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`text-[9px] mt-0.5 tracking-tight truncate max-w-[56px] ${
                  isActive ? 'text-amber-300 font-extrabold' : 'text-slate-400'
                }`}
              >
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
