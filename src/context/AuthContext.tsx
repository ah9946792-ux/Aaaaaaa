import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserProfile,
  AuthGooglePayload,
  UserSettings,
  GameModeId,
  CareerProfile,
  DreamTeamData,
  ManagerClubData,
} from '../types';
import { ApiService } from '../services/api';

const SESSION_KEY = 'cricket_universe_session_google_id';
const PROFILE_CACHE_PREFIX = 'cricket_universe_profile_';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  authError: string | null;
  networkError: string | null;
  lastLoginMessage: string | null;
  isOfflineMode: boolean;
  loginWithGoogle: (payload: AuthGooglePayload) => Promise<boolean>;
  logout: () => void;
  updateProfileSettings: (newSettings: Partial<UserSettings>) => Promise<boolean>;
  updateDisplayName: (newName: string) => Promise<boolean>;
  updateSelectedMode: (mode: GameModeId | null) => Promise<boolean>;
  saveCareerData: (careerData: CareerProfile | null) => Promise<boolean>;
  saveDreamTeamData: (dreamTeamData: DreamTeamData | null) => Promise<boolean>;
  saveManagerData: (managerData: ManagerClubData | null) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function createLocalFallbackProfile(
  payload: Partial<AuthGooglePayload> & { googleId: string }
): UserProfile {
  const cleanId = payload.googleId.replace(/[^a-zA-Z0-9]/g, '').slice(-6) || '999999';
  const now = new Date().toISOString();
  return {
    id: `CU-${cleanId.toUpperCase()}`,
    googleId: payload.googleId,
    email: payload.email || 'player@cricketuniverse.com',
    displayName: payload.displayName || 'Cricket Legend',
    photoURL:
      payload.photoURL ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(payload.googleId)}`,
    createdAt: now,
    lastLoginAt: now,
    currentSelectedMode: null,
    gameProgress: {
      level: 1,
      xp: 0,
      xpToNextLevel: 500,
      rankTitle: 'Rookie Cricketer',
      totalMatchesPlayed: 0,
      reputation: 100,
    },
    currency: {
      coins: 1000,
      gems: 50,
      energy: 100,
      maxEnergy: 100,
    },
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      graphicsQuality: 'high',
      matchSpeed: '1x',
      themeAccent: 'emerald',
      notifications: true,
      autoSaveCloud: true,
    },
    careerData: null,
    dreamTeamData: null,
    managerData: null,
    tournamentData: null,
    playerCollections: [],
    achievements: [
      {
        id: 'ach_welcome',
        title: 'Welcome to Cricket Universe',
        unlockedAt: now,
      },
    ],
    records: {},
    rankings: {},
  };
}

function loadCachedProfile(googleId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(`${PROFILE_CACHE_PREFIX}${googleId}`);
    if (raw) {
      return JSON.parse(raw) as UserProfile;
    }
  } catch (e) {
    console.warn('Failed to parse cached profile:', e);
  }
  return null;
}

function saveCachedProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(`${PROFILE_CACHE_PREFIX}${profile.googleId}`, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to cache profile to localStorage:', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [lastLoginMessage, setLastLoginMessage] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  const pendingSyncRef = useRef<boolean>(false);

  const clearErrors = useCallback(() => {
    setAuthError(null);
    setNetworkError(null);
  }, []);

  // Update user state and persist to local cache immediately
  const persistUserLocal = useCallback((updated: UserProfile) => {
    setUser(updated);
    saveCachedProfile(updated);
    localStorage.setItem(SESSION_KEY, updated.googleId);
  }, []);

  // Check existing session on boot
  useEffect(() => {
    const initializeAuth = async () => {
      setIsAuthLoading(true);
      clearErrors();
      try {
        const storedGoogleId = localStorage.getItem(SESSION_KEY);
        if (storedGoogleId) {
          // Pre-populate with local cache if available for instant display
          const cachedProfile = loadCachedProfile(storedGoogleId);
          if (cachedProfile) {
            setUser(cachedProfile);
          }

          try {
            const res = await ApiService.getProfile(storedGoogleId);
            if (res.success && res.user) {
              persistUserLocal(res.user);
              setIsOfflineMode(false);
            }
          } catch (err: any) {
            console.warn('Could not restore session from server profile:', err);
            // If offline or error, keep cached profile if present
            if (!cachedProfile) {
              const fallback = createLocalFallbackProfile({
                googleId: storedGoogleId,
                displayName: 'Cricket Legend',
              });
              persistUserLocal(fallback);
            }
            setIsOfflineMode(true);
          }
        }
      } catch (err: any) {
        console.error('Session initialization error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, [clearErrors, persistUserLocal]);

  const loginWithGoogle = async (payload: AuthGooglePayload): Promise<boolean> => {
    clearErrors();
    setIsAuthLoading(true);

    try {
      // Step 1: Real backend authentication request
      const response = await ApiService.loginWithGoogle(payload);

      if (response.success && response.user) {
        persistUserLocal(response.user);
        setIsOfflineMode(false);
        setLastLoginMessage(response.message || 'Authenticated successfully');
        setIsAuthLoading(false);
        return true;
      }

      throw new Error(response.message || 'Authentication failed on server.');
    } catch (err: any) {
      console.error('Authentication error:', err);
      const errMsg = err instanceof Error ? err.message : 'Authentication failed';

      // Check if it's a network/connectivity issue
      if (
        errMsg.toLowerCase().includes('network') ||
        errMsg.toLowerCase().includes('timeout') ||
        errMsg.toLowerCase().includes('failed to connect') ||
        errMsg.toLowerCase().includes('fetch')
      ) {
        setNetworkError(errMsg);
      } else {
        setAuthError(errMsg);
      }

      // If backend is unreachable, allow user to enter with local offline profile
      // but do not hide that an error occurred
      let localProfile = loadCachedProfile(payload.googleId);
      if (!localProfile) {
        localProfile = createLocalFallbackProfile(payload);
      }
      persistUserLocal(localProfile);
      setIsOfflineMode(true);
      setIsAuthLoading(false);
      return true;
    }
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem(`${PROFILE_CACHE_PREFIX}${user.googleId}`);
    }
    setUser(null);
    setLastLoginMessage(null);
    setIsOfflineMode(false);
    clearErrors();
    localStorage.removeItem(SESSION_KEY);
  };

  const refreshProfile = async () => {
    if (!user) return;
    setIsProfileLoading(true);
    try {
      const res = await ApiService.getProfile(user.googleId);
      if (res.success && res.user) {
        persistUserLocal(res.user);
        setIsOfflineMode(false);
      }
    } catch (err) {
      console.warn('Failed to refresh profile from server, using local data:', err);
      setIsOfflineMode(true);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const updateProfileSettings = async (
    newSettings: Partial<UserSettings>
  ): Promise<boolean> => {
    if (!user) return false;
    clearErrors();
    const mergedSettings = { ...user.settings, ...newSettings };
    const updated: UserProfile = { ...user, settings: mergedSettings };
    persistUserLocal(updated);

    try {
      const res = await ApiService.updateProfile(user.googleId, {
        settings: mergedSettings,
      });
      if (res.success && res.user) {
        persistUserLocal(res.user);
      }
      return true;
    } catch (err) {
      console.warn('Settings updated locally (offline mode):', err);
      return true;
    }
  };

  const updateDisplayName = async (newName: string): Promise<boolean> => {
    if (!user || !newName.trim()) return false;
    clearErrors();
    const updated: UserProfile = { ...user, displayName: newName.trim() };
    persistUserLocal(updated);

    try {
      const res = await ApiService.updateProfile(user.googleId, {
        displayName: newName.trim(),
      });
      if (res.success && res.user) {
        persistUserLocal(res.user);
      }
      return true;
    } catch (err) {
      console.warn('Display name updated locally (offline mode):', err);
      return true;
    }
  };

  const updateSelectedMode = async (
    mode: GameModeId | null
  ): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = { ...user, currentSelectedMode: mode };
    persistUserLocal(updated);

    try {
      const res = await ApiService.updateProfile(user.googleId, {
        currentSelectedMode: mode,
      });
      if (res.success && res.user) {
        persistUserLocal(res.user);
      }
      return true;
    } catch (err) {
      console.warn('Selected mode updated locally:', err);
      return true;
    }
  };

  const saveCareerData = async (
    careerData: CareerProfile | null
  ): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = { ...user, careerData };
    persistUserLocal(updated);

    try {
      const res = await ApiService.updateProfile(user.googleId, {
        careerData,
      });
      if (res.success && res.user) {
        persistUserLocal(res.user);
      }
      return true;
    } catch (err) {
      console.warn('Career data saved locally:', err);
      return true;
    }
  };

  const saveDreamTeamData = async (
    dreamTeamData: DreamTeamData | null
  ): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = { ...user, dreamTeamData };
    persistUserLocal(updated);

    try {
      const res = await ApiService.updateProfile(user.googleId, {
        dreamTeamData,
      });
      if (res.success && res.user) {
        persistUserLocal(res.user);
      }
      return true;
    } catch (err) {
      console.warn('Dream team data saved locally:', err);
      return true;
    }
  };

  const saveManagerData = async (
    managerData: ManagerClubData | null
  ): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = { ...user, managerData };
    persistUserLocal(updated);

    try {
      const res = await ApiService.updateProfile(user.googleId, {
        managerData,
      });
      if (res.success && res.user) {
        persistUserLocal(res.user);
      }
      return true;
    } catch (err) {
      console.warn('Manager data saved locally:', err);
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        isProfileLoading,
        authError,
        networkError,
        lastLoginMessage,
        isOfflineMode,
        loginWithGoogle,
        logout,
        updateProfileSettings,
        updateDisplayName,
        updateSelectedMode,
        saveCareerData,
        saveDreamTeamData,
        saveManagerData,
        refreshProfile,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

