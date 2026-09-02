import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showOrbitalRings?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showOrbitalRings = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-base', sub: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 46, text: 'text-xl', sub: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 64, text: 'text-3xl', sub: 'text-xs', gap: 'gap-3' },
    xl: { icon: 96, text: 'text-4xl sm:text-5xl', sub: 'text-sm', gap: 'gap-4' },
  };

  const current = sizeMap[size];

  return (
    <div
      id="cricket-universe-logo"
      className={`inline-flex items-center select-none ${current.gap} ${className}`}
    >
      {/* Visual Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: current.icon, height: current.icon }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_0_16px_rgba(16,185,129,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions */}
          <defs>
            <linearGradient id="cu-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="cu-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="cu-ball-grad" x1="20%" y1="20%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="40%" stopColor="#DC2626" />
              <stop offset="85%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#450A0A" />
            </linearGradient>
            <radialGradient id="cu-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
            <filter id="cu-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Ambient Cosmic Background Glow */}
          <circle cx="60" cy="60" r="54" fill="url(#cu-glow)" />

          {/* Outer Cosmic Orbit Ring (Tilt 1) */}
          {showOrbitalRings && (
            <ellipse
              cx="60"
              cy="60"
              rx="52"
              ry="18"
              transform="rotate(-28 60 60)"
              stroke="url(#cu-gold-grad)"
              strokeWidth="2.2"
              strokeDasharray="90 8"
              opacity="0.85"
            />
          )}

          {/* Inner Cosmic Orbit Ring (Tilt 2) */}
          {showOrbitalRings && (
            <ellipse
              cx="60"
              cy="60"
              rx="46"
              ry="14"
              transform="rotate(35 60 60)"
              stroke="url(#cu-emerald-grad)"
              strokeWidth="1.8"
              strokeDasharray="70 6"
              opacity="0.7"
            />
          )}

          {/* Orbiting Celestial Nodes */}
          {showOrbitalRings && (
            <>
              <circle cx="16" cy="40" r="3" fill="#FDE047" />
              <circle cx="104" cy="80" r="3.5" fill="#34D399" />
              <circle cx="95" cy="30" r="2" fill="#60A5FA" />
            </>
          )}

          {/* Shield / Crest Backing */}
          <path
            d="M60 12 L92 26 V62 C92 84 60 102 60 102 C60 102 28 84 28 62 V26 L60 12 Z"
            fill="#091E19"
            stroke="url(#cu-emerald-grad)"
            strokeWidth="2.5"
            filter="url(#cu-shadow)"
          />

          {/* Crossed Willow Cricket Bats */}
          <g opacity="0.9">
            {/* Bat Left-to-Right */}
            <path
              d="M38 34 L76 72 L82 66 L44 28 Z"
              fill="#D97706"
              stroke="#B45309"
              strokeWidth="1"
            />
            {/* Bat Handle Left */}
            <line x1="38" y1="34" x2="31" y2="27" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Bat Right-to-Left */}
            <path
              d="M82 34 L44 72 L38 66 L76 28 Z"
              fill="#B45309"
              stroke="#78350F"
              strokeWidth="1"
            />
            {/* Bat Handle Right */}
            <line x1="82" y1="34" x2="89" y2="27" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Central 3D Cricket Ball */}
          <circle
            cx="60"
            cy="58"
            r="21"
            fill="url(#cu-ball-grad)"
            stroke="#7F1D1D"
            strokeWidth="1.5"
            filter="url(#cu-shadow)"
          />

          {/* Cricket Ball Highlight */}
          <ellipse cx="53" cy="50" rx="6" ry="4" transform="rotate(-30 53 50)" fill="#FECACA" opacity="0.4" />

          {/* Stitched Seam (Curved arc with cross stitches) */}
          <path
            d="M45 46 Q60 58 75 70"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Seam Cross Stitches */}
          <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.9">
            <line x1="47" y1="45" x2="49" y2="49" />
            <line x1="53" y1="49" x2="55" y2="53" />
            <line x1="59" y1="54" x2="61" y2="58" />
            <line x1="65" y1="60" x2="67" y2="64" />
            <line x1="71" y1="65" x2="73" y2="69" />
          </g>

          {/* Top Star of Excellence */}
          <polygon
            points="60,18 62.5,23.5 68,24 64,28 65,33.5 60,30.5 55,33.5 56,28 52,24 57.5,23.5"
            fill="url(#cu-gold-grad)"
          />
        </svg>
      </div>

      {/* Typographic Title */}
      <div className="flex flex-col tracking-tight">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-wider text-white ${current.text}`}>
            CRICKET
          </span>
          <span
            className={`font-black tracking-widest bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent ${current.text}`}
          >
            UNIVERSE
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[1px] w-3 bg-emerald-500/60" />
            <span
              className={`font-bold uppercase tracking-[0.22em] text-emerald-400/90 ${current.sub}`}
            >
              PRO SIMULATION SERIES
            </span>
            <span className="h-[1px] w-3 bg-emerald-500/60" />
          </div>
        )}
      </div>
    </div>
  );
};
