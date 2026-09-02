import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Shield,
  Zap,
  Play,
  Award,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  Trash2,
  UserCheck,
  Star,
  ArrowRightLeft,
  Crown,
  History,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react';
import { DreamTeamData, DreamPlayer, PlayingRole } from '../../types';
import { MASTER_PLAYER_DATABASE } from '../../data/cricketDatabase';
import {
  buyPlayerForDreamTeam,
  sellPlayerFromDreamTeam,
} from '../../services/dreamTeamService';
import { useAuth } from '../../context/AuthContext';
import { DreamTeamMatchModal } from './DreamTeamMatchModal';

interface DreamTeamDashboardProps {
  dreamTeam: DreamTeamData;
  onRefresh: () => void;
}

type DreamTab = 'fixtures' | 'squad' | 'market' | 'records' | 'trophies';
type MarketSubTab = 'market' | 'squad' | 'history';

interface SellModalData {
  player: DreamPlayer;
  sellValue: number;
  inPlayingXI: boolean;
}

export const DreamTeamDashboard: React.FC<DreamTeamDashboardProps> = ({
  dreamTeam,
  onRefresh,
}) => {
  const { saveDreamTeamData } = useAuth();
  const [activeTab, setActiveTab] = useState<DreamTab>('fixtures');
  const [marketSubTab, setMarketSubTab] = useState<MarketSubTab>('market');
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isFriendlyMode, setIsFriendlyMode] = useState(false);
  const [customOpponent, setCustomOpponent] = useState<string | undefined>(undefined);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sellModalData, setSellModalData] = useState<SellModalData | null>(null);

  // Market Filter State
  const [marketSearch, setMarketSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');

  // Squad Filter State in Market
  const [squadSearch, setSquadSearch] = useState('');
  const [squadRoleFilter, setSquadRoleFilter] = useState<string>('All');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentFixture = dreamTeam.calendar[dreamTeam.currentFixtureIndex];

  // Transfer Market Handlers
  const handleBuyPlayer = async (player: DreamPlayer) => {
    const result = buyPlayerForDreamTeam(dreamTeam, player);
    if (!result.success || !result.updatedTeam) {
      showToast(`⚠️ ${result.error || 'Failed to sign player'}`);
      return;
    }

    const saved = await saveDreamTeamData(result.updatedTeam);
    if (saved) {
      showToast(`Signed ${player.name} for $${player.marketValue.toLocaleString()}!`);
      onRefresh();
    }
  };

  const openSellModal = (player: DreamPlayer) => {
    const sellValue = Math.round(player.marketValue * 0.75);
    const inPlayingXI = dreamTeam.playingXIIds.includes(player.id);
    setSellModalData({
      player,
      sellValue,
      inPlayingXI,
    });
  };

  const confirmSellPlayer = async () => {
    if (!sellModalData) return;
    const { player, sellValue } = sellModalData;

    const result = sellPlayerFromDreamTeam(dreamTeam, player.id);
    if (!result.success || !result.updatedTeam) {
      showToast(`⚠️ ${result.error || 'Failed to sell player'}`);
      return;
    }

    const saved = await saveDreamTeamData(result.updatedTeam);
    if (saved) {
      showToast(`Sold ${player.name} for $${sellValue.toLocaleString()}! Funds credited.`);
      setSellModalData(null);
      onRefresh();
    }
  };

  // Lineup Switcher Handlers
  const togglePlayingXI = async (playerId: string) => {
    const isPlaying = dreamTeam.playingXIIds.includes(playerId);
    let newXI = [...dreamTeam.playingXIIds];

    if (isPlaying) {
      if (newXI.length <= 11) {
        showToast('⚠️ Playing XI must have exactly 11 players.');
        return;
      }
      newXI = newXI.filter((id) => id !== playerId);
    } else {
      if (newXI.length >= 11) {
        showToast('⚠️ Playing XI already has 11 players. Swap an existing player.');
        return;
      }
      newXI.push(playerId);
    }

    const updated: DreamTeamData = {
      ...dreamTeam,
      playingXIIds: newXI,
    };
    await saveDreamTeamData(updated);
    onRefresh();
  };

  const setCaptain = async (playerId: string) => {
    const updated: DreamTeamData = { ...dreamTeam, captainId: playerId };
    await saveDreamTeamData(updated);
    showToast('New Captain designated!');
    onRefresh();
  };

  const setViceCaptain = async (playerId: string) => {
    const updated: DreamTeamData = { ...dreamTeam, viceCaptainId: playerId };
    await saveDreamTeamData(updated);
    showToast('New Vice-Captain designated!');
    onRefresh();
  };

  const launchCompetitiveMatch = () => {
    setIsFriendlyMode(false);
    setCustomOpponent(undefined);
    setIsMatchModalOpen(true);
  };

  const launchFriendly = (oppName: string) => {
    setIsFriendlyMode(true);
    setCustomOpponent(oppName);
    setIsMatchModalOpen(true);
  };

  // Available Players for Transfer Market (excluding currently owned)
  const ownedPlayerIds = useMemo(
    () => new Set(dreamTeam.squad.map((p) => p.id)),
    [dreamTeam.squad]
  );

  const availableMarketPlayers = useMemo(() => {
    return MASTER_PLAYER_DATABASE.filter((p) => {
      if (ownedPlayerIds.has(p.id)) return false;
      if (marketSearch.trim()) {
        const q = marketSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCountry = p.country.toLowerCase().includes(q);
        const matchesRole = p.role.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesRole) return false;
      }
      if (roleFilter !== 'All' && p.role !== roleFilter) return false;
      if (countryFilter !== 'All' && p.country !== countryFilter) return false;
      return true;
    });
  }, [ownedPlayerIds, marketSearch, roleFilter, countryFilter]);

  const filteredSquadPlayers = useMemo(() => {
    return dreamTeam.squad.filter((p) => {
      if (squadSearch.trim()) {
        const q = squadSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCountry = p.country.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry) return false;
      }
      if (squadRoleFilter !== 'All' && p.role !== squadRoleFilter) return false;
      return true;
    });
  }, [dreamTeam.squad, squadSearch, squadRoleFilter]);

  return (
    <div id="dream-team-dashboard" className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 border border-amber-500/50 px-4 py-3 text-xs font-bold text-amber-300 shadow-2xl animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Club Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 border border-amber-400/40 flex items-center justify-center text-2xl font-black text-slate-950 shadow-lg">
              {dreamTeam.logoBadge || dreamTeam.shortName.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white uppercase italic tracking-wide">
                  {dreamTeam.teamName}
                </h1>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  {dreamTeam.division}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Home Ground: <span className="text-white font-medium">{dreamTeam.homeGround}</span> • Season {dreamTeam.currentSeason}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 border border-white/10 rounded-2xl p-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Transfer Budget</span>
              <span className="text-emerald-400 font-extrabold text-sm">
                ${dreamTeam.funds.toLocaleString()}
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Squad Size</span>
              <span className="text-white font-extrabold text-sm">
                {dreamTeam.squad.length} Players
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Win Rate</span>
              <span className="text-amber-400 font-extrabold text-sm">
                {dreamTeam.lifetimeStats.totalMatches > 0
                  ? `${Math.round(
                      (dreamTeam.lifetimeStats.totalWins / dreamTeam.lifetimeStats.totalMatches) * 100
                    )}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('fixtures')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'fixtures'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>FIXTURES & LEAGUE</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('squad')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'squad'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>SQUAD & LINEUP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('market')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'market'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>TRANSFER MARKET (BUY / SELL)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'records'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>RECORDS & LIFETIME</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trophies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'trophies'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>TROPHIES ({dreamTeam.trophies.length})</span>
        </button>
      </div>

      {/* TAB 1: Fixtures & League */}
      {activeTab === 'fixtures' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Match Highlight Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  NEXT COMPETITIVE FIXTURE • MATCHDAY {dreamTeam.currentFixtureIndex + 1}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {currentFixture ? currentFixture.inGameDate : 'Season Finished'}
                </span>
              </div>

              {currentFixture ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 border-y border-white/10">
                  {/* User Team */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-lg">
                      {dreamTeam.logoBadge || dreamTeam.shortName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{dreamTeam.teamName}</div>
                      <div className="text-xs text-slate-400">{currentFixture.venue}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xl font-black text-amber-400 italic">VS</span>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold mt-0.5">
                      {dreamTeam.division}
                    </span>
                  </div>

                  {/* Opponent Team */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{currentFixture.opponentTeam}</div>
                      <div className="text-xs text-slate-400">{currentFixture.opponentRating} OVR Rating</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-lg">
                      ⚔️
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  All division fixtures completed for Season {dreamTeam.currentSeason}!
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  Playing XI Status: <span className="text-emerald-400 font-bold">11 Players Active</span>
                </div>

                <button
                  type="button"
                  onClick={launchCompetitiveMatch}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>PLAY MATCH</span>
                </button>
              </div>
            </div>

            {/* Division Standings Table */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {dreamTeam.division} Standings
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Top 2 Promoted</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-2 font-bold">POS</th>
                      <th className="pb-2 font-bold">CLUB</th>
                      <th className="pb-2 font-bold text-center">P</th>
                      <th className="pb-2 font-bold text-center">W</th>
                      <th className="pb-2 font-bold text-center">L</th>
                      <th className="pb-2 font-bold text-center">NRR</th>
                      <th className="pb-2 font-bold text-right">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {dreamTeam.divisionTable.map((row) => (
                      <tr
                        key={row.position}
                        className={
                          row.isUserTeam
                            ? 'bg-amber-500/10 font-bold text-amber-300'
                            : 'text-slate-300'
                        }
                      >
                        <td className="py-2.5">{row.position}</td>
                        <td className="py-2.5 flex items-center gap-1.5">
                          {row.isUserTeam && <span className="text-[10px]">⭐</span>}
                          {row.teamName}
                        </td>
                        <td className="py-2.5 text-center">{row.played}</td>
                        <td className="py-2.5 text-center text-emerald-400">{row.won}</td>
                        <td className="py-2.5 text-center text-rose-400">{row.lost}</td>
                        <td className="py-2.5 text-center font-mono">
                          {row.nrr > 0 ? `+${row.nrr.toFixed(2)}` : row.nrr.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-right font-black">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Exhibition Friendlies */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Exhibition Friendlies
              </h3>
              <p className="text-xs text-slate-400">
                Warm up your lineup against premier invitational squads. Earn coins without affecting league standings.
              </p>

              {[
                { name: 'Melbourne Thunder CC', diff: 'Medium', badge: '⚡' },
                { name: 'London Royals XI', diff: 'Hard', badge: '👑' },
                { name: 'Mumbai Express', diff: 'Elite', badge: '🚀' },
              ].map((f) => (
                <div
                  key={f.name}
                  className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{f.badge}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{f.name}</div>
                      <div className="text-[10px] text-purple-400">{f.diff} Challenge</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => launchFriendly(f.name)}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold border border-purple-500/40 cursor-pointer"
                  >
                    Play 🏏
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Squad & Lineup */}
      {activeTab === 'squad' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Squad Lineup & Role Assignment ({dreamTeam.squad.length} Players)
              </h3>
              <p className="text-xs text-slate-400">
                Configure your active matchday XI, designate Captain (C) / Vice-Captain (VC), or sell players.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
              Playing XI: {dreamTeam.playingXIIds.length} / 11
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dreamTeam.squad.map((player) => {
              const isPlaying = dreamTeam.playingXIIds.includes(player.id);
              const isCaptain = dreamTeam.captainId === player.id;
              const isViceCaptain = dreamTeam.viceCaptainId === player.id;
              const estSellValue = Math.round(player.marketValue * 0.75);

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    isPlaying
                      ? 'bg-slate-900 border-blue-500/40 shadow-md shadow-blue-950/40'
                      : 'bg-slate-950/60 border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{player.name}</h4>
                        {isCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black">
                            CAPTAIN
                          </span>
                        )}
                        {isViceCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500 text-slate-950 text-[9px] font-black">
                            VC
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {player.country} • {player.role}
                      </span>
                    </div>

                    <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {player.rating} OVR
                    </span>
                  </div>

                  {/* Player stats */}
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-center p-2 rounded-lg bg-black/30 text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Matches</span>
                      <span className="font-bold text-white">{player.teamStats?.matches || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Runs</span>
                      <span className="font-bold text-emerald-400">{player.teamStats?.runs || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Wickets</span>
                      <span className="font-bold text-blue-400">{player.teamStats?.wickets || 0}</span>
                    </div>
                  </div>

                  {/* Lineup & Sell Controls */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-1.5">
                        {!isCaptain && (
                          <button
                            type="button"
                            onClick={() => setCaptain(player.id)}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-amber-500/20 text-[10px] text-slate-300 hover:text-amber-300 font-semibold cursor-pointer"
                          >
                            Make (C)
                          </button>
                        )}
                        {!isViceCaptain && !isCaptain && (
                          <button
                            type="button"
                            onClick={() => setViceCaptain(player.id)}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-blue-500/20 text-[10px] text-slate-300 hover:text-blue-300 font-semibold cursor-pointer"
                          >
                            Make (VC)
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => togglePlayingXI(player.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {isPlaying ? 'In Playing XI' : 'On Bench'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openSellModal(player)}
                      className="w-full py-1.5 rounded-lg border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Sell Player (${estSellValue.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Transfer Market (BUY / SELL) */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                DREAM TEAM TRANSFER MARKET
              </h3>
              <p className="text-xs text-slate-400">
                Acquire international talent, sell squad players, or review your historical transactions.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
              Transfer Budget: ${dreamTeam.funds.toLocaleString()}
            </div>
          </div>

          {/* Sub-Tabs: MARKET vs MY SQUAD vs TRANSFER HISTORY */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setMarketSubTab('market')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                marketSubTab === 'market'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>MARKET (BUY / SIGN) ({availableMarketPlayers.length})</span>
            </button>

            <button
              onClick={() => setMarketSubTab('squad')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                marketSubTab === 'squad'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>MY SQUAD (SELL / RELEASE) ({dreamTeam.squad.length})</span>
            </button>

            <button
              onClick={() => setMarketSubTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                marketSubTab === 'history'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>TRANSFER HISTORY ({dreamTeam.transferHistory.length})</span>
            </button>
          </div>

          {/* SUB-VIEW 1: MARKET (BUY) */}
          {marketSubTab === 'market' && (
            <div className="space-y-4">
              {/* Search & Filter Strip */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={marketSearch}
                    onChange={(e) => setMarketSearch(e.target.value)}
                    placeholder="Search player name..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value="All">All Playing Roles</option>
                    <option value="Batter">Batter</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-Rounder">All-Rounder</option>
                    <option value="Wicketkeeper-Batter">Wicketkeeper-Batter</option>
                  </select>
                </div>

                <div>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value="All">All Nationalities ({Array.from(new Set(MASTER_PLAYER_DATABASE.map((p) => p.country))).length} Countries)</option>
                    {Array.from(new Set(MASTER_PLAYER_DATABASE.map((p) => p.country)))
                      .sort()
                      .map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Market Player Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {availableMarketPlayers.map((player) => {
                  const canAfford = dreamTeam.funds >= player.marketValue;

                  return (
                    <div
                      key={player.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-white/10 hover:border-amber-500/40 flex flex-col justify-between space-y-3 transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-white">{player.name}</h4>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              {player.country} • {player.role}
                            </span>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {player.rating} OVR
                          </span>
                        </div>

                        <div className="mt-3 flex gap-2 text-[10px] text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            Bat: {player.batting}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            Bowl: {player.bowling}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            Field: {player.fielding}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-400">
                          ${player.marketValue.toLocaleString()}
                        </span>

                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => handleBuyPlayer(player)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Sign Player
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: MY SQUAD (SELL) */}
          {marketSubTab === 'squad' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/70 border border-white/10">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Squad Players Available to Sell ({dreamTeam.squad.length})
                  </h4>
                  <p className="text-xs text-slate-400">
                    Selling a player removes them from your roster and refunds 75% of their market value.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search squad..."
                    value={squadSearch}
                    onChange={(e) => setSquadSearch(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500"
                  />
                  <select
                    value={squadRoleFilter}
                    onChange={(e) => setSquadRoleFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value="All">All Roles</option>
                    <option value="Batter">Batter</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-Rounder">All-Rounder</option>
                    <option value="Wicketkeeper-Batter">Wicketkeeper</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSquadPlayers.map((player) => {
                  const estSellValue = Math.round(player.marketValue * 0.75);
                  const isPlaying = dreamTeam.playingXIIds.includes(player.id);
                  const isCaptain = dreamTeam.captainId === player.id;
                  const isViceCaptain = dreamTeam.viceCaptainId === player.id;

                  return (
                    <div
                      key={player.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-white/10 hover:border-rose-500/40 flex flex-col justify-between space-y-3 transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white">{player.name}</h4>
                              {isCaptain && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black">
                                  C
                                </span>
                              )}
                              {isViceCaptain && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-500 text-slate-950 text-[9px] font-black">
                                  VC
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              {player.country} • {player.role}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {player.rating} OVR
                            </span>
                            {isPlaying ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                PLAYING XI
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                                BENCH
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Attribute pills */}
                        <div className="mt-3 flex gap-2 text-[10px] text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            Bat: {player.batting}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            Bowl: {player.bowling}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            Field: {player.fielding}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Est. Sale Value:</span>
                          <span className="text-sm font-bold text-emerald-400">
                            +${estSellValue.toLocaleString()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => openSellModal(player)}
                          className="px-4 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Sell</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: TRANSFER HISTORY */}
          {marketSubTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Dream Team Transfer Ledger
                </h4>
                <p className="text-xs text-slate-400">
                  Audit log of all player purchases and sales for your club.
                </p>
              </div>

              {dreamTeam.transferHistory.length === 0 ? (
                <div className="p-12 rounded-xl border border-white/10 bg-slate-950/40 text-center text-xs text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-50" />
                  No transfer activity logged yet. Purchases and sales will appear here.
                </div>
              ) : (
                <div className="space-y-2">
                  {dreamTeam.transferHistory.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            t.type === 'buy'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {t.type === 'buy' ? 'SIGNING' : 'SALE'}
                        </span>
                        <div>
                          <span className="font-bold text-white">{t.playerName}</span> ({t.playerRating} OVR)
                          <span className="text-slate-500 block text-[10px]">{t.date}</span>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-black ${
                          t.type === 'buy' ? 'text-blue-400' : 'text-emerald-400'
                        }`}
                      >
                        {t.type === 'buy' ? '-' : '+'}${t.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Lifetime & Records */}
      {activeTab === 'records' && (
        <div className="space-y-6">
          {/* Team Records Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Highest Team Score
              </span>
              <span className="text-lg font-bold text-white">
                {dreamTeam.records.highestTeamScore || '184/4'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Longest Win Streak
              </span>
              <span className="text-lg font-bold text-emerald-400">
                {dreamTeam.records.longestWinStreak} Matches
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Runs Scored
              </span>
              <span className="text-lg font-bold text-white">
                {dreamTeam.lifetimeStats.totalRuns.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Wickets Taken
              </span>
              <span className="text-lg font-bold text-blue-400">
                {dreamTeam.lifetimeStats.totalWickets}
              </span>
            </div>
          </div>

          {/* Transfer History Log */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Club Transfer Ledger
            </h3>
            {dreamTeam.transferHistory.length === 0 ? (
              <div className="p-6 rounded-xl border border-white/10 bg-slate-950/40 text-center text-xs text-slate-500">
                No transfer activity logged yet.
              </div>
            ) : (
              <div className="space-y-2">
                {dreamTeam.transferHistory.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{t.playerName}</span> ({t.playerRating} OVR)
                      <span className="text-slate-500 block text-[10px]">{t.date}</span>
                    </div>
                    <span
                      className={`font-bold ${
                        t.type === 'buy' ? 'text-blue-400' : 'text-emerald-400'
                      }`}
                    >
                      {t.type === 'buy' ? '-' : '+'}${t.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Trophy Showcase */}
      {activeTab === 'trophies' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Dream Team Trophy Cabinet ({dreamTeam.trophies.length})
            </h3>
          </div>

          {dreamTeam.trophies.length === 0 ? (
            <div className="p-12 rounded-2xl border border-white/10 bg-slate-950/40 text-center space-y-2">
              <span className="text-3xl">🏆</span>
              <p className="text-xs font-semibold text-slate-300">No trophies won yet.</p>
              <p className="text-[11px] text-slate-500">
                Finish in the top positions of your division to earn championship trophies and gain promotions!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dreamTeam.trophies.map((trophy) => (
                <div
                  key={trophy.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-blue-500/30 space-y-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-lg">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{trophy.name}</h4>
                    <span className="text-xs text-blue-400 font-semibold block">
                      {trophy.competition} (Season {trophy.season})
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{trophy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL FOR SELLING DREAM TEAM PLAYER */}
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
                  SELL DREAM TEAM PLAYER
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
                <div className="text-base font-black text-white">{sellModalData.player.name}</div>
                <div className="text-xs text-slate-300">
                  {sellModalData.player.country} • {sellModalData.player.role}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-bold text-slate-400">OVR</span>
                <span className="text-base font-black text-white">{sellModalData.player.rating}</span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Current Market Value:</span>
                <span className="font-semibold">${sellModalData.player.marketValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold text-sm">
                <span>Estimated Sale Valuation:</span>
                <span>+${sellModalData.sellValue.toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex justify-between text-slate-300">
                <span>Current Transfer Budget:</span>
                <span>${dreamTeam.funds.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-white">
                <span>Budget After Sale:</span>
                <span className="text-emerald-400">
                  ${(dreamTeam.funds + sellModalData.sellValue).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Starting XI Warning */}
            {sellModalData.inPlayingXI && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">Active Playing XI Alert</div>
                  <div>
                    This player is in your Playing XI. Selling them will remove them from the lineup and automatically assign a bench replacement.
                  </div>
                </div>
              </div>
            )}

            {/* Squad Minimum Validation Check */}
            {dreamTeam.squad.length <= 11 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-300">Cannot Sell Player (Squad Minimum)</div>
                  <div>
                    Your Dream Team must maintain at least 11 players. Sign a new player before selling this one.
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
                disabled={dreamTeam.squad.length <= 11}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                CONFIRM SALE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Simulator Modal */}
      <DreamTeamMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        dreamTeam={dreamTeam}
        isFriendly={isFriendlyMode}
        customOpponentName={customOpponent}
        onMatchCompleted={onRefresh}
      />
    </div>
  );
};
