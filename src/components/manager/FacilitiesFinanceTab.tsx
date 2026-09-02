import React, { useState } from 'react';
import { ManagerClubData, ManagerClubFacilities } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Landmark,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';

interface FacilitiesFinanceTabProps {
  club: ManagerClubData;
  onClubUpdated: (updatedClub: ManagerClubData) => void;
}

const FACILITY_CONFIGS = [
  {
    key: 'trainingGround' as keyof ManagerClubFacilities,
    title: 'Training Ground & High-Performance Complex',
    description: 'Accelerates player form, stat development, and matchday stamina retention.',
    icon: Dumbbell,
    baseCost: 20000,
    costMultiplier: 1.6,
  },
  {
    key: 'youthAcademy' as keyof ManagerClubFacilities,
    title: 'Youth Scouting Academy',
    description: 'Attracts higher tier local prodigies and wonderkids directly into club trials.',
    icon: GraduationCap,
    baseCost: 25000,
    costMultiplier: 1.7,
  },
  {
    key: 'stadiumInfrastructure' as keyof ManagerClubFacilities,
    title: 'Stadium Seating & Grandstand Expansion',
    description: 'Increases matchday stadium capacity (+5,000 seats per level) and gate revenues.',
    icon: Building2,
    baseCost: 30000,
    costMultiplier: 1.8,
  },
  {
    key: 'physioCenter' as keyof ManagerClubFacilities,
    title: 'Physiotherapy & Medical Sports Science Center',
    description: 'Reduces injury risks during intensive match schedules and quickens recovery.',
    icon: HeartPulse,
    baseCost: 22000,
    costMultiplier: 1.5,
  },
];

export const FacilitiesFinanceTab: React.FC<FacilitiesFinanceTabProps> = ({
  club,
  onClubUpdated,
}) => {
  const { saveManagerData } = useAuth();
  const [upgradingKey, setUpgradingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const getUpgradeCost = (key: keyof ManagerClubFacilities, currentLevel: number) => {
    const config = FACILITY_CONFIGS.find((f) => f.key === key);
    if (!config) return 0;
    return Math.round(config.baseCost * Math.pow(config.costMultiplier, currentLevel - 1));
  };

  const handleUpgradeFacility = async (key: keyof ManagerClubFacilities) => {
    const currentLevel = club.facilities[key];
    if (currentLevel >= 5) {
      setMessage('This facility is already at the maximum level (Level 5)!');
      return;
    }

    const cost = getUpgradeCost(key, currentLevel);
    if (club.balance < cost) {
      setMessage(`Insufficient funds: Upgrade costs $${cost.toLocaleString()}, but club balance is $${club.balance.toLocaleString()}.`);
      return;
    }

    setUpgradingKey(key);
    setMessage(null);

    const nextLevel = currentLevel + 1;
    const nextFacilities = {
      ...club.facilities,
      [key]: nextLevel,
    };

    // Capacity increase if stadium
    let newCapacity = club.stadiumCapacity;
    if (key === 'stadiumInfrastructure') {
      newCapacity += 5000;
    }

    const updatedClub: ManagerClubData = {
      ...club,
      balance: club.balance - cost,
      reputation: club.reputation + 25,
      stadiumCapacity: newCapacity,
      facilities: nextFacilities,
    };

    const success = await saveManagerData(updatedClub);
    if (success) {
      onClubUpdated(updatedClub);
      setMessage(`Successfully upgraded ${FACILITY_CONFIGS.find((f) => f.key === key)?.title} to Level ${nextLevel}!`);
    } else {
      setMessage('Failed to upgrade facility.');
    }
    setUpgradingKey(null);
  };

  const totalPlayerWages = club.squad.reduce((sum, p) => sum + p.salaryPerSeason, 0);

  return (
    <div id="facilities-finance-tab" className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            INFRASTRUCTURE & CAPITAL MANAGEMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic">
            FACILITIES & FINANCIAL LEDGER
          </h2>
          <p className="text-xs text-slate-300">
            Reinvest match receipts and sponsorship revenues into world-class facilities and stadium expansions.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400">Available Treasury</div>
          <div className="text-xl font-black text-emerald-400">
            ${club.balance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Message Feedback */}
      {message && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            message.includes('Insufficient') || message.includes('Failed')
              ? 'border-rose-500/40 bg-rose-950/30 text-rose-300'
              : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
          }`}
        >
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-sm font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Financial Ledger & Stadium Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Stadium Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Home Stadium</span>
          </div>
          <div>
            <h3 className="text-base font-black text-white">{club.stadiumName}</h3>
            <div className="text-xs text-slate-400">
              Capacity: <span className="font-bold text-white">{club.stadiumCapacity.toLocaleString()}</span> Seats
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Est. Gate Receipt / Match: <span className="font-bold text-emerald-400">${(club.stadiumCapacity * 1.5).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Revenue Streams</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Season Ticket Sales:</span>
              <span className="font-bold text-white">${club.seasonTicketRevenue.toLocaleString()} / Yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sponsorship / Match:</span>
              <span className="font-bold text-white">${club.sponsorshipRevenuePerMatch.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Per-Match Average:</span>
              <span className="font-black text-emerald-400">+${(club.stadiumCapacity * 1.5 + club.sponsorshipRevenuePerMatch).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Operating Costs */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <DollarSign className="w-4 h-4 text-rose-400" />
            <span>Annual Liabilities</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Player Wage Payroll:</span>
              <span className="font-bold text-white">${totalPlayerWages.toLocaleString()} / Yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Facility Maintenance:</span>
              <span className="font-bold text-white">$5,000 / Yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Net Profit Margin:</span>
              <span className="font-black text-emerald-400">Healthy (+42%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Facilities Upgrade Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-white uppercase italic">
          CLUB INFRASTRUCTURE & FACILITY UPGRADES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACILITY_CONFIGS.map((facility) => {
            const currentLevel = club.facilities[facility.key];
            const isMax = currentLevel >= 5;
            const cost = getUpgradeCost(facility.key, currentLevel);
            const canAfford = club.balance >= cost;
            const Icon = facility.icon;

            return (
              <div
                key={facility.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Icon className="w-4 h-4" />
                      <span>{facility.title}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
                      LEVEL {currentLevel} / 5
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {facility.description}
                  </p>

                  {/* Level Progress Bar */}
                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          lvl <= currentLevel
                            ? 'bg-amber-400 shadow'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <div>
                    {!isMax ? (
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Upgrade Cost</div>
                        <div className="text-sm font-black text-emerald-400">
                          ${cost.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold">MAXED OUT</span>
                    )}
                  </div>

                  {!isMax ? (
                    <button
                      onClick={() => handleUpgradeFacility(facility.key)}
                      disabled={upgradingKey === facility.key || !canAfford}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>{upgradingKey === facility.key ? 'Upgrading...' : 'UPGRADE TO LVL ' + (currentLevel + 1)}</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      Top World Class
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
