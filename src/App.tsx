import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Compass, Dumbbell, Home, User, WifiOff, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useSpeechGuide } from './hooks/useSpeechGuide';
import type {
  BabId,
  CuratorVideoMeta,
  SoalKuis50,
  SubBabId,
  SubBabProgress,
  UserProgress,
  UserSettings,
  WrongAttempt,
} from './types/physics';
import {
  addWrongAttempt,
  computeEarnedBadges,
  getSubBabProgress,
  loadCuratorMeta,
  loadProgress,
  loadQuiz50,
  loadQuizMismatches,
  loadSettings,
  resetAllProgress,
  saveCuratorMeta,
  saveImportedQuizOverrides,
  saveProgress,
  saveQuizMismatches,
  saveSettings,
  type QuizKeyMismatch,
} from './utils/storage';
import { BimaGuideStrip } from './components/BimaGuideStrip';
import { PWAInstallButton } from './components/PWAInstallButton';
import { CuratorModal } from './pages/CuratorModal';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { PracticeHubPage, type PracticeTab } from './pages/PracticeHubPage';
import { ProfilePage } from './pages/ProfilePage';
import { SubBabPage } from './pages/SubBabPage';

type MainTab = 'beranda' | 'peta' | 'latihan' | 'profil';

export default function App() {
  const isOnline = useOnlineStatus();
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [curatorMeta, setCuratorMeta] = useState<Record<string, CuratorVideoMeta>>(() => loadCuratorMeta());
  const [quiz50, setQuiz50] = useState<SoalKuis50[]>(() => loadQuiz50());
  const [mismatches, setMismatches] = useState<QuizKeyMismatch[]>(() => loadQuizMismatches());

  const [activeTab, setActiveTab] = useState<MainTab>('beranda');
  const [activeSubBab, setActiveSubBab] = useState<SubBabId | null>(null);
  const [mapFilterBab, setMapFilterBab] = useState<BabId | 'ALL'>('ALL');
  const [practiceTab, setPracticeTab] = useState<PracticeTab>('kuis50');
  const [curatorOpen, setCuratorOpen] = useState(false);

  // Step-by-step interactive guide state ("Apakah kamu sudah siap menjadi juara?")
  const [readyPromptStatus, setReadyPromptStatus] = useState<'asking' | 'ready' | 'skipped'>('asking');
  const [guidedMode, setGuidedMode] = useState<boolean>(false);
  const [guidedMessage, setGuidedMessage] = useState<string>(
    'Halo calon juara! Jawab dulu di Beranda: apakah kamu sudah siap menjadi juara?'
  );

  // Secret 5-tap logo trigger for Mode Kurator
  const logoTapsRef = useRef<number[]>([]);
  const handleLogoTap = () => {
    const now = Date.now();
    const recent = logoTapsRef.current.filter((t) => now - t < 3000);
    recent.push(now);
    logoTapsRef.current = recent;
    if (recent.length >= 5) {
      logoTapsRef.current = [];
      setCuratorOpen(true);
    } else {
      setActiveSubBab(null);
      setActiveTab('beranda');
    }
  };

  const speech = useSpeechGuide(settings);

  const guideSpeak = useCallback(
    (msg: string, forceSpeak = false) => {
      setGuidedMessage(msg);
      if (forceSpeak || guidedMode) {
        speech.speak(msg);
      }
    },
    [guidedMode, speech]
  );

  const handleAnswerReady = useCallback(() => {
    setReadyPromptStatus('ready');
    setGuidedMode(true);
    setActiveSubBab(null);
    setActiveTab('peta');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const msg =
      'Mantap! Aku Bima, pemandumu. Sekarang pilih sub-bab yang ingin kamu pelajari di Peta ini. Pencet salah satu kartu sub-bab, misalnya A1 untuk mulai dari awal!';
    setGuidedMessage(msg);
    speech.speak(msg);
  }, [speech]);

  const handleSkipReady = useCallback(() => {
    speech.stop();
    setReadyPromptStatus('skipped');
    setGuidedMode(false);
  }, [speech]);

  const handleEnableGuideAgain = useCallback(() => {
    setReadyPromptStatus('ready');
    setGuidedMode(true);
    const msg =
      'Pemandu Bima aktif kembali! Pilih sub-bab di Peta untuk belajar tahap demi tahap, atau buka tab Latihan untuk mengerjakan Kuis lima puluh Soal.';
    setGuidedMessage(msg);
    speech.speak(msg);
  }, [speech]);

  // Sync dark mode and text scale to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.modeGelap) root.classList.add('dark');
    else root.classList.remove('dark');

    root.classList.remove('text-scale-sm', 'text-scale-md', 'text-scale-lg');
    root.classList.add(`text-scale-${settings.ukuranTeks}`);
  }, [settings.modeGelap, settings.ukuranTeks]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const updateSubBabProgress = useCallback(
    (id: SubBabId, patch: Partial<SubBabProgress>, xpGain = 0) => {
      setProgress((prev) => {
        const current = getSubBabProgress(prev, id);
        const merged: UserProgress = {
          ...prev,
          xp: prev.xp + xpGain,
          lastVisitedSubBab: id,
          subBab: {
            ...prev.subBab,
            [id]: { ...current, ...patch },
          },
        };
        merged.lencana = computeEarnedBadges(merged);
        saveProgress(merged);
        return merged;
      });
    },
    []
  );

  const handleOpenSubBab = useCallback(
    (id: SubBabId) => {
      speech.stop();
      setProgress((prev) => {
        const next = { ...prev, lastVisitedSubBab: id };
        saveProgress(next);
        return next;
      });
      setActiveSubBab(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [speech]
  );

  const handleRecordWrongAttempt = useCallback((attempt: WrongAttempt) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        soalSalah: addWrongAttempt(prev.soalSalah, attempt),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const handleClearWrongAttempt = useCallback((id: string) => {
    setProgress((prev) => {
      const next: UserProgress = {
        ...prev,
        soalSalah: prev.soalSalah.filter((w) => w.id !== id),
        dailyPlanDone: { ...prev.dailyPlanDone, ulangSalah: true },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const handleAnswerQuiz50 = useCallback((nomor: number, dipilih: string, benar: boolean) => {
    setProgress((prev) => {
      const nextKuis = { ...prev.kuis50Jawaban };
      const alreadyAnswered = Boolean(nextKuis[nomor]);
      if (!dipilih) {
        delete nextKuis[nomor];
      } else {
        nextKuis[nomor] = { dipilih, benar };
      }
      const next: UserProgress = {
        ...prev,
        xp: !dipilih || alreadyAnswered ? prev.xp : prev.xp + (benar ? 15 : 2),
        kuis50Jawaban: nextKuis,
      };
      next.lencana = computeEarnedBadges(next);
      saveProgress(next);
      return next;
    });
  }, []);

  const handleImportQuiz50 = useCallback(
    (overrides: Partial<Record<number, Partial<SoalKuis50>>>, newMismatches: QuizKeyMismatch[]) => {
      saveImportedQuizOverrides(overrides);
      saveQuizMismatches(newMismatches);
      setQuiz50(loadQuiz50());
      setMismatches(newMismatches);
    },
    []
  );

  const handleUpdateCuratorMeta = useCallback((videoId: string, patch: Partial<CuratorVideoMeta>) => {
    setCuratorMeta((prev) => {
      const existing = prev[videoId] ?? { status: 'belum_diperiksa' as const };
      const next = {
        ...prev,
        [videoId]: { ...existing, ...patch },
      };
      saveCuratorMeta(next);
      return next;
    });
  }, []);

  const handleMarkDaily = useCallback((field: 'video' | 'latihan3') => {
    setProgress((prev) => {
      const next: UserProgress = {
        ...prev,
        dailyPlanDone: { ...prev.dailyPlanDone, [field]: true },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const switchTab = (tab: MainTab, overridePracticeTab?: PracticeTab) => {
    speech.stop();
    setActiveSubBab(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (guidedMode) {
      window.setTimeout(() => {
        if (tab === 'peta') {
          guideSpeak(
            'Pilih salah satu bab fisika di atas, lalu pencet kartu sub-bab seperti A1 untuk mulai belajar langkah demi langkah!'
          );
        } else if (tab === 'latihan') {
          const target = overridePracticeTab ?? practiceTab;
          if (target === 'kuis50') {
            guideSpeak(
              'Kamu sekarang di Kuis lima puluh Soal Olimpiade. Pencet kartu soal untuk membukanya, pilih jawaban A sampai E, lalu baca cara menjawabnya!'
            );
          } else {
            guideSpeak('Pilih soal latihan di bawah lalu pencet Cek Jawaban untuk melihat hasilnya.');
          }
        } else if (tab === 'profil') {
          guideSpeak(
            'Di halaman Profil ini, cek total bintang, skor Kuis lima puluh Soal, lencana, dan ulangi soal yang sempat salah.'
          );
        }
      }, 90);
    }
  };

  const navItems: Array<{ id: MainTab; label: string; icon: typeof Home }> = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'peta', label: 'Peta', icon: Compass },
    { id: 'latihan', label: 'Latihan', icon: Dumbbell },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-20 md:pb-8">
      {/* Top Navigation Bar (3-zone contract) */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--bg-surface)]/90 border-b border-[var(--border-hairline)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
          {/* Zone 1: Brand wordmark (5 taps opens Mode Kurator) */}
          <button
            type="button"
            onClick={handleLogoTap}
            title="Jagoan Fisika"
            className="inline-flex items-center gap-2 font-display text-lg font-bold text-[var(--text-primary)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-xl bg-[#2F6BFF] text-white flex items-center justify-center">
              <Zap className="w-4 h-4 fill-[#FFBE2E] text-[#FFBE2E]" />
            </span>
            Jagoan Fisika
          </button>

          {/* Zone 2: 4 single-line desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold" aria-label="Navigasi utama">
            {navItems.map((item) => {
              const isCurrent = !activeSubBab && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchTab(item.id)}
                  className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 transition ${
                    isCurrent
                      ? 'border-[#FF7A1A] text-[var(--text-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary action (PWA Install or Streak summary) */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            <span className="hidden sm:inline font-mono-num text-xs font-bold text-[var(--text-secondary)] whitespace-nowrap">
              {progress.xp} XP
            </span>
          </div>
        </div>
      </header>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          Mode Offline aktif — Materi tulis, rumus, dan latihan soal tetap dapat dipakai.
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {guidedMode && (
          <BimaGuideStrip
            speech={speech}
            settings={settings}
            guidedMessage={guidedMessage}
            onUpdateSettings={updateSettings}
            onDisableGuidedMode={() => setGuidedMode(false)}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubBab ? `sub-${activeSubBab}` : activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {activeSubBab ? (
              <SubBabPage
                subBabId={activeSubBab}
                progress={progress}
                settings={settings}
                speech={speech}
                guidedMode={guidedMode}
                onGuideSpeak={guideSpeak}
                curatorMeta={curatorMeta}
                quiz50={quiz50}
                onBackToMap={() => {
                  setActiveSubBab(null);
                  setActiveTab('peta');
                  if (guidedMode) {
                    window.setTimeout(() => {
                      guideSpeak(
                        'Selamat! Kamu kembali di Peta Belajar. Pilih sub-bab berikutnya yang masih berstatus Siap, atau buka tab Latihan untuk Kuis lima puluh Soal.'
                      );
                    }, 90);
                  }
                }}
                onUpdateSubBabProgress={updateSubBabProgress}
                onRecordWrongAttempt={handleRecordWrongAttempt}
                onAnswerQuiz50={handleAnswerQuiz50}
                onUpdateCuratorMeta={handleUpdateCuratorMeta}
                onUpdateSettings={updateSettings}
                onMarkDaily={handleMarkDaily}
              />
            ) : activeTab === 'beranda' ? (
              <HomePage
                progress={progress}
                settings={settings}
                speech={speech}
                readyPromptStatus={readyPromptStatus}
                guidedMode={guidedMode}
                onAnswerReady={handleAnswerReady}
                onSkipReady={handleSkipReady}
                onEnableGuideAgain={handleEnableGuideAgain}
                onUpdateSettings={updateSettings}
                onOpenSubBab={handleOpenSubBab}
                onOpenMapForBab={(babId) => {
                  setMapFilterBab(babId);
                  switchTab('peta');
                }}
                onOpenQuiz50={() => {
                  setPracticeTab('kuis50');
                  switchTab('latihan', 'kuis50');
                }}
                onStartFiveMinChallenge={() => {
                  setPracticeTab('tantangan5m');
                  switchTab('latihan', 'tantangan5m');
                }}
                onOpenWrongReview={() => switchTab('profil')}
              />
            ) : activeTab === 'peta' ? (
              <MapPage
                progress={progress}
                speech={speech}
                guidedMode={guidedMode}
                selectedBab={mapFilterBab}
                onSelectBab={setMapFilterBab}
                onOpenSubBab={handleOpenSubBab}
              />
            ) : activeTab === 'latihan' ? (
              <PracticeHubPage
                initialTab={practiceTab}
                progress={progress}
                settings={settings}
                speech={speech}
                guidedMode={guidedMode}
                onGuideSpeak={guideSpeak}
                quiz50={quiz50}
                onAnswerQuiz50={handleAnswerQuiz50}
                onImportQuiz50={handleImportQuiz50}
                onRecordWrongAttempt={handleRecordWrongAttempt}
                onAddXp={(xp) =>
                  setProgress((prev) => {
                    const next = { ...prev, xp: prev.xp + xp };
                    next.lencana = computeEarnedBadges(next);
                    saveProgress(next);
                    return next;
                  })
                }
                onMarkDailyLatihan={() => handleMarkDaily('latihan3')}
              />
            ) : (
              <ProfilePage
                progress={progress}
                settings={settings}
                speech={speech}
                onUpdateSettings={updateSettings}
                onClearWrongAttempt={handleClearWrongAttempt}
                onResetProgress={() => {
                  setProgress(resetAllProgress());
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation (4 tabs) */}
      <nav
        aria-label="Navigasi bawah"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-hairline)] grid grid-cols-4 items-center"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = !activeSubBab && activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                isCurrent ? 'text-[#FF7A1A] font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Hidden Curator Modal (opened by 5 taps on logo) */}
      <CuratorModal
        isOpen={curatorOpen}
        onClose={() => setCuratorOpen(false)}
        curatorMeta={curatorMeta}
        mismatches={mismatches}
        onUpdateCuratorMeta={handleUpdateCuratorMeta}
      />
    </div>
  );
}
