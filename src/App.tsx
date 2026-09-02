import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrentScreen } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LoadingScreen } from './components/common/LoadingScreen';
import { AndroidSplashScreen } from './components/common/AndroidSplashScreen';
import { AndroidBottomNav } from './components/common/AndroidBottomNav';
import { LoginScreen } from './components/auth/LoginScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { CareerModeScreen } from './components/modes/CareerModeScreen';
import { DreamTeamModeScreen } from './components/modes/DreamTeamModeScreen';
import { ManagerModeScreen } from './components/modes/ManagerModeScreen';
import { WorldwideTournamentScreen } from './components/modes/WorldwideTournamentScreen';
import { UniverseSpecialScreen } from './components/modes/UniverseSpecialScreen';
import { GlobalPlayerDatabaseScreen } from './components/database/GlobalPlayerDatabaseScreen';
import { ProfileModal } from './components/profile/ProfileModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { ApkDownloadModal } from './components/common/ApkDownloadModal';
import { ErrorBanner } from './components/common/ErrorBanner';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated, isAuthLoading, authError, networkError, clearErrors } =
    useAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Splash Screen on startup
  if (showSplash) {
    return <AndroidSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Authentication Loading State
  if (isAuthLoading && !user) {
    return (
      <LoadingScreen
        message="AUTHENTICATING GOOGLE ACCOUNT..."
        subMessage="Validating permanent Cricket Universe profile"
      />
    );
  }

  // Unauthenticated Login Portal
  if (!isAuthenticated || !user) {
    return <LoginScreen />;
  }

  const navigateTo = (screen: CurrentScreen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#020617] text-slate-100 selection:bg-emerald-500 selection:text-black overflow-x-hidden font-sans pb-16 sm:pb-0">
      {/* Immersive Top Radial Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#1e3a8a_0%,transparent_50%)] opacity-35 z-0" />

      {/* Top Main Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Global Error Banner if any */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <ErrorBanner
          error={authError}
          onRetry={clearErrors}
          onDismiss={clearErrors}
        />
        <ErrorBanner
          error={networkError}
          onRetry={clearErrors}
          onDismiss={clearErrors}
          isNetworkError={true}
        />
      </div>

      {/* Main Dynamic Game View */}
      <main className="relative z-10 flex-1 w-full flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            onSelectMode={(mode) => navigateTo(mode)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        )}

        {currentScreen === 'career' && (
          <CareerModeScreen onBack={() => navigateTo('home')} />
        )}

        {currentScreen === 'dream_team' && (
          <DreamTeamModeScreen onBack={() => navigateTo('home')} />
        )}

        {currentScreen === 'manager' && (
          <ManagerModeScreen onBack={() => navigateTo('home')} />
        )}

        {currentScreen === 'worldwide_tournament' && (
          <WorldwideTournamentScreen onBack={() => navigateTo('home')} />
        )}

        {currentScreen === 'universe_special' && (
          <UniverseSpecialScreen onBack={() => navigateTo('home')} />
        )}

        {currentScreen === 'database' && (
          <GlobalPlayerDatabaseScreen onBack={() => navigateTo('home')} />
        )}
      </main>

      {/* Mobile Android Bottom Navigation Bar */}
      <AndroidBottomNav currentScreen={currentScreen} onNavigate={navigateTo} />

      {/* Footer for Desktop / Web */}
      <div className="hidden sm:block">
        <Footer
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenApkModal={() => setIsApkModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
