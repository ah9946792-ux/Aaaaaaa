import React, { useState, useEffect, useMemo } from 'react';
import {
  GlobalMarketPlayer,
  ManagerClubData,
  ManagerPlayerContract,
  PlayingRole,
  PlayerTier,
  ManagerTransferEntry,
} from '../../types';
import { ApiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { isPlayerRetired } from '../../services/playerEligibility';
import {
  Search,
  DollarSign,
  Award,
  Shield,
  CheckCircle2,
  Lock,
  History,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Users,
  ShoppingBag,
  ArrowRightLeft,
  Crown,
  AlertTriangle,
  X,
} from 'lucide-react';

interface GlobalMarketTabProps {
  club: ManagerClubData;
  onClubUpdated: (updatedClub: ManagerClubData) => void;
}

const TIER_LABELS: Record<PlayerTier, { name: string; color: string; bg: string; border: string }> = {
  6: { name: 'Tier 6: Legend (93+)', color: 'text-amber-300', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
  5: { name: 'Tier 5: World-Class (89-92)', color: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-500/40' },
  4: { name: 'Tier 4: Star (84-88)', color: 'text-blue-300', bg: 'bg-blue-500/20', border: 'border-blue-500/40' },
  3: { name: 'Tier 3: International (78-83)', color: 'text-emerald-300', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
  2: { name: 'Tier 2: Domestic Pro (71-77)', color: 'text-cyan-300', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40' },
  1: { name: 'Tier 1: Local Talent (60-70)', color: 'text-slate-300', bg: 'bg-slate-500/20', border: 'border-slate-500/40' },
};

interface SellModalData {
  playerId: string;
  name: string;
  country: string;
  role: string;
  rating: number;
  tier: PlayerTier;
  salary: number;
  contractYears: number;
  signingCost: number;
  sellValue: number;
  inStartingXI: boolean;
}

export const GlobalMarketTab: React.FC<GlobalMarketTabProps> = ({
  club,
  onClubUpdated,
}) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'market' | 'squad' | 'history'>('market');
  const [marketPlayers, setMarketPlayers] = useState<GlobalMarketPlayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters for Market
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<number | 'ALL'>('ALL');
  const [selectedRole, setSelectedRole] = useState<PlayingRole | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'AVAILABLE' | 'SIGNED_BY_ME' | 'SIGNED_OTHERS'>('ALL');

  // Filters for My Squad tab
  const [squadSearchQuery, setSquadSearchQuery] = useState<string>('');
  const [squadRoleFilter, setSquadRoleFilter] = useState<PlayingRole | 'ALL'>('ALL');

  // Modals
  const [selectedHistoryPlayer, setSelectedHistoryPlayer] = useState<GlobalMarketPlayer | null>(null);
  const [sellModalData, setSellModalData] = useState<SellModalData | null>(null);

  const fetchMarket = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const players = await ApiService.getGlobalMarket();
      setMarketPlayers(players);
    } catch (err) {
      console.error('Failed to load global market:', err);
      setNotification({
        type: 'error',
        message: 'Failed to connect to the global transfer network.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarket();
    // Auto-refresh market every 20 seconds to sync live transactions
    const interval = setInterval(() => {
      fetchMarket(true);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleSignPlayer = async (player: GlobalMarketPlayer) => {
    if (!user) return;
    setActionLoadingId(player.id);
    setNotification(null);

    try {
      const res = await ApiService.signPlayerExclusively(user.googleId, player.id);
      if (res.success && res.user && res.user.managerData) {
        onClubUpdated(res.user.managerData);
        setNotification({
          type: 'success',
          message: res.message,
        });
        await fetchMarket(true);
      } else {
        setNotification({
          type: 'error',
          message: res.message || 'Signing failed.',
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error executing exclusive transfer.';
      setNotification({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const openSellModalForContract = (squadPlayer: ManagerPlayerContract) => {
    const marketPlayer = marketPlayers.find((p) => p.id === squadPlayer.playerId);
    const signingCost = marketPlayer ? marketPlayer.signingCost : Math.round(squadPlayer.rating * 50);
    const sellValue = Math.round(signingCost * 0.75);
    const inStartingXI = club.playingXIIds.includes(squadPlayer.playerId);

    setSellModalData({
      playerId: squadPlayer.playerId,
      name: squadPlayer.name,
      country: squadPlayer.country,
      role: squadPlayer.roleSubType || squadPlayer.role,
      rating: squadPlayer.rating,
      tier: squadPlayer.tier,
      salary: squadPlayer.salaryPerSeason,
      contractYears: squadPlayer.contractYearsRemaining,
      signingCost,
      sellValue,
      inStartingXI,
    });
  };

  const openSellModalForMarketPlayer = (player: GlobalMarketPlayer) => {
    const squadPlayer = club.squad.find((p) => p.playerId === player.id);
    const signingCost = player.signingCost;
    const sellValue = Math.round(signingCost * 0.75);
    const inStartingXI = club.playingXIIds.includes(player.id);

    setSellModalData({
      playerId: player.id,
      name: player.name,
      country: player.country,
      role: player.roleSubType || player.role,
      rating: player.rating,
      tier: player.tier,
      salary: squadPlayer?.salaryPerSeason || player.salaryPerSeason,
      contractYears: squadPlayer?.contractYearsRemaining || 2,
      signingCost,
      sellValue,
      inStartingXI,
    });
  };

  const confirmSellPlayer = async () => {
    if (!user || !sellModalData) return;
    const playerId = sellModalData.playerId;
    const playerName = sellModalData.name;

    setActionLoadingId(playerId);
    setNotification(null);

    try {
      const res = await ApiService.releasePlayerExclusively(user.googleId, playerId);
      if (res.success && res.user && res.user.managerData) {
        onClubUpdated(res.user.managerData);
        setNotification({
          type: 'success',
          message: res.message || `Sold ${playerName} and credited funds to club treasury.`,
        });
        setSellModalData(null);
        await fetchMarket(true);
      } else {
        setNotification({
          type: 'error',
          message: res.message || 'Sale/Release failed.',
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error completing sale.';
      setNotification({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredMarketPlayers = useMemo(() => {
    return marketPlayers.filter((p) => {
      // Manager Career is strictly Active Players Only
      if (isPlayerRetired(p)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCountry = p.country.toLowerCase().includes(q);
        const matchesRole = p.role.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesRole) return false;
      }

      if (selectedTier !== 'ALL' && p.tier !== selectedTier) return false;
      if (selectedRole !== 'ALL' && p.role !== selectedRole) return false;

      if (selectedStatus === 'AVAILABLE') {
        if (p.ownershipState !== 'AVAILABLE') return false;
      } else if (selectedStatus === 'SIGNED_BY_ME') {
        if (p.ownerClubId !== club.id) return false;
      } else if (selectedStatus === 'SIGNED_OTHERS') {
        if (p.ownershipState !== 'SIGNED' || p.ownerClubId === club.id) return false;
      }

      return true;
    });
  }, [marketPlayers, searchQuery, selectedTier, selectedRole, selectedStatus, club.id]);

  const filteredSquadPlayers = useMemo(() => {
    return club.squad.filter((p) => {
      if (squadSearchQuery.trim()) {
        const q = squadSearchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCountry = p.country.toLowerCase().includes(q);
        const matchesRole = p.role.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesRole) return false;
      }
      if (squadRoleFilter !== 'ALL' && p.role !== squadRoleFilter) return false;
      return true;
    });
  }, [club.squad, squadSearchQuery, squadRoleFilter]);

  const transferHistoryList: ManagerTransferEntry[] = club.transferHistory || [];

  return (
    <div id="global-market-tab" className="space-y-6">
      
      {/* Top Banner with Financial Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              EXCLUSIVE GLOBAL TRANSFER NETWORK
            </span>
            <span className="flex items-center gap-1 rounded bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-300">
              ACTIVE PLAYERS POOL ONLY
            </span>
            <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE SYNCHRONIZATION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic mt-0.5">
            TRANSFER MARKET & ROSTER EXCHANGES
          </h2>
          <p className="text-xs text-slate-300">
            Sign world talent or sell contracted players to rebalance your finances and build a championship squad.
          </p>
        </div>

        {/* Club Finances Quick Bar */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Club Treasury</div>
            <div className="text-base sm:text-lg font-black text-emerald-400">
              ${club.balance.toLocaleString()}
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Squad Size</div>
            <div className="text-base sm:text-lg font-black text-white">
              {club.squad.length} <span className="text-xs text-slate-400 font-normal">/ 22 max</span>
            </div>
          </div>
          <button
            onClick={() => fetchMarket(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Market Live"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-Navigation: MARKET vs MY SQUAD vs TRANSFER HISTORY */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSubTab('market')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeSubTab === 'market'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>MARKET (BUY / SIGN)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('squad')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeSubTab === 'squad'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>MY SQUAD (SELL / RELEASE) ({club.squad.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            activeSubTab === 'history'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <History className="w-4 h-4" />
          <span>TRANSFER HISTORY ({transferHistoryList.length})</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            notification.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: GLOBAL MARKET (BUY / SIGN) */}
      {activeSubTab === 'market' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by player name, country, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as PlayingRole | 'ALL')}
                  className="w-full py-2 px-3 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="ALL">All Playing Roles</option>
                  <option value="Batter">Batters</option>
                  <option value="Bowler">Bowlers</option>
                  <option value="All-Rounder">All-Rounders</option>
                  <option value="Wicketkeeper-Batter">Wicketkeeper-Batters</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-xl border border-white/10 bg-slate-900 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="ALL">All Ownership States</option>
                  <option value="AVAILABLE">Available Free Agents Only</option>
                  <option value="SIGNED_BY_ME">Signed to My Club</option>
                  <option value="SIGNED_OTHERS">Signed by Other Clubs</option>
                </select>
              </div>
            </div>

            {/* Tier Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                onClick={() => setSelectedTier('ALL')}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                  selectedTier === 'ALL'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                All Tiers ({marketPlayers.length})
              </button>
              {([6, 5, 4, 3, 2, 1] as PlayerTier[]).map((tier) => {
                const count = marketPlayers.filter((p) => p.tier === tier).length;
                const meta = TIER_LABELS[tier];
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                      selectedTier === tier
                        ? `${meta.border} ${meta.bg} ${meta.color}`
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {meta.name.split(' (')[0]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Players Market Grid */}
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              <p className="text-sm">Connecting to global transfer clearinghouse...</p>
            </div>
          ) : filteredMarketPlayers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-sm font-semibold">No players matching the active filters found.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTier('ALL');
                  setSelectedRole('ALL');
                  setSelectedStatus('ALL');
                }}
                className="mt-3 text-xs text-amber-400 underline font-bold"
              >
                Reset all market filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarketPlayers.map((player) => {
                const isOwnedByMe = player.ownerClubId === club.id;
                const isOwnedByOther = player.ownershipState === 'SIGNED' && !isOwnedByMe;
                const canAfford = club.balance >= player.signingCost;
                const meetsReputation = club.reputation >= player.minReputationRequired;
                const meetsTier = club.tierLevel >= player.minClubTierLevel;
                const isEligible = canAfford && meetsReputation && meetsTier && player.ownershipState === 'AVAILABLE';
                const tierMeta = TIER_LABELS[player.tier];

                return (
                  <div
                    key={player.id}
                    className={`relative overflow-hidden rounded-2xl border p-4 backdrop-blur-md flex flex-col justify-between transition-all ${
                      isOwnedByMe
                        ? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg ring-1 ring-emerald-500/30'
                        : isOwnedByOther
                        ? 'border-slate-800 bg-slate-950/40 opacity-75'
                        : 'border-white/10 bg-white/5 hover:border-amber-500/40 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      {/* Top Bar: Role, Country, Tier */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${tierMeta.bg} ${tierMeta.color} border ${tierMeta.border}`}
                        >
                          Tier {player.tier}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-300">
                          {player.country} • Age {player.age}
                        </span>
                      </div>

                      {/* Player Name & Rating */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-base font-black text-white leading-tight">
                            {player.name}
                          </h3>
                          <div className="text-xs text-amber-400 font-medium">
                            {player.roleSubType || player.role}
                          </div>
                        </div>
                        <div className="h-11 w-11 rounded-xl bg-slate-900 border border-amber-500/30 flex flex-col items-center justify-center shrink-0 shadow">
                          <span className="text-[9px] font-bold text-slate-400 leading-none">OVR</span>
                          <span className="text-base font-black text-white leading-none mt-0.5">
                            {player.rating}
                          </span>
                        </div>
                      </div>

                      {/* Attributes Bar */}
                      <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs mb-3">
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400">BAT</div>
                          <div className="font-extrabold text-white">{player.batting}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400">BOWL</div>
                          <div className="font-extrabold text-white">{player.bowling}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400">FLD</div>
                          <div className="font-extrabold text-white">{player.fielding}</div>
                        </div>
                      </div>

                      {/* Financial Terms & Eligibility Requirements */}
                      <div className="space-y-1.5 text-[11px] text-slate-300 mb-3 border-t border-white/5 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Signing Fee:</span>
                          <span className="font-black text-emerald-400">
                            ${player.signingCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Wage / Season:</span>
                          <span className="font-bold text-slate-200">
                            ${player.salaryPerSeason.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Req. Club Tier / Rep:</span>
                          <span
                            className={`font-bold ${
                              meetsTier && meetsReputation ? 'text-slate-300' : 'text-amber-400'
                            }`}
                          >
                            Tier {player.minClubTierLevel}+ • {player.minReputationRequired} REP
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ownership Status & Action Button */}
                    <div className="border-t border-white/10 pt-3 mt-1 space-y-2">
                      {isOwnedByMe ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>CONTRACTED TO YOUR CLUB</span>
                            </span>
                            <button
                              onClick={() => setSelectedHistoryPlayer(player)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                            >
                              <History className="w-3 h-3" /> History
                            </button>
                          </div>
                          <button
                            onClick={() => openSellModalForMarketPlayer(player)}
                            disabled={actionLoadingId === player.id}
                            className="w-full rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-xs font-bold py-2.5 transition-all flex items-center justify-center gap-1.5 shadow"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>SELL / RELEASE (Est. ${Math.round(player.signingCost * 0.75).toLocaleString()})</span>
                          </button>
                        </div>
                      ) : isOwnedByOther ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] bg-slate-900 px-2.5 py-1.5 rounded-lg border border-white/10">
                            <div className="truncate">
                              <div className="text-[9px] uppercase font-bold text-slate-400">Exclusive Owner</div>
                              <div className="font-bold text-amber-300 truncate">
                                {player.ownerClubName || 'Another Manager Club'}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedHistoryPlayer(player)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 shrink-0 ml-2"
                            >
                              <History className="w-3 h-3" /> Contract
                            </button>
                          </div>
                          <button
                            disabled
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 text-slate-500 text-xs font-bold py-2.5 cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-600" />
                            <span>OWNED BY ANOTHER CLUB</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          {isEligible ? (
                            <button
                              onClick={() => handleSignPlayer(player)}
                              disabled={actionLoadingId === player.id}
                              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black py-2.5 shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>
                                {actionLoadingId === player.id
                                  ? 'Executing Transfer...'
                                  : `SIGN EXCLUSIVELY ($${player.signingCost.toLocaleString()})`}
                              </span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full rounded-xl border border-white/10 bg-slate-900 text-slate-500 text-xs font-bold py-2.5 cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-500" />
                              <span>
                                {!canAfford
                                  ? 'Insufficient Funds'
                                  : !meetsTier
                                  ? `Requires Club Tier ${player.minClubTierLevel}`
                                  : `Requires ${player.minReputationRequired} Reputation`}
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY SQUAD (SELL / RELEASE) */}
      {activeSubTab === 'squad' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Contracted Squad Roster ({club.squad.length} Players)
              </h3>
              <p className="text-xs text-slate-400">
                Manage and sell your squad members. Minimum squad limit for match fixtures is 11 players.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search squad..."
                value={squadSearchQuery}
                onChange={(e) => setSquadSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500"
              />
              <select
                value={squadRoleFilter}
                onChange={(e) => setSquadRoleFilter(e.target.value as PlayingRole | 'ALL')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
              >
                <option value="ALL">All Roles</option>
                <option value="Batter">Batter</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicketkeeper-Batter">Wicketkeeper</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSquadPlayers.map((player) => {
              const inStartingXI = club.playingXIIds.includes(player.playerId);
              const isCaptain = club.captainId === player.playerId;
              const isViceCaptain = club.viceCaptainId === player.playerId;
              const marketPlayer = marketPlayers.find((p) => p.id === player.playerId);
              const signingCost = marketPlayer ? marketPlayer.signingCost : Math.round(player.rating * 50);
              const estSellValue = Math.round(signingCost * 0.75);
              const tierMeta = TIER_LABELS[player.tier] || TIER_LABELS[1];

              return (
                <div
                  key={player.playerId}
                  className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                    inStartingXI
                      ? 'border-blue-500/40 bg-slate-900/80 shadow-md shadow-blue-950/30'
                      : 'border-white/10 bg-slate-950/60'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${tierMeta.bg} ${tierMeta.color} border ${tierMeta.border}`}>
                        Tier {player.tier}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isCaptain && (
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> CAPTAIN
                          </span>
                        )}
                        {isViceCaptain && (
                          <span className="px-2 py-0.5 rounded bg-blue-500 text-slate-950 text-[9px] font-black">
                            VC
                          </span>
                        )}
                        {inStartingXI ? (
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                            STARTING XI
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px] font-medium border border-white/5">
                            BENCH
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name & OVR */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-base font-black text-white">{player.name}</h4>
                        <div className="text-xs text-slate-300">
                          {player.country} • {player.roleSubType || player.role}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-slate-900 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-slate-400 leading-none">OVR</span>
                        <span className="text-sm font-black text-white leading-none mt-0.5">
                          {player.rating}
                        </span>
                      </div>
                    </div>

                    {/* Stats & Contract */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs mb-3">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">BAT</div>
                        <div className="font-extrabold text-white">{player.batting}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">BOWL</div>
                        <div className="font-extrabold text-white">{player.bowling}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-slate-400">FLD</div>
                        <div className="font-extrabold text-white">{player.fielding}</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300 mb-3 border-t border-white/5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Annual Wage:</span>
                        <span className="font-bold text-slate-200">${player.salaryPerSeason.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Contract Remaining:</span>
                        <span className="font-bold text-amber-300">{player.contractYearsRemaining} Years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Est. Sale Fee:</span>
                        <span className="font-black text-emerald-400">${estSellValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sell Button */}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => openSellModalForContract(player)}
                      disabled={actionLoadingId === player.playerId}
                      className="w-full rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-xs font-bold py-2.5 transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>SELL / RELEASE PLAYER (${estSellValue.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: TRANSFER HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Club Transfer Ledger & Financial Audit
            </h3>
            <p className="text-xs text-slate-400">
              Complete historical record of all player acquisitions, sales, and release transactions.
            </p>
          </div>

          {transferHistoryList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 rounded-2xl border border-white/10 bg-white/5">
              <History className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No club transfer transactions logged yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Purchases and sales made in the Transfer Market will be recorded here permanently.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transferHistoryList.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/10 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        entry.type === 'buy'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {entry.type === 'buy' ? 'SIGNING / BUY' : 'SALE / RELEASE'}
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {entry.playerName}{' '}
                        <span className="text-xs text-slate-400 font-normal">
                          ({entry.playerRating} OVR {entry.role ? `• ${entry.role}` : ''})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {entry.notes || (entry.type === 'buy' ? 'Player acquired' : 'Player released')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-slate-400 text-[11px]">{entry.date}</span>
                    <span
                      className={`text-sm font-black ${
                        entry.type === 'buy' ? 'text-blue-400' : 'text-emerald-400'
                      }`}
                    >
                      {entry.type === 'buy' ? '-' : '+'}${entry.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL FOR SELLING / RELEASING A PLAYER */}
      {sellModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-rose-500/30 bg-[#0f172a] p-6 shadow-2xl space-y-4 text-slate-100">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">
                  CONFIRM TRANSFER TRANSACTION
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  SELL / RELEASE PLAYER
                </h3>
              </div>
              <button
                onClick={() => setSellModalData(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Player Card Summary */}
            <div className="p-4 rounded-xl border border-white/10 bg-slate-900 flex items-center justify-between">
              <div>
                <div className="text-base font-black text-white">{sellModalData.name}</div>
                <div className="text-xs text-slate-300">
                  {sellModalData.country} • {sellModalData.role}
                </div>
                <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                  Contract: {sellModalData.contractYears} Years Remaining (${sellModalData.salary.toLocaleString()}/yr)
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-bold text-slate-400">OVR</span>
                <span className="text-base font-black text-white">{sellModalData.rating}</span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Original Signing Value:</span>
                <span className="font-semibold">${sellModalData.signingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold text-sm">
                <span>Estimated Sale Valuation:</span>
                <span>+${sellModalData.sellValue.toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex justify-between text-slate-300">
                <span>Current Club Treasury:</span>
                <span>${club.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-white">
                <span>Treasury Balance After Sale:</span>
                <span className="text-emerald-400">
                  ${(club.balance + sellModalData.sellValue).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Starting XI Warning */}
            {sellModalData.inStartingXI && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">Active Starting XI Alert</div>
                  <div>
                    This player is currently in your Starting XI. Selling them will remove them from your active lineup and auto-assign a replacement from your squad.
                  </div>
                </div>
              </div>
            )}

            {/* Squad Minimum Validation Check */}
            {club.squad.length <= 11 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-300">Cannot Sell Player (Squad Minimum)</div>
                  <div>
                    Your club must maintain at least 11 players for matchday fixtures. Sign a new player before selling this one.
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSellModalData(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={confirmSellPlayer}
                disabled={club.squad.length <= 11 || actionLoadingId === sellModalData.playerId}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                {actionLoadingId === sellModalData.playerId ? 'PROCESSING SALE...' : 'CONFIRM SALE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Audit History Modal */}
      {selectedHistoryPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  TRANSFER HISTORY AUDIT
                </div>
                <h3 className="text-lg font-black text-white">{selectedHistoryPlayer.name}</h3>
              </div>
              <button
                onClick={() => setSelectedHistoryPlayer(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase">
                Historical Contract Log
              </div>
              {selectedHistoryPlayer.ownershipHistory &&
              selectedHistoryPlayer.ownershipHistory.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedHistoryPlayer.ownershipHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-amber-300">{entry.clubName}</span>
                        <span className="text-slate-400">{entry.seasons}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        Manager: <span className="text-white">{entry.managerName || 'Anonymous'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Signed on: {new Date(entry.signedDate).toLocaleDateString()}
                        {entry.releasedDate && (
                          <span> • Released: {new Date(entry.releasedDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-4 rounded-xl bg-white/5 text-center">
                  No historical transfers recorded yet. Initial global contract.
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedHistoryPlayer(null)}
              className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
