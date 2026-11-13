import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  Search,
  Star,
  Volume2,
} from 'lucide-react';
import { BAB_MAP } from '../data/babs';
import { generateSoalMirip } from '../data/generators';
import { NARASI } from '../data/narasi';
import { SUBBAB_MAP } from '../data/subbab';
import { B6_SEARCH_URL, VIDEOS } from '../data/videos';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import type {
  CuratorVideoMeta,
  LevelLatihan,
  SoalKuis50,
  SoalMirip,
  SubBabId,
  SubBabProgress,
  UserProgress,
  UserSettings,
  VideoRef,
  WrongAttempt,
} from '../types/physics';
import { getSubBabProgress } from '../utils/storage';
import { playSoftFx } from '../utils/soundFx';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { MathText } from '../components/MathText';
import { SVGPhysicsDiagram } from '../components/SVGPhysicsDiagram';
import { VoiceGuideBar } from '../components/VoiceGuideBar';
import { VoltaMascot, type VoltaExpression } from '../components/VoltaMascot';
import { YouTubeEmbed } from '../components/YouTubeEmbed';

interface SubBabPageProps {
  subBabId: SubBabId;
  progress: UserProgress;
  settings: UserSettings;
  speech: UseSpeechGuideReturn;
  guidedMode: boolean;
  onGuideSpeak: (msg: string, forceSpeak?: boolean) => void;
  curatorMeta: Record<string, CuratorVideoMeta>;
  quiz50: SoalKuis50[];
  onBackToMap: () => void;
  onUpdateSubBabProgress: (id: SubBabId, patch: Partial<SubBabProgress>, xpGain?: number) => void;
  onRecordWrongAttempt: (attempt: WrongAttempt) => void;
  onAnswerQuiz50: (nomor: number, dipilih: string, benar: boolean) => void;
  onUpdateCuratorMeta: (videoId: string, patch: Partial<CuratorVideoMeta>) => void;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
  onMarkDaily: (field: 'video' | 'latihan3') => void;
}

const TAHAP_LABELS = [
  { no: 1, label: 'Pemandu' },
  { no: 2, label: 'Video' },
  { no: 3, label: 'Rumus' },
  { no: 4, label: 'Contoh' },
  { no: 5, label: 'Latihan' },
  { no: 6, label: 'Olimpiade' },
];

function formatPeranLabel(v: VideoRef): string {
  const role = v.peran === 'utama' ? 'Utama' : v.peran === 'cadangan' ? 'Cadangan' : 'Pendukung';
  const lvl = v.level === 'SMP' ? 'Level SMP' : v.level === 'SMA' ? 'Level SMA' : 'Bahasa Inggris';
  return `${role} · ${lvl}`;
}

