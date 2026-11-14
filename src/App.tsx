import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  ChevronDown,
  Cloud,
  Compass,
  DownloadCloud,
  Dumbbell,
  Home,
  LogOut,
  RefreshCw,
  UploadCloud,
  User as UserIcon,
  WifiOff,
  Zap,
} from 'lucide-react';
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
  DriveAuthExpiredError,
  loadProgressFromDrive,
  uploadProgressToDrive,
  type DriveProgressPayload,
} from './utils/driveSync';
import {
  clearAccessToken,
  getAccessToken,
  googleLogout,
  googleSignIn,
  initGoogleAuth,
} from './utils/googleAuth';
import {
  addWrongAttempt,
  computeEarnedBadges,
  getSubBabProgress,
  loadCuratorMeta,
  loadProgress,
  loadQuiz50,
  loadQuizMismatches,
  loadSettings,
  normalizeProgress,
  resetAllProgress,
  saveCuratorMeta,
  saveImportedQuizOverrides,
  saveProgress,
  saveQuizMismatches,
  saveSettings,
  type QuizKeyMismatch,
} from './utils/storage';
import { BimaGuideStrip } from './components/BimaGuideStrip';
import { DriveSyncModal, type PendingDriveConfirmation } from './components/DriveSyncModal';
import { GoogleSignInButton } from './components/GoogleSignInButton';
import { PWAInstallButton } from './components/PWAInstallButton';
import { ReadyCheckScreen } from './components/ReadyCheckScreen';
import { CuratorModal } from './pages/CuratorModal';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { PracticeHubPage, type PracticeTab } from './pages/PracticeHubPage';
import { ProfilePage } from './pages/ProfilePage';
import { SubBabPage } from './pages/SubBabPage';

type MainTab = 'beranda' | 'peta' | 'latihan' | 'profil';

