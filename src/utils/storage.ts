import { INITIAL_KUIS_50 } from '../data/kuis50';
import type {
  CuratorVideoMeta,
  SoalKuis50,
  SubBabId,
  SubBabProgress,
  UserProgress,
  UserSettings,
  WrongAttempt,
} from '../types/physics';

const KEY_PROGRESS = 'jf_progress_v1';
const KEY_SETTINGS = 'jf_settings_v1';
const KEY_CURATOR = 'jf_curator_videos_v1';
const KEY_IMPORTED_QUIZ = 'jf_imported_quiz_v1';
const KEY_QUIZ_MISMATCH = 'jf_quiz_mismatches_v1';

export interface QuizKeyMismatch {
  nomor: number;
  kunciHtml: string;
  kunciBagian7: string;
}

function todayIso(): string {
  try {
    return new Date().toISOString().slice(0, 10);
  } catch {
    return '2026-11-13';
  }
}

export function defaultProgress(): UserProgress {
  const today = todayIso();
  return {
    xp: 0,
    streakHarian: 1,
    tanggalAktifTerakhir: today,
    subBab: {},
    kuis50Jawaban: {},
    lencana: [],
    soalSalah: [],
    dailyPlanDone: {
      video: false,
      latihan3: false,
      ulangSalah: false,
      tanggal: today,
    },
  };
}

export function defaultSettings(): UserSettings {
  return {
    kecepatanSuara: 1.0,
    voiceURI: '',
    bisukanSuara: false,
    efekSuara: true,
    ukuranTeks: 'md',
    modeGelap: false,
  };
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Tetap berjalan jika localStorage penuh/diblokir
  }
}

export function loadProgress(): UserProgress {
  const today = todayIso();
  const base = defaultProgress();
  const stored = safeRead<UserProgress>(KEY_PROGRESS, base);

  let streak = stored.streakHarian || 1;
  if (stored.tanggalAktifTerakhir && stored.tanggalAktifTerakhir !== today) {
    const prev = new Date(stored.tanggalAktifTerakhir);
    const now = new Date(today);
    const diffDays = Math.round((now.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak += 1;
    else if (diffDays > 1) streak = 1;
  }

  const daily =
    stored.dailyPlanDone?.tanggal === today
      ? stored.dailyPlanDone
      : { video: false, latihan3: false, ulangSalah: false, tanggal: today };

  return {
    ...base,
    ...stored,
    streakHarian: streak,
    tanggalAktifTerakhir: today,
    dailyPlanDone: daily,
  };
}

export function saveProgress(p: UserProgress): void {
  safeWrite(KEY_PROGRESS, p);
}

export function loadSettings(): UserSettings {
  const stored = safeRead<Omit<Partial<UserSettings>, 'kecepatanSuara'> & { kecepatanSuara?: number }>(
    KEY_SETTINGS,
    {}
  );
  const rawSpd = stored.kecepatanSuara;
  const normalizedSpeed: UserSettings['kecepatanSuara'] =
    rawSpd === 0.85 || rawSpd === 0.8
      ? 0.85
      : rawSpd === 1.15 || rawSpd === 1.1
        ? 1.15
        : 1.0;
  return { ...defaultSettings(), ...stored, kecepatanSuara: normalizedSpeed };
}

export function saveSettings(s: UserSettings): void {
  safeWrite(KEY_SETTINGS, s);
}

export function loadCuratorMeta(): Record<string, CuratorVideoMeta> {
  return safeRead<Record<string, CuratorVideoMeta>>(KEY_CURATOR, {});
}

export function saveCuratorMeta(meta: Record<string, CuratorVideoMeta>): void {
  safeWrite(KEY_CURATOR, meta);
}

export function loadQuiz50(): SoalKuis50[] {
  const overrides = safeRead<Partial<Record<number, Partial<SoalKuis50>>>>(KEY_IMPORTED_QUIZ, {});
  return INITIAL_KUIS_50.map((q) => {
    const ov = overrides[q.nomor];
    if (!ov) return q;
    return { ...q, ...ov };
  });
}

export function saveImportedQuizOverrides(overrides: Partial<Record<number, Partial<SoalKuis50>>>): void {
  safeWrite(KEY_IMPORTED_QUIZ, overrides);
}

export function loadQuizMismatches(): QuizKeyMismatch[] {
  return safeRead<QuizKeyMismatch[]>(KEY_QUIZ_MISMATCH, []);
}

export function saveQuizMismatches(list: QuizKeyMismatch[]): void {
  safeWrite(KEY_QUIZ_MISMATCH, list);
}

export function resetAllProgress(): UserProgress {
  const fresh = defaultProgress();
  saveProgress(fresh);
  return fresh;
}

export function getSubBabProgress(p: UserProgress, id: SubBabId): SubBabProgress {
  return (
    p.subBab[id] ?? {
      tahapSelesai: [],
      bintang: 0,
      catatanCepat: '',
      tugasTontonCentang: [false, false, false],
      sudahNonton: false,
      skorLevel3Terbaik: 0,
    }
  );
}

export function computeEarnedBadges(p: UserProgress): string[] {
  const badges = new Set<string>(p.lencana);
  const completedSubBabs = Object.entries(p.subBab).filter(([, v]) => (v?.tahapSelesai?.length ?? 0) >= 5);
  const stars = Object.values(p.subBab).reduce((acc, v) => acc + (v?.bintang ?? 0), 0);

  if (p.xp >= 50) badges.add('Langkah Pertama');
  if ((p.subBab.I1?.bintang ?? 0) >= 2 || (p.subBab.C1?.bintang ?? 0) >= 2) badges.add('Pemburu Satuan');
  if ((p.subBab.F1?.bintang ?? 0) >= 2) badges.add('Raja Tuas');
  if ((p.subBab.A1?.bintang ?? 0) >= 2) badges.add('Ahli Grafik');
  if ((p.subBab.B4?.bintang ?? 0) >= 2) badges.add('Penjaga Kalor');
  if ((p.subBab.C5?.bintang ?? 0) >= 2) badges.add('Kapten Archimedes');
  if ((p.subBab.D2?.bintang ?? 0) >= 2) badges.add('Penala Resonansi');
  if ((p.subBab.E1?.bintang ?? 0) >= 2) badges.add('Master Rangkaian');
  if ((p.subBab.G2?.bintang ?? 0) >= 2) badges.add('Navigator Waktu');
  if (stars >= 15 || completedSubBabs.length >= 5) badges.add('Bintang Laboratorium');
  if (p.streakHarian >= 3) badges.add('Konsisten 3 Hari');
  if (Object.keys(p.kuis50Jawaban).length >= 10) badges.add('Penantang Olimpiade');

  return Array.from(badges);
}

export function addWrongAttempt(list: WrongAttempt[], item: WrongAttempt): WrongAttempt[] {
  const filtered = list.filter((w) => w.pertanyaan !== item.pertanyaan);
  return [item, ...filtered].slice(0, 40);
}
