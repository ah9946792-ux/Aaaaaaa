import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Shield,
  Calendar,
  Clock,
  Coins,
  Gem,
  Award,
  Edit2,
  Check,
  Zap,
  Gamepad2,
  Database,
  Lock,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateDisplayName } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSaving(true);
    await updateDisplayName(nameInput.trim());
    setIsSaving(false);
    setIsEditingName(false);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      id="player-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b132b]/95 p-6 text-slate-100 backdrop-blur-2xl shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
              PLAYER PROFILE & CLOUD IDENTITY
            </h2>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Identity Hero Block */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center gap-5 backdrop-blur-sm">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-full bg-slate-800 border border-white/20 overflow-hidden ring-4 ring-emerald-500/40 shadow-lg">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1 text-black font-black text-[10px] ring-2 ring-black">
              PRO
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="rounded-lg border border-emerald-500/60 bg-black/40 px-2.5 py-1 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSaving}
                  className="rounded-lg bg-emerald-500 p-1.5 text-black hover:bg-emerald-400 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setNameInput(user.displayName);
                    setIsEditingName(false);
                  }}
                  className="rounded-lg bg-white/10 p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <h3 className="text-xl font-black text-white truncate">
                  {user.displayName}
                </h3>
                <button
                  id="edit-profile-name-btn"
                  onClick={() => setIsEditingName(true)}
                  className="rounded-md p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  title="Edit Player Name"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="text-xs text-slate-400 mb-2 truncate">
              {user.email}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                {user.gameProgress?.rankTitle || 'Rookie Cricketer'}
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                Level {user.gameProgress?.level ?? 1}
              </span>
              <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-slate-400">
                XP: {user.gameProgress?.xp ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Inventory Wallet */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
              <Coins className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Coins</span>
            </div>
            <div className="text-lg font-black text-white">
              {user.currency?.coins?.toLocaleString() ?? 1000}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
              <Gem className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Gems</span>
            </div>
            <div className="text-lg font-black text-white">
              {user.currency?.gems?.toLocaleString() ?? 50}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1.5 text-purple-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Energy</span>
            </div>
            <div className="text-lg font-black text-white">
              {user.currency?.energy ?? 100} / 100
            </div>
          </div>
        </div>

        {/* Career Stats & Cloud Metadata Breakdown */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6 space-y-3 backdrop-blur-sm">
          <div className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Cloud State & Game Progress</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg bg-black/20 p-2.5 border border-white/5">
              <div className="text-slate-400 text-[10px]">Matches Played</div>
              <div className="font-bold text-white text-sm">{user.gameProgress?.totalMatchesPlayed ?? 0}</div>
            </div>
            <div className="rounded-lg bg-black/20 p-2.5 border border-white/5">
              <div className="text-slate-400 text-[10px]">Reputation</div>
              <div className="font-bold text-emerald-400 text-sm">{user.gameProgress?.reputation ?? 100}</div>
            </div>
            <div className="rounded-lg bg-black/20 p-2.5 border border-white/5">
              <div className="text-slate-400 text-[10px]">Current Level</div>
              <div className="font-bold text-amber-400 text-sm">LVL {user.gameProgress?.level ?? 1}</div>
            </div>
            <div className="rounded-lg bg-black/20 p-2.5 border border-white/5">
              <div className="text-slate-400 text-[10px]">XP to Next Level</div>
              <div className="font-bold text-cyan-400 text-sm">{user.gameProgress?.xpToNextLevel ?? 1000}</div>
            </div>
          </div>

          {/* Cloud Anchor Data Details */}
          <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Google Permanent ID:</span>
              </span>
              <span className="font-mono text-slate-200">{user.googleId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Account Created:</span>
              </span>
              <span className="text-slate-200">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Last Cloud Login:</span>
              </span>
              <span className="text-slate-200">{formatDate(user.lastLoginAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
