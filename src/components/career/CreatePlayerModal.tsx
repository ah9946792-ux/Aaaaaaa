import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Shield,
  MapPin,
  Flame,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  PlayingRole,
  RoleSubType,
  BatterSubType,
  BowlerSubType,
  AllRounderSubType,
  WicketkeeperSubType,
} from '../../types';
import { COUNTRIES_DATA } from '../../data/cricketDatabase';
import { createInitialCareer, generateInitialRatings } from '../../services/careerService';
import { useAuth } from '../../context/AuthContext';

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onPlayerCreated: () => void;
}

export const CreatePlayerModal: React.FC<CreatePlayerModalProps> = ({
  isOpen,
  onPlayerCreated,
}) => {
  const { user, saveCareerData } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [playerName, setPlayerName] = useState(user?.displayName || 'Tafi Ahmad');
  const [age, setAge] = useState<number>(18);
  const [country, setCountry] = useState<string>('Bangladesh');
  const [division, setDivision] = useState<string>('Dhaka');
  const [district, setDistrict] = useState<string>('Mirpur');
  const [jerseyNumber, setJerseyNumber] = useState<number>(18);

  const [role, setRole] = useState<PlayingRole>('All-Rounder');
  const [roleSubType, setRoleSubType] = useState<RoleSubType>('Balanced All-Rounder');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Country -> Division -> District mapping
  const selectedCountryData =
    COUNTRIES_DATA.find((c) => c.country === country) || COUNTRIES_DATA[0];
  const selectedDivisionData =
    selectedCountryData.divisions.find((d) => d.name === division) ||
    selectedCountryData.divisions[0];

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const countryData = COUNTRIES_DATA.find((c) => c.country === newCountry) || COUNTRIES_DATA[0];
    const firstDiv = countryData.divisions[0]?.name || '';
    setDivision(firstDiv);
    const firstDist = countryData.divisions[0]?.districts[0]?.name || '';
    setDistrict(firstDist);
  };

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const divData = selectedCountryData.divisions.find((d) => d.name === newDiv);
    const firstDist = divData?.districts[0]?.name || '';
    setDistrict(firstDist);
  };

  const handleRoleChange = (newRole: PlayingRole) => {
    setRole(newRole);
    if (newRole === 'Batter') setRoleSubType('Top-Order Batter');
    else if (newRole === 'Bowler') setRoleSubType('Fast Bowler');
    else if (newRole === 'All-Rounder') setRoleSubType('Balanced All-Rounder');
    else setRoleSubType('Middle-Order WK-Batter');
  };

  const previewRatings = generateInitialRatings(role, roleSubType);

  const handleCreate = async () => {
    if (!playerName.trim()) {
      setError('Please enter a valid player name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const initialCareer = createInitialCareer({
        playerName: playerName.trim(),
        age,
        country,
        division,
        district,
        jerseyNumber: Number(jerseyNumber) || 10,
        role,
        roleSubType,
      });

      const success = await saveCareerData(initialCareer);
      if (success) {
        onPlayerCreated();
      } else {
        setError('Could not save career to cloud. Please try again.');
      }
    } catch (err) {
      console.error('Career creation error:', err);
      setError('An unexpected error occurred while creating your career.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 text-slate-100 overflow-hidden flex flex-col my-8"
      >
        {/* Top Header Banner */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-white uppercase flex items-center gap-2">
                CREATE YOUR CRICKETER
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CAREER MODE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Begin your journey from local district turf to international glory
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border transition-all ${
                  step === s
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/40'
                    : step > s
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-white/10 text-slate-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-sm flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Step Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> 1. Personal Information & Roots
                </h3>
                <p className="text-xs text-slate-400">
                  Set up your player profile, nationality, and local cricket origin
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Player Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Player Full Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g. Tafi Ahmad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-emerald-500 focus:outline-none text-sm text-white placeholder:text-slate-600"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex justify-between">
                    <span>Starting Age</span>
                    <span className="text-emerald-400 font-semibold">{age} Years Old</span>
                  </label>
                  <input
                    type="range"
                    min={17}
                    max={23}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>17 (Young Prodigy)</span>
                    <span>20 (Prime Rookie)</span>
                    <span>23 (Experienced)</span>
                  </div>
                </div>

                {/* Jersey Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Jersey Number</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Country of Representation</label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  >
                    {COUNTRIES_DATA.map((c) => (
                      <option key={c.country} value={c.country} className="bg-slate-900 text-white">
                        {c.country} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Division */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">State / Division</label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  >
                    {selectedCountryData.divisions.map((d) => (
                      <option key={d.name} value={d.name} className="bg-slate-900 text-white">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">District / Region</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  >
                    {selectedDivisionData.districts.map((d) => (
                      <option key={d.name} value={d.name} className="bg-slate-900 text-white">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Starting Club Badge preview */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    🏛️
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Assigned Starting Club (District Tier)
                    </span>
                    <span className="text-sm font-bold text-white">
                      {selectedDivisionData.districts.find((d) => d.name === district)?.clubs[0] ||
                        `${district} Pioneers CC`}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Signing Bonus: $3,000
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Playing Role & Archetype */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Flame className="w-4 h-4" /> 2. Playing Role & Sub-Type Archetype
                </h3>
                <p className="text-xs text-slate-400">
                  Define your on-pitch identity, core specializations, and tactical strengths
                </p>
              </div>

              {/* Primary Role Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Batter', 'Bowler', 'All-Rounder', 'Wicketkeeper-Batter'] as PlayingRole[]).map(
                  (r) => {
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-950/60'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="text-xl mb-2">
                          {r === 'Batter'
                            ? '🏏'
                            : r === 'Bowler'
                            ? '🎯'
                            : r === 'All-Rounder'
                            ? '⚡'
                            : '🧤'}
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">{r}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {r === 'Batter'
                              ? 'Run machine & boundaries'
                              : r === 'Bowler'
                              ? 'Wicket taker & discipline'
                              : r === 'All-Rounder'
                              ? 'Two-way match winner'
                              : 'Stump master & finisher'}
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              {/* Sub-Type Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Specialized Sub-Type
                </label>

                {role === 'Batter' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(
                      [
                        'Opening Batter',
                        'Top-Order Batter',
                        'Middle-Order Batter',
                        'Lower-Order Batter',
                      ] as BatterSubType[]
                    ).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setRoleSubType(sub)}
                        className={`px-3.5 py-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between ${
                          roleSubType === sub
                            ? 'bg-emerald-500/20 border-emerald-400 text-white'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span>{sub}</span>
                        {roleSubType === sub && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}

                {role === 'Bowler' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(
                      [
                        'Fast Bowler',
                        'Fast-Medium Bowler',
                        'Medium Pacer',
                        'Off Spin',
                        'Leg Spin',
                        'Left-Arm Orthodox',
                        'Left-Arm Wrist Spin',
                      ] as BowlerSubType[]
                    ).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setRoleSubType(sub)}
                        className={`px-3.5 py-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between ${
                          roleSubType === sub
                            ? 'bg-emerald-500/20 border-emerald-400 text-white'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span>{sub}</span>
                        {roleSubType === sub && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}

                {role === 'All-Rounder' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        'Batting All-Rounder',
                        'Bowling All-Rounder',
                        'Balanced All-Rounder',
                      ] as AllRounderSubType[]
                    ).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setRoleSubType(sub)}
                        className={`px-3.5 py-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between ${
                          roleSubType === sub
                            ? 'bg-emerald-500/20 border-emerald-400 text-white'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span>{sub}</span>
                        {roleSubType === sub && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}

                {role === 'Wicketkeeper-Batter' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        'Opening WK-Batter',
                        'Middle-Order WK-Batter',
                        'Finisher WK-Batter',
                      ] as WicketkeeperSubType[]
                    ).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setRoleSubType(sub)}
                        className={`px-3.5 py-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between ${
                          roleSubType === sub
                            ? 'bg-emerald-500/20 border-emerald-400 text-white'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span>{sub}</span>
                        {roleSubType === sub && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Attribute Preview & Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="border-b border-white/10 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> 3. Rating & Career Confirmation
                </h3>
                <p className="text-xs text-slate-400">
                  Review generated attributes, potential, and starting club contract
                </p>
              </div>

              {/* Player Card Summary */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex flex-col items-center justify-center text-slate-950 shadow-xl shadow-emerald-950/80">
                    <span className="text-xs font-black uppercase tracking-wider">OVR</span>
                    <span className="text-4xl font-extrabold">{previewRatings.overall}</span>
                    <span className="text-[10px] font-bold">POT {previewRatings.potential}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                    #{jerseyNumber}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h4 className="text-xl font-bold text-white">{playerName}</h4>
                  <div className="text-xs text-emerald-300 font-semibold flex items-center justify-center sm:justify-start gap-2">
                    <span>{country}</span> • <span>{role}</span> • <span>{roleSubType}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Roots: {district}, {division}
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
                      Starting Club: <strong className="text-white">{selectedDivisionData.districts.find((d) => d.name === district)?.clubs[0] || `${district} Pioneers`}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
                      Signing Funds: $3,000
                    </span>
                  </div>
                </div>
              </div>

              {/* Attributes Radar Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Batting Attributes */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex justify-between">
                    <span>🏏 Batting Skills</span>
                    <span>{previewRatings.batting.batting}</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Power</span>
                      <span className="font-semibold text-white">{previewRatings.batting.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timing</span>
                      <span className="font-semibold text-white">{previewRatings.batting.timing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technique</span>
                      <span className="font-semibold text-white">{previewRatings.batting.technique}</span>
                    </div>
                  </div>
                </div>

                {/* Bowling Attributes */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex justify-between">
                    <span>🎯 Bowling Skills</span>
                    <span>{previewRatings.bowling.bowling}</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Accuracy</span>
                      <span className="font-semibold text-white">{previewRatings.bowling.accuracy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Movement/Spin</span>
                      <span className="font-semibold text-white">
                        {previewRatings.bowling.spin > 20
                          ? previewRatings.bowling.spin
                          : previewRatings.bowling.movement}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Control</span>
                      <span className="font-semibold text-white">{previewRatings.bowling.control}</span>
                    </div>
                  </div>
                </div>

                {/* Fielding Attributes */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex justify-between">
                    <span>🧤 Fielding Skills</span>
                    <span>{previewRatings.fielding.fielding}</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Catching</span>
                      <span className="font-semibold text-white">{previewRatings.fielding.catching}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reaction</span>
                      <span className="font-semibold text-white">{previewRatings.fielding.reaction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wicketkeeping</span>
                      <span className="font-semibold text-white">
                        {previewRatings.fielding.wicketkeeping}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Wizard Bottom Controls */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !playerName.trim()) {
                  setError('Please enter a player name.');
                  return;
                }
                setError(null);
                setStep((s) => (s + 1) as 1 | 2 | 3);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreate}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>Signing Contract...</>
              ) : (
                <>
                  Launch Career <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
