import React, { useState, useMemo } from 'react';
import { GlobalCricketPlayer, PlayingRole } from '../../types';
import { GLOBAL_PLAYERS_DATABASE } from '../../data/players';
import { getPlayerModeEligibility, isPlayerRetired } from '../../services/playerEligibility';
import {
  Search,
  Filter,
  Globe,
  ArrowLeft,
  Star,
  Award,
  Shield,
  Zap,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Activity,
  X,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  XCircle,
  Trophy,
  Briefcase,
  User,
} from 'lucide-react';

interface GlobalPlayerDatabaseScreenProps {
  onBack: () => void;
}

const CATEGORY_COLORS: Record<string, { badge: string; text: string; bg: string; border: string }> = {
  LEGENDARY: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    text: 'text-amber-400',
    bg: 'from-amber-950/40 to-slate-900/80',
    border: 'border-amber-500/40 hover:border-amber-400',
  },
  ICON: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    text: 'text-purple-400',
    bg: 'from-purple-950/40 to-slate-900/80',
    border: 'border-purple-500/40 hover:border-purple-400',
  },
  SUPERSTAR: {
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    text: 'text-blue-400',
    bg: 'from-blue-950/40 to-slate-900/80',
    border: 'border-blue-500/40 hover:border-blue-400',
  },
  STAR: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    text: 'text-emerald-400',
    bg: 'from-emerald-950/40 to-slate-900/80',
    border: 'border-emerald-500/40 hover:border-emerald-400',
  },
};

const ALL_COUNTRIES = [
  'All Countries',
  'Afghanistan',
  'Australia',
  'Bangladesh',
  'Canada',
  'England',
  'India',
  'Ireland',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Oman',
  'Pakistan',
  'Scotland',
  'South Africa',
  'Sri Lanka',
  'United Arab Emirates',
  'United States',
  'West Indies',
  'Zimbabwe',
];

