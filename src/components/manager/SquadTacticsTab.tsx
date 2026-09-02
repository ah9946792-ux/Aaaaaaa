import React, { useState } from 'react';
import {
  ManagerClubData,
  ManagerPlayerContract,
  ManagerClubTactics,
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Sliders,
  Crown,
  Star,
  Shield,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Save,
  DollarSign,
  Activity,
} from 'lucide-react';

interface SquadTacticsTabProps {
  club: ManagerClubData;
  onClubUpdated: (updatedClub: ManagerClubData) => void;
}

export const SquadTacticsTab: React.FC<SquadTacticsTabProps> = ({
  club,
  onClubUpdated,
}) => {
  const { saveManagerData } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'lineup' | 'tactics' | 'contracts'>('lineup');

  // Local state for lineup configuration
  const [playingXIIds, setPlayingXIIds] = useState<string[]>([...club.playingXIIds]);
  const [captainId, setCaptainId] = useState<string>(club.captainId);
  const [viceCaptainId, setViceCaptainId] = useState<string>(club.viceCaptainId);
  const [battingOrderIds, setBattingOrderIds] = useState<string[]>([...club.battingOrderIds]);
  const [bowlingOrderIds, setBowlingOrderIds] = useState<string[]>([...club.bowlingOrderIds]);

  // Tactics
  const [tactics, setTactics] = useState<ManagerClubTactics>({ ...club.tactics });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Toggle a player in or out of the Starting XI
  const handleTogglePlayingXI = (playerId: string) => {
    if (playingXIIds.includes(playerId)) {
      if (playingXIIds.length <= 11) {
        setSaveMessage('Starting XI must have exactly 11 players. Swap or select a replacement.');
        return;
      }
      const nextXI = playingXIIds.filter((id) => id !== playerId);
      setPlayingXIIds(nextXI);
      setBattingOrderIds(battingOrderIds.filter((id) => id !== playerId));
      setBowlingOrderIds(bowlingOrderIds.filter((id) => id !== playerId));
    } else {
      if (playingXIIds.length >= 11) {
        setSaveMessage('Starting XI is full (11 players max). Remove a player first.');
        return;
      }
      const nextXI = [...playingXIIds, playerId];
      setPlayingXIIds(nextXI);
      setBattingOrderIds([...battingOrderIds, playerId]);
      const player = club.squad.find((p) => p.playerId === playerId);
      if (player && (player.role === 'Bowler' || player.role === 'All-Rounder')) {
        setBowlingOrderIds([...bowlingOrderIds, playerId]);
      }
    }
  };

  const moveBattingOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= battingOrderIds.length) return;
    const nextOrder = [...battingOrderIds];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIndex];
    nextOrder[targetIndex] = temp;
    setBattingOrderIds(nextOrder);
  };

  const toggleBowlingSpell = (playerId: string) => {
    if (bowlingOrderIds.includes(playerId)) {
      if (bowlingOrderIds.length <= 4) {
        setSaveMessage('You must assign at least 4 bowlers in your bowling rotation.');
        return;
      }
      setBowlingOrderIds(bowlingOrderIds.filter((id) => id !== playerId));
    } else {
      setBowlingOrderIds([...bowlingOrderIds, playerId]);
    }
  };

  const handleSaveAll = async () => {
    if (playingXIIds.length !== 11) {
      setSaveMessage('Error: You must select exactly 11 players for your Starting XI.');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const updatedClub: ManagerClubData = {
      ...club,
      playingXIIds,
      captainId: captainId || playingXIIds[0],
      viceCaptainId: viceCaptainId || playingXIIds[1],
      battingOrderIds,
      bowlingOrderIds,
      tactics,
    };

    const success = await saveManagerData(updatedClub);
    if (success) {
      onClubUpdated(updatedClub);
      setSaveMessage('Tactical directives & Starting XI saved successfully!');
    } else {
      setSaveMessage('Failed to save tactical directives.');
    }
    setIsSaving(false);
  };

  const totalWageBill = club.squad.reduce((sum, p) => sum + p.salaryPerSeason, 0);

  return (
    <div id="squad-tactics-tab" className="space-y-6">
      
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            TACTICAL HEADQUARTERS & ROSTER
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic">
            SQUAD & TACTICS BOARD
          </h2>
          <p className="text-xs text-slate-300">
            Configure Starting XI, Batting Order, Bowling Spells, and Matchday Tactical Directives.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-black text-slate-950 uppercase tracking-wider shadow-lg hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'SAVING...' : 'SAVE TACTICAL SETUP'}</span>
          </button>
        </div>
      </div>

      {/* Message Feedback */}
      {saveMessage && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            saveMessage.includes('Error') || saveMessage.includes('must')
              ? 'border-rose-500/40 bg-rose-950/30 text-rose-300'
              : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
          }`}
        >
          <span>{saveMessage}</span>
          <button onClick={() => setSaveMessage(null)} className="text-sm font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveSubTab('lineup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
            activeSubTab === 'lineup'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>STARTING XI & LINEUP ({playingXIIds.length}/11)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tactics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
            activeSubTab === 'tactics'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>MATCHDAY TACTICS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contracts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
            activeSubTab === 'contracts'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>ROSTER CONTRACTS ({club.squad.length} PLAYERS)</span>
        </button>
      </div>

      {/* SUB-TAB 1: STARTING XI & BATTING ORDER */}
      {activeSubTab === 'lineup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Batting Order & XI List */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase italic">
                  OFFICIAL BATTING ORDER (1 to 11)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Reorder batting positions to optimize run accumulation and anchor innings.
                </p>
              </div>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {battingOrderIds.length} IN XI
              </span>
            </div>

            <div className="space-y-2">
              {battingOrderIds.map((playerId, idx) => {
                const player = club.squad.find((p) => p.playerId === playerId);
                if (!player) return null;
                const isCaptain = captainId === playerId;
                const isViceCaptain = viceCaptainId === playerId;

                return (
                  <div
                    key={playerId}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/10 bg-slate-900/80 hover:border-amber-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-md bg-amber-500/20 border border-amber-500/30 font-black text-amber-400 flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span>{player.name}</span>
                          {isCaptain && (
                            <span className="flex items-center gap-0.5 px-1 py-0.2 bg-amber-500/20 text-amber-400 text-[9px] rounded font-black border border-amber-500/30">
                              <Crown className="w-2.5 h-2.5" /> (C)
                            </span>
                          )}
                          {isViceCaptain && (
                            <span className="flex items-center gap-0.5 px-1 py-0.2 bg-purple-500/20 text-purple-300 text-[9px] rounded font-black border border-purple-500/30">
                              <Star className="w-2.5 h-2.5" /> (VC)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {player.role} • OVR {player.rating} (BAT {player.batting} / BWL {player.bowling})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reorder Buttons */}
                      <button
                        onClick={() => moveBattingOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveBattingOrder(idx, 'down')}
                        disabled={idx === battingOrderIds.length - 1}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Captain toggles */}
                      <button
                        onClick={() => setCaptainId(playerId)}
                        className={`px-1.5 py-1 rounded text-[10px] font-bold border transition-all ${
                          isCaptain
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                        }`}
                        title="Set Captain"
                      >
                        C
                      </button>
                      <button
                        onClick={() => setViceCaptainId(playerId)}
                        className={`px-1.5 py-1 rounded text-[10px] font-bold border transition-all ${
                          isViceCaptain
                            ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                        }`}
                        title="Set Vice-Captain"
                      >
                        VC
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reserves & Bowling Spells Management */}
          <div className="space-y-6">
            
            {/* Bowling Attack Rotation */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase italic">
                  BOWLING SPELLS ROTATION
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  {bowlingOrderIds.length} Bowlers Selected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Select which players will share the 20/50 over bowling quota.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {club.squad
                  .filter((p) => playingXIIds.includes(p.playerId))
                  .map((player) => {
                    const isBowlerSelected = bowlingOrderIds.includes(player.playerId);
                    return (
                      <button
                        key={player.playerId}
                        onClick={() => toggleBowlingSpell(player.playerId)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isBowlerSelected
                            ? 'border-amber-500/50 bg-amber-500/10 text-white font-bold'
                            : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate text-xs">{player.name}</div>
                          <div className="text-[10px] text-slate-400">
                            BWL {player.bowling} • {player.role}
                          </div>
                        </div>
                        {isBowlerSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Reserves & Squad Selector */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase italic">
                  SQUAD ROSTER & BENCH
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  Click to add/remove from Starting XI
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {club.squad.map((player) => {
                  const isInXI = playingXIIds.includes(player.playerId);
                  return (
                    <div
                      key={player.playerId}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                        isInXI
                          ? 'border-emerald-500/30 bg-emerald-950/20'
                          : 'border-white/10 bg-slate-900/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">{player.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {player.role} • OVR {player.rating} • {player.country}
                        </div>
                      </div>

                      <button
                        onClick={() => handleTogglePlayingXI(player.playerId)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                          isInXI
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isInXI ? 'IN STARTING XI' : 'BENCH'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: MATCHDAY TACTICS DIALS */}
      {activeSubTab === 'tactics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Batting Aggression */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Batting Aggression Dial</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Controls stroke-making risk vs wicket preservation rate during matchday innings.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {(['Conservative', 'Balanced', 'Aggressive', 'Ultra-Attack'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTactics({ ...tactics, battingAggression: mode })}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    tactics.battingAggression === mode
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow'
                      : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Bowling Strategy */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Bowling Strategy Preset</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dictates length discipline, field coordination, and over-allocation across spells.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {(['Pace Heavy', 'Spin Choke', 'Balanced Rotation', 'Death Bowling Focus'] as const).map(
                (mode) => (
                  <button
                    key={mode}
                    onClick={() => setTactics({ ...tactics, bowlingStrategy: mode })}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      tactics.bowlingStrategy === mode
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow'
                        : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Field Preset */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Field Placement Preset</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ring density, boundary riders, and catching cordon positioning.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {(['Attacking Ring', 'Balanced Standard', 'Boundary Protection', 'Slip Cordon'] as const).map(
                (mode) => (
                  <button
                    key={mode}
                    onClick={() => setTactics({ ...tactics, fieldPreset: mode })}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      tactics.fieldPreset === mode
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow'
                        : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Captaincy Style */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Crown className="w-4 h-4 text-purple-400" />
              <span>Captaincy Leadership Philosophy</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Determines on-field decision instincts and team morale multipliers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {(['Tactical Analyst', 'Aggressive Leader', 'Player Motivator'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTactics({ ...tactics, captaincyStyle: mode })}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    tactics.captaincyStyle === mode
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300 shadow'
                      : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: ROSTER CONTRACTS & FINANCIAL PAYROLL */}
      {activeSubTab === 'contracts' && (
        <div className="space-y-4">
          
          {/* Wage Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">Annual Payroll Liability</div>
              <div className="text-xl font-black text-amber-400">
                ${totalWageBill.toLocaleString()} / Season
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-bold">Active Squad Size</div>
              <div className="text-xl font-black text-white">{club.squad.length} / 22 Players</div>
            </div>
          </div>

          {/* Contracts Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="p-3.5">Player</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Tier</th>
                  <th className="p-3.5 text-center">OVR</th>
                  <th className="p-3.5 text-center">Matches</th>
                  <th className="p-3.5 text-center">Runs</th>
                  <th className="p-3.5 text-center">Wickets</th>
                  <th className="p-3.5 text-right">Wage / Yr</th>
                  <th className="p-3.5 text-center">Contract</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {club.squad.map((player) => (
                  <tr key={player.playerId} className="hover:bg-white/5 transition-all">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <span>{player.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({player.country})</span>
                    </td>
                    <td className="p-3.5 text-amber-300">{player.role}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold">
                        Tier {player.tier}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-extrabold text-white">{player.rating}</td>
                    <td className="p-3.5 text-center">{player.matchesPlayed}</td>
                    <td className="p-3.5 text-center text-emerald-400 font-bold">{player.runsScored}</td>
                    <td className="p-3.5 text-center text-amber-400 font-bold">{player.wicketsTaken}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-200">
                      ${player.salaryPerSeason.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">
                        {player.contractYearsRemaining} Yrs
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
