import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Compass,
  ExternalLink,
  Flame,
  Play,
  Sparkles,
  Timer,
  Trophy,
  Volume2,
} from 'lucide-react';
import { BABS } from '../data/babs';
import { PANDUAN_ALUR_AWAL, PANDUAN_LENGKAP_SUARA } from '../data/panduanAwal';
import { SUBBAB_LIST, SUBBAB_MAP } from '../data/subbab';
import { BONUS_OSN_VIDEOS } from '../data/videos';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import type { BabId, SubBabId, UserProgress, UserSettings } from '../types/physics';
import { getSubBabProgress } from '../utils/storage';
import { ChapterIcon } from '../components/ChapterIcon';
import { VoiceGuideBar } from '../components/VoiceGuideBar';
import { VoltaMascot } from '../components/VoltaMascot';

interface HomePageProps {
  progress: UserProgress;
  settings: UserSettings;
  speech: UseSpeechGuideReturn;
  readyPromptStatus: 'asking' | 'ready' | 'skipped';
  guidedMode: boolean;
  onAnswerReady: () => void;
  onSkipReady: () => void;
  onEnableGuideAgain: () => void;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
  onOpenSubBab: (id: SubBabId) => void;
  onOpenMapForBab: (babId: BabId) => void;
  onOpenQuiz50: () => void;
  onStartFiveMinChallenge: () => void;
  onOpenWrongReview: () => void;
}

const READY_QUESTION_VOICE =
  'Halo calon juara fisika! Aku Bima, pemandumu di sini. Apakah kamu sudah siap menjadi juara? Kalau sudah siap, pencet tombol oranye Sudah Siap! Aku akan langsung memandumu memilih sub-bab dan menemani langkah demi langkah sampai selesai.';

