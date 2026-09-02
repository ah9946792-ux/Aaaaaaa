import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Sparkles,
  Users,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { createInitialDreamTeam } from '../../services/dreamTeamService';
import { MASTER_PLAYER_DATABASE } from '../../data/cricketDatabase';
import { useAuth } from '../../context/AuthContext';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onTeamCreated: () => void;
}

const BADGES = ['Shield', 'Crown', 'Flame', 'Falcon', 'Tiger', 'Star'];

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onTeamCreated,
}) => {
  const { user, saveDreamTeamData } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [teamName, setTeamName] = useState('Apex Strikers XI');
  const [shortName, setShortName] = useState('APX');
  const [homeGround, setHomeGround] = useState('Cosmic Arena Stadium');
  const [selectedBadge, setSelectedBadge] = useState('Shield');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const starterPlayers = MASTER_PLAYER_DATABASE.filter((p) => p.isStarter);

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !shortName.trim()) {
      setError('Please provide a team name and short code.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const initialTeam = createInitialDreamTeam({
        teamName: teamName.trim(),
        shortName: shortName.trim().toUpperCase(),
        logoBadge: selectedBadge,
        homeGround: homeGround.trim() || 'Dream Universe Ground',
      });

      const success = await saveDreamTeamData(initialTeam);
      if (success) {
        onTeamCreated();
      } else {
        setError('Could not save Dream Team to cloud. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create dream team:', err);
      setError('An error occurred during team establishment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-blue-500/30 shadow-2xl shadow-blue-950/40 text-slate-100 overflow-hidden flex flex-col my-8"
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-white uppercase flex items-center gap-2">
                FOUND YOUR DREAM TEAM
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  MY DREAM CRICKET TEAM
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Design your club identity, receive starter players, and enter the Starter Division
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border transition-all ${
                  step === s
                    ? 'bg-blue-500 border-blue-400 text-slate-950 shadow-md shadow-blue-500/40'
                    : step > s
                    ? 'bg-blue-950/80 border-blue-500/40 text-blue-300'
                    : 'bg-slate-800 border-white/10 text-slate-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {/* STEP 1: Club Identity */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  1. Club Name, Short Code & Home Turf
                </h3>
                <p className="text-xs text-slate-400">
                  Establish your franchise brand across all cricket leagues
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Club Full Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Apex Strikers XI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-blue-500 focus:outline-none text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Short Code (3-4 Letters)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value.toUpperCase())}
                    placeholder="e.g. APX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-blue-500 focus:outline-none text-sm text-white uppercase font-bold"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300">Home Stadium Name</label>
                  <input
                    type="text"
                    value={homeGround}
                    onChange={(e) => setHomeGround(e.target.value)}
                    placeholder="e.g. Cosmic Arena Stadium"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-blue-500 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              {/* Logo Badge Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Franchise Crest
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {BADGES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBadge(b)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        selectedBadge === b
                          ? 'bg-blue-500/20 border-blue-400 text-white shadow-lg shadow-blue-950/60'
                          : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">
                        {b === 'Shield'
                          ? '🛡️'
                          : b === 'Crown'
                          ? '👑'
                          : b === 'Flame'
                          ? '🔥'
                          : b === 'Falcon'
                          ? '🦅'
                          : b === 'Tiger'
                          ? '🐯'
                          : '⭐'}
                      </span>
                      <span className="text-[10px] font-bold uppercase">{b}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Starter Squad & Division */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  2. Starter Squad & Transfer Budget
                </h3>
                <p className="text-xs text-slate-400">
                  You are awarded 11 foundational starter cricketers and 6,000 transfer coins
                </p>
              </div>

              {/* Starter Squad List */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase flex justify-between">
                  <span>Assigned Starter Squad (11 Players)</span>
                  <span className="text-blue-400">Avg Rating: 68 OVR</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {starterPlayers.slice(0, 11).map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white">{p.name}</span>
                        <span className="text-slate-400 block text-[10px]">
                          {p.country} • {p.role}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                        {p.rating} OVR
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Perks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Starting Division
                  </span>
                  <span className="text-sm font-bold text-white">Starter Division</span>
                  <span className="text-[10px] text-slate-500 block">Tier 1 of 6</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Transfer Funds
                  </span>
                  <span className="text-sm font-bold text-emerald-400">6,000 Coins</span>
                  <span className="text-[10px] text-slate-500 block">Ready to Sign Players</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => {
                if (!teamName.trim() || !shortName.trim()) {
                  setError('Please enter team name and short code.');
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/30 cursor-pointer"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreateTeam}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/40 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Establishing Club...' : 'Found Dream Team →'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
