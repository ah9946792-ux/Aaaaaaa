import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserSettings } from '../../types';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Monitor,
  FastForward,
  LogOut,
  Sliders,
  Smartphone,
  Download,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApkModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenApkModal }) => {
  const { user, updateProfileSettings, logout } = useAuth();

  if (!isOpen || !user) return null;

  const currentSettings: UserSettings = user.settings || {
    soundEnabled: true,
    musicEnabled: true,
    graphicsQuality: 'high',
    matchSpeed: '1x',
    themeAccent: 'emerald',
    notifications: true,
    autoSaveCloud: true,
  };

  const handleToggle = (key: keyof UserSettings) => {
    updateProfileSettings({
      [key]: !currentSettings[key],
    });
  };

  const handleSelect = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    updateProfileSettings({
      [key]: value,
    });
  };

  return (
    <div
      id="game-settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b132b]/95 p-6 text-slate-100 backdrop-blur-2xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
              CRICKET UNIVERSE SETTINGS
            </h2>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form Controls */}
        <div className="space-y-4 text-xs">
          
          {/* Audio Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 backdrop-blur-sm">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1">
              Audio & Stadium Effects
            </div>

            {/* Sound FX */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                {currentSettings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span>Sound Effects (Bat impact, Crowd cheers)</span>
              </div>
              <button
                id="toggle-sound-btn"
                onClick={() => handleToggle('soundEnabled')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentSettings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    currentSettings.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Music */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Music className="w-4 h-4 text-cyan-400" />
                <span>Stadium Soundtrack & Theme Music</span>
              </div>
              <button
                id="toggle-music-btn"
                onClick={() => handleToggle('musicEnabled')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentSettings.musicEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    currentSettings.musicEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Gameplay & Simulation Engine */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 backdrop-blur-sm">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1">
              Simulation Performance
            </div>

            {/* Match Speed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <FastForward className="w-4 h-4 text-amber-400" />
                <span>Match Simulation Pace</span>
              </div>
              <div className="flex gap-1">
                {(['1x', '1.5x', '2x'] as const).map((spd) => (
                  <button
                    key={spd}
                    id={`speed-${spd}-btn`}
                    onClick={() => handleSelect('matchSpeed', spd)}
                    className={`rounded-lg px-2.5 py-1 font-bold transition-colors ${
                      currentSettings.matchSpeed === spd
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>

            {/* Graphics Quality */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Graphics Rendering</span>
              </div>
              <div className="flex gap-1">
                {(['medium', 'high', 'ultra'] as const).map((qual) => (
                  <button
                    key={qual}
                    id={`graphics-${qual}-btn`}
                    onClick={() => handleSelect('graphicsQuality', qual)}
                    className={`rounded-lg px-2.5 py-1 font-bold capitalize transition-colors ${
                      currentSettings.graphicsQuality === qual
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {qual}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Android APK Download Section */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Android App (APK)</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    v2.5.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Direct install on Android phone/tablet (2.47 MB)
                </div>
              </div>
            </div>
            {onOpenApkModal ? (
              <button
                id="settings-download-apk-btn"
                onClick={() => {
                  onClose();
                  onOpenApkModal();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get APK</span>
              </button>
            ) : (
              <a
                href="/api/apk/download"
                download="cricket-universe.apk"
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
          </div>

          {/* Account & Logout */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-center justify-between backdrop-blur-sm">
            <div>
              <div className="font-bold text-red-300">Google Account Session</div>
              <div className="text-[11px] text-red-400/80 truncate max-w-[240px]">
                {user.email}
              </div>
            </div>
            <button
              id="settings-logout-btn"
              onClick={() => {
                onClose();
                logout();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/20 hover:bg-red-500/30 px-3.5 py-1.5 text-xs font-bold text-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider transition-colors"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};
