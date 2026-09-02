import React from 'react';
import { GameModeId } from '../../types';

interface ModeIconProps {
  modeId: GameModeId;
  className?: string;
  size?: number;
}

export const ModeIcon: React.FC<ModeIconProps> = ({
  modeId,
  className = '',
  size = 56,
}) => {
  switch (modeId) {
    case 'career':
      // My Career: Batsman silhouette in dynamic drive pose + career progression star and aura
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="career-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="career-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Background Badge Frame */}
          <rect x="4" y="4" width="56" height="56" rx="14" fill="#064E3B" fillOpacity="0.5" stroke="url(#career-glow)" strokeWidth="2" />
          
          {/* Batsman Head & Helmet */}
          <circle cx="34" cy="18" r="5" fill="#34D399" />
          <path d="M36 15 L40 18 L36 21" stroke="#ECFDF5" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Batsman Body in Cover Drive Action */}
          <path d="M33 23 L28 32 L36 38" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Front Leg */}
          <path d="M28 32 L20 48" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M20 48 L15 50" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
          {/* Back Leg */}
          <path d="M28 32 L38 46 L44 48" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          
          {/* Cricket Bat & Hands */}
          <path d="M33 23 L42 28 L49 20" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bat Blade */}
          <path d="M49 20 L54 13 L50 10 L45 17 Z" fill="url(#career-gold)" stroke="#78350F" strokeWidth="1" />
          
          {/* Stumps & Bails in Background */}
          <line x1="12" y1="36" x2="12" y2="48" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="15" y1="36" x2="15" y2="48" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="18" y1="36" x2="18" y2="48" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="11" y1="36" x2="19" y2="36" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

          {/* Career Progression Star Badge */}
          <polygon points="52,44 54,49 59,49 55,52 57,57 52,54 47,57 49,52 45,49 50,49" fill="url(#career-gold)" />
        </svg>
      );

    case 'dream_team':
      // My Dream Cricket Team: Grand Cricket Championship Trophy + Fantasy XI Formation Shield
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="dream-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="dream-border" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Background Badge Frame */}
          <rect x="4" y="4" width="56" height="56" rx="14" fill="#78350F" fillOpacity="0.45" stroke="url(#dream-border)" strokeWidth="2" />
          
          {/* Trophy Cup Main Body */}
          <path
            d="M20 16 H44 V28 C44 35 38 41 32 41 C26 41 20 35 20 28 V16 Z"
            fill="url(#dream-gold)"
            stroke="#FEF3C7"
            strokeWidth="1.5"
          />
          {/* Trophy Handles */}
          <path
            d="M20 20 C14 20 12 28 18 32 C19 33 20 32 20 32"
            stroke="url(#dream-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M44 20 C50 20 52 28 46 32 C45 33 44 32 44 32"
            stroke="url(#dream-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Trophy Stem & Pedestal */}
          <path d="M30 41 H34 V48 H30 Z" fill="#D97706" />
          <path d="M22 48 H42 L45 54 H19 L22 48 Z" fill="url(#dream-gold)" stroke="#78350F" strokeWidth="1" />

          {/* Golden Cricket Ball on Trophy Top */}
          <circle cx="32" cy="15" r="5" fill="#DC2626" stroke="#FEF08A" strokeWidth="1.2" />
          <path d="M29 13 Q32 15 35 17" stroke="#FEF08A" strokeWidth="0.9" />

          {/* Dream XI Formation Stars in Trophy */}
          <circle cx="28" cy="24" r="1.5" fill="#FEF08A" />
          <circle cx="32" cy="22" r="1.8" fill="#FFFFFF" />
          <circle cx="36" cy="24" r="1.5" fill="#FEF08A" />
          <circle cx="30" cy="30" r="1.5" fill="#FEF08A" />
          <circle cx="34" cy="30" r="1.5" fill="#FEF08A" />
          <circle cx="32" cy="35" r="1.2" fill="#FEF08A" />
        </svg>
      );

    case 'manager':
      // My Manager Career: Strategy Clipboard + Pitch Tactics Diagram + Headset
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="mgr-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          {/* Background Badge Frame */}
          <rect x="4" y="4" width="56" height="56" rx="14" fill="#1E3A8A" fillOpacity="0.45" stroke="url(#mgr-blue)" strokeWidth="2" />
          
          {/* Tactical Clipboard */}
          <rect x="16" y="14" width="32" height="40" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.8" />
          {/* Clipboard Metal Clip Top */}
          <rect x="25" y="11" width="14" height="6" rx="2" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="32" cy="14" r="1.5" fill="#0F172A" />

          {/* Pitch Tactical Field Layout Inside Clipboard */}
          <rect x="20" y="20" width="24" height="28" rx="2" fill="#064E3B" opacity="0.7" stroke="#10B981" strokeWidth="0.8" />
          
          {/* Cricket Pitch Strip Center */}
          <rect x="29" y="22" width="6" height="24" rx="1" fill="#D97706" opacity="0.8" />
          
          {/* Tactical X and O markers */}
          {/* Bowler Run-up Vector */}
          <path d="M32 44 L32 36" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
          <path d="M30 38 L32 35 L34 38" stroke="#FBBF24" strokeWidth="1.2" fill="none" />
          
          {/* Fielders Placement Dots */}
          <circle cx="23" cy="25" r="1.8" fill="#38BDF8" /> {/* Slips */}
          <circle cx="41" cy="27" r="1.8" fill="#38BDF8" /> {/* Cover */}
          <circle cx="24" cy="42" r="1.8" fill="#38BDF8" /> {/* Midwicket */}
          <circle cx="40" cy="42" r="1.8" fill="#38BDF8" /> {/* Long off */}
          
          {/* Batsman Marker */}
          <circle cx="32" cy="26" r="2.2" fill="#EF4444" stroke="#FFF" strokeWidth="0.8" />

          {/* Manager Strategy Headset Overlay */}
          <path d="M12 28 C12 18 20 10 32 10 C44 10 52 18 52 28" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="10" y="26" width="5" height="9" rx="2" fill="#38BDF8" />
          <rect x="49" y="26" width="5" height="9" rx="2" fill="#38BDF8" />
          <path d="M49 34 C49 42 42 46 34 46" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="33" cy="46" r="2" fill="#F87171" />
        </svg>
      );

    case 'worldwide_tournament':
      // Worldwide Tournament: Global 3D Globe with Coordinate Grid + ICC Trophy & Cricket Orbit
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="world-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="world-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {/* Background Badge Frame */}
          <rect x="4" y="4" width="56" height="56" rx="14" fill="#4C1D95" fillOpacity="0.45" stroke="url(#world-purple)" strokeWidth="2" />
          
          {/* Globe Sphere */}
          <circle cx="32" cy="32" r="18" fill="#1E1B4B" stroke="url(#world-glow)" strokeWidth="1.8" />
          
          {/* Globe Latitude & Longitude Coordinate Grid */}
          {/* Horizontal Equator */}
          <ellipse cx="32" cy="32" rx="18" ry="6" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.75" />
          {/* Vertical Meridian */}
          <ellipse cx="32" cy="32" rx="8" ry="18" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.75" />
          <line x1="32" y1="14" x2="32" y2="50" stroke="#8B5CF6" strokeWidth="1" opacity="0.6" />
          <line x1="14" y1="32" x2="50" y2="32" stroke="#8B5CF6" strokeWidth="1" opacity="0.6" />

          {/* Continents / World Ground nodes */}
          <circle cx="26" cy="26" r="2" fill="#34D399" />
          <circle cx="38" cy="24" r="2.5" fill="#34D399" />
          <circle cx="28" cy="38" r="2" fill="#34D399" />
          <circle cx="42" cy="36" r="2" fill="#34D399" />

          {/* Orbiting Cricket Ball traversing the Globe */}
          <ellipse cx="32" cy="32" rx="24" ry="10" transform="rotate(-25 32 32)" stroke="#FBBF24" strokeWidth="1.6" strokeDasharray="4 2" />
          <circle cx="50" cy="22" r="4.5" fill="#DC2626" stroke="#FEF08A" strokeWidth="1" />
          <path d="M47 20 Q50 22 53 24" stroke="#FEF08A" strokeWidth="0.8" />

          {/* Laurels / Championship Wreath at Base */}
          <path d="M16 44 C20 48 26 51 32 51 C38 51 44 48 48 44" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          <polygon points="32,48 34,51 37,51 35,53 36,56 32,54 28,56 29,53 27,51 30,51" fill="#FDE047" />
        </svg>
      );

    case 'universe_special':
      // Universe Special Tournament: Cosmic Vortex + Golden Lightning + Special Super-Over Crown
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient id="cosmic-pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
            <linearGradient id="cosmic-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <radialGradient id="vortex-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDF2F8" />
              <stop offset="40%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#831843" />
            </radialGradient>
          </defs>
          {/* Background Badge Frame */}
          <rect x="4" y="4" width="56" height="56" rx="14" fill="#831843" fillOpacity="0.45" stroke="url(#cosmic-pink)" strokeWidth="2" />
          
          {/* Cosmic Galaxy Vortex Spiral */}
          <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(-35 32 32)" stroke="url(#cosmic-pink)" strokeWidth="2.2" strokeDasharray="36 6" />
          <ellipse cx="32" cy="32" rx="16" ry="6" transform="rotate(45 32 32)" stroke="#FDE047" strokeWidth="1.8" strokeDasharray="24 4" />
          
          {/* Central Pulsing Cosmic Core */}
          <circle cx="32" cy="32" r="10" fill="url(#vortex-core)" stroke="#FDF2F8" strokeWidth="1.5" />
          
          {/* Glowing Cosmic Energy Lightning Bolt */}
          <path
            d="M34 14 L24 33 H33 L29 50 L42 29 H33 L37 14 Z"
            fill="url(#cosmic-gold)"
            stroke="#FFFBEB"
            strokeWidth="1"
          />

          {/* Super-Over Cosmic Crown Stars */}
          <circle cx="16" cy="18" r="2" fill="#FDE047" />
          <circle cx="48" cy="18" r="2" fill="#FDE047" />
          <circle cx="46" cy="46" r="2" fill="#F472B6" />
          <circle cx="18" cy="46" r="2" fill="#F472B6" />
        </svg>
      );

    default:
      return null;
  }
};
