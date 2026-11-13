import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileUp,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Search,
  Shuffle,
  Timer,
  Trophy,
  Volume2,
} from 'lucide-react';
import { BAB_MAP, BABS } from '../data/babs';
import { generateSoalMirip } from '../data/generators';
import {
  ATURAN_SKOR_KUIS,
  CONTEKAN_RUMUS_RINGKAS,
  TIPS_JITU_OLIMPIADE,
} from '../data/panduanAwal';
import { SUBBAB_LIST, SUBBAB_MAP } from '../data/subbab';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import type {
  BabId,
  LevelLatihan,
  SoalKuis50,
  SoalMirip,
  SubBabId,
  UserProgress,
  UserSettings,
  WrongAttempt,
} from '../types/physics';
import { parseAndValidateQuizInput } from '../utils/quizImporter';
import { playSoftFx } from '../utils/soundFx';
import type { QuizKeyMismatch } from '../utils/storage';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { MathText } from '../components/MathText';
import { SVGPhysicsDiagram } from '../components/SVGPhysicsDiagram';

export type PracticeTab = 'kuis50' | 'bank' | 'rumus' | 'tantangan5m';

interface PracticeHubPageProps {
  initialTab?: PracticeTab;
  progress: UserProgress;
  settings: UserSettings;
  speech: UseSpeechGuideReturn;
  guidedMode: boolean;
  onGuideSpeak: (msg: string, forceSpeak?: boolean) => void;
  quiz50: SoalKuis50[];
  onAnswerQuiz50: (nomor: number, dipilih: string, benar: boolean) => void;
  onImportQuiz50: (overrides: Partial<Record<number, Partial<SoalKuis50>>>, mismatches: QuizKeyMismatch[]) => void;
  onRecordWrongAttempt: (attempt: WrongAttempt) => void;
  onAddXp: (xp: number) => void;
  onMarkDailyLatihan: () => void;
}

const KUIS50_VOICE_GUIDE =
  'Selamat datang di Kuis Olimpiade lima puluh Soal! Kerjakan dulu setiap soal sendiri sebelum membuka pembahasan. Pencet kartu soal untuk membukanya, lalu pilih jawaban A sampai E. Ingat aturan skornya: jawaban benar ditambah empat, jawaban salah dikurangi satu, dan kalau tidak dijawab nilainya nol. Kalau kamu ragu, kamu boleh pencet tombol Kosongkan. Setelah menjawab, langsung baca Cara menjawab dan Tips soal serupa!';

