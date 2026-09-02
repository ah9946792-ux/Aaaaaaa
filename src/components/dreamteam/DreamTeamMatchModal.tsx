import React from 'react';
import { DreamTeamData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UniversalMatchModal } from '../match/UniversalMatchModal';
import {
  MatchContextConfig,
  MatchTeamsSetup,
  MatchPlayerPerformance,
  CompletedMatchReport,
} from '../../services/matchEngine/types';
import { processDreamTeamMatchIntegration } from '../../services/matchEngine/matchIntegration';
import { GLOBAL_PLAYERS_DATABASE } from '../../data/players';
import { buildOptimalPlayingXI, buildLogicalBattingOrder } from '../../services/matchEngine/tacticalEngine';

interface DreamTeamMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  dreamTeam: DreamTeamData;
  isFriendly?: boolean;
  customOpponentName?: string;
  onMatchCompleted: () => void;
}

export const DreamTeamMatchModal: React.FC<DreamTeamMatchModalProps> = ({
  isOpen,
  onClose,
  dreamTeam,
  isFriendly = false,
  customOpponentName,
  onMatchCompleted,
}) => {
  const { saveDreamTeamData } = useAuth();
  const currentFixture = dreamTeam.calendar[dreamTeam.currentFixtureIndex];
  const opponentName = customOpponentName || currentFixture?.opponentTeam || 'Thunder Strikers XI';

  if (!isOpen) return null;

  // Build match config
  const config: MatchContextConfig = {
    matchId: currentFixture?.id || `dt_match_${Date.now()}`,
    gameMode: 'dream_team',
    competitionName: `${dreamTeam.division} League`,
    format: 'T20',
    totalInnings: 2,
    maxOversPerInnings: 20,
    venue: currentFixture?.venue || 'Dream Park Cricket Stadium',
    pitch: 'BATTING',
    weather: 'SUNNY',
    dlsApplicable: true,
    dayNight: true,
  };

  // Convert entire Dream Team squad into MatchPlayerPerformance
  const allSquad: MatchPlayerPerformance[] = dreamTeam.squad.map((p, idx) => ({
    playerId: p.id,
    name: p.name || 'Player',
    shortName: p.name ? (p.name.split(' ').pop() || p.name) : 'Player',
    role: p.role,
    overallRating: p.rating,
    condition: 'EXCELLENT',
    form: p.form === 'Excellent' ? 'IN_FORM' : 'NORMAL',
    fatigue: 0,
    isCaptain: p.isCaptain || idx === 0,
    isWicketkeeper: p.isWicketKeeper || p.role === 'Wicketkeeper-Batter',
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

  // Convert Dream Team playing XI into MatchPlayerPerformance preserving user selection & order
  const userPlayingXISquad = dreamTeam.squad
    .filter((p) => dreamTeam.playingXIIds.includes(p.id))
    .slice(0, 11);

  // Fallback if less than 11 selected
  const pool = userPlayingXISquad.length === 11 ? userPlayingXISquad : dreamTeam.squad.slice(0, 11);

  const userXI: MatchPlayerPerformance[] = pool.map((p, idx) => {
    const matched = allSquad.find((item) => item.playerId === p.id);
    return matched ? { ...matched, battingPosition: idx + 1 } : {
      playerId: p.id,
      name: p.name || 'Player',
      shortName: p.name ? (p.name.split(' ').pop() || p.name) : 'Player',
      role: p.role,
      overallRating: p.rating,
      condition: 'EXCELLENT',
      form: p.form === 'Excellent' ? 'IN_FORM' : 'NORMAL',
      fatigue: 0,
      isCaptain: p.isCaptain || idx === 0,
      isWicketkeeper: p.isWicketKeeper || p.role === 'Wicketkeeper-Batter',
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

  // Build Opponent XI using Tactical Engine
  const oppPool = GLOBAL_PLAYERS_DATABASE.slice(20, 36);
  const rawOppSquad: MatchPlayerPerformance[] = oppPool.map((p, idx) => ({
    playerId: p.player_id,
    name: p.name,
    shortName: p.short_name,
    role: p.primary_role,
    overallRating: p.overall_rating,
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
    format: config.format,
    pitch: config.pitch,
    weather: config.weather,
  });

  const userTeamName = dreamTeam.teamName || 'Dream XI';
  const oppTeamName = opponentName || 'Opponent XI';
  const teams: MatchTeamsSetup = {
    teamA: {
      id: 'dream_team_user',
      name: userTeamName,
      shortName: userTeamName.substring(0, 3).toUpperCase(),
      countryCode: 'IND',
      isUserTeam: true,
      controlMode: 'USER',
      playingXI: userXI,
      fullSquad: allSquad,
      captainPlayerId: userXI.find((p) => p.isCaptain)?.playerId || userXI[0].playerId,
      wicketkeeperPlayerId: userXI.find((p) => p.isWicketkeeper)?.playerId || userXI[1].playerId,
    },
    teamB: {
      id: `opp_${oppTeamName.toLowerCase().replace(/\s+/g, '_')}`,
      name: oppTeamName,
      shortName: oppTeamName.substring(0, 3).toUpperCase(),
      countryCode: 'AUS',
      isUserTeam: false,
      controlMode: 'AI',
      playingXI: oppXI,
      captainPlayerId: oppXI[0]?.playerId,
      wicketkeeperPlayerId: oppXI.find((p) => p.isWicketkeeper)?.playerId || oppXI[1]?.playerId,
    },
  };


  const handleMatchCompleted = async (report: CompletedMatchReport) => {
    const updatedTeam = processDreamTeamMatchIntegration(dreamTeam, report);
    await saveDreamTeamData(updatedTeam);
    onMatchCompleted();
  };

  return (
    <UniversalMatchModal
      isOpen={isOpen}
      onClose={onClose}
      config={config}
      teams={teams}
      onMatchCompleted={handleMatchCompleted}
    />
  );
};
