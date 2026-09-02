import React from 'react';
import { CareerProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UniversalMatchModal } from '../match/UniversalMatchModal';
import {
  MatchContextConfig,
  MatchTeamsSetup,
  MatchPlayerPerformance,
  CompletedMatchReport,
} from '../../services/matchEngine/types';
import { processCareerMatchIntegration } from '../../services/matchEngine/matchIntegration';
import { GLOBAL_PLAYERS_DATABASE } from '../../data/players';
import { buildOptimalPlayingXI, buildLogicalBattingOrder } from '../../services/matchEngine/tacticalEngine';

interface CareerMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  career: CareerProfile;
  onMatchCompleted: () => void;
}

export const CareerMatchModal: React.FC<CareerMatchModalProps> = ({
  isOpen,
  onClose,
  career,
  onMatchCompleted,
}) => {
  const { saveCareerData } = useAuth();
  const currentFixture = career.matchCalendar[career.currentMatchIndex];

  if (!isOpen || !currentFixture) return null;

  // Build realistic config based on career fixture
  const clubName = typeof career.currentClub === 'string' ? career.currentClub : 'District XI';
  const userPlayerId = `career_user_${(career.playerName || 'player').toLowerCase().replace(/\s+/g, '_')}`;

  const config: MatchContextConfig = {
    matchId: currentFixture.id,
    gameMode: 'career',
    userPlayerId,
    competitionName: currentFixture.tournamentName || clubName,
    format: currentFixture.format === 'T20' ? 'T20' : currentFixture.format === 'ODI' ? 'ODI' : 'TEST',
    totalInnings: currentFixture.format === 'TEST' ? 4 : 2,
    maxOversPerInnings: currentFixture.overs || 20,
    venue: currentFixture.venue,
    pitch: currentFixture.pitchCondition || 'BALANCED',
    weather: currentFixture.weather || 'SUNNY',
    dlsApplicable: true,
    dayNight: true,
  };

  // Build User Career Player
  const userPlayerXI: MatchPlayerPerformance = {
    playerId: userPlayerId,
    name: career.playerName || 'Player',
    shortName: (career.playerName || 'Player').split(' ').pop() || career.playerName || 'Player',
    role: career.role || 'Batter',
    overallRating: career.ratings?.overall || 75,
    condition: 'EXCELLENT',
    form: 'NORMAL',
    fatigue: 0,
    isCaptain: false,
    isWicketkeeper: career.role === 'Wicketkeeper-Batter',
    isUserPlayer: true,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0,
    isOut: false,
    dismissalText: 'not out',
    battingPosition: 4,
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

  // Generate User Club Squad (fill with global players)
  const clubPool = GLOBAL_PLAYERS_DATABASE.slice(0, 16);
  const rawClubSquad: MatchPlayerPerformance[] = [
    userPlayerXI,
    ...clubPool.slice(0, 14).map((p, idx) => ({
      playerId: p.player_id,
      name: p.name,
      shortName: p.short_name,
      role: p.primary_role,
      overallRating: p.overall_rating,
      condition: 'EXCELLENT' as const,
      form: 'NORMAL' as const,
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
      battingPosition: idx + 2,
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
    })),
  ];

  const userPlayingXI = buildOptimalPlayingXI(rawClubSquad, {
    format: config.format,
    pitch: config.pitch,
    weather: config.weather,
    userPlayerId,
  });

  // Generate Opponent Squad
  const oppPool = GLOBAL_PLAYERS_DATABASE.slice(16, 32);
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

  const oppPlayingXI = buildOptimalPlayingXI(rawOppSquad, {
    format: config.format,
    pitch: config.pitch,
    weather: config.weather,
  });

  const oppTeamName = currentFixture.opponentTeam || 'Opponent XI';
  const teams: MatchTeamsSetup = {
    teamA: {
      id: 'career_user_club',
      name: clubName,
      shortName: clubName.substring(0, 3).toUpperCase(),
      countryCode: 'BAN',
      isUserTeam: true,
      playingXI: userPlayingXI,
      captainPlayerId: userPlayingXI[1]?.playerId || userPlayerXI.playerId,
      wicketkeeperPlayerId: userPlayerXI.isWicketkeeper ? userPlayerXI.playerId : userPlayingXI.find(p => p.isWicketkeeper)?.playerId || userPlayingXI[2]?.playerId,
    },
    teamB: {
      id: `opp_${oppTeamName.toLowerCase().replace(/\s+/g, '_')}`,
      name: oppTeamName,
      shortName: oppTeamName.substring(0, 3).toUpperCase(),
      countryCode: 'IND',
      isUserTeam: false,
      playingXI: oppPlayingXI,
      captainPlayerId: oppPlayingXI[0]?.playerId,
      wicketkeeperPlayerId: oppPlayingXI.find(p => p.isWicketkeeper)?.playerId || oppPlayingXI[1]?.playerId,
    },
  };


  const handleMatchCompleted = async (report: CompletedMatchReport) => {
    const updatedCareer = processCareerMatchIntegration(career, report);
    await saveCareerData(updatedCareer);
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
