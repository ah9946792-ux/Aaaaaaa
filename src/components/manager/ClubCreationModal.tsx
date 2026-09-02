import React, { useState } from 'react';
import { CLUB_EMBLEMS, createInitialManagerClub } from './managerDefaults';
import { ManagerClubData } from '../../types';
import { Shield, Sparkles, Building2, Palette, Trophy, CheckCircle2 } from 'lucide-react';

interface ClubCreationModalProps {
  managerName: string;
  onClubCreated: (club: ManagerClubData) => void;
}

export const ClubCreationModal: React.FC<ClubCreationModalProps> = ({
  managerName,
  onClubCreated,
}) => {
  const [clubName, setClubName] = useState('Dhaka Royals CC');
  const [shortName, setShortName] = useState('DRC');
  const [country, setCountry] = useState('Bangladesh');
  const [region, setRegion] = useState('Dhaka');
  const [stadiumName, setStadiumName] = useState('Sher-e-Bangla Grand Park');
  const [selectedBadge, setSelectedBadge] = useState(CLUB_EMBLEMS[0]);
  const [primaryColor, setPrimaryColor] = useState('#059669'); // Emerald
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b'); // Amber

  const COUNTRIES_REGIONS = [
    { country: 'Bangladesh', regions: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'] },
    { country: 'India', regions: ['Mumbai', 'Delhi', 'Kolkata', 'Bangalore', 'Chennai', 'Punjab'] },
    { country: 'Pakistan', regions: ['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Multan'] },
    { country: 'Australia', regions: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'] },
    { country: 'England', regions: ['London', 'Yorkshire', 'Lancashire', 'Surrey', 'Warwickshire'] },
    { country: 'South Africa', regions: ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Titans'] },
  ];

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const match = COUNTRIES_REGIONS.find((c) => c.country === newCountry);
    if (match && match.regions.length > 0) {
      setRegion(match.regions[0]);
      setClubName(`${match.regions[0]} Royals CC`);
      setShortName(match.regions[0].substring(0, 3).toUpperCase());
    }
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !shortName.trim()) return;

    const newClub = createInitialManagerClub(
      clubName.trim(),
      shortName.trim(),
      country,
      region,
      stadiumName.trim() || `${region} Cricket Arena`,
      selectedBadge,
      primaryColor,
      secondaryColor,
      managerName
    );

    onClubCreated(newClub);
  };

  return (
    <div
      id="club-creation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0f172a] shadow-2xl text-slate-100 p-6 sm:p-8 my-8">
        
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                MASTER PROMPT 3: CLUB INAUGURATION
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                STARTING SEED $50,000
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">
              FOUND YOUR CRICKET CLUB
            </h2>
          </div>
        </div>

        <form onSubmit={handleCreateClub} className="space-y-6">
          
          {/* Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Official Club Name
              </label>
              <input
                id="input-club-name"
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
                placeholder="e.g. Dhaka Strikers CC"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Short Name / Code (3-4 Letters)
              </label>
              <input
                id="input-short-name"
                type="text"
                maxLength={4}
                value={shortName}
                onChange={(e) => setShortName(e.target.value.toUpperCase())}
                required
                placeholder="e.g. DSC"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Country of Operation
              </label>
              <select
                id="select-club-country"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                {COUNTRIES_REGIONS.map((c) => (
                  <option key={c.country} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Home Division / Region
              </label>
              <select
                id="select-club-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                {(COUNTRIES_REGIONS.find((c) => c.country === country)?.regions || [region]).map(
                  (r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Stadium & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Home Stadium Name</span>
              </label>
              <input
                id="input-stadium-name"
                type="text"
                value={stadiumName}
                onChange={(e) => setStadiumName(e.target.value)}
                placeholder="e.g. Imperial Park"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Club Crest Emblem</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CLUB_EMBLEMS.map((emblem) => (
                  <button
                    key={emblem}
                    type="button"
                    onClick={() => setSelectedBadge(emblem)}
                    className={`h-9 w-9 text-lg rounded-lg border transition-all flex items-center justify-center ${
                      selectedBadge === emblem
                        ? 'border-amber-400 bg-amber-500/20 scale-110 shadow-md'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {emblem}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors & Starter Squad Preview */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/20"
                style={{ backgroundColor: primaryColor }}
              >
                {selectedBadge}
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold">Inaugural Crest Preview</div>
                <div className="text-sm font-black text-white">{clubName} ({shortName})</div>
                <div className="text-xs text-amber-400">{region}, {country} • Tier 1 Division</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  Primary
                </label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-8 w-10 rounded cursor-pointer border-0 bg-transparent"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                  Secondary
                </label>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-8 w-10 rounded cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Perks list */}
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full 14-player contracted starter squad included with initial club grant.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Participate in the live Global Player Market with exclusive contracts.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Compete in League Seasons & Global Manager Multiplayer Cups.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              id="submit-create-club-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-black text-slate-950 uppercase tracking-wider shadow-lg hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] transition-all"
            >
              <Shield className="w-5 h-5" />
              <span>ESTABLISH CLUB & ENTER MANAGER HEADQUARTERS</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