export const HomePage: React.FC<HomePageProps> = ({
  progress,
  settings,
  speech,
  readyPromptStatus,
  guidedMode,
  onAnswerReady,
  onSkipReady,
  onEnableGuideAgain,
  onUpdateSettings,
  onOpenSubBab,
  onOpenMapForBab,
  onOpenQuiz50,
  onStartFiveMinChallenge,
  onOpenWrongReview,
}) => {
  const [selectedGuideStep, setSelectedGuideStep] = useState<number | null>(null);

  const recommendedSubBab = useMemo(() => {
    if (progress.lastVisitedSubBab && SUBBAB_MAP[progress.lastVisitedSubBab]) {
      return SUBBAB_MAP[progress.lastVisitedSubBab];
    }
    const nextUnfinished = SUBBAB_LIST.find((s) => {
      const sp = getSubBabProgress(progress, s.id);
      return sp.tahapSelesai.length < 6;
    });
    return nextUnfinished ?? SUBBAB_LIST[0];
  }, [progress]);

  const wrongSuggestedSubBab = useMemo(() => {
    if (progress.soalSalah.length > 0) {
      return SUBBAB_MAP[progress.soalSalah[0].subBabId];
    }
    return null;
  }, [progress.soalSalah]);

  const totalStars = useMemo(
    () => Object.values(progress.subBab).reduce((acc, s) => acc + (s?.bintang ?? 0), 0),
    [progress.subBab]
  );

  const quizStats = useMemo(() => {
    const entries = Object.values(progress.kuis50Jawaban);
    let benar = 0;
    let salah = 0;
    for (const e of entries) {
      if (!e) continue;
      if (e.benar) benar++;
      else salah++;
    }
    return {
      terjawab: entries.length,
      skor: benar * 4 - salah,
    };
  }, [progress.kuis50Jawaban]);

  const activeGuideScript =
    selectedGuideStep !== null
      ? PANDUAN_ALUR_AWAL[selectedGuideStep - 1]?.suara ?? PANDUAN_LENGKAP_SUARA
      : PANDUAN_LENGKAP_SUARA;

  return (
    <div className="space-y-8">
      {/* Check-in Awal: "Apakah kamu sudah siap menjadi juara?" */}
      {readyPromptStatus === 'asking' && (
        <section
          aria-label="Sambutan Pemandu Bima"
          className="rounded-[28px] border-2 border-[#FF7A1A]/50 bg-[var(--bg-surface)] p-5 sm:p-7"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="rounded-3xl bg-[var(--bg-surface-soft)] p-3 shrink-0">
              <VoltaMascot
                expression="menyemangati"
                speaking={speech.isSpeaking && !speech.isPaused}
                mouthOpen={speech.mouthOpen}
                size={88}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#2F6BFF]">
                Pemandu Suara · {speech.activeVoiceLabel}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-1">
                Apakah kamu sudah siap menjadi juara?
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-2xl">
                Jawab <strong>Sudah Siap!</strong> maka Bima (suara normal anak laki-laki) akan langsung memandumu memilih sub-bab pertama dan memberi arahan otomatis setiap kali kamu menyelesaikan satu langkah.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onAnswerReady}
                  className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm sm:text-base inline-flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Sudah Siap! Mulai Dipandu Bima
                </button>

                <button
                  type="button"
                  onClick={() =>
                    speech.isSpeaking ? speech.stop() : speech.speak(READY_QUESTION_VOICE)
                  }
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  {speech.isSpeaking ? 'Hentikan Suara' : 'Dengar Pertanyaan Bima'}
                </button>

                <button
                  type="button"
                  onClick={onSkipReady}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Jelajah Sendiri
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Banner — Volta + Continue Learning + Streak */}
      <section className="rounded-[28px] border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="rounded-3xl bg-[var(--bg-surface-soft)] p-3 shrink-0">
              <VoltaMascot
                expression="bangga"
                speaking={speech.isSpeaking && !speech.isPaused}
                mouthOpen={speech.mouthOpen}
                size={84}
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1 text-[#FF7A1A]">
                  <Flame className="w-4 h-4" />
                  Streak {progress.streakHarian} hari
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{progress.xp} XP</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{totalStars} / 99 Bintang</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">
                  Kuis 50: {quizStats.terjawab}/50 ({quizStats.skor} poin)
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1.5">
                {wrongSuggestedSubBab
                  ? `Perkuat "${wrongSuggestedSubBab.judul}" atau lanjutkan "${recommendedSubBab.judul}"`
                  : `Lanjutkan ekspedisi: ${recommendedSubBab.id} — ${recommendedSubBab.judul}`}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl">
                Pilih sub-bab untuk belajar 6 tahap terpandu, atau langsung uji kemampuanmu di Kuis 50 Soal Olimpiade.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenSubBab(recommendedSubBab.id)}
                  className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
                >
                  Lanjutkan: {recommendedSubBab.id}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenQuiz50}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm inline-flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  Kuis 50 Soal
                </button>

                <button
                  type="button"
                  onClick={onStartFiveMinChallenge}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <Timer className="w-4 h-4 text-[#2F6BFF]" />
                  Tantangan 5 Menit
                </button>

                {!guidedMode && readyPromptStatus !== 'asking' && (
                  <button
                    type="button"
                    onClick={onEnableGuideAgain}
                    className="min-h-[48px] px-4 py-2.5 rounded-2xl border border-[#2F6BFF]/40 bg-[#2F6BFF]/8 text-[#2F6BFF] font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    Aktifkan Pemandu Bima
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Rencana Belajar Harian (3 langkah) */}
          <div className="lg:col-span-4 rounded-2xl bg-[var(--bg-surface-soft)] p-4">
            <p className="font-display text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7A1A]" />
              Rencana Belajar Harian
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                {progress.dailyPlanDone.video ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A36E] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                )}
                <button
                  type="button"
                  onClick={() => onOpenSubBab(recommendedSubBab.id)}
                  className="text-left hover:underline cursor-pointer text-[var(--text-primary)]"
                >
                  1. Tonton 1 video ({recommendedSubBab.id})
                </button>
              </li>
              <li className="flex items-start gap-2.5">
                {progress.dailyPlanDone.latihan3 ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A36E] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                )}
                <button
                  type="button"
                  onClick={onStartFiveMinChallenge}
                  className="text-left hover:underline cursor-pointer text-[var(--text-primary)]"
                >
                  2. Kerjakan 3 soal latihan
                </button>
              </li>
              <li className="flex items-start gap-2.5">
                {progress.dailyPlanDone.ulangSalah ? (
                  <CheckCircle2 className="w-5 h-5 text-[#16A36E] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                )}
                <button
                  type="button"
                  onClick={onOpenWrongReview}
                  className="text-left hover:underline cursor-pointer text-[var(--text-primary)]"
                >
                  3. Ulang 1 soal salah ({progress.soalSalah.length} tersimpan)
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ringkasan Alur Belajar & Pemutar Suara Lengkap */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Peta Alur Belajar (Langkah 1 sampai 6)
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Kamu juga bisa mendengarkan rincian setiap langkah kapan saja di bawah ini.
            </p>
          </div>
          {selectedGuideStep !== null && (
            <button
              type="button"
              onClick={() => {
                setSelectedGuideStep(null);
                speech.speak(PANDUAN_LENGKAP_SUARA);
              }}
              className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#2F6BFF] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4" />
              Putar Semua Langkah (1–6)
            </button>
          )}
        </div>

        <VoiceGuideBar
          speech={speech}
          textToRead={activeGuideScript}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          expression="menyemangati"
          title={
            selectedGuideStep !== null
              ? `Panduan Langkah ${selectedGuideStep} — ${PANDUAN_ALUR_AWAL[selectedGuideStep - 1]?.judul}`
              : 'Pemandu Bima — Urutan Tombol & Alur Belajar Lengkap'
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PANDUAN_ALUR_AWAL.map((step) => {
            const isSelected = selectedGuideStep === step.nomor;
            return (
              <div
                key={step.nomor}
                className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition ${
                  isSelected
                    ? 'border-[#FF7A1A] bg-[#FF7A1A]/8'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-surface)]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-xs font-bold text-[#2F6BFF]">
                      Langkah {step.nomor} / 6
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGuideStep(step.nomor);
                        speech.speak(step.suara);
                      }}
                      className="min-h-[36px] px-3 rounded-xl bg-[var(--bg-surface-soft)] border border-[var(--border-hairline)] text-xs font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer hover:border-[#FF7A1A]"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#FF7A1A]" />
                      Dengar
                    </button>
                  </div>
                  <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                    {step.judul}
                  </h3>
                  <p className="text-xs font-bold text-[#FF7A1A]">{step.tombolTujuan}</p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{step.instruksi}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Peta 9 Pulau Fisika (Bab) */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              9 Pulau Olimpiade Fisika
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Pilih pulau untuk memulai ekspedisi 33 sub-bab terstruktur.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenMapForBab('A')}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-sm font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Compass className="w-4 h-4 text-[#2F6BFF]" />
            Semua Jalur
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BABS.map((bab, idx) => {
            const doneCount = bab.subBabIds.filter(
              (sid) => getSubBabProgress(progress, sid).tahapSelesai.length >= 5
            ).length;
            const stars = bab.subBabIds.reduce(
              (acc, sid) => acc + getSubBabProgress(progress, sid).bintang,
              0
            );
            const maxStars = bab.subBabIds.length * 3;
            const radiusClass =
              idx % 3 === 0
                ? 'rounded-[26px] rounded-tr-[12px]'
                : idx % 3 === 1
                  ? 'rounded-[24px] rounded-bl-[12px]'
                  : 'rounded-[28px] rounded-tl-[12px]';

            return (
              <button
                key={bab.id}
                type="button"
                onClick={() => onOpenMapForBab(bab.id)}
                className={`text-left border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 transition hover:-translate-y-0.5 cursor-pointer ${radiusClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: bab.warnaSoft }}
                  >
                    <ChapterIcon babId={bab.id} color={bab.warnaHex} size={30} />
                  </div>
                  <div className="text-xs font-mono-num text-[var(--text-secondary)]">
                    {doneCount}/{bab.subBabIds.length} sub-bab · ★ {stars}/{maxStars}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mt-3">
                  {bab.id}. {bab.nama}
                </h3>
                <p className="text-xs font-semibold mt-0.5" style={{ color: bab.warnaHex }}>
                  {bab.pulau}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                  {bab.deskripsi}
                </p>

                <div className="mt-4 h-2 w-full rounded-full bg-[var(--bg-surface-soft)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((doneCount / bab.subBabIds.length) * 100)}%`,
                      backgroundColor: bab.warnaHex,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Rak Bonus: Bedah Soal OSN */}
      <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-2">
          <Trophy className="w-5 h-5 text-[#FF7A1A]" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            Rak Bonus: Bedah Soal OSN
          </h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Video dan daftar putar latihan OSN IPA SMP untuk pengayaan setelah menuntaskan sub-bab.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BONUS_OSN_VIDEOS.map((v) => {
            const href =
              v.tipe === 'playlist'
                ? `https://www.youtube.com/playlist?list=${v.id}`
                : `https://www.youtube.com/watch?v=${v.id}`;
            return (
              <a
                key={v.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-4 flex flex-col justify-between gap-3 hover:border-[#2F6BFF] transition"
              >
                <div>
                  <p className="text-xs font-bold text-[#2F6BFF]">
                    {v.tipe === 'playlist' ? 'Daftar Putar YouTube' : 'Video Pembahasan'}
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
                    {v.deskripsi}
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--text-secondary)] inline-flex items-center gap-1">
                  Buka di YouTube <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
};