export const GlobalPlayerDatabaseScreen: React.FC<GlobalPlayerDatabaseScreenProps> = ({
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedRole, setSelectedRole] = useState<'ALL' | PlayingRole>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'LEGENDARY' | 'ICON' | 'SUPERSTAR' | 'STAR'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Retired'>('ALL');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'DREAM_TEAM' | 'MANAGER' | 'CAREER'>('ALL');
  const [sortBy, setSortBy] = useState<'rating_desc' | 'rating_asc' | 'value_desc' | 'name_asc'>('rating_desc');
  const [inspectingPlayer, setInspectingPlayer] = useState<GlobalCricketPlayer | null>(null);

  // Filtered & Sorted Players
  const filteredPlayers = useMemo(() => {
    return GLOBAL_PLAYERS_DATABASE.filter((player) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(query) || player.short_name.toLowerCase().includes(query);
        const matchesCountry = player.country.toLowerCase().includes(query);
        const matchesRole = player.primary_role.toLowerCase().includes(query) || (player.secondary_role && player.secondary_role.toLowerCase().includes(query));
        const matchesTeam = player.current_team?.toLowerCase().includes(query);
        if (!matchesName && !matchesCountry && !matchesRole && !matchesTeam) return false;
      }

      // Country
      if (selectedCountry !== 'All Countries') {
        if (selectedCountry === 'United Arab Emirates' && (player.country === 'UAE' || player.country_code === 'UAE')) {
          // match
        } else if (selectedCountry === 'United States' && (player.country === 'USA' || player.country_code === 'USA')) {
          // match
        } else if (player.country !== selectedCountry) {
          return false;
        }
      }

      // Role
      if (selectedRole !== 'ALL' && player.primary_role !== selectedRole) {
        return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && player.category !== selectedCategory) {
        return false;
      }

      // Status
      if (statusFilter !== 'ALL' && player.career_status !== statusFilter) {
        return false;
      }

      // Game Mode Eligibility Filter
      const isRetired = isPlayerRetired(player);
      if (modeFilter === 'MANAGER' && isRetired) {
        return false;
      }
      if (modeFilter === 'CAREER' && isRetired) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating_desc') return b.overall_rating - a.overall_rating;
      if (sortBy === 'rating_asc') return a.overall_rating - b.overall_rating;
      if (sortBy === 'value_desc') return (b.market_value || 0) - (a.market_value || 0);
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, selectedCountry, selectedRole, selectedCategory, statusFilter, sortBy]);

  // Statistics
  const totalCount = GLOBAL_PLAYERS_DATABASE.length;
  const activeCount = useMemo(() => GLOBAL_PLAYERS_DATABASE.filter((p) => p.career_status === 'Active').length, []);
  const retiredCount = useMemo(() => GLOBAL_PLAYERS_DATABASE.filter((p) => p.career_status === 'Retired').length, []);
  const avgRating = useMemo(() => {
    const sum = GLOBAL_PLAYERS_DATABASE.reduce((acc, p) => acc + p.overall_rating, 0);
    return (sum / totalCount).toFixed(1);
  }, [totalCount]);

  return (
    <div
      id="global-player-database-screen"
      className="min-h-full w-full p-4 sm:p-8 text-slate-100 max-w-7xl mx-auto space-y-6"
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          id="db-return-home-btn"
          onClick={onBack}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:border-emerald-500/50 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-emerald-400" />
          <span>RETURN TO UNIVERSE HOME</span>
        </button>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold text-emerald-400 backdrop-blur-sm">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>20 NATIONS • {totalCount} PLAYERS LOADED</span>
        </div>
      </div>

      {/* Hero Database Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#0b132b]/80 to-[#020617] p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                CRICKET UNIVERSE CENTRAL REPOSITORY
              </span>
              <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-black text-emerald-300 uppercase">
                MASTER PROMPT 4
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
              GLOBAL PLAYER DATABASE
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Explore 700+ verified cricketers across all 20 international cricket nations with granular ratings, 
              historical World Cup achievements, career statistics, and detailed attribute profiles.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 w-full md:w-auto">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Players</span>
              <p className="text-xl font-black text-white">{totalCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Countries</span>
              <p className="text-xl font-black text-emerald-400">20</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Active Pros</span>
              <p className="text-xl font-black text-blue-400">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Legends</span>
              <p className="text-xl font-black text-amber-400">{retiredCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Filter Panel */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md space-y-4">
        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="db-player-search-input"
              type="text"
              placeholder="Search by name, country, role, franchise, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              id="db-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500/60"
            >
              <option value="rating_desc">Highest Rating (OVR ↓)</option>
              <option value="rating_asc">Lowest Rating (OVR ↑)</option>
              <option value="value_desc">Highest Market Value ($)</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Grid */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-400" /> Nation:
          </span>
          <select
            id="db-country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500/60"
          >
            {ALL_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="text-slate-400 font-bold uppercase text-[10px] ml-2 mr-1">Role:</span>
          {(['ALL', 'Batter', 'Bowler', 'All-Rounder', 'Wicketkeeper-Batter'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                selectedRole === role
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : role}
            </button>
          ))}

          <span className="text-slate-400 font-bold uppercase text-[10px] ml-2 mr-1">Tier:</span>
          {(['ALL', 'LEGENDARY', 'ICON', 'SUPERSTAR', 'STAR'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat === 'ALL' ? 'All Tiers' : cat}
            </button>
          ))}

          <span className="text-slate-400 font-bold uppercase text-[10px] ml-2 mr-1">Status:</span>
          {(['ALL', 'Active', 'Retired'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {st === 'ALL' ? 'All Status' : st}
            </button>
          ))}

          <span className="text-slate-400 font-bold uppercase text-[10px] ml-2 mr-1">Mode Eligibility:</span>
          {[
            { key: 'ALL', label: 'All Modes' },
            { key: 'DREAM_TEAM', label: 'Dream Team (All)' },
            { key: 'MANAGER', label: 'Manager Career (Active Only)' },
            { key: 'CAREER', label: 'My Career (Active Only)' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setModeFilter(m.key as any)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                modeFilter === m.key
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400 font-medium">
          Showing <span className="font-bold text-white">{filteredPlayers.length}</span> matching cricketers
        </p>
      </div>

      {/* Players Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => {
          const catStyle = CATEGORY_COLORS[player.category] || CATEGORY_COLORS.STAR;
          const eligibility = getPlayerModeEligibility(player);

          return (
            <div
              key={player.player_id}
              id={`player-card-${player.player_id}`}
              onClick={() => setInspectingPlayer(player)}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b ${catStyle.bg} border ${catStyle.border} transition-all hover:scale-[1.01] cursor-pointer shadow-md`}
            >
              <div>
                {/* Card Top: Country, Category, & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/10 text-slate-200 border border-white/10">
                      {player.country_code || player.country}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[110px]">
                      {player.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        eligibility.isRetired
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {eligibility.isRetired ? 'RETIRED' : 'ACTIVE'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${catStyle.badge}`}>
                      {player.category}
                    </span>
                  </div>
                </div>

                {/* Main Player Info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                      {player.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {player.primary_role} • {player.career_status}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                      {player.secondary_role || player.current_team || 'International Squad'}
                    </p>
                  </div>

                  {/* Rating Shield */}
                  <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-black/50 border border-white/15 shadow-inner">
                    <span className="text-xl font-black text-white leading-none">
                      {player.overall_rating}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                      OVR
                    </span>
                  </div>
                </div>

                {/* Mini Attributes Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
                  <div className="rounded-lg bg-black/30 p-1.5 border border-white/5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">BAT</span>
                    <span className="text-xs font-black text-slate-200">
                      {player.batting_attributes?.battingAbility ?? 50}
                    </span>
                  </div>
                  <div className="rounded-lg bg-black/30 p-1.5 border border-white/5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">BOWL</span>
                    <span className="text-xs font-black text-slate-200">
                      {player.bowling_attributes?.bowlingAbility ?? 50}
                    </span>
                  </div>
                  <div className="rounded-lg bg-black/30 p-1.5 border border-white/5">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">FLD</span>
                    <span className="text-xs font-black text-slate-200">
                      {player.fielding_attributes?.fielding ?? 50}
                    </span>
                  </div>
                </div>

                {/* Quick Mode Eligibility Pill Row */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-semibold">Modes:</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                      Dream Team
                    </span>
                    {eligibility.managerCareer.eligible ? (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-bold border border-blue-500/20">
                        Manager & Career
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/20">
                        DT Only (Retired)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Market Value & Detail CTA */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Val:</span>
                  <span className="font-bold text-amber-300">${(player.market_value || 1000).toLocaleString()}k</span>
                </div>

                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold text-[11px]">
                  VIEW DOSSIER <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/5">
          <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-300">No cricketers matched your filter criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting &apos;All Countries&apos;.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCountry('All Countries');
              setSelectedRole('ALL');
              setSelectedCategory('ALL');
              setStatusFilter('ALL');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Inspect Player Modal */}
      {inspectingPlayer && (
        <div
          id="player-dossier-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-900 p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/10 text-emerald-400 border border-white/10">
                    {inspectingPlayer.country_code} • {inspectingPlayer.country}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {inspectingPlayer.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {inspectingPlayer.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {inspectingPlayer.primary_role} • {inspectingPlayer.batting_style} • {inspectingPlayer.bowling_style || 'N/A'}
                </p>
              </div>

              <button
                onClick={() => setInspectingPlayer(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Rating</span>
                <span className="text-2xl font-black text-emerald-400">{inspectingPlayer.overall_rating}</span>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Status</span>
                <span className="text-base font-black text-white">{inspectingPlayer.age} • {inspectingPlayer.career_status}</span>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Market Value</span>
                <span className="text-base font-black text-amber-300">${(inspectingPlayer.market_value || 1000).toLocaleString()}k</span>
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Team</span>
                <span className="text-xs font-bold text-slate-200 line-clamp-1">{inspectingPlayer.current_team || 'National'}</span>
              </div>
            </div>

            {/* Attribute Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" /> Attribute Ratings
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Batting */}
                <div className="rounded-xl bg-white/5 p-3.5 border border-white/5 space-y-2">
                  <span className="font-bold text-amber-400 uppercase text-[11px] block border-b border-white/10 pb-1">
                    Batting
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ability:</span>
                    <span className="font-bold text-white">{inspectingPlayer.batting_attributes?.battingAbility ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Technique:</span>
                    <span className="font-bold text-white">{inspectingPlayer.batting_attributes?.technique ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Power:</span>
                    <span className="font-bold text-white">{inspectingPlayer.batting_attributes?.power ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Timing:</span>
                    <span className="font-bold text-white">{inspectingPlayer.batting_attributes?.timing ?? 50}</span>
                  </div>
                </div>

                {/* Bowling */}
                <div className="rounded-xl bg-white/5 p-3.5 border border-white/5 space-y-2">
                  <span className="font-bold text-blue-400 uppercase text-[11px] block border-b border-white/10 pb-1">
                    Bowling
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ability:</span>
                    <span className="font-bold text-white">{inspectingPlayer.bowling_attributes?.bowlingAbility ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pace:</span>
                    <span className="font-bold text-white">{inspectingPlayer.bowling_attributes?.pace ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accuracy:</span>
                    <span className="font-bold text-white">{inspectingPlayer.bowling_attributes?.accuracy ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Variation:</span>
                    <span className="font-bold text-white">{inspectingPlayer.bowling_attributes?.variation ?? 50}</span>
                  </div>
                </div>

                {/* Fielding & Keeping */}
                <div className="rounded-xl bg-white/5 p-3.5 border border-white/5 space-y-2">
                  <span className="font-bold text-emerald-400 uppercase text-[11px] block border-b border-white/10 pb-1">
                    Fielding & Fitness
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fielding:</span>
                    <span className="font-bold text-white">{inspectingPlayer.fielding_attributes?.fielding ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Catching:</span>
                    <span className="font-bold text-white">{inspectingPlayer.fielding_attributes?.catching ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Throwing:</span>
                    <span className="font-bold text-white">{inspectingPlayer.fielding_attributes?.throwing ?? 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reaction:</span>
                    <span className="font-bold text-white">{inspectingPlayer.fielding_attributes?.reaction ?? 50}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Statistics */}
            {inspectingPlayer.career_statistics && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" /> Career Records
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="rounded-lg bg-black/40 p-2 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Matches</span>
                    <span className="font-bold text-white">{inspectingPlayer.career_statistics?.matches ?? 0}</span>
                  </div>
                  <div className="rounded-lg bg-black/40 p-2 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Runs</span>
                    <span className="font-bold text-white">
                      {inspectingPlayer.career_statistics?.runs ?? 0} (Avg {inspectingPlayer.career_statistics?.battingAverage ?? 0})
                    </span>
                  </div>
                  <div className="rounded-lg bg-black/40 p-2 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Wickets</span>
                    <span className="font-bold text-white">
                      {inspectingPlayer.career_statistics?.wickets ?? 0} (Econ {inspectingPlayer.career_statistics?.economyRate ?? 0})
                    </span>
                  </div>
                  <div className="rounded-lg bg-black/40 p-2 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">100s / 50s</span>
                    <span className="font-bold text-white">
                      {inspectingPlayer.career_statistics?.hundreds ?? 0} / {inspectingPlayer.career_statistics?.fifties ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Career Achievements */}
            {inspectingPlayer.achievements && inspectingPlayer.achievements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Signature Career Milestones
                </h4>
                <ul className="space-y-1.5">
                  {inspectingPlayer.achievements.map((ach, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-300 rounded-lg bg-white/5 p-2 border border-white/5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Game Mode Compatibility Breakdown */}
            {(() => {
              const elig = getPlayerModeEligibility(inspectingPlayer);
              return (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Game Mode Compatibility & Rules
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Dream Team */}
                    <div className="rounded-xl bg-black/40 border border-white/10 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-black text-amber-400 uppercase text-[11px] flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-400" /> Dream Team
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[9px] border border-emerald-500/30">
                            ELIGIBLE
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">
                          {elig.dreamTeam.reason}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-slate-400">
                        ✓ All Active & Legendary players available
                      </div>
                    </div>

                    {/* Manager Career */}
                    <div className={`rounded-xl bg-black/40 border ${elig.managerCareer.eligible ? 'border-white/10' : 'border-red-500/30 bg-red-950/20'} p-3 flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-black text-blue-400 uppercase text-[11px] flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-blue-400" /> Manager Mode
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-black text-[9px] border ${
                            elig.managerCareer.eligible
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {elig.managerCareer.badgeText}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">
                          {elig.managerCareer.reason}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-slate-400">
                        {elig.managerCareer.eligible ? '✓ Contractable in Global Market' : '✗ Retired cricketers prohibited'}
                      </div>
                    </div>

                    {/* My Career */}
                    <div className={`rounded-xl bg-black/40 border ${elig.myCareer.eligible ? 'border-white/10' : 'border-red-500/30 bg-red-950/20'} p-3 flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-black text-emerald-400 uppercase text-[11px] flex items-center gap-1">
                            <User className="w-3 h-3 text-emerald-400" /> My Career
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-black text-[9px] border ${
                            elig.myCareer.eligible
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {elig.myCareer.badgeText}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">
                          {elig.myCareer.reason}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-slate-400">
                        {elig.myCareer.eligible ? '✓ Active teammate & circuit opponent' : '✗ Historical icons excluded'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Close CTA */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setInspectingPlayer(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
