import fs from 'fs';
import path from 'path';
import { UserProfile, AuthGooglePayload } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROFILES_FILE)) {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify([]), 'utf-8');
  }
}

export function loadAllProfiles(): UserProfile[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(PROFILES_FILE, 'utf-8');
    return JSON.parse(data) as UserProfile[];
  } catch (error) {
    console.error('Error reading profiles database:', error);
    return [];
  }
}

export function saveAllProfiles(profiles: UserProfile[]): boolean {
  ensureDataDir();
  try {
    const tempFile = `${PROFILES_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(profiles, null, 2), 'utf-8');
    fs.renameSync(tempFile, PROFILES_FILE);
    return true;
  } catch (error) {
    console.error('Error saving profiles database:', error);
    return false;
  }
}

export function getProfileByGoogleId(googleId: string): UserProfile | null {
  const profiles = loadAllProfiles();
  return profiles.find((p) => p.googleId === googleId) || null;
}

export function getProfileByUserId(userId: string): UserProfile | null {
  const profiles = loadAllProfiles();
  return profiles.find((p) => p.id === userId) || null;
}

function generateUniqueUserId(existingProfiles: UserProfile[]): string {
  let id = '';
  let exists = true;
  while (exists) {
    const num = Math.floor(100000 + Math.random() * 900000);
    id = `CU-${num}`;
    exists = existingProfiles.some((p) => p.id === id);
  }
  return id;
}

export function authenticateOrRegisterGoogleUser(payload: AuthGooglePayload): {
  user: UserProfile;
  isNewUser: boolean;
} {
  const { googleId, email, displayName, photoURL } = payload;
  if (!googleId) {
    throw new Error('Google ID is required for authentication.');
  }

  const profiles = loadAllProfiles();
  const existingIndex = profiles.findIndex((p) => p.googleId === googleId);

  const now = new Date().toISOString();

  if (existingIndex !== -1) {
    // Existing user: Update lastLoginAt and any updated Google profile info
    const existing = profiles[existingIndex];
    const updated: UserProfile = {
      ...existing,
      email: email || existing.email,
      displayName: displayName || existing.displayName,
      photoURL: photoURL || existing.photoURL,
      lastLoginAt: now,
    };

    profiles[existingIndex] = updated;
    saveAllProfiles(profiles);

    return {
      user: updated,
      isNewUser: false,
    };
  }

  // New user: Create brand-new permanent profile
  const newId = generateUniqueUserId(profiles);
  const newProfile: UserProfile = {
    id: newId,
    googleId,
    email: email || '',
    displayName: displayName || 'Cricket Master',
    photoURL:
      photoURL ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newId)}`,
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

  profiles.push(newProfile);
  saveAllProfiles(profiles);

  return {
    user: newProfile,
    isNewUser: true,
  };
}

export function updateProfile(
  googleId: string,
  partialUpdate: Partial<UserProfile>
): UserProfile | null {
  const profiles = loadAllProfiles();
  const index = profiles.findIndex((p) => p.googleId === googleId);

  if (index === -1) {
    return null;
  }

  // Prevent overwriting primary identity keys
  const safeUpdate = { ...partialUpdate };
  delete safeUpdate.id;
  delete safeUpdate.googleId;
  delete safeUpdate.createdAt;

  const updated: UserProfile = {
    ...profiles[index],
    ...safeUpdate,
  };

  profiles[index] = updated;
  saveAllProfiles(profiles);
  return updated;
}
