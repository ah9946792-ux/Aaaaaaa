import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  User,
  Target,
  Award,
  Sparkles,
  Shield,
  TrendingUp,
  CheckCircle2,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';
import { CreatePlayerModal } from '../career/CreatePlayerModal';
import { CareerDashboard } from '../career/CareerDashboard';
import { ModeIcon } from '../common/ModeIcons';

interface CareerModeScreenProps {
  onBack: () => void;
}

export const CareerModeScreen: React.FC<CareerModeScreenProps> = ({ onBack }) => {
  const { user, refreshProfile, saveCareerData } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const career = user?.careerData;

  const handleResetCareer = async () => {
    await saveCareerData(null);
    setShowResetConfirm(false);
    refreshProfile();
  };

  return (
    <div id="career-mode-screen" className="min-h-full w-full p-4 sm:p-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            id="career-back-btn"
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:border-emerald-500/50 hover:bg-white/10 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-emerald-400" />
            <span>RETURN TO UNIVERSE HOME</span>
          </button>

          <div className="flex items-center gap-3">
            {career && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/40 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Career</span>
              </button>
            )}

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CAREER MODE ACTIVE</span>
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
              <h3 className="text-lg font-bold text-white">Reset Career Progress?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to retire this cricketer and start a brand new career from scratch?
                Your current stats, trophies, and wallet funds will be reset.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetCareer}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Yes, Start New Career
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conditional Rendering: If player has career, show dashboard; else show onboarding */}
        {career ? (
          <CareerDashboard career={career} onRefresh={refreshProfile} />
        ) : (
          <div className="space-y-6">
            {/* Hero Mode Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-[#0b132b]/80 to-[#020617] p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 ring-1 ring-emerald-500/40 text-emerald-400 shadow-lg">
                    <ModeIcon modeId="career" size={54} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        SINGLE PLAYER STORY
                      </span>
                      <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-extrabold text-emerald-300 uppercase">
                        FLAGSHIP MODE
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
                      MY CAREER MODE
                    </h1>
                    <p className="text-sm text-slate-300 max-w-xl mt-1">
                      Create your personalized cricketer from your home district, earn club contracts, dominate franchise leagues, and lead your national team to World Cups!
                    </p>
                  </div>
                </div>

                {/* Create Player CTA */}
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full md:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/40 transition-all cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Your Cricketer</span>
                </button>
              </div>
            </div>

            {/* Mode Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Player Archetypes */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Realistic Roles & Archetypes</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Define your craft: Opening Batter, Express Pacer, Leg-Spin Wizard, or All-Rounder with granular skill parameters.
                </p>
                <div className="space-y-2">
                  {[
                    'Batters: Opening, Top-Order, Finisher',
                    'Bowlers: Fast, Fast-Medium, Mystery Spin',
                    'Dynamic All-Rounders & WK-Batters',
                    'Authentic Starting District Clubs',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Skill Progression System */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Match Day Engine</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Make critical on-pitch batting and bowling decisions with live ball-by-ball commentary and teammate integration.
                </p>
                <div className="space-y-2">
                  {[
                    'Shot Selection: Defense, Drives, Maximums',
                    'Delivery Tactics: Yorkers, Bouncers, Spin Loop',
                    '2-3 Days Calendar Interval Progression',
                    'Real Teammates from Central Database',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Lifestyle & Coaching */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Lifestyle & Lifetime Coaching</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Invest match earnings into luxury gear and real estate. At Age 45, transition into head coach until Age 75!
                </p>
                <div className="space-y-2">
                  {[
                    'Lifestyle Store & Real Estate Assets',
                    'Franchise League Offers (BPL, IPL, PSL)',
                    'National Team Selection Hierarchy',
                    'Coaching Career Management to Age 75',
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

        {/* Create Player Modal */}
        <CreatePlayerModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPlayerCreated={() => {
            setIsCreateModalOpen(false);
            refreshProfile();
          }}
        />
      </div>
    </div>
  );
};
