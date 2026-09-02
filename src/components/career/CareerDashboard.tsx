import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Shield,
  Zap,
  Play,
  Award,
  DollarSign,
  TrendingUp,
  Briefcase,
  ShoppingBag,
  Globe,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  UserCheck,
  ChevronRight,
  Flame,
  Activity,
} from 'lucide-react';
import { CareerProfile } from '../../types';
import {
  acceptLeagueOffer,
  purchaseLifestyleItem,
  simulateCoachingSeason,
} from '../../services/careerService';
import { useAuth } from '../../context/AuthContext';
import { CareerMatchModal } from './CareerMatchModal';

interface CareerDashboardProps {
  career: CareerProfile;
  onRefresh: () => void;
  onResetCareer?: () => void;
}

type CareerTab =
  | 'match_day'
  | 'ratings'
  | 'stats'
  | 'contracts'
  | 'trophies'
  | 'lifestyle'
  | 'international'
  | 'coaching';

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  career,
  onRefresh,
}) => {
  const { saveCareerData } = useAuth();
  const [activeTab, setActiveTab] = useState<CareerTab>('match_day');
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const currentFixture = career.matchCalendar[career.currentMatchIndex];

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleAcceptOffer = async (offerId: string) => {
    const updated = acceptLeagueOffer(career, offerId);
    const success = await saveCareerData(updated);
    if (success) {
      showToast('Signed new club contract!');
      onRefresh();
    }
  };

  const handleBuyLifestyle = async (itemId: string) => {
    const updated = purchaseLifestyleItem(career, itemId);
    const success = await saveCareerData(updated);
    if (success) {
      showToast('Lifestyle purchase completed & prestige increased!');
      onRefresh();
    }
  };

  const handleSimulateCoaching = async () => {
    const updated = simulateCoachingSeason(career);
    const success = await saveCareerData(updated);
    if (success) {
      showToast('Coaching season completed!');
      onRefresh();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/30 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {actionMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Player Profile Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* OVR Badge */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
              <span className="text-[10px] tracking-wider uppercase">OVR</span>
              <span className="text-3xl leading-none">{career.ratings.overall}</span>
              <span className="text-[9px] font-bold">POT {career.ratings.potential}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 border border-emerald-500/40 text-[9px] font-bold text-emerald-300">
              #{career.jerseyNumber}
            </div>
          </div>

          {/* Player Info */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{career.playerName}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                {career.role}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-medium">
                Age {career.age}
              </span>
            </div>

            <div className="text-xs text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-semibold text-emerald-400">{career.country}</span>
              <span>•</span>
              <span>{career.roleSubType}</span>
              <span>•</span>
              <span className="text-slate-400">Club: {career.currentClub}</span>
            </div>

            {/* Form Pill */}
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
              <div
                className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                  career.ratings.formStatus === 'Excellent'
                    ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                    : career.ratings.formStatus === 'Good'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}
              >
                <Activity className="w-3 h-3" /> Form: {career.ratings.formStatus} ({career.ratings.form}%)
              </div>
              <div className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                ⭐ {career.reputation} Reputation
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Match Action CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Wallet Balance */}
          <div className="px-5 py-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-center sm:text-right w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Career Wallet
            </span>
            <span className="text-xl font-black text-emerald-400">
              ${career.wallet.toLocaleString()}
            </span>
          </div>

          {/* Enter Match Day Button */}
          {!career.playingCareerFinished ? (
            <button
              type="button"
              onClick={() => setIsMatchModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Match Day (Match #{career.currentMatchIndex + 1})
            </button>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
              Playing Career Retired (Age 45+)
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 border-b border-white/10">
        {[
          { id: 'match_day', label: '🏟️ Match Day & Calendar' },
          { id: 'ratings', label: '📊 Ratings & Skills' },
          { id: 'stats', label: '📈 Career Statistics' },
          { id: 'contracts', label: '📜 Club & League Offers' },
          { id: 'trophies', label: `🏆 Trophy Cabinet (${career.trophies.length})` },
          { id: 'lifestyle', label: '🛍️ Lifestyle & Assets' },
          { id: 'international', label: '🌍 National Selection' },
          { id: 'coaching', label: '👔 Coaching Career' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as CareerTab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md shadow-emerald-950/40'
                : 'bg-slate-950/40 text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Match Day & Calendar */}
      {activeTab === 'match_day' && (
        <div className="space-y-6">
          {/* Active Next Match Highlight */}
          {currentFixture && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {currentFixture.competitionName} • Matchday #{currentFixture.matchNumber}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {currentFixture.playerTeam} <span className="text-slate-400 font-normal">vs</span>{' '}
                  {currentFixture.opponentTeam}
                </h3>
                <div className="text-xs text-slate-300 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span>📅 Date: {currentFixture.inGameDate}</span>
                  <span>📍 Venue: {currentFixture.venue}</span>
                  <span>🏏 Format: {currentFixture.format}</span>
                </div>
              </div>

              {!career.playingCareerFinished ? (
                <button
                  type="button"
                  onClick={() => setIsMatchModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/40 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Play Match Now
                </button>
              ) : (
                <span className="text-xs text-purple-400 font-bold">Retired</span>
              )}
            </div>
          )}

          {/* Full Season Calendar Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Season Fixtures & Match Calendar (2-3 Days Interval)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {career.matchCalendar.map((fix, idx) => {
                const isCurrent = idx === career.currentMatchIndex;
                const isPast = fix.status === 'completed';

                return (
                  <div
                    key={fix.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/60'
                        : isPast
                        ? 'bg-slate-950/60 border-white/10 opacity-75'
                        : 'bg-slate-950/40 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                      <span>MATCH #{fix.matchNumber}</span>
                      <span className="text-emerald-400">{fix.inGameDate}</span>
                    </div>

                    <div className="text-sm font-bold text-white truncate">
                      vs {fix.opponentTeam}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{fix.competitionName}</div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                      <span className="text-slate-400">{fix.format}</span>
                      {isPast ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                          ✓ Completed
                        </span>
                      ) : isCurrent ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                          ● Next Up
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Upcoming</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Ratings & Skills */}
      {activeTab === 'ratings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Batting Skills */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏏</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Batting Attributes
                </h3>
              </div>
              <span className="text-lg font-black text-amber-400">
                {career.ratings.batting.batting}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Power Hitting', val: career.ratings.batting.power },
                { name: 'Timing & Placement', val: career.ratings.batting.timing },
                { name: 'Defensive Technique', val: career.ratings.batting.technique },
                { name: 'Running Between Wickets', val: career.ratings.batting.runningBetweenWickets },
                { name: 'Shot Selection', val: career.ratings.batting.shotSelection },
              ].map((attr) => (
                <div key={attr.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{attr.name}</span>
                    <span className="font-bold text-white">{attr.val}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                      style={{ width: `${attr.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bowling Skills */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Bowling Attributes
                </h3>
              </div>
              <span className="text-lg font-black text-blue-400">
                {career.ratings.bowling.bowling}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Raw Pace / Speed', val: career.ratings.bowling.pace },
                { name: 'Pitch Accuracy', val: career.ratings.bowling.accuracy },
                { name: 'Seam / Swing Movement', val: career.ratings.bowling.movement },
                { name: 'Variation & Slower Balls', val: career.ratings.bowling.variation },
                { name: 'Spin & Drift', val: career.ratings.bowling.spin },
                { name: 'Line Control', val: career.ratings.bowling.control },
              ].map((attr) => (
                <div key={attr.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{attr.name}</span>
                    <span className="font-bold text-white">{attr.val}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${attr.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fielding & Keeping */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧤</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Fielding & Keeping
                </h3>
              </div>
              <span className="text-lg font-black text-emerald-400">
                {career.ratings.fielding.fielding}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Catching Reflexes', val: career.ratings.fielding.catching },
                { name: 'Throwing Power & Aim', val: career.ratings.fielding.throwing },
                { name: 'Ground Fielding & Sliding', val: career.ratings.fielding.groundFielding },
                { name: 'Reaction Speed', val: career.ratings.fielding.reaction },
                { name: 'Wicketkeeping Glovework', val: career.ratings.fielding.wicketkeeping },
              ].map((attr) => (
                <div key={attr.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{attr.name}</span>
                    <span className="font-bold text-white">{attr.val}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${attr.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Career Statistics */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase font-bold text-[11px] border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-3 py-3">Mat</th>
                  <th className="px-3 py-3">Runs</th>
                  <th className="px-3 py-3">Avg</th>
                  <th className="px-3 py-3">SR</th>
                  <th className="px-3 py-3">HS</th>
                  <th className="px-3 py-3">50s/100s</th>
                  <th className="px-3 py-3">Overs</th>
                  <th className="px-3 py-3">Wkts</th>
                  <th className="px-3 py-3">BBI</th>
                  <th className="px-3 py-3">Econ</th>
                  <th className="px-3 py-3">Catches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {[
                  { name: 'Club Cricket', st: career.stats?.club },
                  { name: 'Franchise Leagues', st: career.stats?.franchise },
                  { name: 'International', st: career.stats?.international },
                  { name: 'Total Career', st: career.stats?.total, isTotal: true },
                ].map((row) => {
                  const st = row.st || {
                    matches: 0,
                    runs: 0,
                    average: 0,
                    strikeRate: 0,
                    highestScore: 0,
                    fifties: 0,
                    hundreds: 0,
                    overs: 0,
                    wickets: 0,
                    bestBowling: '-',
                    economy: 0,
                    catches: 0,
                  };
                  return (
                    <tr
                      key={row.name}
                      className={row.isTotal ? 'bg-emerald-950/20 font-bold text-white' : ''}
                    >
                      <td className="px-4 py-3 font-semibold text-white">{row.name}</td>
                      <td className="px-3 py-3">{st.matches ?? 0}</td>
                      <td className="px-3 py-3 font-bold text-emerald-300">{st.runs ?? 0}</td>
                      <td className="px-3 py-3">{st.average ?? 0}</td>
                      <td className="px-3 py-3">{st.strikeRate ?? 0}</td>
                      <td className="px-3 py-3">{st.highestScore ?? 0}</td>
                      <td className="px-3 py-3">
                        {st.fifties ?? 0} / {st.hundreds ?? 0}
                      </td>
                      <td className="px-3 py-3">{st.overs ?? 0}</td>
                      <td className="px-3 py-3 font-bold text-blue-300">{st.wickets ?? 0}</td>
                      <td className="px-3 py-3">{st.bestBowling || '-'}</td>
                      <td className="px-3 py-3">{st.economy ?? 0}</td>
                      <td className="px-3 py-3">{st.catches ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Club & League Offers */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          {/* Active Contract Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Active Club Contract
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{career.currentContract.clubName}</h3>
                <div className="text-xs text-slate-400">
                  {career.currentContract.teamType} • {career.currentContract.clubTier.toUpperCase()} TIER
                </div>
              </div>
              <div className="flex items-center gap-4 text-center sm:text-right">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Match Fee</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ${career.currentContract.salaryPerMatch}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Remaining</span>
                  <span className="text-lg font-bold text-white">
                    {career.currentContract.remainingMatches} Matches
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Available League Offers */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Available Franchise & League Offers
            </h3>

            {career.availableOffers.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-950/40 text-center text-xs text-slate-400 space-y-1">
                <p>No active franchise offers at this moment.</p>
                <p className="text-slate-500">
                  Perform strongly in upcoming matches to attract scouts from BPL, IPL, and Big Bash!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {career.availableOffers.map((off) => (
                  <div
                    key={off.id}
                    className="p-5 rounded-xl bg-slate-950/70 border border-white/10 hover:border-emerald-500/40 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-emerald-400 uppercase">
                          {off.leagueName}
                        </span>
                        <span className="text-xs font-bold text-white">${off.salary} / match</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{off.teamName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{off.roleOffered}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAcceptOffer(off.id)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      Accept Contract Offer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Club History */}
          {career.clubHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Club History & Career Log
              </h3>
              <div className="space-y-2">
                {career.clubHistory.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-between text-xs text-slate-300"
                  >
                    <div>
                      <span className="font-bold text-white">{ch.clubName}</span> ({ch.tier})
                      <span className="text-slate-500 block text-[11px]">Season {ch.seasons}</span>
                    </div>
                    <div className="text-right">
                      <span>{ch?.matches ?? 0} Matches</span>
                      <span className="text-emerald-400 font-semibold block text-[11px]">
                        +${(ch?.salaryEarned ?? 0).toLocaleString()} Earned
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Trophy Cabinet */}
      {activeTab === 'trophies' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Career Trophy Showcase ({career.trophies.length})
            </h3>
          </div>

          {career.trophies.length === 0 ? (
            <div className="p-12 rounded-2xl border border-white/10 bg-slate-950/40 text-center space-y-2">
              <span className="text-3xl">🏆</span>
              <p className="text-xs font-semibold text-slate-300">No trophies won yet.</p>
              <p className="text-[11px] text-slate-500">
                Win Player of the Match awards, league tournaments, and national championships to fill your cabinet!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {career.trophies.map((trophy) => (
                <div
                  key={trophy.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{trophy.name}</h4>
                    <span className="text-xs text-amber-400 font-semibold block">
                      {trophy.competition} ({trophy.season})
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{trophy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Lifestyle & Real Estate */}
      {activeTab === 'lifestyle' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Lifestyle & Real Estate Store
              </h3>
              <p className="text-xs text-slate-400">
                Invest your career match earnings into luxury assets and gear to boost prestige
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
              Funds: ${career.wallet.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {career.purchases.map((item) => {
              const canAfford = career.wallet >= item.price;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    item.purchased
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        +{item.prestigeBoost} Prestige
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm font-bold text-white">
                      ${item.price.toLocaleString()}
                    </span>

                    {item.purchased ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                        ✓ Owned
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleBuyLifestyle(item.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                          canAfford
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Buy Asset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: National Selection */}
      {activeTab === 'international' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              National Cricket Team Status ({career.country})
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {[
                { id: 'ineligible', label: '1. Domestic Tier' },
                { id: 'on_radar', label: '2. On Radar' },
                { id: 'squad_member', label: '3. Squad Call-up' },
                { id: 'playing_xi', label: '4. Playing XI Star' },
                { id: 'captain', label: '5. National Captain' },
              ].map((st, idx) => {
                const ranks = ['ineligible', 'on_radar', 'squad_member', 'playing_xi', 'captain'];
                const currentRankIdx = ranks.indexOf(career.internationalStatus);
                const isPassed = idx <= currentRankIdx;

                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border text-xs font-bold ${
                      isPassed
                        ? 'bg-emerald-500/20 border-emerald-400 text-white'
                        : 'bg-slate-950/60 border-white/5 text-slate-500'
                    }`}
                  >
                    {st.label}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-300">
              Current Status:{' '}
              <strong className="text-emerald-400 uppercase">
                {career.internationalStatus.replace('_', ' ')}
              </strong>
              . Maintain an OVR above 80 and Reputation above 400 to secure your spot in the national Playing XI!
            </p>
          </div>
        </div>
      )}

      {/* TAB 8: Coaching Career (Unlocked at Age 45) */}
      {activeTab === 'coaching' && (
        <div className="space-y-6">
          {!career.coachingUnlocked ? (
            <div className="p-12 rounded-2xl border border-white/10 bg-slate-950/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Coaching Career Locked</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Upon reaching Age 45 and concluding your active playing career, the Coaching Career opens up allowing you to mentor franchises and national teams until Age 75.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/40 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Active Coach Head
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {career.coachingProfile?.currentTeam || 'National Academy Coach'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Seasons Managed: {career.coachingProfile?.seasonsCoached || 0} • Age: {career.age}
                  </p>
                </div>

                {!career.lifetimeCareerCompleted ? (
                  <button
                    type="button"
                    onClick={handleSimulateCoaching}
                    className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/30 cursor-pointer"
                  >
                    Simulate Coaching Season ⏩
                  </button>
                ) : (
                  <div className="text-xs font-bold text-purple-300">
                    Lifetime Career Completed (Age 75)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Match Modal */}
      <CareerMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        career={career}
        onMatchCompleted={onRefresh}
      />
    </div>
  );
};
