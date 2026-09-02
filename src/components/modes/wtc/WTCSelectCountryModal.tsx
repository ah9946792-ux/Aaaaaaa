import React from 'react';
import { StandardCountryCode } from '../../../types';
import { WTC_COUNTRIES } from '../../../services/wtcData';
import { getAvailableWTCCountryPlayers } from '../../../services/wtcEngine';
import { Shield, ArrowRight, Trophy, Star, Sparkles, MapPin, Users } from 'lucide-react';

interface WTCSelectCountryModalProps {
  onSelectCountry: (code: StandardCountryCode) => void;
  onCancel?: () => void;
}

export const WTCSelectCountryModal: React.FC<WTCSelectCountryModalProps> = ({
  onSelectCountry,
  onCancel,
}) => {
  return (
    <div className="relative min-h-[500px] w-full p-4 sm:p-6 text-slate-100 flex flex-col items-center">
      {/* Top Hero Banner */}
      <div className="w-full max-w-5xl mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Official ICC 2025–2027 Cycle</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Select Your National Test Team
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Choose from the 9 official ICC World Test Championship nations. Take full command of your selected national team across 6 grueling Test series (3 Home, 3 Away) to qualify for the Grand Final at Lord&apos;s.
        </p>
      </div>

      {/* 9 WTC Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
        {WTC_COUNTRIES.map((country) => {
          const activePlayers = getAvailableWTCCountryPlayers(country.code);
          const topStars = activePlayers.slice(0, 3).map((p) => p.name).join(', ');

          return (
            <button
              key={country.code}
              type="button"
              onClick={() => onSelectCountry(country.code)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-white/10 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/10 transition-all text-left cursor-pointer overflow-hidden"
            >
              {/* Country Gradient Glow */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${country.primaryColor} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity pointer-events-none`}
              />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                        {country.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {country.shortName} • Rating {country.rating}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-emerald-400 font-bold">
                    {activePlayers.length} Active Pros
                  </span>
                </div>

                {/* Key Active Stars */}
                <div className="rounded-xl bg-white/5 p-2.5 border border-white/5 space-y-1 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-400" /> Active Squad Stars
                  </div>
                  <div className="text-[11px] text-slate-200 truncate font-medium">
                    {topStars || 'Full National Squad Ready'}
                  </div>
                </div>

                {/* Primary Venue */}
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="truncate">{country.homeVenues[0]?.name}, {country.homeVenues[0]?.city}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
                <span className="uppercase tracking-wider text-[10px]">Select National Team</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
