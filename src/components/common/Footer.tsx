import React from 'react';
import { Settings, Sparkles, Smartphone } from 'lucide-react';

interface FooterProps {
  onOpenSettings: () => void;
  onOpenApkModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSettings, onOpenApkModal }) => {
  return (
    <footer
      id="main-app-footer"
      className="relative z-10 w-full h-14 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 bg-black/40 border-t border-white/5 text-[10px] text-slate-500 font-bold tracking-[0.1em] uppercase backdrop-blur-sm"
    >
      {/* Left: Version & Status */}
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="text-slate-400">v2.5.0 • Official Release</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-emerald-500 hidden sm:inline">Google Auth Linked</span>
      </div>

      {/* Right: Quick Action Links */}
      <div className="flex items-center gap-6">
        {onOpenApkModal && (
          <button
            id="footer-apk-btn"
            onClick={onOpenApkModal}
            className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors focus:outline-none text-emerald-400/90"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android APK (2.47 MB)</span>
          </button>
        )}

        <button
          id="footer-settings-btn"
          onClick={onOpenSettings}
          className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors focus:outline-none"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        <div className="flex items-center gap-1.5 text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400/70" />
          <span>Simulation Active</span>
        </div>
      </div>
    </footer>
  );
};