export default function App() {
  const isOnline = useOnlineStatus();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [needsDriveReauth, setNeedsDriveReauth] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);

  const [driveSyncAuthorized, setDriveSyncAuthorized] = useState<boolean>(false);
  const [driveFileId, setDriveFileId] = useState<string | null>(null);
  const [driveStatus, setDriveStatus] = useState<'idle' | 'syncing' | 'saved' | 'error' | 'offline'>('idle');
  const [driveLastSavedAt, setDriveLastSavedAt] = useState<string | null>(null);
  const [driveError, setDriveError] = useState<string>('');
  const [pendingDriveConfirm, setPendingDriveConfirm] = useState<PendingDriveConfirmation | null>(null);
  const [confirmBusy, setConfirmBusy] = useState<boolean>(false);

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
  const [readyPromptStatus, setReadyPromptStatus] = useState<'asking' | 'not_ready' | 'ready'>('asking');
  const [guidedMode, setGuidedMode] = useState<boolean>(false);
  const [guidedMessage, setGuidedMessage] = useState<string>(
    'Halo calon juara! Jawab dulu apakah kamu sudah siap menjadi juara.'
  );

  // Mutable refs for reliable background auto-save on visibilitychange/pagehide/beforeunload
  const uidRef = useRef<string | null>(null);
  const authUserRef = useRef<User | null>(null);
  const progressRef = useRef<UserProgress>(progress);
  const settingsRef = useRef<UserSettings>(settings);
  const driveFileIdRef = useRef<string | null>(null);
  const driveSyncAuthorizedRef = useRef<boolean>(false);
  const driveDirtyRef = useRef<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    uidRef.current = authUser?.uid ?? null;
    authUserRef.current = authUser;
  }, [authUser]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    driveFileIdRef.current = driveFileId;
  }, [driveFileId]);

  useEffect(() => {
    driveSyncAuthorizedRef.current = driveSyncAuthorized;
  }, [driveSyncAuthorized]);

  // Close account dropdown when clicking outside
  useEffect(() => {
    if (!accountMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [accountMenuOpen]);

  // Listen to Firebase Auth state (keeps in-memory token secure across sessions)
  useEffect(() => {
    const unsub = initGoogleAuth(
      (user) => {
        setAuthUser(user);
        setNeedsDriveReauth(false);
        setAuthError('');
      },
      (user) => {
        setAuthUser(user);
        if (user) {
          setNeedsDriveReauth(true);
          setDriveSyncAuthorized(false);
          setProgress(loadProgress(user.uid));
        } else {
          setNeedsDriveReauth(false);
          setDriveSyncAuthorized(false);
          setDriveFileId(null);
          setDriveStatus('idle');
          setDriveLastSavedAt(null);
          setProgress(loadProgress(null));
        }
      }
    );
    return () => unsub();
  }, []);

  const buildDrivePayload = useCallback(
    (user: User, prog: UserProgress, sett: UserSettings): DriveProgressPayload => ({
      version: 1,
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? 'Siswa',
      updatedAt: new Date().toISOString(),
      progress: prog,
      settings: sett,
    }),
    []
  );

  // Background upload helper (used by off-web lifecycle events & periodic sync)
  const flushToDrive = useCallback(
    async (opts?: { keepalive?: boolean }) => {
      const user = authUserRef.current;
      const token = getAccessToken();
      if (!user || !token || !driveSyncAuthorizedRef.current || !driveDirtyRef.current) {
        return;
      }
      if (!navigator.onLine) {
        setDriveStatus('offline');
        return;
      }

      const keepalive = Boolean(opts?.keepalive);
      if (!keepalive) {
        setDriveStatus('syncing');
      }

      const payload = buildDrivePayload(user, progressRef.current, settingsRef.current);

      try {
        const res = await uploadProgressToDrive(token, payload, driveFileIdRef.current, {
          keepalive,
        });
        driveDirtyRef.current = false;
        setDriveFileId(res.fileId);
        driveFileIdRef.current = res.fileId;
        setDriveLastSavedAt(res.updatedAt);
        setDriveStatus('saved');
        setDriveError('');
      } catch (err) {
        if (err instanceof DriveAuthExpiredError) {
          clearAccessToken();
          setNeedsDriveReauth(true);
          setDriveSyncAuthorized(false);
          setDriveStatus('error');
          setDriveError(err.message);
        } else if (!keepalive) {
          setDriveStatus('error');
          setDriveError(err instanceof Error ? err.message : 'Gagal menyimpan otomatis ke Drive.');
        }
      }
    },
    [buildDrivePayload]
  );

  // Auto-save saat off web (tab disembunyikan / pindah aplikasi / halaman ditutup)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void flushToDrive({ keepalive: true });
      }
    };
    const handlePageExit = () => {
      void flushToDrive({ keepalive: true });
    };
    const handleBackOnline = () => {
      if (driveDirtyRef.current) {
        void flushToDrive({ keepalive: false });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageExit);
    window.addEventListener('beforeunload', handlePageExit);
    window.addEventListener('online', handleBackOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageExit);
      window.removeEventListener('beforeunload', handlePageExit);
      window.removeEventListener('online', handleBackOnline);
    };
  }, [flushToDrive]);

  // Debounced background sync (12s after activity while online & Drive sync enabled)
  useEffect(() => {
    if (!authUser || !driveSyncAuthorized || needsDriveReauth) return;
    const timer = window.setTimeout(() => {
      if (driveDirtyRef.current && navigator.onLine) {
        void flushToDrive({ keepalive: false });
      }
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [progress, settings, authUser, driveSyncAuthorized, needsDriveReauth, flushToDrive]);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoggingIn(true);
    setAuthError('');
    setDriveError('');
    try {
      const previousGuestProgress = !authUserRef.current ? progressRef.current : null;
      const { user, accessToken } = await googleSignIn();
      setAuthUser(user);
      setNeedsDriveReauth(false);
      setAccountMenuOpen(false);

      // Load account's local progress (or keep current unsaved guest work if this account has none locally)
      const accountLocal = loadProgress(user.uid);
      const guestHasWork =
        previousGuestProgress &&
        (previousGuestProgress.xp > 0 ||
          Object.keys(previousGuestProgress.kuis50Jawaban).length > 0 ||
          Object.keys(previousGuestProgress.subBab).length > 0);
      const accountLocalEmpty =
        accountLocal.xp === 0 &&
        Object.keys(accountLocal.kuis50Jawaban).length === 0 &&
        Object.keys(accountLocal.subBab).length === 0;

      const candidateLocal = guestHasWork && accountLocalEmpty ? previousGuestProgress : accountLocal;
      setProgress(candidateLocal);
      saveProgress(candidateLocal, user.uid);

      // Check existing Drive file (read-only) before asking explicit confirmation to sync/create
      const driveRecord = await loadProgressFromDrive(accessToken);
      setPendingDriveConfirm({
        mode: driveRecord ? 'connect_existing' : 'connect_new',
        userEmail: user.email ?? user.displayName ?? 'Akun Google',
        driveRecord,
        localProgress: candidateLocal,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk dengan akun Google.';
      setAuthError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const handleGoogleLogout = useCallback(async () => {
    setAccountMenuOpen(false);
    await googleLogout();
    setAuthUser(null);
    setNeedsDriveReauth(false);
    setDriveSyncAuthorized(false);
    setDriveFileId(null);
    setDriveStatus('idle');
    setDriveLastSavedAt(null);
    setDriveError('');
    driveDirtyRef.current = false;
    setProgress(loadProgress(null));
  }, []);

  const handleConfirmUseDriveData = useCallback(() => {
    if (!pendingDriveConfirm?.driveRecord || !authUser) return;
    const rec = pendingDriveConfirm.driveRecord;
    const hydrated = normalizeProgress(rec.payload.progress);
    setProgress(hydrated);
    saveProgress(hydrated, authUser.uid);

    if (rec.payload.settings) {
      setSettings((prev) => {
        const mergedSettings = { ...prev, ...rec.payload.settings };
        saveSettings(mergedSettings);
        return mergedSettings;
      });
    }

    setDriveFileId(rec.fileId);
    driveFileIdRef.current = rec.fileId;
    setDriveSyncAuthorized(true);
    driveSyncAuthorizedRef.current = true;
    driveDirtyRef.current = false;
    setDriveLastSavedAt(rec.payload.updatedAt);
    setDriveStatus('saved');
    setDriveError('');
    setPendingDriveConfirm(null);
  }, [pendingDriveConfirm, authUser]);

  const handleConfirmUploadLocalToDrive = useCallback(async () => {
    if (!pendingDriveConfirm || !authUser) return;
    const token = getAccessToken();
    if (!token) {
      setPendingDriveConfirm(null);
      setNeedsDriveReauth(true);
      return;
    }

    setConfirmBusy(true);
    try {
      const payload = buildDrivePayload(authUser, pendingDriveConfirm.localProgress, settingsRef.current);
      const res = await uploadProgressToDrive(
        token,
        payload,
        pendingDriveConfirm.driveRecord?.fileId ?? driveFileIdRef.current,
        { keepalive: false }
      );
      setDriveFileId(res.fileId);
      driveFileIdRef.current = res.fileId;
      setDriveSyncAuthorized(true);
      driveSyncAuthorizedRef.current = true;
      driveDirtyRef.current = false;
      setDriveLastSavedAt(res.updatedAt);
      setDriveStatus('saved');
      setDriveError('');
      setPendingDriveConfirm(null);
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearAccessToken();
        setNeedsDriveReauth(true);
        setPendingDriveConfirm(null);
      }
      setDriveError(err instanceof Error ? err.message : 'Gagal menyimpan progres ke Google Drive.');
    } finally {
      setConfirmBusy(false);
    }
  }, [pendingDriveConfirm, authUser, buildDrivePayload]);

  const handleManualSaveDrive = useCallback(async () => {
    setAccountMenuOpen(false);
    if (!authUser) {
      await handleGoogleSignIn();
      return;
    }
    const token = getAccessToken();
    if (!token) {
      setNeedsDriveReauth(true);
      await handleGoogleSignIn();
      return;
    }

    setDriveStatus('syncing');
    setDriveError('');
    try {
      const driveRecord = await loadProgressFromDrive(token);
      setDriveStatus('idle');
      setPendingDriveConfirm({
        mode: driveRecord ? 'manual_overwrite' : 'connect_new',
        userEmail: authUser.email ?? authUser.displayName ?? 'Akun Google',
        driveRecord,
        localProgress: progressRef.current,
      });
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearAccessToken();
        setNeedsDriveReauth(true);
      }
      setDriveStatus('error');
      setDriveError(err instanceof Error ? err.message : 'Gagal memeriksa Google Drive.');
    }
  }, [authUser, handleGoogleSignIn]);

  const handleManualLoadDrive = useCallback(async () => {
    setAccountMenuOpen(false);
    if (!authUser) {
      await handleGoogleSignIn();
      return;
    }
    const token = getAccessToken();
    if (!token) {
      setNeedsDriveReauth(true);
      await handleGoogleSignIn();
      return;
    }

    setDriveStatus('syncing');
    setDriveError('');
    try {
      const driveRecord = await loadProgressFromDrive(token);
      setDriveStatus('idle');
      if (!driveRecord) {
        setDriveError('Belum ada file jagoan-fisika-progres.json di Google Drive akun ini.');
        return;
      }
      setPendingDriveConfirm({
        mode: 'manual_restore',
        userEmail: authUser.email ?? authUser.displayName ?? 'Akun Google',
        driveRecord,
        localProgress: progressRef.current,
      });
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearAccessToken();
        setNeedsDriveReauth(true);
      }
      setDriveStatus('error');
      setDriveError(err instanceof Error ? err.message : 'Gagal mengunduh dari Google Drive.');
    }
  }, [authUser, handleGoogleSignIn]);

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
    } else if (readyPromptStatus === 'ready') {
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

  const handleAnswerNotReady = useCallback(() => {
    speech.stop();
    setReadyPromptStatus('not_ready');
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

  const commitProgress = useCallback((updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next, uidRef.current);
      if (authUserRef.current) {
        driveDirtyRef.current = true;
      }
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      if (authUserRef.current) {
        driveDirtyRef.current = true;
      }
      return next;
    });
  }, []);

  const updateSubBabProgress = useCallback(
    (id: SubBabId, patch: Partial<SubBabProgress>, xpGain = 0) => {
      commitProgress((prev) => {
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
        return merged;
      });
    },
    [commitProgress]
  );

  const handleOpenSubBab = useCallback(
    (id: SubBabId) => {
      speech.stop();
      commitProgress((prev) => ({ ...prev, lastVisitedSubBab: id }));
      setActiveSubBab(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [speech, commitProgress]
  );

  const handleRecordWrongAttempt = useCallback(
    (attempt: WrongAttempt) => {
      commitProgress((prev) => ({
        ...prev,
        soalSalah: addWrongAttempt(prev.soalSalah, attempt),
      }));
    },
    [commitProgress]
  );

  const handleClearWrongAttempt = useCallback(
    (id: string) => {
      commitProgress((prev) => ({
        ...prev,
        soalSalah: prev.soalSalah.filter((w) => w.id !== id),
        dailyPlanDone: { ...prev.dailyPlanDone, ulangSalah: true },
      }));
    },
    [commitProgress]
  );

  const handleAnswerQuiz50 = useCallback(
    (nomor: number, dipilih: string, benar: boolean) => {
      commitProgress((prev) => {
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
        return next;
      });
    },
    [commitProgress]
  );

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

  const handleMarkDaily = useCallback(
    (field: 'video' | 'latihan3') => {
      commitProgress((prev) => ({
        ...prev,
        dailyPlanDone: { ...prev.dailyPlanDone, [field]: true },
      }));
    },
    [commitProgress]
  );

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
            'Di halaman Profil ini, kamu bisa masuk akun Google agar progres tersimpan otomatis ke Google Drive, cek bintang, skor kuis, dan lencana.'
          );
        }
      }, 90);
    }
  };

  const navItems: Array<{ id: MainTab; label: string; icon: typeof UserIcon }> = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'peta', label: 'Peta', icon: Compass },
    { id: 'latihan', label: 'Latihan', icon: Dumbbell },
    { id: 'profil', label: 'Profil', icon: UserIcon },
  ];

  const firstName = (authUser?.displayName ?? authUser?.email ?? 'Akun').split(' ')[0];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-20 md:pb-8">
      {/* Top Navigation Bar (3-zone contract) */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--bg-surface)]/90 border-b border-[var(--border-hairline)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
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

          {/* Zone 2: 4 single-line desktop nav links (locked until Ready) */}
          {readyPromptStatus === 'ready' && (
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
          )}

          {/* Zone 3: PWA Install, XP, and Google Login Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            {readyPromptStatus === 'ready' && (
              <span className="hidden sm:inline font-mono-num text-xs font-bold text-[var(--text-secondary)] whitespace-nowrap">
                {progress.xp} XP
              </span>
            )}

            {/* Menu Login Akun Google */}
            {!authUser ? (
              <GoogleSignInButton
                compact
                disabled={isLoggingIn}
                onClick={handleGoogleSignIn}
                label={isLoggingIn ? 'Masuk…' : 'Masuk Google'}
              />
            ) : (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  aria-expanded={accountMenuOpen}
                  aria-label="Menu akun Google"
                  className="min-h-[40px] px-2.5 py-1 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] inline-flex items-center gap-2 cursor-pointer max-w-[160px]"
                >
                  {authUser.photoURL ? (
                    <img
                      src={authUser.photoURL}
                      alt={firstName}
                      className="w-6 h-6 rounded-full shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-[#2F6BFF] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {firstName[0].toUpperCase()}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {firstName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3.5 shadow-xl space-y-3 z-50">
                    <div className="pb-2.5 border-b border-[var(--border-hairline)]">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {authUser.displayName ?? 'Siswa'}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{authUser.email}</p>
                      <p className="text-[11px] font-semibold mt-1 text-[#16A36E] inline-flex items-center gap-1">
                        <Cloud className="w-3.5 h-3.5" />
                        {needsDriveReauth
                          ? 'Perlu hubungkan ulang Drive'
                          : driveSyncAuthorized
                            ? driveStatus === 'syncing'
                              ? 'Mengunggah ke Drive…'
                              : 'Auto-save Drive aktif'
                            : 'Siap sinkronisasi Drive'}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {needsDriveReauth && (
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[#2F6BFF] text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Hubungkan Ulang Google Drive
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleManualSaveDrive}
                        className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface-soft)] text-[var(--text-primary)] text-xs font-bold flex items-center gap-2 cursor-pointer hover:border-[#2F6BFF]"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#2F6BFF]" />
                        Simpan Sekarang ke Drive
                      </button>

                      <button
                        type="button"
                        onClick={handleManualLoadDrive}
                        className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface-soft)] text-[var(--text-primary)] text-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <DownloadCloud className="w-3.5 h-3.5 text-[#16A36E]" />
                        Muat Progres dari Drive
                      </button>

                      {readyPromptStatus === 'ready' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            switchTab('profil');
                          }}
                          className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface-soft)] text-[var(--text-primary)] text-xs font-bold flex items-center gap-2 cursor-pointer"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-[#FF7A1A]" />
                          Buka Profil &amp; Progres
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface-soft)] text-[var(--text-primary)] text-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        Ganti Akun Google
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleLogout}
                        className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border border-[#E5484D]/30 text-[#E5484D] text-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          Mode Offline aktif — Progres tersimpan lokal &amp; akan diunggah ke Google Drive saat online kembali.
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {readyPromptStatus !== 'ready' ? (
          <ReadyCheckScreen
            status={readyPromptStatus}
            speech={speech}
            authUser={authUser}
            needsDriveReauth={needsDriveReauth}
            isLoggingIn={isLoggingIn}
            authError={authError}
            onSelectReady={handleAnswerReady}
            onSelectNotReady={handleAnswerNotReady}
            onGoogleSignIn={handleGoogleSignIn}
            onGoogleLogout={handleGoogleLogout}
          />
        ) : (
          <>
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
                    guidedMode={guidedMode}
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
                      commitProgress((prev) => {
                        const next = { ...prev, xp: prev.xp + xp };
                        next.lencana = computeEarnedBadges(next);
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
                    authUser={authUser}
                    needsDriveReauth={needsDriveReauth}
                    isLoggingIn={isLoggingIn}
                    driveSyncAuthorized={driveSyncAuthorized}
                    driveStatus={driveStatus}
                    driveLastSavedAt={driveLastSavedAt}
                    driveError={driveError}
                    onGoogleSignIn={handleGoogleSignIn}
                    onGoogleLogout={handleGoogleLogout}
                    onManualSaveDrive={handleManualSaveDrive}
                    onManualLoadDrive={handleManualLoadDrive}
                    onUpdateSettings={updateSettings}
                    onClearWrongAttempt={handleClearWrongAttempt}
                    onResetProgress={() => {
                      const fresh = resetAllProgress(uidRef.current);
                      setProgress(fresh);
                      if (authUserRef.current) {
                        driveDirtyRef.current = true;
                      }
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation (4 tabs, only after Ready) */}
      {readyPromptStatus === 'ready' && (
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
      )}

      {/* Confirmation dialog before creating/overwriting/loading Google Drive files */}
      <DriveSyncModal
        pending={pendingDriveConfirm}
        busy={confirmBusy}
        onUseDriveData={handleConfirmUseDriveData}
        onUploadLocalToDrive={handleConfirmUploadLocalToDrive}
        onCancel={() => {
          setPendingDriveConfirm(null);
          setDriveSyncAuthorized(false);
        }}
      />

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
