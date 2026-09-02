import React from 'react';
import { MatchContextConfig, PitchCondition, WeatherCondition, MatchTeamsSetup } from '../../services/matchEngine/types';
import { Shield, MapPin, Calendar, Clock, Cloud, Sun, CloudRain, Wind, Flame, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

interface MatchPreviewPanelProps {
  config: MatchContextConfig;
  teams: MatchTeamsSetup;
  onProceed: () => void;
}

const PITCH_DETAILS: Record<PitchCondition, { title: string; desc: string; badge: string; color: string }> = {
  BATTING: {
    title: 'Batting Paradise (Hard & Flat)',
    desc: 'True bounce and rapid outfield. High scoring match expected with huge boundary probabilities.',
    badge: 'High Scoring',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  BALANCED: {
    title: 'Even Sporting Turf',
    desc: 'Equal balance between bat and ball with steady carry throughout the day.',
    badge: 'Sporting Pitch',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  PACE_FRIENDLY: {
    title: 'Hard Bouncy Track',
    desc: 'Extra bounce and carry for fast bowlers. Batters must handle steep bouncers and short balls.',
    badge: 'Fast & Bouncy',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  SPIN_FRIENDLY: {
    title: 'Turning Dustbowl',
    desc: 'Dry abrasive surface offering sharp turn and variable bounce to spin bowlers.',
    badge: 'Spin Heaven',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  SLOW: {
    title: 'Two-Paced Slow Track',
    desc: 'Sticky surface making shot timing difficult. Slower deliveries and cutters will be deadly.',
    badge: 'Low & Slow',
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  },
  GREEN: {
    title: 'Lush Green Seamer',
    desc: 'Ample grass cover providing extensive lateral movement and swing under cloudy skies.',
    badge: 'Heavy Seam',
    color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
  },
  DRY: {
    title: 'Cracked Dry Surface',
    desc: 'Prone to deterioration as the match progresses. Spinners and reverse swing become pivotal.',
    badge: 'Reverse & Spin',
    color: 'text-amber-300 bg-amber-500/20 border-amber-500/30',
  },
};

const WEATHER_DETAILS: Record<WeatherCondition, { label: string; desc: string; icon: React.ReactNode }> = {
  SUNNY: {
    label: 'Sunny & Warm (28°C)',
    desc: 'Ideal clear conditions with maximum visibility.',
    icon: <Sun className="w-5 h-5 text-amber-400" />,
  },
  PARTLY_CLOUDY: {
    label: 'Partly Cloudy (24°C)',
    desc: 'Pleasant overhead conditions with minimal swing.',
    icon: <Cloud className="w-5 h-5 text-blue-300" />,
  },
  CLOUDY: {
    label: 'Heavy Overcast (21°C)',
    desc: 'Enhanced moisture and atmospheric pressure boosting swing and seam movement.',
    icon: <Cloud className="w-5 h-5 text-slate-300" />,
  },
  HUMID: {
    label: 'Humid & Sweltering (31°C)',
    desc: 'Sticky air causing rapid player fatigue and reverse swing later in the game.',
    icon: <Wind className="w-5 h-5 text-cyan-300" />,
  },
  WINDY: {
    label: 'Breezy Crosswinds (22 knots)',
    desc: 'Strong breeze favoring aerial shots with the wind.',
    icon: <Wind className="w-5 h-5 text-indigo-300" />,
  },
  RAIN: {
    label: 'Rain Interruption Risk (DLS Active)',
    desc: 'Passing showers expected. Duckworth-Lewis-Stern target adjustments enabled.',
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
  },
  HEAVY_RAIN: {
    label: 'Heavy Rain Risk',
    desc: 'High probability of reduced overs match.',
    icon: <CloudRain className="w-5 h-5 text-rose-400" />,
  },
};

export const MatchPreviewPanel: React.FC<MatchPreviewPanelProps> = ({
  config,
  teams,
  onProceed,
}) => {
  const pitchInfo = PITCH_DETAILS[config.pitch] || PITCH_DETAILS.BALANCED;
  const weatherInfo = WEATHER_DETAILS[config.weather] || WEATHER_DETAILS.SUNNY;

  const keyPlayerA = teams.teamA.playingXI[0];
  const keyPlayerB = teams.teamB.playingXI[0];

  return (
    <div
      id="match-preview-panel"
      className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b1021] via-[#101733] to-[#060a17] p-6 sm:p-8 text-white shadow-2xl space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-indigo-300">
              OFFICIAL MATCH PREVIEW
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {config.matchId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            {teams.teamA.name} <span className="text-indigo-400 italic">vs</span> {teams.teamB.name}
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>2026 Season</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{config.maxOversPerInnings} Overs</span>
          </div>
        </div>
      </div>

      {/* Match Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pitch Condition Report */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">PITCH REPORT</span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${pitchInfo.color}`}>
              {pitchInfo.badge}
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{pitchInfo.title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{pitchInfo.desc}</p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>Venue: {config.venue}</span>
          </div>
        </div>

        {/* Weather Forecast */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">WEATHER CONDITIONS</span>
            <span className="p-1 rounded-lg bg-white/10">{weatherInfo.icon}</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{weatherInfo.label}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{weatherInfo.desc}</p>
          </div>
          <div className="text-[11px] text-indigo-300 font-mono">
            {config.dlsApplicable ? '⚡ DLS Target Adjustment Protocol Enabled' : 'Standard Playing Conditions'}
          </div>
        </div>

      </div>

      {/* Key Players Spotlight */}
      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3">
        <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
          KEY PLAYER MATCHUP & HEAD-TO-HEAD
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Team A Key Player */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-300 text-sm">
              {keyPlayerA?.overallRating || 85}
            </div>
            <div>
              <div className="font-bold text-sm text-white">{keyPlayerA?.name || teams.teamA.name + ' Star'}</div>
              <div className="text-[11px] text-slate-400">{keyPlayerA?.role || 'Batter'} • {teams.teamA.name}</div>
            </div>
          </div>

          {/* Team B Key Player */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-black text-purple-300 text-sm">
              {keyPlayerB?.overallRating || 84}
            </div>
            <div>
              <div className="font-bold text-sm text-white">{keyPlayerB?.name || teams.teamB.name + ' Star'}</div>
              <div className="text-[11px] text-slate-400">{keyPlayerB?.role || 'Bowler'} • {teams.teamB.name}</div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onProceed}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm uppercase tracking-wider shadow-xl transition-all active:scale-[0.99]"
      >
        <span>CONFIRM SQUAD & PROCEED TO TOSS</span>
        <ChevronRight className="w-5 h-5" />
      </button>

    </div>
  );
};
