import React, { useState } from 'react';
import { ModeIcon } from '../common/ModeIcons';
import { useAuth } from '../../context/AuthContext';
import { ManagerClubData } from '../../types';
import { ClubCreationModal } from '../manager/ClubCreationModal';
import { ManagerOverviewTab } from '../manager/ManagerOverviewTab';
import { GlobalMarketTab } from '../manager/GlobalMarketTab';
import { SquadTacticsTab } from '../manager/SquadTacticsTab';
import { LeagueFixturesTab } from '../manager/LeagueFixturesTab';
import { TournamentsTab } from '../manager/TournamentsTab';
import { FacilitiesFinanceTab } from '../manager/FacilitiesFinanceTab';
import { ClubHistoryTab } from '../manager/ClubHistoryTab';
import {
  ArrowLeft,
  Briefcase,
  Globe,
  Users,
  Calendar,
  Trophy,
  Building2,
  History,
  Shield,
  Sparkles,
  DollarSign,
  Crown,
} from 'lucide-react';

interface ManagerModeScreenProps {
  onBack: () => void;
}

type ManagerTab = 'overview' | 'market' | 'squad' | 'league' | 'tournaments' | 'facilities' | 'history';

export const ManagerModeScreen: React.FC<ManagerModeScreenProps> = ({ onBack }) => {
  const { user, saveManagerData } = useAuth();
  const [activeTab, setActiveTab] = useState<ManagerTab>('overview');

  const clubData = user?.managerData || null;

  // Auto-sanitize divisionTable against duplicate names in existing saved data
  const sanitizedClubData = React.useMemo(() => {
    if (!clubData) return null;
    let modified = false;
    const namesSeen = new Set<string>();
    const sanitizedTable = clubData.divisionTable.map((team, idx) => {
      const lower = team.teamName.trim().toLowerCase();
      if ((!team.isUserClub && lower === clubData.name.trim().toLowerCase()) || (namesSeen.has(lower) && !team.isUserClub)) {
        modified = true;
        const newName = `${clubData.divisionRegion || 'Regional'} Gladiators CC`;
        namesSeen.add(newName.toLowerCase());
        return { ...team, teamName: newName };
      }
      namesSeen.add(lower);
      return team;
    });

    if (modified) {
      return { ...clubData, divisionTable: sanitizedTable };
    }
    return clubData;
  }, [clubData]);

  React.useEffect(() => {
    if (sanitizedClubData && clubData && sanitizedClubData !== clubData) {
      saveManagerData(sanitizedClubData);
    }
  }, [sanitizedClubData, clubData, saveManagerData]);

  const activeClub = sanitizedClubData || clubData;

  const handleClubCreated = async (newClub: ManagerClubData) => {
    await saveManagerData(newClub);
    setActiveTab('overview');
  };

  const handleClubUpdated = async (updatedClub: ManagerClubData) => {
    await saveManagerData(updatedClub);
  };

  // If the user has not established a club yet, show the Club Creation wizard
  if (!activeClub) {
    return (
      <div id="manager-mode-screen" className="min-h-full w-full p-4 sm:p-8 text-slate-100">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <button
              id="manager-back-btn"
              onClick={onBack}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:border-amber-500/50 hover:bg-white/10 hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
              <span>RETURN TO UNIVERSE HOME</span>
            </button>
          </div>

          <ClubCreationModal
            managerName={user?.displayName || 'Cricket Manager'}
            onClubCreated={handleClubCreated}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      id="manager-mode-screen"
      className="min-h-full w-full p-4 sm:p-8 text-slate-100 space-y-6"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Top App Bar & Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            id="manager-back-btn"
            onClick={onBack}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 hover:border-amber-500/50 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
            <span>RETURN TO UNIVERSE HOME</span>
          </button>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 rounded-full px-4 py-1.5 text-xs">
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" /> ${activeClub.balance.toLocaleString()}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="font-bold text-amber-400">
              {activeClub.reputation} REP (Tier {activeClub.tierLevel})
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-slate-300 font-semibold">
              Season {activeClub.currentSeason}
            </span>
          </div>
        </div>

        {/* Primary Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
          <button
            id="tab-manager-overview"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>HEADQUARTERS</span>
          </button>

          <button
            id="tab-manager-market"
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'market'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>GLOBAL MARKET</span>
          </button>

          <button
            id="tab-manager-squad"
            onClick={() => setActiveTab('squad')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'squad'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>SQUAD & TACTICS</span>
          </button>

          <button
            id="tab-manager-league"
            onClick={() => setActiveTab('league')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'league'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>DIVISION LEAGUE</span>
          </button>

          <button
            id="tab-manager-tournaments"
            onClick={() => setActiveTab('tournaments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'tournaments'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>MULTIPLAYER CUPS</span>
          </button>

          <button
            id="tab-manager-facilities"
            onClick={() => setActiveTab('facilities')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'facilities'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>FACILITIES & STADIUM</span>
          </button>

          <button
            id="tab-manager-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg ring-1 ring-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4 text-rose-400" />
            <span>HONORS & RECORDS</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'overview' && (
            <ManagerOverviewTab
              club={activeClub}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onPlayNextMatch={() => setActiveTab('league')}
            />
          )}

          {activeTab === 'market' && (
            <GlobalMarketTab
              club={activeClub}
              onClubUpdated={handleClubUpdated}
            />
          )}

          {activeTab === 'squad' && (
            <SquadTacticsTab
              club={activeClub}
              onClubUpdated={handleClubUpdated}
            />
          )}

          {activeTab === 'league' && (
            <LeagueFixturesTab
              club={activeClub}
              onClubUpdated={handleClubUpdated}
            />
          )}

          {activeTab === 'tournaments' && (
            <TournamentsTab
              club={activeClub}
              onClubUpdated={handleClubUpdated}
            />
          )}

          {activeTab === 'facilities' && (
            <FacilitiesFinanceTab
              club={activeClub}
              onClubUpdated={handleClubUpdated}
            />
          )}

          {activeTab === 'history' && (
            <ClubHistoryTab club={activeClub} />
          )}
        </div>

      </div>
    </div>
  );
};