export const SubBabPage: React.FC<SubBabPageProps> = ({
  subBabId,
  progress,
  settings,
  speech,
  guidedMode,
  onGuideSpeak,
  curatorMeta,
  quiz50,
  onBackToMap,
  onUpdateSubBabProgress,
  onRecordWrongAttempt,
  onAnswerQuiz50,
  onUpdateCuratorMeta,
  onUpdateSettings,
  onMarkDaily,
}) => {
  const sub = SUBBAB_MAP[subBabId];
  const bab = BAB_MAP[sub.babId];
  const narasi = NARASI[subBabId];
  const sp = getSubBabProgress(progress, subBabId);

  const [tahapAktif, setTahapAktif] = useState<number>(1);
  const [confettiKey, setConfettiKey] = useState(0);
  const [voltaMsg, setVoltaMsg] = useState<string>('');
  const [voltaExpr, setVoltaExpr] = useState<VoltaExpression>('senang');

  // Tahap 2 Video state
  const visibleVideos = useMemo(() => {
    const raw = VIDEOS[subBabId] ?? [];
    const filtered = raw.filter((v) => {
      const m = curatorMeta[v.id];
      return m?.status !== 'mati' && m?.status !== 'kurang_cocok';
    });
    return filtered.sort((a, b) => {
      const pa = curatorMeta[a.id]?.diprioritaskan ? 1 : 0;
      const pb = curatorMeta[b.id]?.diprioritaskan ? 1 : 0;
      return pb - pa;
    });
  }, [subBabId, curatorMeta]);

  const [selectedVideoId, setSelectedVideoId] = useState<string>(visibleVideos[0]?.id ?? '');
  useEffect(() => {
    setSelectedVideoId(visibleVideos[0]?.id ?? '');
    setTahapAktif(1);
    setVoltaMsg('');
    setVoltaExpr('senang');
  }, [subBabId]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeVideo = visibleVideos.find((v) => v.id === selectedVideoId) ?? visibleVideos[0];
  const backupVideo = visibleVideos.find((v) => v.id !== activeVideo?.id);

  // Tahap 4 Guided example state
  const [stepIdx, setStepIdx] = useState(0);
  const [stepInputs, setStepInputs] = useState<Record<number, string>>({});
  const [stepVerified, setStepVerified] = useState<Record<number, boolean>>({});
  const [stepErrorMsg, setStepErrorMsg] = useState<string>('');
  const [shakeStep, setShakeStep] = useState(false);

  useEffect(() => {
    setStepIdx(0);
    setStepInputs({});
    setStepVerified({});
    setStepErrorMsg('');
  }, [subBabId]);

  // Tahap 5 Parametric practice state
  const [latihanLevel, setLatihanLevel] = useState<LevelLatihan>(1);
  const [seedBase, setSeedBase] = useState<number>(101);
  const [soalIdx, setSoalIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [checkedLatihan, setCheckedLatihan] = useState(false);
  const [showVideoMethod, setShowVideoMethod] = useState(false);
  const [usedHintThisRound, setUsedHintThisRound] = useState(false);
  const [level3CorrectNoHint, setLevel3CorrectNoHint] = useState(0);
  const [shakeLatihan, setShakeLatihan] = useState(false);

  const latihanSet: SoalMirip[] = useMemo(() => {
    return [0, 1, 2].map((i) => generateSoalMirip(subBabId, latihanLevel, seedBase + i * 97));
  }, [subBabId, latihanLevel, seedBase]);

  const currentSoal = latihanSet[soalIdx];

  useEffect(() => {
    setSoalIdx(0);
    setSelectedOpt(null);
    setCheckedLatihan(false);
    setShowVideoMethod(false);
    setUsedHintThisRound(false);
  }, [subBabId, latihanLevel, seedBase]);

  // Tahap 6 Mapped Olympiad questions
  const [revealedStage6, setRevealedStage6] = useState<Record<number, boolean>>({});
  const mappedOlimpiade = useMemo(
    () => quiz50.filter((q) => sub.soalKuis.includes(q.nomor)),
    [quiz50, sub.soalKuis]
  );

  const maxUnlockedTahap = useMemo(() => {
    if (sp.tahapSelesai.length === 0) return 1;
    return Math.min(6, Math.max(...sp.tahapSelesai) + 1);
  }, [sp.tahapSelesai]);

  const fullIntroScript = `${narasi.sapaan} ${narasi.tujuan} Sambil menonton nanti, catat tiga hal: ${narasi.tugasTonton.join(' ')} ${narasi.penyemangat} Kalau sudah siap, pencet tombol oranye Lanjut ke Video di bawah.`;

  const stageNextHint: Record<number, { text: string; voice: string }> = {
    1: {
      text: 'Pencet "Putar Suara" di atas, baca 3 Tugas Tonton, lalu pencet tombol oranye "Lanjut ke Video".',
      voice: 'Di Tahap satu, pencet Putar Suara untuk mendengarkan tugas tonton, lalu pencet tombol oranye Lanjut ke Video.',
    },
    2: {
      text: 'Putar video, centang 3 kotak Tugas Tonton di kanan, pencet "Sudah nonton", lalu pencet "Lanjut ke Rumus".',
      voice: 'Di Tahap dua, putar video di kiri, centang tiga Tugas Tonton di kanan, pencet Sudah nonton, lalu pencet Lanjut ke Rumus.',
    },
    3: {
      text: 'Pelajari rumus bersatuan dan 2 jebakan, atau pencet "Dengarkan ringkasan", lalu pencet "Lanjut ke Contoh Terpandu".',
      voice: 'Di Tahap tiga, baca rumus dan jebakan, atau pencet Dengarkan ringkasan, lalu pencet tombol oranye Lanjut ke Contoh Terpandu.',
    },
    4: {
      text: 'Isi jawaban tiap langkah, pencet "Cek Langkah Ini", lalu "Langkah berikutnya" sampai muncul tombol "Lanjut ke Latihan 3 Level".',
      voice: 'Di Tahap empat, isi jawaban tiap langkah lalu pencet Cek Langkah Ini, pencet Langkah berikutnya sampai selesai, lalu pencet Lanjut ke Latihan tiga Level.',
    },
    5: {
      text: 'Pilih level 1, 2, lalu 3. Pilih A sampai E lalu pencet "Cek Jawaban". Jawab benar 2 dari 3 soal Level 3 tanpa petunjuk untuk 3 bintang!',
      voice: 'Di Tahap lima, pilih jawaban A sampai E lalu pencet Cek Jawaban, lalu Soal Berikutnya. Naikkan dari Level satu ke Level tiga. Selesaikan dengan benar minimal dua dari tiga soal Level tiga tanpa petunjuk untuk mendapat tiga bintang, lalu pencet Lanjut ke Soal Olimpiade.',
    },
    6: {
      text: 'Jawab soal olimpiade asli (Benar +4, Salah −1, Kosong 0), baca pembahasannya, lalu pencet tombol hijau "Selesaikan Sub-bab".',
      voice: 'Di Tahap enam terakhir, coba jawab soal olimpiade asli, baca cara menjawab dan tipsnya, lalu pencet tombol hijau Selesaikan Sub-bab untuk kembali ke Peta.',
    },
  };

  const summaryScript = `Ringkasan ${sub.judul}. Konsep inti: ${sub.konsepInti.join(' ')} Langkah baku: ${sub.langkahBaku.join(' ')} Hati-hati jebakan: ${sub.jebakan.join(' ')}`;

  // Auto-speak Tahap 1 once when entering a sub-bab in guidedMode
  const lastNarratedSubBabRef = useRef<string | null>(null);
  const onGuideSpeakRef = useRef(onGuideSpeak);
  onGuideSpeakRef.current = onGuideSpeak;

  useEffect(() => {
    if (!guidedMode) {
      lastNarratedSubBabRef.current = null;
      return;
    }
    if (lastNarratedSubBabRef.current === subBabId) return;
    lastNarratedSubBabRef.current = subBabId;
    const timer = window.setTimeout(() => {
      onGuideSpeakRef.current(
        `Kamu memilih ${sub.id}: ${sub.judul}. ${fullIntroScript}`,
        true
      );
    }, 120);
    return () => window.clearTimeout(timer);
  }, [subBabId, guidedMode, sub.id, sub.judul, fullIntroScript]);

  const completeAndNext = (currentTahap: number) => {
    speech.stop();
    const nextSet = Array.from(new Set([...sp.tahapSelesai, currentTahap]));
    const gainedXp = sp.tahapSelesai.includes(currentTahap) ? 0 : 15;
    onUpdateSubBabProgress(subBabId, { tahapSelesai: nextSet }, gainedXp);
    if (currentTahap < 6) {
      const nextTahap = currentTahap + 1;
      setTahapAktif(nextTahap);
      if (guidedMode) {
        onGuideSpeak(
          `Tahap ${currentTahap} selesai! ${stageNextHint[nextTahap]?.voice ?? ''}`,
          true
        );
      }
    }
  };

  const handleCheckStep = () => {
    const step = sub.contohTerpandu.langkah[stepIdx];
    const raw = (stepInputs[stepIdx] ?? '').trim();
    if (!raw) {
      setShakeStep(true);
      setStepErrorMsg('Isi atau pilih jawaban langkah ini dulu ya.');
      if (guidedMode) {
        onGuideSpeak('Isi atau pilih jawaban langkah ini dulu, lalu pencet Cek Langkah Ini.', true);
      }
      window.setTimeout(() => setShakeStep(false), 400);
      return;
    }

    let ok = false;
    if (step.tipeInput === 'pilihan') {
      ok = raw === step.jawabanBenar;
    } else {
      const numUser = Number(raw.replace(',', '.'));
      const numTarget = Number(step.jawabanBenar.replace(',', '.'));
      const tol = step.toleransiAngka ?? 0.02;
      ok = Number.isFinite(numUser) && Math.abs(numUser - numTarget) <= tol;
    }

    if (ok) {
      playSoftFx('benar', settings.efekSuara);
      setStepVerified((prev) => ({ ...prev, [stepIdx]: true }));
      setStepErrorMsg('');
      setVoltaExpr('bangga');
      setVoltaMsg(step.penjelasanLangkah);
      if (guidedMode) {
        const isLast = stepIdx >= sub.contohTerpandu.langkah.length - 1;
        const nextCmd = isLast
          ? 'Semua langkah contoh selesai! Sekarang pencet tombol oranye Lanjut ke Latihan tiga Level.'
          : 'Mantap! Sekarang pencet tombol biru Langkah berikutnya.';
        onGuideSpeak(`${step.penjelasanLangkah} ${nextCmd}`, true);
      }
    } else {
      playSoftFx('salah', settings.efekSuara);
      setStepErrorMsg(step.petunjukSalah);
      setVoltaExpr('berpikir');
      setVoltaMsg(step.petunjukSalah);
      if (guidedMode) {
        onGuideSpeak(`Belum pas, coba lagi ya. ${step.petunjukSalah}`, true);
      }
    }
  };

  const handleCheckLatihan = () => {
    if (selectedOpt === null) {
      setShakeLatihan(true);
      if (guidedMode) {
        onGuideSpeak('Pilih salah satu huruf A sampai E dulu, lalu pencet Cek Jawaban.', true);
      }
      window.setTimeout(() => setShakeLatihan(false), 400);
      return;
    }
    setCheckedLatihan(true);
    onMarkDaily('latihan3');
    const isCorrect = selectedOpt === currentSoal.indeksBenar;

    const nextButtonCmd =
      soalIdx < 2
        ? 'Sekarang pencet tombol biru Soal Berikutnya.'
        : latihanLevel < 3
          ? `Level ${latihanLevel} beres! Pencet tombol biru Naik ke Level ${latihanLevel + 1}.`
          : 'Semua level latihan selesai! Sekarang pencet Lanjut ke Soal Olimpiade.';

    if (isCorrect) {
      playSoftFx('benar', settings.efekSuara);
      setConfettiKey((k) => k + 1);
      setVoltaExpr('bangga');
      const praise = narasi.saatBenar[soalIdx % narasi.saatBenar.length];
      setVoltaMsg(praise);

      let newStars = sp.bintang;
      if (latihanLevel === 1 && newStars < 1) newStars = 1;
      if (latihanLevel === 2 && newStars < 2) newStars = 2;

      let nextL3Score = level3CorrectNoHint;
      if (latihanLevel === 3 && !usedHintThisRound) {
        nextL3Score = level3CorrectNoHint + 1;
        setLevel3CorrectNoHint(nextL3Score);
        if (nextL3Score >= 2) {
          newStars = 3;
          playSoftFx('bintang', settings.efekSuara);
        }
      }

      onUpdateSubBabProgress(
        subBabId,
        {
          bintang: newStars,
          skorLevel3Terbaik: Math.max(sp.skorLevel3Terbaik, nextL3Score),
        },
        10
      );
      if (guidedMode) {
        onGuideSpeak(`${praise} ${nextButtonCmd}`, true);
      }
    } else {
      playSoftFx('salah', settings.efekSuara);
      setVoltaExpr('kaget');
      const enc = narasi.saatSalah[soalIdx % narasi.saatSalah.length];
      setVoltaMsg(`${enc} ${currentSoal.kesalahanUmum}`);
      onRecordWrongAttempt({
        id: `${currentSoal.uid}-${Date.now()}`,
        sumber: 'latihan',
        subBabId,
        pertanyaan: currentSoal.pertanyaan,
        jawabanUser: currentSoal.pilihan[selectedOpt],
        jawabanBenar: currentSoal.pilihan[currentSoal.indeksBenar],
        langkah: currentSoal.langkah,
        timestamp: Date.now(),
      });
      if (guidedMode) {
        onGuideSpeak(`${enc} ${currentSoal.kesalahanUmum} ${nextButtonCmd}`, true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Header bar of sub-bab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => {
              speech.stop();
              onBackToMap();
            }}
            aria-label="Kembali ke Peta"
            className="min-h-[48px] min-w-[48px] rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] flex items-center justify-center cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-xs font-bold" style={{ color: bab.warnaHex }}>
              Bab {bab.id}: {bab.nama} · Sub-bab {sub.id} · Soal #{sub.soalKuis.join(', #')}
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              {sub.judul}
            </h1>
            {sub.opsionalDiAtasSMP && (
              <p className="text-xs font-semibold text-[#D97706] mt-0.5">{sub.opsionalDiAtasSMP}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2">
            {[1, 2, 3].map((n) => (
              <Star
                key={n}
                className={`w-5 h-5 ${
                  n <= sp.bintang ? 'fill-[#FFBE2E] text-[#FFBE2E]' : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
            <span className="ml-1.5 text-xs font-mono-num font-bold">{sp.bintang}/3</span>
          </div>
        </div>
      </div>

      {/* Horizontal 6-Stage Stepper */}
      <nav aria-label="Tahap belajar" className="flex items-center gap-2 overflow-x-auto pb-1">
        {TAHAP_LABELS.map((t) => {
          const isDone = sp.tahapSelesai.includes(t.no);
          const isUnlocked = t.no <= maxUnlockedTahap || isDone;
          const isActive = tahapAktif === t.no;

          return (
            <button
              key={t.no}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                speech.stop();
                setTahapAktif(t.no);
                if (guidedMode) {
                  onGuideSpeak(stageNextHint[t.no]?.voice ?? '', true);
                }
              }}
              className={`min-h-[48px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                isActive
                  ? 'bg-[#2F6BFF] text-white'
                  : isDone
                    ? 'bg-[#16A36E]/15 text-[#16A36E] border border-[#16A36E]/30'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
              }`}
            >
              <span className="font-mono-num">
                {isDone ? <Check className="w-4 h-4" /> : `${t.no}.`}
              </span>
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Per-stage clear next-button guidance (with Bima boy voice button) */}
      <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <p className="text-xs sm:text-sm text-[var(--text-primary)]">
          <strong className="text-[#FF7A1A]">Panduan Tahap {tahapAktif}:</strong>{' '}
          {stageNextHint[tahapAktif]?.text}
        </p>
        <button
          type="button"
          onClick={() =>
            speech.isSpeaking
              ? speech.stop()
              : speech.speak(stageNextHint[tahapAktif]?.voice ?? '')
          }
          className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface-soft)] border border-[var(--border-hairline)] text-xs font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#2F6BFF]" />
          {speech.isSpeaking ? 'Hentikan' : 'Dengar Langkah'}
        </button>
      </div>

      {/* TAHAP 1: Dengarkan Pemandu */}
      {tahapAktif === 1 && (
        <section className="space-y-5">
          <VoiceGuideBar
            speech={speech}
            textToRead={fullIntroScript}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            expression="menyemangati"
            onSkip={() => completeAndNext(1)}
            title="Tahap 1 — Dengarkan Pemandu Volta"
          />

          <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">
              Tugas Tonton (3 Hal yang Harus Dicatat)
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Saat menonton video di tahap berikutnya, cari dan catat tiga poin berikut:
            </p>
            <ol className="space-y-2.5">
              {narasi.tugasTonton.map((tugas, idx) => (
                <li
                  key={idx}
                  className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-sm font-semibold text-[var(--text-primary)] flex items-start gap-3"
                >
                  <span className="font-mono-num w-6 h-6 rounded-full bg-[#FF7A1A] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tugas}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => completeAndNext(1)}
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                Lanjut ke Video <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAHAP 2: Tonton Video (Desktop 2-col: video left, notes + checklist right) */}
      {tahapAktif === 2 && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            {subBabId === 'B6' || visibleVideos.length === 0 ? (
              <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-center">
                <Search className="w-10 h-10 mx-auto text-[#FF7A1A] mb-3" />
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Video Sedang Dicari
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
                  Belum ada kandidat video yang terverifikasi cukup meyakinkan untuk sub-bab Hukum Charles ini. Kamu tetap bisa mencari referensi di YouTube atau langsung mempelajari Tahap 3–6 yang sudah lengkap.
                </p>
                <a
                  href={B6_SEARCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Cari di YouTube
                </a>
              </div>
            ) : (
              <>
                {activeVideo && (
                  <YouTubeEmbed
                    video={activeVideo}
                    backupVideo={backupVideo}
                    curatorMeta={curatorMeta[activeVideo.id]}
                    onSelectBackup={(v) => setSelectedVideoId(v.id)}
                    onVideoPlay={() => speech.stop()}
                    onMetaDetected={onUpdateCuratorMeta}
                  />
                )}

                {/* Primary / Backup chips */}
                <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4">
                  <p className="text-xs font-bold text-[var(--text-secondary)] mb-2.5">
                    Pilih Video Utama atau Cadangan ({visibleVideos.length} tersedia):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {visibleVideos.map((v, idx) => {
                      const selected = v.id === activeVideo?.id;
                      const customTitle = curatorMeta[v.id]?.judulTerdeteksi;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVideoId(v.id)}
                          className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold border text-left cursor-pointer transition ${
                            selected
                              ? 'bg-[#2F6BFF] text-white border-[#2F6BFF]'
                              : 'bg-[var(--bg-surface-soft)] text-[var(--text-primary)] border-[var(--border-hairline)]'
                          }`}
                        >
                          <span className="block">
                            {customTitle ? customTitle.slice(0, 32) : `Video ${idx + 1} (${v.id})`}
                          </span>
                          <span className={`text-[11px] font-normal ${selected ? 'text-blue-100' : 'text-[var(--text-secondary)]'}`}>
                            {formatPeranLabel(v)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right column: Tugas Tonton Checkboxes + Catatan Cepat + Sudah Nonton */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5">
              <h2 className="font-display text-base font-bold text-[var(--text-primary)] mb-3">
                Centang Tugas Tonton
              </h2>
              <div className="space-y-2.5">
                {narasi.tugasTonton.map((tugas, idx) => {
                  const checked = sp.tugasTontonCentang[idx];
                  return (
                    <label
                      key={idx}
                      className="min-h-[48px] flex items-start gap-3 rounded-2xl bg-[var(--bg-surface-soft)] p-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next: [boolean, boolean, boolean] = [...sp.tugasTontonCentang] as [boolean, boolean, boolean];
                          next[idx] = !next[idx];
                          onUpdateSubBabProgress(subBabId, { tugasTontonCentang: next });
                          if (guidedMode && next.every(Boolean)) {
                            onGuideSpeak(
                              'Keren, tiga tugas tonton sudah dicentang! Sekarang pencet Sudah nonton lalu Lanjut ke Rumus.',
                              true
                            );
                          }
                        }}
                        className="mt-1 w-5 h-5 accent-[#16A36E] shrink-0"
                      />
                      <span className={`text-sm ${checked ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                        {tugas}
                      </span>
                    </label>
                  );
                })}
              </div>

              <label className="block mt-5">
                <span className="font-display text-base font-bold text-[var(--text-primary)] block mb-2">
                  Catatan Cepatmu
                </span>
                <textarea
                  rows={4}
                  value={sp.catatanCepat}
                  onChange={(e) => onUpdateSubBabProgress(subBabId, { catatanCepat: e.target.value })}
                  placeholder="Tulis rumus penting atau cara cepat dari video di sini (tersimpan otomatis)…"
                  className="w-full rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3 text-sm text-[var(--text-primary)]"
                />
              </label>

              {sp.sudahNonton && (
                <div className="mt-4 rounded-2xl bg-[#16A36E]/12 p-3 flex items-center gap-3">
                  <VoltaMascot expression="bangga" size={44} />
                  <p className="text-xs font-semibold text-[#16A36E]">
                    Volta: &ldquo;Bagus sekali! Catatanmu akan sangat membantu di tahap rumus dan latihan.&rdquo;
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2.5 justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSubBabProgress(subBabId, { sudahNonton: true }, sp.sudahNonton ? 0 : 10);
                    onMarkDaily('video');
                    if (guidedMode) {
                      onGuideSpeak('Sip, video sudah ditandai selesai! Sekarang pencet tombol oranye Lanjut ke Rumus.', true);
                    }
                  }}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl border border-[#16A36E] text-[#16A36E] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {sp.sudahNonton ? 'Sudah Ditonton' : 'Sudah nonton'}
                </button>

                <button
                  type="button"
                  onClick={() => completeAndNext(2)}
                  className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  Lanjut ke Rumus <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAHAP 3: Rumus & Jebakan */}
      {tahapAktif === 3 && (
        <section className="space-y-5">
          <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Ringkasan Rumus &amp; Jebakan
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Pelajari konsep inti, rumus bersatuan, langkah baku, dan dua jebakan yang sering muncul.
                </p>
              </div>
              <button
                type="button"
                onClick={() => (speech.isSpeaking ? speech.stop() : speech.speak(summaryScript))}
                className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                {speech.isSpeaking ? 'Hentikan Suara' : 'Dengarkan ringkasan'}
              </button>
            </div>

            {/* 1. Konsep Inti */}
            <div>
              <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-2">
                1. Konsep Inti
              </h3>
              <ul className="space-y-2">
                {sub.konsepInti.slice(0, 3).map((k, idx) => (
                  <li key={idx} className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-sm text-[var(--text-primary)]">
                    <MathText text={k} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Rumus Berlabel Satuan */}
            <div>
              <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-2">
                2. Rumus &amp; Satuan Wajib
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sub.rumus.map((r, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-4"
                  >
                    <p className="text-xs font-bold text-[var(--text-secondary)]">{r.label}</p>
                    <div className="my-2 text-lg overflow-x-auto">
                      <MathText text={r.latex} block />
                    </div>
                    <p className="text-xs font-mono-num text-[#2F6BFF]">Satuan: {r.satuan}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Langkah Baku */}
            <div>
              <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-2">
                3. Langkah Baku (Ikuti Cara di Video)
              </h3>
              <ol className="space-y-2">
                {sub.langkahBaku.map((l, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                    <span className="font-mono-num w-6 h-6 rounded-xl bg-[#2F6BFF]/15 text-[#2F6BFF] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{l}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* 4. 2 Jebakan Umum */}
            <div>
              <h3 className="font-display text-base font-bold text-[#E5484D] mb-2">
                4. Dua Jebakan Umum Olimpiade
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sub.jebakan.map((j, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#E5484D]/30 bg-[#E5484D]/8 p-4 text-sm text-[var(--text-primary)] flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#E5484D] shrink-0 mt-0.5" />
                    <span>{j}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => completeAndNext(3)}
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                Lanjut ke Contoh Terpandu <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAHAP 4: Kita Kerjakan Bareng (Contoh Terpandu) */}
      {tahapAktif === 4 && (
        <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 space-y-5">
          <div>
            <p className="text-xs font-bold text-[#2F6BFF]">Tahap 4 — Kita Kerjakan Bareng</p>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mt-1">
              {sub.contohTerpandu.judul}
            </h2>
          </div>

          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 text-sm sm:text-base text-[var(--text-primary)]">
            <MathText text={sub.contohTerpandu.soal} />
            {sub.contohTerpandu.diagram && <SVGPhysicsDiagram spec={sub.contohTerpandu.diagram} />}
          </div>

          {/* Step cards */}
          <div className="space-y-4">
            {sub.contohTerpandu.langkah.slice(0, stepIdx + 1).map((step, idx) => {
              const verified = Boolean(stepVerified[idx]);
              const isCurrent = idx === stepIdx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 transition ${
                    verified
                      ? 'border-[#16A36E]/40 bg-[#16A36E]/8'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]'
                  } ${isCurrent && shakeStep ? 'animate-shake' : ''}`}
                >
                  <p className="text-sm font-bold text-[var(--text-primary)]">{step.instruksi}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{step.pertanyaanKecil}</p>

                  {step.tipeInput === 'pilihan' && step.pilihan ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {step.pilihan.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          disabled={verified}
                          onClick={() => setStepInputs((p) => ({ ...p, [idx]: opt }))}
                          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition ${
                            stepInputs[idx] === opt
                              ? 'bg-[#2F6BFF] text-white border-[#2F6BFF]'
                              : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 max-w-xs">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={verified}
                        value={stepInputs[idx] ?? ''}
                        onChange={(e) => setStepInputs((p) => ({ ...p, [idx]: e.target.value }))}
                        placeholder="Ketik angka hasil langkah ini…"
                        className="w-full min-h-[48px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 text-sm font-mono-num text-[var(--text-primary)]"
                      />
                    </div>
                  )}

                  {!verified ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCheckStep}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FF7A1A] text-white font-bold text-sm cursor-pointer"
                      >
                        Cek Langkah Ini
                      </button>
                      {isCurrent && stepErrorMsg && (
                        <span className="text-xs font-semibold text-[#E5484D]">{stepErrorMsg}</span>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-[#16A36E] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {step.penjelasanLangkah}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {voltaMsg && (
            <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3.5 flex items-center gap-3">
              <VoltaMascot expression={voltaExpr} size={48} />
              <p className="text-sm text-[var(--text-primary)]">{voltaMsg}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            {stepIdx < sub.contohTerpandu.langkah.length - 1 ? (
              <button
                type="button"
                disabled={!stepVerified[stepIdx]}
                onClick={() => {
                  const nextIdx = stepIdx + 1;
                  setStepIdx(nextIdx);
                  setStepErrorMsg('');
                  if (guidedMode) {
                    const nextStep = sub.contohTerpandu.langkah[nextIdx];
                    if (nextStep) {
                      onGuideSpeak(
                        `Langkah ${nextIdx + 1}: ${nextStep.instruksi}. ${nextStep.pertanyaanKecil} Isi atau pilih jawabannya, lalu pencet Cek Langkah Ini.`,
                        true
                      );
                    }
                  }
                }}
                className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                Langkah berikutnya <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              stepVerified[stepIdx] && (
                <button
                  type="button"
                  onClick={() => completeAndNext(4)}
                  className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  Lanjut ke Latihan 3 Level <ArrowRight className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </section>
      )}

      {/* TAHAP 5: Latihan Soal Mirip (3 Level Generator Parametrik) */}
      {tahapAktif === 5 && (
        <section className="space-y-5">
          <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Latihan Soal Mirip (Generator Terverifikasi)
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  Raih 3 bintang dengan menjawab benar minimal 2 dari 3 soal Level 3 tanpa memakai petunjuk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSeedBase((s) => s + 313)}
                className="min-h-[44px] px-3.5 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                Acak Angka Baru
              </button>
            </div>

            {/* Level Selector */}
            <div className="flex flex-wrap gap-2">
              {([
                { lvl: 1 as const, label: 'Level 1 · Meniru (Petunjuk penuh)' },
                { lvl: 2 as const, label: 'Level 2 · Variasi (1 petunjuk)' },
                { lvl: 3 as const, label: 'Level 3 · Tantangan (Tanpa petunjuk)' },
              ]).map((item) => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => {
                    setLatihanLevel(item.lvl);
                    if (item.lvl === 3) setLevel3CorrectNoHint(0);
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold cursor-pointer transition ${
                    latihanLevel === item.lvl
                      ? 'bg-[#2F6BFF] text-white'
                      : 'bg-[var(--bg-surface-soft)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Progress soal 1..3 */}
            <div className="flex items-center justify-between text-xs font-mono-num text-[var(--text-secondary)]">
              <span>Soal {soalIdx + 1} dari 3 · {currentSoal.levelLabel}</span>
              {latihanLevel === 3 && <span>Skor Level 3 tanpa petunjuk: {level3CorrectNoHint}/3</span>}
            </div>

            {/* Question stem */}
            <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 sm:p-5 text-sm sm:text-base text-[var(--text-primary)]">
              <MathText text={currentSoal.pertanyaan} />
              {currentSoal.catatanKhusus && (
                <p className="mt-2 text-xs font-bold text-[#D97706]">{currentSoal.catatanKhusus}</p>
              )}
              {currentSoal.diagram && <SVGPhysicsDiagram spec={currentSoal.diagram} />}
            </div>

            {/* Hints (Level 1 & 2) */}
            {currentSoal.petunjuk.length > 0 && (
              <div className="rounded-2xl border border-[#2F6BFF]/30 bg-[#2F6BFF]/8 p-3.5 text-xs sm:text-sm space-y-1">
                <p className="font-bold text-[#2F6BFF] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Petunjuk Langkah:
                </p>
                {currentSoal.petunjuk.map((h, i) => (
                  <p key={i} className="text-[var(--text-primary)]">{h}</p>
                ))}
              </div>
            )}

            {/* 5 Choices A-E */}
            <div className={`space-y-2.5 ${shakeLatihan ? 'animate-shake' : ''}`}>
              {currentSoal.pilihan.map((opt, idx) => {
                const huruf = ['A', 'B', 'C', 'D', 'E'][idx];
                const isSelected = selectedOpt === idx;
                const isRight = idx === currentSoal.indeksBenar;

                let btnClass =
                  'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)]';
                if (checkedLatihan) {
                  if (isRight) btnClass = 'border-[#16A36E] bg-[#16A36E]/15 text-[#16A36E] font-bold';
                  else if (isSelected) btnClass = 'border-[#E5484D] bg-[#E5484D]/15 text-[#E5484D]';
                } else if (isSelected) {
                  btnClass = 'border-[#2F6BFF] bg-[#2F6BFF]/12 text-[#2F6BFF] font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={checkedLatihan}
                    onClick={() => setSelectedOpt(idx)}
                    className={`w-full min-h-[48px] rounded-2xl border p-3.5 text-left text-sm flex items-center gap-3 cursor-pointer transition ${btnClass}`}
                  >
                    <span className="font-mono-num w-7 h-7 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-center text-xs font-bold shrink-0">
                      {huruf}
                    </span>
                    <span className="flex-1">
                      <MathText text={opt} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {!checkedLatihan ? (
                  <button
                    type="button"
                    onClick={handleCheckLatihan}
                    className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm cursor-pointer"
                  >
                    Cek Jawaban
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (soalIdx < 2) {
                        setSoalIdx((s) => s + 1);
                        setSelectedOpt(null);
                        setCheckedLatihan(false);
                        setShowVideoMethod(false);
                        setUsedHintThisRound(false);
                        if (guidedMode) {
                          onGuideSpeak(
                            `Ini soal ke-${soalIdx + 2}. Pilih jawaban A sampai E, lalu pencet Cek Jawaban.`,
                            true
                          );
                        }
                      } else if (latihanLevel < 3) {
                        const nextLvl = (latihanLevel + 1) as LevelLatihan;
                        setLatihanLevel(nextLvl);
                        if (nextLvl === 3) setLevel3CorrectNoHint(0);
                        if (guidedMode) {
                          onGuideSpeak(
                            `Naik ke Level ${nextLvl}! Kerjakan tiga soal lagi, pilih A sampai E lalu pencet Cek Jawaban.`,
                            true
                          );
                        }
                      } else {
                        completeAndNext(5);
                      }
                    }}
                    className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    {soalIdx < 2
                      ? 'Soal Berikutnya'
                      : latihanLevel < 3
                        ? `Naik ke Level ${latihanLevel + 1}`
                        : 'Lanjut ke Soal Olimpiade'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowVideoMethod((v) => !v);
                    if (!checkedLatihan) setUsedHintThisRound(true);
                  }}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#2F6BFF]" />
                  Lihat cara yang sama seperti di video
                </button>
              </div>

              <button
                type="button"
                onClick={() => completeAndNext(5)}
                className="min-h-[48px] px-4 py-2.5 rounded-2xl text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Lanjut ke Tahap 6 →
              </button>
            </div>

            {showVideoMethod && (
              <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-4 space-y-2">
                <p className="font-display text-sm font-bold text-[#2F6BFF]">
                  Langkah Baku dengan Angka Soal Ini:
                </p>
                {currentSoal.langkah.map((st, idx) => (
                  <p key={idx} className="text-sm text-[var(--text-primary)]">
                    <MathText text={st} />
                  </p>
                ))}
              </div>
            )}

            {voltaMsg && checkedLatihan && (
              <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3.5 flex items-center gap-3">
                <VoltaMascot expression={voltaExpr} size={48} />
                <p className="text-sm text-[var(--text-primary)]">{voltaMsg}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAHAP 6: Tantangan Soal Olimpiade Asli */}
      {tahapAktif === 6 && (
        <section className="space-y-4">
          <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Tahap 6 — Tantangan Soal Olimpiade Asli
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Kerjakan soal dari Kuis 50 Soal yang terpetakan ke sub-bab {sub.id} dulu sendiri (Benar +4, Salah −1, Kosong 0), lalu pelajari cara menjawab dan tipsnya.
            </p>
          </div>

          {mappedOlimpiade.map((q) => {
            const savedAns = progress.kuis50Jawaban[q.nomor];
            const showSol = Boolean(savedAns || revealedStage6[q.nomor]);
            return (
              <div
                key={q.nomor}
                className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                    Soal Olimpiade #{q.nomor} — {q.judulSingkat}
                  </h3>
                  {q.perluCekSoalAsli && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFBE2E]/25 text-amber-900 dark:text-amber-200 text-xs font-bold">
                      <HelpCircle className="w-4 h-4" />
                      Cek soal asli
                    </span>
                  )}
                </div>

                {q.teksSoal && (
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-[var(--text-primary)]">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(['A', 'B', 'C', 'D', 'E'] as const).map((huruf) => {
                      const chosen = savedAns?.dipilih === huruf;
                      const isKey = q.kunci === huruf;
                      return (
                        <button
                          key={huruf}
                          type="button"
                          onClick={() => {
                            const isRight = q.kunci === huruf;
                            onAnswerQuiz50(q.nomor, huruf, isRight);
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
                                jawabanUser: `${huruf}. ${q.pilihan?.[huruf] ?? ''}`,
                                jawabanBenar: `${q.kunci}. ${q.pilihan?.[q.kunci as 'A' | 'B' | 'C' | 'D' | 'E'] ?? ''}`,
                                langkah: q.pembahasanLangkah,
                                timestamp: Date.now(),
                              });
                            }
                            if (guidedMode) {
                              onGuideSpeak(
                                `${
                                  isRight
                                    ? `Benar, tambah empat poin! Jawaban ${huruf} tepat.`
                                    : `Belum tepat, kunci yang benar adalah ${q.kunci}.`
                                } Baca cara menjawabnya di bawah, lalu kalau semua soal sub-bab ini sudah beres, pencet tombol hijau Selesaikan Sub-bab ${sub.id}.`,
                                true
                              );
                            }
                          }}
                          className={`min-h-[48px] rounded-2xl border p-3 text-left text-sm flex items-start gap-2.5 cursor-pointer ${
                            showSol
                              ? isKey
                                ? 'border-[#16A36E] bg-[#16A36E]/12 text-[#16A36E] font-bold'
                                : chosen
                                  ? 'border-[#E5484D] bg-[#E5484D]/12 text-[#E5484D]'
                                  : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)]'
                              : chosen
                                ? 'border-[#2F6BFF] bg-[#2F6BFF]/12 text-[#2F6BFF] font-bold'
                                : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)]'
                          }`}
                        >
                          <span className="font-mono-num font-bold">{huruf}.</span>
                          <span>{q.pilihan?.[huruf]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRevealedStage6((p) => ({ ...p, [q.nomor]: !showSol }))}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold text-[#2F6BFF] cursor-pointer"
                  >
                    {showSol ? 'Sembunyikan Pembahasan' : 'Lihat Kunci & Pembahasan'}
                  </button>
                  {savedAns && (
                    <button
                      type="button"
                      onClick={() => onAnswerQuiz50(q.nomor, '', false)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold text-[var(--text-secondary)] cursor-pointer"
                    >
                      Kosongkan (0 poin)
                    </button>
                  )}
                </div>

                {showSol && (
                  <>
                    {q.perluCekSoalAsli && q.catatanCekAsli && (
                      <div className="rounded-2xl border border-amber-400/50 bg-[#FFBE2E]/15 p-3.5 text-xs sm:text-sm text-[var(--text-primary)]">
                        <strong>Kunci kuis: {q.kunci}.</strong> Catatan: ada kemungkinan salah ketik di soal. Tanyakan guru. ({q.catatanCekAsli}) — Soal ini tidak dihitung untuk bintang.
                      </div>
                    )}

                    <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 space-y-2">
                      <p className="text-xs font-bold text-[#16A36E]">
                        Jawaban Benar: {q.kunci}. {q.pilihan?.[q.kunci as 'A' | 'B' | 'C' | 'D' | 'E']}
                      </p>
                      <p className="text-xs font-bold text-[#2F6BFF]">Cara Menjawab (Langkah Demi Langkah):</p>
                      <ol className="list-decimal pl-5 space-y-1 text-sm text-[var(--text-primary)]">
                        {q.pembahasanLangkah.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                      <p className="text-xs font-semibold text-[#16A36E] pt-2 border-t border-[var(--border-hairline)]">
                        Tips soal serupa: {q.tipsSerupa}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                const nextSet = Array.from(new Set([...sp.tahapSelesai, 6]));
                onUpdateSubBabProgress(subBabId, { tahapSelesai: nextSet }, sp.tahapSelesai.includes(6) ? 0 : 20);
                setConfettiKey((k) => k + 1);
                onBackToMap();
              }}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#16A36E] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Selesaikan Sub-bab {sub.id}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
