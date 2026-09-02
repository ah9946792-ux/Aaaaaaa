import React, { useState } from 'react';
import {
  ManagerClubData,
  ManagerFixture,
  ManagerDivisionTableEntry,
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Play,
  Trophy,
  Award,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight,
  Flame,
  Tv,
} from 'lucide-react';
import { UniversalMatchModal } from '../match/UniversalMatchModal';
import {
  MatchContextConfig,
  MatchTeamsSetup,
  MatchPlayerPerformance,
  CompletedMatchReport,
} from '../../services/matchEngine/types';
import { processManagerMatchIntegration } from '../../services/matchEngine/matchIntegration';
import { GLOBAL_PLAYERS_DATABASE } from '../../data/players';
import { buildOptimalPlayingXI, buildLogicalBattingOrder } from '../../services/matchEngine/tacticalEngine';

interface LeagueFixturesTabProps {
  club: ManagerClubData;
  onClubUpdated: (updatedClub: ManagerClubData) => void;
}

export const LeagueFixturesTab: React.FC<LeagueFixturesTabProps> = ({
  club,
  onClubUpdated,
}) => {
  const { saveManagerData } = useAuth();
  const [isInteractiveModalOpen, setIsInteractiveModalOpen] = useState(false);
  const [selectedFixtureForMatch, setSelectedFixtureForMatch] = useState<ManagerFixture | null>(null);

  // Current active fixture to play
  const currentFixture = club.calendar[club.currentFixtureIndex];

  // Helper to open interactive full match engine
  const handleOpenInteractiveMatch = (fixture: ManagerFixture) => {
    setSelectedFixtureForMatch(fixture);
    setIsInteractiveModalOpen(true);
  };

  // Build match config for manager fixture
  const buildMatchConfig = (fixture: ManagerFixture): MatchContextConfig => ({
    matchId: fixture.id,
    gameMode: 'manager',
    competitionName: `${club.currentDivisionName} (Tier ${club.tierLevel})`,
    format: 'T20',
    totalInnings: 2,
    maxOversPerInnings: 20,
    venue: fixture.venue,
    pitch: 'BALANCED',
    weather: 'SUNNY',
    dlsApplicable: true,
    dayNight: true,
  });

  // Build teams setup for manager fixture
  const buildTeamsSetup = (fixture: ManagerFixture): MatchTeamsSetup => {
    const allClubSquad: MatchPlayerPerformance[] = club.squad.map((p, idx) => ({
      playerId: p.playerId,
      name: p.name || 'Player',
      shortName: p.name ? (p.name.split(' ').pop() || p.name) : 'Player',
      role: p.role,
      overallRating: p.rating,
      condition: p.condition === 'Injured' ? 'INJURED' : 'EXCELLENT',
      form: p.form > 80 ? 'IN_FORM' : 'NORMAL',
      fatigue: 0,
      isCaptain: p.playerId === club.captainId || idx === 0,
      isWicketkeeper: p.playerId === club.wicketKeeperId || p.role === 'Wicketkeeper-Batter',
      isUserPlayer: false,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      dismissalText: 'not out',
      battingPosition: idx + 1,
      oversBowled: 0,
      ballsBowledInOver: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economyRate: 0,
      dotBalls: 0,
      wides: 0,
      noBalls: 0,
      catches: 0,
      runOuts: 0,
      stumpings: 0,
      boundarySaves: 0,
      impactPoints: 0,
    }));

    const userPlayingXISquad = club.squad.filter((p) => club.playingXIIds.includes(p.playerId));
    const userPool = userPlayingXISquad.length === 11 ? userPlayingXISquad : club.squad.slice(0, 11);

    const userXI: MatchPlayerPerformance[] = userPool.map((p, idx) => {
      const matched = allClubSquad.find((item) => item.playerId === p.playerId);
      return matched ? { ...matched, battingPosition: idx + 1 } : {
        playerId: p.playerId,
        name: p.name || 'Player',
        shortName: p.name ? (p.name.split(' ').pop() || p.name) : 'Player',
        role: p.role,
        overallRating: p.rating,
        condition: p.condition === 'Injured' ? 'INJURED' : 'EXCELLENT',
        form: p.form > 80 ? 'IN_FORM' : 'NORMAL',
        fatigue: 0,
        isCaptain: p.playerId === club.captainId || idx === 0,
        isWicketkeeper: p.playerId === club.wicketKeeperId || p.role === 'Wicketkeeper-Batter',
        isUserPlayer: false,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isOut: false,
        dismissalText: 'not out',
        battingPosition: idx + 1,
        oversBowled: 0,
        ballsBowledInOver: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0,
        economyRate: 0,
        dotBalls: 0,
        wides: 0,
        noBalls: 0,
        catches: 0,
        runOuts: 0,
        stumpings: 0,
        boundarySaves: 0,
        impactPoints: 0,
      };
    });

    const oppPool = GLOBAL_PLAYERS_DATABASE.slice(10, 26);
    const rawOppSquad: MatchPlayerPerformance[] = oppPool.map((p, idx) => ({
      playerId: p.player_id,
      name: p.name,
      shortName: p.short_name,
      role: p.primary_role,
      overallRating: fixture.opponentRating,
      condition: 'EXCELLENT',
      form: 'NORMAL',
      fatigue: 0,
      isCaptain: idx === 0,
      isWicketkeeper: p.primary_role === 'Wicketkeeper-Batter',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      dismissalText: 'not out',
      battingPosition: idx + 1,
      oversBowled: 0,
      ballsBowledInOver: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economyRate: 0,
      dotBalls: 0,
      wides: 0,
      noBalls: 0,
      catches: 0,
      runOuts: 0,
      stumpings: 0,
      boundarySaves: 0,
      impactPoints: 0,
    }));

    const oppXI = buildOptimalPlayingXI(rawOppSquad, {
      format: 'T20',
      pitch: 'BALANCED',
      weather: 'SUNNY',
    });


    const clubName = club.name || 'User Club';
    const oppName = fixture.opponentTeam || 'Opponent XI';
    const clubShort = club.shortName || clubName.substring(0, 3).toUpperCase();
    const oppShort = oppName.substring(0, 3).toUpperCase();

    return {
      teamA: {
        id: club.id || 'manager_user_club',
        name: clubName,
        shortName: clubShort,
        countryCode: 'BAN',
        isUserTeam: true,
        controlMode: 'USER',
        playingXI: userXI,
        fullSquad: allClubSquad,
        captainPlayerId: club.captainId || userXI[0].playerId,
        wicketkeeperPlayerId: club.wicketKeeperId || userXI.find(p => p.isWicketkeeper)?.playerId || userXI[1].playerId,
      },
      teamB: {
        id: `opp_${oppName.toLowerCase().replace(/\s+/g, '_')}`,
        name: oppName,
        shortName: oppShort,
        countryCode: 'IND',
        isUserTeam: false,
        controlMode: 'AI',
        playingXI: oppXI,
        captainPlayerId: oppXI[0]?.playerId,
        wicketkeeperPlayerId: oppXI.find(p => p.isWicketkeeper)?.playerId || oppXI[1]?.playerId,
      },
    };
  };


  const handleMatchCompleted = async (report: CompletedMatchReport) => {
    const updatedClub = processManagerMatchIntegration(club, report);
    await saveManagerData(updatedClub);
    onClubUpdated(updatedClub);
  };

  return (
    <div id="league-fixtures-tab" className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            COMPETITIVE PYRAMID • SEASON {club.currentSeason}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic">
            {club.currentDivisionName}
          </h2>
          <p className="text-xs text-slate-300">
            Top 2 positions qualify for division promotion. Bottom 2 face relegation play-offs.
          </p>
        </div>

        {/* Current Matchday Launcher */}
        {currentFixture && currentFixture.status !== 'completed' && (
          <button
            onClick={() => handleOpenInteractiveMatch(currentFixture)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-xs font-black text-slate-950 uppercase tracking-wider shadow-lg hover:from-emerald-400 hover:to-emerald-500 active:scale-95 transition-all"
          >
            <Tv className="w-4 h-4" />
            <span>PLAY MATCHDAY {currentFixture.matchDay} (LIVE SIM)</span>
          </button>
        )}
      </div>

      {/* Division Table & Fixture List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Division Standings Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase italic">
              DIVISION LEAGUE STANDINGS
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Tier {club.tierLevel}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="p-2.5">Pos</th>
                  <th className="p-2.5">Club</th>
                  <th className="p-2.5 text-center">P</th>
                  <th className="p-2.5 text-center">W</th>
                  <th className="p-2.5 text-center">L</th>
                  <th className="p-2.5 text-center">Pts</th>
                  <th className="p-2.5 text-right">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {club.divisionTable.map((team, idx) => (
                  <tr
                    key={`league_table_${team.isUserClub ? 'user' : 'opp'}_${team.position}_${idx}_${team.teamName}`}
                    className={`hover:bg-white/5 transition-all ${
                      team.isUserClub ? 'bg-amber-500/10 font-bold text-white' : ''
                    }`}
                  >
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          team.position <= 2
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : team.position >= 5
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {team.position}
                      </span>
                    </td>
                    <td className="p-2.5 flex items-center gap-1.5">
                      <span>{team.teamName}</span>
                      {team.isUserClub && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 uppercase">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">{team.played}</td>
                    <td className="p-2.5 text-center text-emerald-400">{team.won}</td>
                    <td className="p-2.5 text-center text-rose-400">{team.lost}</td>
                    <td className="p-2.5 text-center font-black text-amber-400">{team.points}</td>
                    <td className="p-2.5 text-right font-mono">
                      {team.nrr > 0 ? `+${team.nrr}` : team.nrr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Season Calendar Fixtures */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase italic">
              SEASON FIXTURE CALENDAR
            </h3>
            <span className="text-xs text-slate-400">
              {club.calendar.filter((f) => f.status === 'completed').length} / {club.calendar.length} Completed
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {club.calendar.map((fixture) => {
              const isCurrent = fixture.id === currentFixture?.id && fixture.status !== 'completed';

              return (
                <div
                  key={fixture.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30'
                      : fixture.status === 'completed'
                      ? 'border-white/5 bg-slate-900/40 opacity-70'
                      : 'border-white/5 bg-slate-900/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950'
                          : fixture.status === 'completed'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-800/40 text-slate-500'
                      }`}
                    >
                      MD{fixture.matchDay}
                    </div>

                    <div>
                      <div className="font-bold text-xs text-white">
                        {club.name} vs {fixture.opponentTeam}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {fixture.isHome ? '🏠 Home' : '✈️ Away'} • {fixture.venue}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {fixture.status === 'completed' && fixture.result ? (
                      <div className="text-right">
                        <div
                          className={`text-xs font-black ${
                            fixture.result.userWon ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {fixture.result.userWon ? 'VICTORY' : 'DEFEAT'}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {fixture.result.userClubScore} vs {fixture.result.opponentScore}
                        </div>
                      </div>
                    ) : isCurrent ? (
                      <button
                        onClick={() => handleOpenInteractiveMatch(fixture)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md transition-all"
                      >
                        PLAY NOW
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        UPCOMING
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Universal Match Modal */}
      {isInteractiveModalOpen && selectedFixtureForMatch && (
        <UniversalMatchModal
          isOpen={isInteractiveModalOpen}
          onClose={() => {
            setIsInteractiveModalOpen(false);
            setSelectedFixtureForMatch(null);
          }}
          config={buildMatchConfig(selectedFixtureForMatch)}
          teams={buildTeamsSetup(selectedFixtureForMatch)}
          onMatchCompleted={handleMatchCompleted}
        />
      )}

    </div>
  );
};