export const PracticeHubPage: React.FC<PracticeHubPageProps> = ({
  initialTab = 'kuis50',
  progress,
  settings,
  speech,
  guidedMode,
  onGuideSpeak,
  quiz50,
  onAnswerQuiz50,
  onImportQuiz50,
  onRecordWrongAttempt,
  onAddXp,
  onMarkDailyLatihan,
}) => {
  const [tab, setTab] = useState<PracticeTab>(initialTab);
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // 1. Kuis 50 Soal state
  const [filterBabKuis, setFilterBabKuis] = useState<BabId | 'ALL'>('ALL');
  const [filterStatusKuis, setFilterStatusKuis] = useState<'ALL' | 'BELUM' | 'SALAH'>('ALL');
  const [showImportBox, setShowImportBox] = useState(false);
  const [showTipsBox, setShowTipsBox] = useState(false);
  const [showCheatBox, setShowCheatBox] = useState(false);
  const [importText, setImportText] = useState('');
  const [importReport, setImportReport] = useState<string>('');
  const [expandedNo, setExpandedNo] = useState<number | null>(1);
  const [revealedPembahasan, setRevealedPembahasan] = useState<Record<number, boolean>>({});

  const quizScoreSummary = useMemo(() => {
    let benar = 0;
    let salah = 0;
    for (const q of quiz50) {
      const ans = progress.kuis50Jawaban[q.nomor];
      if (!ans) continue;
      if (ans.benar) benar++;
      else salah++;
    }
    const terjawab = benar + salah;
    const kosong = quiz50.length - terjawab;
    const skor = benar * 4 - salah;
    return { benar, salah, terjawab, kosong, skor };
  }, [progress.kuis50Jawaban, quiz50]);

  const filteredQuiz50 = useMemo(() => {
    return quiz50.filter((q) => {
      if (filterBabKuis !== 'ALL' && SUBBAB_MAP[q.subBabId]?.babId !== filterBabKuis) return false;
      const saved = progress.kuis50Jawaban[q.nomor];
      if (filterStatusKuis === 'BELUM' && saved) return false;
      if (filterStatusKuis === 'SALAH' && (!saved || saved.benar)) return false;
      return true;
    });
  }, [filterBabKuis, filterStatusKuis, progress.kuis50Jawaban, quiz50]);

  const handleRunImport = () => {
    const res = parseAndValidateQuizInput(importText);
    if (res.errors.length > 0 && res.importedCount === 0) {
      setImportReport(`Gagal mengimpor: ${res.errors.join(' ')}`);
      return;
    }
    onImportQuiz50(res.overrides, res.mismatches);
    const mismatchMsg =
      res.mismatches.length > 0
        ? ` Ditemukan ${res.mismatches.length} perbedaan kunci dengan Bagian 7 (lihat peringatan di Mode Kurator).`
        : ' Semua kunci cocok dengan daftar terverifikasi.';
    setImportReport(`Berhasil mengimpor ${res.importedCount} soal.${mismatchMsg}`);
    setImportText('');
  };

  // 2. Bank Soal Mirip state
  const [bankSubBab, setBankSubBab] = useState<SubBabId>('A1');
  const [bankLevel, setBankLevel] = useState<LevelLatihan>(1);
  const [bankSeed, setBankSeed] = useState(501);
  const [bankChoice, setBankChoice] = useState<number | null>(null);
  const [bankChecked, setBankChecked] = useState(false);
  const [bankShowMethod, setBankShowMethod] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const bankSoal: SoalMirip = useMemo(
    () => generateSoalMirip(bankSubBab, bankLevel, bankSeed),
    [bankSubBab, bankLevel, bankSeed]
  );

  // 3. Tantangan 5 Menit state
  const [sprintRunning, setSprintRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [sprintIdx, setSprintIdx] = useState(0);
  const [sprintSeed, setSprintSeed] = useState(777);
  const [sprintScore, setSprintScore] = useState(0);
  const [sprintChoice, setSprintChoice] = useState<number | null>(null);
  const [sprintChecked, setSprintChecked] = useState(false);
  const [sprintDone, setSprintDone] = useState(false);

  const sprintQuestions: SoalMirip[] = useMemo(() => {
    const pickIds: SubBabId[] = ['A2', 'B1', 'C4', 'D3', 'F1'];
    return pickIds.map((id, i) => generateSoalMirip(id, ((i % 3) + 1) as LevelLatihan, sprintSeed + i * 43));
  }, [sprintSeed]);

  useEffect(() => {
    if (!sprintRunning || sprintDone) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setSprintDone(true);
          setSprintRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [sprintRunning, sprintDone]);

  const startSprint = () => {
    setSprintSeed((s) => s + 109);
    setSecondsLeft(300);
    setSprintIdx(0);
    setSprintScore(0);
    setSprintChoice(null);
    setSprintChecked(false);
    setSprintDone(false);
    setSprintRunning(true);
  };

  // 4. Buku Rumus & Jebakan search
  const [rumusQuery, setRumusQuery] = useState('');
  const [rumusBab, setRumusBab] = useState<BabId | 'ALL'>('ALL');
  const filteredRumus = useMemo(() => {
    const q = rumusQuery.trim().toLowerCase();
    return SUBBAB_LIST.filter((s) => {
      if (rumusBab !== 'ALL' && s.babId !== rumusBab) return false;
      if (!q) return true;
      return (
        s.judul.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.rumus.some((r) => r.label.toLowerCase().includes(q)) ||
        s.jebakan.some((j) => j.toLowerCase().includes(q))
      );
    });
  }, [rumusQuery, rumusBab]);

  const tipsSpeechText = TIPS_JITU_OLIMPIADE.map((t) => `Tip ${t.no}: ${t.judul}. ${t.isi}`).join(' ');

  return (
    <div className="space-y-6">
      <ConfettiBurst triggerKey={confettiKey} />

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Arena Latihan &amp; Buku Rumus
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Kerjakan Kuis 50 Soal lengkap dengan pembahasan, uji Bank Soal Mirip acak, Tantangan 5 Menit, atau cari cepat rumus dan jebakan.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { id: 'kuis50' as const, label: 'Kuis 50 Soal', icon: Trophy },
          { id: 'bank' as const, label: 'Bank Soal Mirip', icon: Shuffle },
          { id: 'tantangan5m' as const, label: 'Tantangan 5 Menit', icon: Timer },
          { id: 'rumus' as const, label: 'Buku Rumus & Jebakan', icon: BookOpen },
        ]).map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                if (guidedMode) {
                  const tabMsg: Record<PracticeTab, string> = {
                    kuis50:
                      'Kamu di Kuis lima puluh Soal. Buka soalnya, pilih A sampai E, baca cara menjawab, lalu pencet Lanjut Soal berikutnya.',
                    bank: 'Kamu di Bank Soal Mirip. Pilih sub-bab dan level, pilih A sampai E, lalu pencet Cek Jawaban.',
                    tantangan5m:
                      'Kamu di Tantangan lima Menit. Pencet Mulai Tantangan lima Menit untuk uji kecepatan lima soal.',
                    rumus: 'Kamu di Buku Rumus dan Jebakan. Ketik kata kunci untuk mencari rumus cepat.',
                  };
                  onGuideSpeak(tabMsg[item.id], true);
                }
              }}
              className={`min-h-[48px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition ${
                active
                  ? 'bg-[#2F6BFF] text-white'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: KUIS 50 SOAL + ATURAN SKOR + 10 TIPS JITU */}
      {tab === 'kuis50' && (
        <section className="space-y-4">
          {/* Header + Scoreboard */}
          <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                  Kuis Olimpiade Fisika SMP (50 Soal Lengkap)
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  {ATURAN_SKOR_KUIS.ringkasan} Kerjakan dulu sendiri sebelum membuka pembahasan.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => (speech.isSpeaking ? speech.stop() : speech.speak(KUIS50_VOICE_GUIDE))}
                  className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#2F6BFF] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  {speech.isSpeaking ? 'Hentikan Panduan' : 'Dengar Panduan Kuis'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTipsBox((v) => !v)}
                  className="min-h-[44px] px-4 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs sm:text-sm font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-[#FF7A1A]" />
                  10 Tips Jitu
                  {showTipsBox ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheatBox((v) => !v)}
                  className="min-h-[44px] px-4 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs sm:text-sm font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#16A36E]" />
                  Contekan Rumus
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportBox((v) => !v)}
                  className="min-h-[44px] px-4 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs sm:text-sm font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FileUp className="w-4 h-4" />
                  Impor
                </button>
              </div>
            </div>

            {/* Live Olympiad Scoreboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-hairline)]">
              <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3">
                <p className="text-[11px] font-bold text-[var(--text-secondary)]">Total Skor (+4 / −1 / 0)</p>
                <p className="font-mono-num text-xl font-bold text-[#2F6BFF] mt-0.5">
                  {quizScoreSummary.skor} <span className="text-xs font-normal text-[var(--text-secondary)]">/ 200</span>
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3">
                <p className="text-[11px] font-bold text-[var(--text-secondary)]">Benar (+4 poin)</p>
                <p className="font-mono-num text-xl font-bold text-[#16A36E] mt-0.5">
                  {quizScoreSummary.benar}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3">
                <p className="text-[11px] font-bold text-[var(--text-secondary)]">Salah (−1 poin)</p>
                <p className="font-mono-num text-xl font-bold text-[#E5484D] mt-0.5">
                  {quizScoreSummary.salah}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3">
                <p className="text-[11px] font-bold text-[var(--text-secondary)]">Kosong (0 poin)</p>
                <p className="font-mono-num text-xl font-bold text-[var(--text-primary)] mt-0.5">
                  {quizScoreSummary.kosong}
                </p>
              </div>
            </div>
          </div>

          {/* 10 Tips Jitu Drawer */}
          {showTipsBox && (
            <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  10 Tips Jitu Menghadapi Olimpiade Fisika SMP
                </h3>
                <button
                  type="button"
                  onClick={() => (speech.isSpeaking ? speech.stop() : speech.speak(tipsSpeechText))}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#FF7A1A] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {speech.isSpeaking ? 'Hentikan' : 'Dengar 10 Tips (Bima)'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TIPS_JITU_OLIMPIADE.map((t) => (
                  <div key={t.no} className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-xs sm:text-sm">
                    <p className="font-bold text-[#2F6BFF]">
                      Tip {t.no}: {t.judul}
                    </p>
                    <p className="text-[var(--text-primary)] mt-1">{t.isi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contekan Rumus Ringkas Drawer */}
          {showCheatBox && (
            <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3">
              <h3 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Contekan Rumus &amp; Fakta Penting (50 Soal)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                {CONTEKAN_RUMUS_RINGKAS.map((row) => (
                  <div
                    key={row.topik}
                    className="rounded-xl bg-[var(--bg-surface-soft)] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <span className="font-bold text-[var(--text-primary)]">{row.topik}</span>
                    <span className="font-mono-num text-[#2F6BFF]">{row.rumus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Impor Kuis */}
          {showImportBox && (
            <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3">
              <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                Modul Impor Kuis Tambahan (Opsional)
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Semua 50 soal &amp; kunci sudah terpasang bawaan. Gunakan kotak ini hanya jika guru ingin memperbarui teks soal tertentu via JSON/HTML.
              </p>
              <textarea
                rows={5}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={'Contoh JSON:\n[{"nomor": 1, "teksSoal": "...", "pilihan": {"A":"...","B":"...","C":"...","D":"...","E":"..."}, "kunci": "D"}]'}
                className="w-full rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3 text-xs font-mono-num text-[var(--text-primary)]"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRunImport}
                  className="min-h-[44px] px-5 py-2 rounded-2xl bg-[#2F6BFF] text-white text-sm font-bold cursor-pointer"
                >
                  Proses &amp; Simpan Kuis
                </button>
                {importReport && (
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{importReport}</p>
                )}
              </div>
            </div>
          )}

          {/* Filter Status + Bab */}
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'ALL' as const, label: `Semua (${quiz50.length})` },
              { id: 'BELUM' as const, label: `Belum Dijawab (${quizScoreSummary.kosong})` },
              { id: 'SALAH' as const, label: `Perlu Diulang / Salah (${quizScoreSummary.salah})` },
            ]).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setFilterStatusKuis(st.id)}
                className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold cursor-pointer ${
                  filterStatusKuis === st.id
                    ? 'bg-[#2F6BFF] text-white'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Filter Mode Per Bab */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setFilterBabKuis('ALL')}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                filterBabKuis === 'ALL'
                  ? 'bg-[#FF7A1A] text-white'
                  : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
              }`}
            >
              Semua Bab (50 Soal)
            </button>
            {BABS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setFilterBabKuis(b.id)}
                className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  filterBabKuis === b.id
                    ? 'text-white'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
                }`}
                style={filterBabKuis === b.id ? { backgroundColor: b.warnaHex } : undefined}
              >
                Bab {b.id}: {b.nama}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredQuiz50.length === 0 && (
              <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-center text-sm text-[var(--text-secondary)]">
                Tidak ada soal pada filter ini. Pilih filter “Semua” di atas untuk melihat soal lainnya.
              </div>
            )}

            {filteredQuiz50.map((q) => {
              const sub = SUBBAB_MAP[q.subBabId];
              const bab = BAB_MAP[sub.babId];
              const isOpen = expandedNo === q.nomor;
              const saved = progress.kuis50Jawaban[q.nomor];
              const showSolution = Boolean(saved || revealedPembahasan[q.nomor]);

              return (
                <div
                  key={q.nomor}
                  className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedNo(isOpen ? null : q.nomor)}
                    className="w-full min-h-[56px] p-4 sm:px-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--bg-surface-soft)]/50"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono-num font-bold" style={{ color: bab.warnaHex }}>
                          Soal {q.nomor} · {q.subBabId}
                        </span>
                        {q.perluCekSoalAsli && (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Cek soal asli
                          </span>
                        )}
                        {saved ? (
                          <span className={`font-bold ${saved.benar ? 'text-[#16A36E]' : 'text-[#E5484D]'}`}>
                            · Dijawab {saved.dipilih} ({saved.benar ? 'Benar +4' : 'Salah −1'})
                          </span>
                        ) : (
                          <span className="text-[var(--text-secondary)]">· Belum dijawab (0)</span>
                        )}
                      </div>
                      <p className="font-display text-sm sm:text-base font-bold text-[var(--text-primary)] mt-1">
                        {q.judulSingkat}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#2F6BFF] shrink-0">
                      {isOpen ? 'Tutup' : 'Kerjakan'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 border-t border-[var(--border-hairline)] space-y-4">
                      {q.teksSoal && (
                        <div className="space-y-2">
                          <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
                            <MathText text={q.teksSoal} />
                          </p>
                          {q.gambarDeskripsi && (
                            <p className="text-xs italic text-[var(--text-secondary)]">
                              Gambar: {q.gambarDeskripsi}
                            </p>
                          )}
                          {q.gambarSpec && <SVGPhysicsDiagram spec={q.gambarSpec} />}
                        </div>
                      )}

                      {q.pilihan && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {(['A', 'B', 'C', 'D', 'E'] as const).map((h) => {
                            const isChosen = saved?.dipilih === h;
                            const isKey = q.kunci === h;
                            return (
                              <button
                                key={h}
                                type="button"
                                onClick={() => {
                                  const isRight = q.kunci === h;
                                  onAnswerQuiz50(q.nomor, h, isRight);
                                  onMarkDailyLatihan();
                                  if (isRight) {
                                    playSoftFx('benar', settings.efekSuara);
                                    setConfettiKey((k) => k + 1);
                                  } else {
                                    playSoftFx('salah', settings.efekSuara);
                                    onRecordWrongAttempt({
                                      id: `kuis50-${q.nomor}`,
                                      sumber: 'kuis50',
                                      subBabId: q.subBabId,
                                      pertanyaan: q.teksSoal ?? q.judulSingkat,
                                      jawabanUser: `${h}. ${q.pilihan?.[h] ?? ''}`,
                                      jawabanBenar: `${q.kunci}. ${q.pilihan?.[q.kunci as 'A' | 'B' | 'C' | 'D' | 'E'] ?? ''}`,
                                      langkah: q.pembahasanLangkah,
                                      timestamp: Date.now(),
                                    });
                                  }
                                  if (guidedMode) {
                                    onGuideSpeak(
                                      `${
                                        isRight
                                          ? `Benar, tambah empat poin! Jawaban ${h} tepat.`
                                          : `Kurang satu poin, jawaban benar adalah ${q.kunci}.`
                                      } Baca cara menjawab dan tipsnya di bawah, lalu ${
                                        q.nomor < 50
                                          ? `pencet tombol oranye Lanjut Soal ${q.nomor + 1}.`
                                          : 'kamu sudah menuntaskan soal ke-50! Cek skor totalmu di atas.'
                                      }`,
                                      true
                                    );
                                  }
                                }}
                                className={`min-h-[48px] rounded-2xl border p-3 text-left text-sm flex items-start gap-2.5 cursor-pointer transition ${
                                  showSolution
                                    ? isKey
                                      ? 'border-[#16A36E] bg-[#16A36E]/12 text-[#16A36E] font-bold'
                                      : isChosen
                                        ? 'border-[#E5484D] bg-[#E5484D]/12 text-[#E5484D]'
                                        : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]'
                                    : isChosen
                                      ? 'border-[#2F6BFF] bg-[#2F6BFF]/12 text-[#2F6BFF] font-bold'
                                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] hover:border-[#2F6BFF]'
                                }`}
                              >
                                <span className="font-mono-num font-bold shrink-0">{h}.</span>
                                <span>{q.pilihan?.[h]}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedPembahasan((prev) => ({
                                ...prev,
                                [q.nomor]: !showSolution,
                              }))
                            }
                            className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold text-[#2F6BFF] cursor-pointer"
                          >
                            {showSolution ? 'Sembunyikan Pembahasan' : 'Lihat Kunci & Pembahasan'}
                          </button>
                          {saved && (
                            <button
                              type="button"
                              onClick={() => onAnswerQuiz50(q.nomor, '', false)}
                              className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold text-[var(--text-secondary)] inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Kosongkan Jawaban (0 poin)
                            </button>
                          )}
                        </div>
                        {q.nomor < 50 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextNo = q.nomor + 1;
                              setExpandedNo(nextNo);
                              if (guidedMode) {
                                onGuideSpeak(
                                  `Sekarang kerjakan Soal ${nextNo}. Baca soalnya pelan-pelan, lalu pilih jawaban A sampai E.`,
                                  true
                                );
                              }
                            }}
                            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#FF7A1A] text-white text-xs font-bold cursor-pointer"
                          >
                            Lanjut Soal {q.nomor + 1} →
                          </button>
                        )}
                      </div>

                      {showSolution && (
                        <>
                          {q.perluCekSoalAsli && q.catatanCekAsli && (
                            <div className="rounded-2xl border border-amber-400/50 bg-[#FFBE2E]/15 p-3.5 text-xs sm:text-sm">
                              <p className="font-bold flex items-center gap-1.5">
                                <HelpCircle className="w-4 h-4 text-amber-700" />
                                Catatan Penting (Kunci Kuis: {q.kunci})
                              </p>
                              <p className="text-[var(--text-secondary)] mt-1">
                                {q.catatanCekAsli}
                              </p>
                            </div>
                          )}

                          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 space-y-2">
                            <p className="text-xs font-bold text-[#16A36E]">
                              Jawaban Benar: {q.kunci}. {q.pilihan?.[q.kunci as 'A' | 'B' | 'C' | 'D' | 'E']}
                            </p>
                            <p className="text-xs font-bold text-[#2F6BFF]">Cara Menjawab (Langkah Demi Langkah):</p>
                            <ol className="list-decimal pl-5 space-y-1 text-sm text-[var(--text-primary)]">
                              {q.pembahasanLangkah.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                            <p className="text-xs font-semibold text-[#16A36E] pt-2 border-t border-[var(--border-hairline)]">
                              Tips soal serupa: {q.tipsSerupa}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: BANK SOAL MIRIP */}
      {tab === 'bank' && (
        <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Pilih Sub-bab</span>
              <select
                value={bankSubBab}
                onChange={(e) => {
                  setBankSubBab(e.target.value as SubBabId);
                  setBankChoice(null);
                  setBankChecked(false);
                  setBankShowMethod(false);
                }}
                className="w-full min-h-[48px] rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] px-3 text-sm font-semibold"
              >
                {SUBBAB_LIST.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} — {s.judul}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Tingkat Kesulitan</span>
              <select
                value={bankLevel}
                onChange={(e) => {
                  setBankLevel(Number(e.target.value) as LevelLatihan);
                  setBankChoice(null);
                  setBankChecked(false);
                }}
                className="w-full min-h-[48px] rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] px-3 text-sm font-semibold"
              >
                <option value={1}>Level 1 — Meniru</option>
                <option value={2}>Level 2 — Variasi</option>
                <option value={3}>Level 3 — Tantangan</option>
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setBankSeed((s) => s + 137);
                  setBankChoice(null);
                  setBankChecked(false);
                  setBankShowMethod(false);
                }}
                className="w-full min-h-[48px] rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Buat Soal Acak Baru
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 text-sm sm:text-base">
            <MathText text={bankSoal.pertanyaan} />
            {bankSoal.diagram && <SVGPhysicsDiagram spec={bankSoal.diagram} />}
          </div>

          <div className="space-y-2">
            {bankSoal.pilihan.map((opt, idx) => {
              const huruf = ['A', 'B', 'C', 'D', 'E'][idx];
              const isSelected = bankChoice === idx;
              const isRight = idx === bankSoal.indeksBenar;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={bankChecked}
                  onClick={() => setBankChoice(idx)}
                  className={`w-full min-h-[48px] rounded-2xl border p-3.5 text-left text-sm flex items-center gap-3 cursor-pointer ${
                    bankChecked
                      ? isRight
                        ? 'border-[#16A36E] bg-[#16A36E]/15 text-[#16A36E] font-bold'
                        : isSelected
                          ? 'border-[#E5484D] bg-[#E5484D]/15 text-[#E5484D]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]'
                      : isSelected
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/12 text-[#2F6BFF] font-bold'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]'
                  }`}
                >
                  <span className="font-mono-num font-bold">{huruf}.</span>
                  <MathText text={opt} />
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            {!bankChecked && (
              <button
                type="button"
                disabled={bankChoice === null}
                onClick={() => {
                  if (bankChoice === null) return;
                  setBankChecked(true);
                  onMarkDailyLatihan();
                  if (bankChoice === bankSoal.indeksBenar) {
                    playSoftFx('benar', settings.efekSuara);
                    setConfettiKey((k) => k + 1);
                    onAddXp(10);
                    if (guidedMode) {
                      onGuideSpeak(
                        'Mantap, jawabanmu benar! Pencet Buat Soal Acak Baru kalau mau latihan angka lain.',
                        true
                      );
                    }
                  } else {
                    playSoftFx('salah', settings.efekSuara);
                    onRecordWrongAttempt({
                      id: `${bankSoal.uid}-${Date.now()}`,
                      sumber: 'latihan',
                      subBabId: bankSubBab,
                      pertanyaan: bankSoal.pertanyaan,
                      jawabanUser: bankSoal.pilihan[bankChoice],
                      jawabanBenar: bankSoal.pilihan[bankSoal.indeksBenar],
                      langkah: bankSoal.langkah,
                      timestamp: Date.now(),
                    });
                    if (guidedMode) {
                      onGuideSpeak(
                        'Belum tepat! Pencet tombol Lihat cara yang sama seperti di video untuk mengecek langkahnya.',
                        true
                      );
                    }
                  }
                }}
                className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm disabled:opacity-45 cursor-pointer"
              >
                Cek Jawaban
              </button>
            )}
            <button
              type="button"
              onClick={() => setBankShowMethod((v) => !v)}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-sm font-bold cursor-pointer"
            >
              {bankShowMethod ? 'Sembunyikan Pembahasan' : 'Lihat cara yang sama seperti di video'}
            </button>
          </div>

          {bankShowMethod && (
            <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 space-y-1.5 text-sm">
              {bankSoal.langkah.map((l, i) => (
                <p key={i}><MathText text={l} /></p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: TANTANGAN 5 MENIT */}
      {tab === 'tantangan5m' && (
        <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                Tantangan 5 Menit (5 Soal Campuran)
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Uji kecepatan dan ketelitianmu menyelesaikan 5 soal acak lintas bab dalam 300 detik.
              </p>
            </div>
            <div className="font-mono-num text-lg font-bold px-4 py-2 rounded-2xl bg-[var(--bg-surface-soft)] border border-[var(--border-hairline)]">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </div>
          </div>

          {!sprintRunning && !sprintDone && (
            <button
              type="button"
              onClick={startSprint}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm cursor-pointer"
            >
              Mulai Tantangan 5 Menit
            </button>
          )}

          {sprintRunning && !sprintDone && (
            <div className="space-y-4">
              <p className="text-xs font-mono-num text-[var(--text-secondary)]">
                Soal {sprintIdx + 1} / 5 · Sub-bab {sprintQuestions[sprintIdx].subBabId}
              </p>
              <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 text-sm sm:text-base">
                <MathText text={sprintQuestions[sprintIdx].pertanyaan} />
              </div>
              <div className="space-y-2">
                {sprintQuestions[sprintIdx].pilihan.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={sprintChecked}
                    onClick={() => setSprintChoice(idx)}
                    className={`w-full min-h-[48px] rounded-2xl border p-3.5 text-left text-sm flex items-center gap-3 cursor-pointer ${
                      sprintChecked
                        ? idx === sprintQuestions[sprintIdx].indeksBenar
                          ? 'border-[#16A36E] bg-[#16A36E]/15 font-bold'
                          : sprintChoice === idx
                            ? 'border-[#E5484D] bg-[#E5484D]/15'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]'
                        : sprintChoice === idx
                          ? 'border-[#2F6BFF] bg-[#2F6BFF]/12 font-bold'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]'
                    }`}
                  >
                    <span className="font-mono-num font-bold">{['A', 'B', 'C', 'D', 'E'][idx]}.</span>
                    <MathText text={opt} />
                  </button>
                ))}
              </div>
              {!sprintChecked ? (
                <button
                  type="button"
                  disabled={sprintChoice === null}
                  onClick={() => {
                    if (sprintChoice === null) return;
                    setSprintChecked(true);
                    const q = sprintQuestions[sprintIdx];
                    const ok = sprintChoice === q.indeksBenar;
                    if (ok) {
                      setSprintScore((s) => s + 1);
                      playSoftFx('benar', settings.efekSuara);
                    } else {
                      playSoftFx('salah', settings.efekSuara);
                      onRecordWrongAttempt({
                        id: `${q.uid}-${Date.now()}`,
                        sumber: 'tantangan5m',
                        subBabId: q.subBabId,
                        pertanyaan: q.pertanyaan,
                        jawabanUser: q.pilihan[sprintChoice],
                        jawabanBenar: q.pilihan[q.indeksBenar],
                        langkah: q.langkah,
                        timestamp: Date.now(),
                      });
                    }
                    if (guidedMode) {
                      onGuideSpeak(
                        `${ok ? 'Benar!' : 'Belum pas.'} Sekarang pencet tombol biru ${
                          sprintIdx < 4 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'
                        }.`,
                        true
                      );
                    }
                  }}
                  className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm disabled:opacity-45 cursor-pointer"
                >
                  Kunci Jawaban
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (sprintIdx < 4) {
                      setSprintIdx((i) => i + 1);
                      setSprintChoice(null);
                      setSprintChecked(false);
                    } else {
                      setSprintDone(true);
                      setSprintRunning(false);
                      onAddXp(sprintScore * 12);
                      onMarkDailyLatihan();
                      if (guidedMode) {
                        onGuideSpeak(
                          `Tantangan lima menit selesai! Skormu ${sprintScore} dari lima soal.`,
                          true
                        );
                      }
                    }
                  }}
                  className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm cursor-pointer"
                >
                  {sprintIdx < 4 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                </button>
              )}
            </div>
          )}

          {sprintDone && (
            <div className="rounded-2xl bg-[#16A36E]/12 border border-[#16A36E]/30 p-5 space-y-3">
              <p className="font-display text-lg font-bold text-[#16A36E] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Tantangan Selesai! Skor: {sprintScore} / 5
              </p>
              <button
                type="button"
                onClick={startSprint}
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#FF7A1A] text-white text-sm font-bold cursor-pointer"
              >
                Main Lagi dengan Soal Baru
              </button>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: BUKU RUMUS & JEBAKAN */}
      {tab === 'rumus' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="search"
                value={rumusQuery}
                onChange={(e) => setRumusQuery(e.target.value)}
                placeholder="Cari rumus, sub-bab, atau jebakan (mis. Archimedes, trafo, Charles)…"
                className="w-full min-h-[48px] rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] pl-10 pr-4 text-sm"
              />
            </div>
            <select
              value={rumusBab}
              onChange={(e) => setRumusBab(e.target.value as BabId | 'ALL')}
              className="min-h-[48px] rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 text-sm font-semibold"
            >
              <option value="ALL">Semua Bab</option>
              {BABS.map((b) => (
                <option key={b.id} value={b.id}>
                  Bab {b.id}: {b.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRumus.map((s) => {
              const bab = BAB_MAP[s.babId];
              return (
                <article
                  key={s.id}
                  className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3"
                >
                  <div>
                    <p className="text-xs font-bold" style={{ color: bab.warnaHex }}>
                      {s.id} · {bab.nama}
                    </p>
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{s.judul}</h3>
                  </div>

                  <div className="space-y-2">
                    {s.rumus.map((r, i) => (
                      <div key={i} className="rounded-2xl bg-[var(--bg-surface-soft)] p-3">
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">
                          {r.label} · <span className="font-mono-num">{r.satuan}</span>
                        </p>
                        <div className="mt-1 overflow-x-auto">
                          <MathText text={r.latex} block />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-[#E5484D]/8 p-3 text-xs space-y-1">
                    <p className="font-bold text-[#E5484D]">Jebakan Umum:</p>
                    {s.jebakan.map((j, i) => (
                      <p key={i} className="text-[var(--text-primary)]">• {j}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
