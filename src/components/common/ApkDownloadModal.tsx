import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Zap,
  Share2,
} from 'lucide-react';

interface ApkInfo {
  appName?: string;
  versionName?: string;
  versionCode?: number;
  packageName?: string;
  buildType?: string;
  pwaReady?: boolean;
  note?: string;
}

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [apkInfo, setApkInfo] = useState<ApkInfo | null>(null);
  const [, setLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  useEffect(() => {
    // Listen for PWA BeforeInstallPromptEvent
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchApkInfo();
    }
  }, [isOpen]);

  const fetchApkInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/apk/info');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.apk) {
          setApkInfo(data.apk);
        }
      }
    } catch (err) {
      console.warn('Could not fetch mobile app info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handle1TapInstall = async () => {
    if (installPrompt) {
      try {
        installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setInstallSuccess(true);
          setInstallPrompt(null);
        }
      } catch (err) {
        console.error('Install error:', err);
      }
    } else {
      alert(
        lang === 'bn'
          ? 'আপনার ফোনের Chrome ব্রাউজারের উপরে ৩-ডট (⋮) বাটনে চাপ দিন এবং "Install app" বা "Add to Home screen" নির্বাচন করুন। এটি আপনার ফোনে সম্পূর্ণ গেমটি ইনস্টল করে দেবে!'
          : 'Tap the 3 dots (⋮) in Chrome browser and select "Install app" or "Add to Home screen" to install the game on your home screen!'
      );
    }
  };

  const handleCopyWebUrl = () => {
    const fullUrl = window.location.origin;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      id="apk-download-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-emerald-500/30 bg-[#070e22]/98 p-5 sm:p-7 text-slate-100 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] my-auto max-h-[92vh] overflow-y-auto">
        {/* Top Controls: Language Switch & Close */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-white/10 p-0.5 border border-white/10 text-[11px] font-bold">
            <button
              onClick={() => setLang('bn')}
              className={`px-2 py-0.5 rounded ${lang === 'bn' ? 'bg-emerald-500 text-black' : 'text-slate-300 hover:text-white'}`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded ${lang === 'en' ? 'bg-emerald-500 text-black' : 'text-slate-300 hover:text-white'}`}
            >
              ENG
            </button>
          </div>

          <button
            id="close-apk-modal-btn"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="flex items-start gap-4 border-b border-white/10 pb-4 mb-4">
          <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-2 shrink-0 flex items-center justify-center shadow-lg">
            <Smartphone className="w-8 h-8 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-black ring-2 ring-black">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {lang === 'bn' ? 'অফিসিয়াল অ্যান্ড্রয়েড অ্যাপ' : 'Official Android App'}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                v{apkInfo?.versionName || '2.5.0'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1">
              CRICKET UNIVERSE MOBILE
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'যেকোনো অ্যান্ড্রয়েড ফোনে সহজে ও ১০০% সফলভাবে ইনস্টল করার উপায়'
                : 'Install smoothly on any Android device without parsing errors'}
            </p>
          </div>
        </div>

        {/* PRIMARY METHOD 1: 1-Click Mobile Web / PWA Installation */}
        <div className="rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-950/70 via-slate-900/90 to-slate-950 p-4 sm:p-5 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.25)] relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{lang === 'bn' ? 'সরাসরি মোবাইলে ইনস্টল (Add to Home Screen)' : 'Install on Mobile (Add to Home Screen)'}</span>
          </div>

          <p className="text-xs text-slate-200 mb-3.5 leading-relaxed">
            {lang === 'bn'
              ? 'নিচের বাটনে চাপ দিন। আপনার অ্যান্ড্রয়েড/আইওএস ব্রাউজার সম্পূর্ণ ক্রিকেট ইউনিভার্স ওয়েব গেমটি হোম স্ক্রিনে ইনস্টল করে ফুল-স্ক্রিন মোডে রান করবে।'
              : 'Tap the button below. Your mobile browser will install the complete Cricket Universe web game to your home screen for full-screen offline gameplay.'}
          </p>

          <button
            id="one-tap-install-btn"
            onClick={handle1TapInstall}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:brightness-110 active:scale-[0.99] text-black font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-500/20"
          >
            {installSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-black" />
                <span>{lang === 'bn' ? 'সফলভাবে ইনস্টল হয়েছে!' : 'INSTALLED SUCCESSFULLY!'}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 text-black" />
                <span>{lang === 'bn' ? '⚡ ফোনে সরাসরি ইনস্টল করুন' : '⚡ INSTALL ON PHONE'}</span>
              </>
            )}
          </button>

          {/* Fallback browser visual instructions */}
          <div className="mt-3 rounded-xl bg-black/40 border border-white/10 p-3 text-[11px] text-slate-300 flex items-start gap-2">
            <div className="font-bold text-amber-400 shrink-0">💡 {lang === 'bn' ? 'টিপস:' : 'Tip:'}</div>
            <div>
              {lang === 'bn' ? (
                <>
                  যদি ইনস্টল প্রম্পট সরাসরি না খোলে, আপনার Chrome ব্রাউজারের উপরে <strong>৩-ডট (⋮)</strong> মেনু খুলুন এবং <strong>&ldquo;Install app&rdquo;</strong> বা <strong>&ldquo;Add to Home screen&rdquo;</strong> নির্বাচন করুন।
                </>
              ) : (
                <>
                  If prompt does not open automatically, open Chrome&apos;s <strong>top-right 3-dots (⋮)</strong> and tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                </>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Share & Play Link */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'bn' ? 'গেমের সরাসরি লিংক' : 'Direct Game Link'}</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              Web App
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            {lang === 'bn'
              ? 'মোবাইল বা পিসির ব্রাউজারে খেলতে সরাসরি লিংকটি কপি করুন বা ওপেন করুন।'
              : 'Copy the direct web link to play instantly on mobile or desktop browsers.'}
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleCopyWebUrl}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wide"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copiedUrl ? (lang === 'bn' ? 'লিঙ্ক কপি হয়েছে!' : 'Link Copied!') : (lang === 'bn' ? 'গেমের লিংক কপি করুন' : 'Copy Game Link')}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Android Native Build Notice */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs space-y-2 mb-4">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'bn'
                ? 'অ্যান্ড্রয়েড নেটিভ APK তৈরির তথ্য'
                : 'Android Native APK Build Information'}
            </span>
          </div>

          <div className="text-slate-400 text-[11px] leading-relaxed space-y-1">
            <p>
              {lang === 'bn'
                ? '• অফিসিয়াল অ্যান্ড্রয়েড .apk তৈরির জন্য Android Studio এবং Gradle বিল্ড সিস্টেম (./gradlew assembleRelease) প্রয়োজন।'
                : '• Building an official standalone Android APK requires the Android Gradle toolchain (./gradlew assembleRelease).'}
            </p>
            <p>
              {lang === 'bn'
                ? '• বর্তমান ওয়েব ভার্সনটিতে ক্যারিয়ার মোড, ড্রিম টিম, ম্যানেজার, এবং ডব্লিউটিসি টুর্নামেন্টসহ সম্পূর্ণ গেম ফিচার অ্যাক্টিভ রয়েছে।'
                : '• The web application contains the complete, full-featured game (Career, Dream Team, Manager, Tournaments, DRS, Match Engine).'}
            </p>
          </div>
        </div>

        {/* Technical Specs Footer */}
        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-white/10">
          <div>
            Package: <span className="text-emerald-400 font-bold">com.cricketuniverse.app</span>
          </div>
          <div>
            Target: <span className="text-slate-200">Android 8.0 - 15+ (API 35)</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider transition-colors"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

