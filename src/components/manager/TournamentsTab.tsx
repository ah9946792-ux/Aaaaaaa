import React, { useState, useEffect } from 'react';
import { MultiplayerTournament, ManagerClubData } from '../../types';
import { ApiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  Users,
  DollarSign,
  Award,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Shield,
  Zap,
} from 'lucide-react';

interface TournamentsTabProps {
  club: ManagerClubData;
  onClubUpdated: (updatedClub: ManagerClubData) => void;
}

export const TournamentsTab: React.FC<TournamentsTabProps> = ({
  club,
  onClubUpdated,
}) => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<MultiplayerTournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<MultiplayerTournament | null>(null);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getTournaments();
      setTournaments(data);
      if (data.length > 0 && !selectedTournament) {
        setSelectedTournament(data[0]);
      }
    } catch (err) {
      console.error('Failed to load tournaments:', err);
      setNotification({
        type: 'error',
        message: 'Could not load active multiplayer tournament server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleRegister = async (tourId: string) => {
    if (!user) return;
    setIsRegistering(tourId);
    setNotification(null);

    try {
      const res = await ApiService.registerTournament(user.googleId, tourId);
      if (res.success && res.user && res.user.managerData) {
        onClubUpdated(res.user.managerData);
        setNotification({
          type: 'success',
          message: res.message,
        });
        await fetchTournaments();
      } else {
        setNotification({
          type: 'error',
          message: res.message || 'Registration failed.',
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error registering for tournament.';
      setNotification({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setIsRegistering(null);
    }
  };

  return (
    <div id="tournaments-tab" className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
            GLOBAL ONLINE CHAMPIONSHIPS
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic">
            MULTIPLAYER TOURNAMENT ARENA
          </h2>
          <p className="text-xs text-slate-300">
            Enter your exclusively contracted club roster into multi-manager cups for massive prize pools.
          </p>
        </div>

        <button
          onClick={fetchTournaments}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Tournaments</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            notification.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Tournaments Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
          <p className="text-sm">Connecting to multiplayer tournament servers...</p>
        </div>
      ) : tournaments.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-sm font-semibold">No active global tournaments open right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tournament Selection List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Tournaments
            </h3>
            {tournaments.map((tour) => {
              const isRegistered = tour.registeredClubs.some((c) => c.clubId === club.id);
              const isSelected = selectedTournament?.id === tour.id;

              return (
                <div
                  key={tour.id}
                  onClick={() => setSelectedTournament(tour)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {tour.tier}
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      Prize: ${tour.prizePool.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="font-black text-white text-sm leading-tight">{tour.name}</h4>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
                    <span>{tour.registeredClubs.length} / {tour.maxClubs} Clubs</span>
                    {isRegistered ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold">Entry: ${tour.entryFee}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Tournament Detail View */}
          {selectedTournament && (
            <div className="lg:col-span-2 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-amber-400">
                      {selectedTournament.format}
                    </span>
                    <span className="text-xs text-slate-400">• Status: {selectedTournament.status}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedTournament.name}</h3>
                </div>

                {/* Register Button */}
                <div>
                  {selectedTournament.registeredClubs.some((c) => c.clubId === club.id) ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>YOUR CLUB IS ENROLLED</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(selectedTournament.id)}
                      disabled={
                        isRegistering === selectedTournament.id ||
                        club.balance < selectedTournament.entryFee ||
                        selectedTournament.registeredClubs.length >= selectedTournament.maxClubs
                      }
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>
                        {isRegistering === selectedTournament.id
                          ? 'Registering...'
                          : `ENROLL CLUB ($${selectedTournament.entryFee})`}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Registered Competitors & Standings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Registered Competitor Clubs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTournament.registeredClubs.map((comp) => (
                    <div
                      key={comp.clubId}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        comp.clubId === club.id
                          ? 'border-amber-400 bg-amber-500/10'
                          : 'border-white/10 bg-slate-900/60'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{comp.clubName}</span>
                          {comp.clubId === club.id && (
                            <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-extrabold uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Manager: {comp.managerName} ({comp.country})
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Rating</div>
                        <div className="font-black text-amber-400">{comp.rating} OVR</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knockout / Fixtures Schedule */}
              {selectedTournament.fixtures && selectedTournament.fixtures.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Tournament Fixtures & Brackets
                  </h4>
                  <div className="space-y-2">
                    {selectedTournament.fixtures.map((fix) => (
                      <div
                        key={fix.id}
                        className="p-3 rounded-xl border border-white/10 bg-slate-900/60 text-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-amber-400">
                            {fix.roundName}
                          </span>
                          <div className="font-bold text-white">
                            {fix.homeClubName} vs {fix.awayClubName}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-400 uppercase">
                          {fix.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
