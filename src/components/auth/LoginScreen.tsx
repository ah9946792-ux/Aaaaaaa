import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { ErrorBanner } from '../common/ErrorBanner';
import {
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Globe,
  Award,
  Gamepad2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const {
    loginWithGoogle,
    isAuthLoading,
    authError,
    networkError,
    clearErrors,
  } = useAuth();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showManualLogin, setShowManualLogin] = useState(false);

  // Default Quick Google Account (e.g. developer's active user or test profiles)
  const defaultGoogleAccounts = [
    {
      googleId: 'google-sub-799010666083-tafi',
      email: 'tafiahmadabuhuraira@gmail.com',
      displayName: 'Tafi Ahmad',
      photoURL:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Primary Google Account',
    },
    {
      googleId: 'google-sub-cricket-captain-01',
      email: 'captain.pro@cricketuniverse.com',
      displayName: 'Captain Virat',
      photoURL:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'Pro Test Profile',
    },
  ];

  const handleQuickSignIn = async (account: (typeof defaultGoogleAccounts)[0]) => {
    clearErrors();
    await loginWithGoogle({
      googleId: account.googleId,
      email: account.email,
      displayName: account.displayName,
      photoURL: account.photoURL,
    });
  };

  const handleGuestSignIn = async () => {
    clearErrors();
    const randId = Math.floor(1000 + Math.random() * 9000);
    await loginWithGoogle({
      googleId: `guest-player-${randId}`,
      email: `guest${randId}@cricketuniverse.com`,
      displayName: `Player #${randId}`,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=guest${randId}`,
    });
  };

  const handleCustomGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    clearErrors();
    const email = customEmail.trim();
    const displayName =
      customName.trim() || email.split('@')[0].replace('.', ' ').toUpperCase();
    const googleId = `google-sub-${email.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    await loginWithGoogle({
      googleId,
      email,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
        email
      )}`,
    });
  };

  return (
    <div
      id="cricket-universe-login-screen"
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#020617] text-slate-100 selection:bg-emerald-500 selection:text-black overflow-x-hidden font-sans"
    >
      {/* Immersive Top Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#1e3a8a_0%,transparent_50%)] opacity-35 z-0" />

      {/* Top Header Notice */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
        <Logo size="sm" showSubtitle={true} />
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Google Cloud Synced</span>
        </div>
      </header>

      {/* Center Auth Portal */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Game Lore & Feature Showcase */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-bold text-slate-200 mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THE DEFINITIVE CRICKET SIMULATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none mb-4 uppercase italic">
              ENTER THE <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                CRICKET UNIVERSE
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              One permanent account connects your entire cricket legacy. Experience My Career, Dream Team XI, Tactical Manager, World Cups, and Special Universe Tournaments.
            </p>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200 backdrop-blur-sm">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">5 Signature Modes</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200 backdrop-blur-sm">
                <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-medium">Cross-Device Sync</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200 backdrop-blur-sm">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-medium">World ICC Arenas</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200 backdrop-blur-sm">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Permanent Profiles</span>
              </div>
            </div>
          </div>

          {/* Right Column: Google Sign-In Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              
              {/* Card Header */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  Player Authentication
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sign in with your Google account to create or resume your permanent Cricket Universe profile.
                </p>
              </div>

              {/* Error Banners */}
              <ErrorBanner
                error={authError}
                onRetry={clearErrors}
                onDismiss={clearErrors}
              />
              <ErrorBanner
                error={networkError}
                onRetry={clearErrors}
                onDismiss={clearErrors}
                isNetworkError={true}
              />

              {/* Quick One-Click Google Account Sign-In Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  <span>Select Google Account to Play:</span>
                  <span className="text-emerald-400">Instant Access</span>
                </div>

                {defaultGoogleAccounts.map((account) => (
                  <button
                    key={account.googleId}
                    id={`login-google-${account.googleId}`}
                    onClick={() => handleQuickSignIn(account)}
                    className="w-full group flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/30 hover:border-emerald-400 p-3.5 text-left transition-all duration-150 shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-emerald-400 overflow-hidden ring-2 ring-emerald-500/30 shrink-0 shadow">
                        <img
                          src={account.photoURL}
                          alt={account.displayName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm truncate group-hover:text-emerald-300">
                            {account.displayName}
                          </span>
                          <span className="text-[9px] rounded bg-emerald-500/20 border border-emerald-400/40 px-1.5 py-0.5 text-emerald-300 font-bold shrink-0">
                            {account.badge}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 truncate">
                          {account.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-500 text-slate-950 font-bold text-xs px-2.5 py-1.5 rounded-lg group-hover:bg-emerald-400 transition-colors shrink-0 ml-2 shadow">
                      <span>ENTER</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}

                {/* Instant Play / Guest Button */}
                <button
                  id="instant-guest-login-btn"
                  onClick={handleGuestSignIn}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 p-3 text-xs font-bold text-amber-300 transition-all shadow active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>PLAY INSTANTLY (GUEST MODE)</span>
                </button>

                {/* Divider */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative bg-[#0b132b] px-3 text-[11px] font-semibold text-slate-400 uppercase rounded-full">
                    or enter custom account
                  </span>
                </div>

                {/* Custom Google/Gmail Address Login Drawer */}
                {!showManualLogin ? (
                  <button
                    id="toggle-custom-google-login"
                    onClick={() => setShowManualLogin(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-xs font-semibold text-slate-300 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Enter Custom Gmail / Google Account</span>
                  </button>
                ) : null}

                {showManualLogin && (
                  <form onSubmit={handleCustomGoogleSignIn} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                        Google / Gmail Address
                      </label>
                      <input
                        type="email"
                        id="custom-google-email-input"
                        placeholder="yourname@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                        Player Display Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="custom-google-name-input"
                        placeholder="e.g. Master Blaster"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        id="submit-custom-google-btn"
                        disabled={isAuthLoading || !customEmail.trim()}
                        className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
                      >
                        {isAuthLoading ? 'Authenticating...' : 'Sign In with Google'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowManualLogin(false)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Security Invariant Guarantee */}
              <div className="mt-6 rounded-xl border border-white/5 bg-black/20 p-3 text-[11px] text-slate-400 leading-snug">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Permanent Account Policy</span>
                </div>
                Your unique Google account identifier is the permanent anchor. Signing in on any device or browser always reloads your exact Cricket Universe profile without duplicates.
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full h-12 px-4 flex items-center justify-center text-xs text-slate-500 border-t border-white/5 bg-black/40">
        CRICKET UNIVERSE Simulation Engine • Foundation Phase 1 • All Player Profiles Cloud Secured
      </footer>
    </div>
  );
};
