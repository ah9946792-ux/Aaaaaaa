import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Users,
  Trophy,
  Sparkles,
  Shield,
  Layers,
  CheckCircle2,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';
import { ModeIcon } from '../common/ModeIcons';
import { CreateTeamModal } from '../dreamteam/CreateTeamModal';
import { DreamTeamDashboard } from '../dreamteam/DreamTeamDashboard';

interface DreamTeamModeScreenProps {
  onBack: () => void;
}

export const DreamTeamModeScreen: React.FC<DreamTeamModeScreenProps> = ({ onBack }) => {
  const { user, refreshProfile, saveDreamTeamData } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const dreamTeam = user?.dreamTeamData;

  const handleResetTeam = async () => {
    await saveDreamTeamData(null);
    setShowResetConfirm(false);
    refreshProfile();
  };

  return (
    <div id="dream-team-mode-screen" className="min-h-full w-full p-4 sm:p-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            id="dreamteam-back-btn"
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:border-blue-500/50 hover:bg-white/10 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-blue-400" />
            <span>RETURN TO UNIVERSE HOME</span>
          </button>

          <div className="flex items-center gap-3">
            {dreamTeam && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/40 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Found Club</span>
              </button>
            )}

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-blue-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>DREAM TEAM MODE ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="p-6 rounded-2xl bg-slate-900 border border-red-500/40 max-w-md w-full space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center text-xl">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-white">Disband Dream Team?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to disband this cricket club? All signed players, division progress, and transfer coins will be reset.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetTeam}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                >
                  Yes, Disband Club
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conditional Rendering */}
        {dreamTeam ? (
          <DreamTeamDashboard dreamTeam={dreamTeam} onRefresh={refreshProfile} />
        ) : (
          <div className="space-y-6">
            {/* Hero Mode Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/60 via-[#0b132b]/80 to-[#020617] p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30 ring-1 ring-blue-500/40 text-blue-400 shadow-lg">
                    <ModeIcon modeId="dream_team" size={54} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        FANTASY CLUB MANAGEMENT
                      </span>
                      <span className="rounded bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[9px] font-extrabold text-blue-300 uppercase">
                        POPULAR MODE
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
                      MY DREAM CRICKET TEAM
                    </h1>
                    <p className="text-sm text-slate-300 max-w-xl mt-1">
                      Found your own cricket franchise, manage starting lineups, scout superstar players on the transfer market, and win promotions across 6 division tiers!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full md:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/40 transition-all cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Found Dream Team</span>
                </button>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>6-Tier Division Ladder</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Climb from Starter Division to Regional, Challenger, Premier, Elite, and Legendary Champions Division with real division tables and NRR.
                </p>
                <div className="space-y-2">
                  {[
                    'Promotion & Relegation Mechanics',
                    'Interactive Match Simulation Engine',
                    'Division Championship Trophy Rewards',
                    'Exhibition Friendly Matches',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Squad & Lineup Tactics</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Assign Playing XI, set Captain (C) and Vice-Captain (VC), structure batting order, and allocate bowling spells.
                </p>
                <div className="space-y-2">
                  {[
                    'Designate Captaincy & Vice-Captaincy',
                    'Playing XI vs Bench Management',
                    'Player Lifetime Team Stats & Records',
                    'Individual Match Performance Logs',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Transfer Trading Hub</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Use match win coin bonuses to purchase all-time legends and rising talents from Bangladesh, India, Australia, and worldwide.
                </p>
                <div className="space-y-2">
                  {[
                    'Central Master Player Database',
                    'Buy & Sell Players with Real Coin Balances',
                    'Filter by Nationality, Rating & Role',
                    'Complete Club Transfer History Ledger',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Team Modal */}
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTeamCreated={() => {
            setIsCreateModalOpen(false);
            refreshProfile();
          }}
        />
      </div>
    </div>
  );
};
