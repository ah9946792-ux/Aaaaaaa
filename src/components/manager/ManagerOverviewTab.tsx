import React from 'react';
import { ManagerClubData } from '../../types';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Building2,
  Calendar,
  Play,
  Shield,
  Crown,
  ChevronRight,
  Globe,
  Sliders,
} from 'lucide-react';

interface ManagerOverviewTabProps {
  club: ManagerClubData;
  onNavigateTab: (tab: 'market' | 'squad' | 'league' | 'facilities' | 'tournaments' | 'history') => void;
  onPlayNextMatch: () => void;
}

export const ManagerOverviewTab: React.FC<ManagerOverviewTabProps> = ({
  club,
  onNavigateTab,
  onPlayNextMatch,
}) => {
  const currentFixture = club.calendar[club.currentFixtureIndex];
  const startingXI = club.squad.filter((p) => club.playingXIIds.includes(p.playerId));
  const captain = club.squad.find((p) => p.playerId === club.captainId);

  return (
    <div id="manager-overview-tab" className="space-y-6">
      
      {/* Club Identity & Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#0f172a] via-[#020617] to-black p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-white/20 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0 ring-2 ring-amber-400/40"
              style={{ backgroundColor: club.primaryColor || '#059669' }}
            >
              {club.logoBadge || '🦅'}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  {club.currentDivisionName}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[9px] font-extrabold text-amber-300 border border-amber-500/30 uppercase">
                  Tier {club.tierLevel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
                {club.name} ({club.shortName})
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{club.stadiumName} ({club.stadiumCapacity.toLocaleString()} seats)</span>
                <span>•</span>
                <span>{club.divisionRegion}, {club.country}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Treasury</div>
              <div className="text-base font-black text-emerald-400">${club.balance.toLocaleString()}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Reputation</div>
              <div className="text-base font-black text-amber-400">{club.reputation} REP</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Board Confidence</div>
              <div className="text-base font-black text-white">{club.managerStats.boardConfidence}%</div>
            </div>
          </div>

        </div>
      </div>

      {/* Matchday Action Card */}
      {currentFixture && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-black p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                NEXT FIXTURE • MATCHDAY {currentFixture.matchDay}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {club.name} vs {currentFixture.opponentTeam}
            </h3>
            <p className="text-xs text-slate-300">
              Venue: {currentFixture.venue} ({currentFixture.isHome ? 'Home Ground' : 'Away Match'}) • {currentFixture.inGameDate}
            </p>
          </div>

          <button
            onClick={onPlayNextMatch}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-black text-slate-950 uppercase tracking-wider shadow-lg hover:from-emerald-400 hover:to-emerald-500 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>PLAY MATCHDAY {currentFixture.matchDay}</span>
          </button>
        </div>
      )}

      {/* Quick Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Global Market */}
        <div
          onClick={() => onNavigateTab('market')}
          className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md cursor-pointer hover:border-amber-500/40 hover:bg-white/10 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase italic">Global Player Market</h4>
            <p className="text-xs text-slate-400 mt-1">
              Sign world-class international stars and youth prodigies with exclusive rights.
            </p>
          </div>
        </div>

        {/* Squad Tactics */}
        <div
          onClick={() => onNavigateTab('squad')}
          className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md cursor-pointer hover:border-amber-500/40 hover:bg-white/10 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Users className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase italic">Starting XI & Tactics</h4>
            <p className="text-xs text-slate-400 mt-1">
              Configure batting order, bowling spells, field presets, and tactical dials.
            </p>
          </div>
        </div>

        {/* League Table */}
        <div
          onClick={() => onNavigateTab('league')}
          className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md cursor-pointer hover:border-amber-500/40 hover:bg-white/10 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase italic">Division League</h4>
            <p className="text-xs text-slate-400 mt-1">
              Compete for league title promotion and simulate tactical matchdays.
            </p>
          </div>
        </div>

        {/* Facilities & Finance */}
        <div
          onClick={() => onNavigateTab('facilities')}
          className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md cursor-pointer hover:border-amber-500/40 hover:bg-white/10 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase italic">Facilities & Stadium</h4>
            <p className="text-xs text-slate-400 mt-1">
              Upgrade high-performance training ground, youth academy, and seat capacity.
            </p>
          </div>
        </div>

      </div>

      {/* Mini Division Standings & Starting XI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Starting XI Quick View */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase italic flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>CURRENT STARTING XI ({startingXI.length} PLAYERS)</span>
            </h3>
            <button
              onClick={() => onNavigateTab('squad')}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              Edit Lineup →
            </button>
          </div>

          <div className="space-y-1.5">
            {startingXI.map((p, idx) => (
              <div
                key={p.playerId}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white">{p.name}</span>
                  {p.playerId === club.captainId && (
                    <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-black">
                      (C)
                    </span>
                  )}
                </div>
                <div className="text-slate-400 text-[11px]">
                  {p.role} • OVR {p.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Division Mini Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase italic flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>DIVISION TABLE</span>
            </h3>
            <button
              onClick={() => onNavigateTab('league')}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              Full Standings →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 bg-slate-900/60 text-[10px] uppercase text-slate-400 font-bold">
                <tr>
                  <th className="p-2">Pos</th>
                  <th className="p-2">Club</th>
                  <th className="p-2 text-center">P</th>
                  <th className="p-2 text-center">W</th>
                  <th className="p-2 text-center">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {club.divisionTable.map((team, idx) => (
                  <tr
                    key={`overview_team_${team.isUserClub ? 'user' : 'ai'}_${team.position}_${idx}_${team.teamName}`}
                    className={`hover:bg-white/5 transition-all ${
                      team.isUserClub ? 'bg-amber-500/10 font-bold text-white' : ''
                    }`}
                  >
                    <td className="p-2">{team.position}</td>
                    <td className="p-2 truncate">{team.teamName}</td>
                    <td className="p-2 text-center">{team.played}</td>
                    <td className="p-2 text-center text-emerald-400">{team.won}</td>
                    <td className="p-2 text-center font-bold text-amber-400">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
