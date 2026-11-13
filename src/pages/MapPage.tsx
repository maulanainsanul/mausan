import React, { useState } from 'react';
import { Check, Lock, Play, Star, Volume2 } from 'lucide-react';
import { BABS } from '../data/babs';
import { SUBBAB_MAP } from '../data/subbab';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import type { BabId, SubBabId, UserProgress } from '../types/physics';
import { getSubBabProgress } from '../utils/storage';
import { ChapterIcon } from '../components/ChapterIcon';

interface MapPageProps {
  progress: UserProgress;
  speech: UseSpeechGuideReturn;
  guidedMode: boolean;
  selectedBab: BabId | 'ALL';
  onSelectBab: (bab: BabId | 'ALL') => void;
  onOpenSubBab: (id: SubBabId) => void;
}

const MAP_VOICE_GUIDE =
  'Di halaman Peta Belajar ini, pilih salah satu bab fisika dari deretan tombol di atas. Setelah itu, pencet salah satu kartu sub-bab seperti A1 untuk memulai enam tahap belajar dari pemandu, video, rumus, contoh, latihan, sampai soal olimpiade. Kalau mau melompat bebas ke sub-bab mana saja, pencet tombol Buka Semua Pos.';

export const MapPage: React.FC<MapPageProps> = ({
  progress,
  speech,
  guidedMode,
  selectedBab,
  onSelectBab,
  onOpenSubBab,
}) => {
  const [freeExplore, setFreeExplore] = useState(false);

  const visibleBabs = selectedBab === 'ALL' ? BABS : BABS.filter((b) => b.id === selectedBab);

  const recommendedSid: SubBabId = (() => {
    const last = progress.lastVisitedSubBab;
    if (last && getSubBabProgress(progress, last).tahapSelesai.length < 6) {
      return last;
    }
    for (const bab of BABS) {
      for (const sid of bab.subBabIds) {
        if (getSubBabProgress(progress, sid).tahapSelesai.length < 6) {
          return sid;
        }
      }
    }
    return 'A1';
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Peta Belajar 33 Sub-bab
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Taklukkan tiap pos berurutan atau aktifkan mode jelajah bebas untuk melompat ke topik mana saja.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => (speech.isSpeaking ? speech.stop() : speech.speak(MAP_VOICE_GUIDE))}
            className="min-h-[44px] px-4 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-sm font-bold text-[var(--text-primary)] inline-flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#FF7A1A]" />
            {speech.isSpeaking ? 'Hentikan Panduan' : 'Dengar Cara Pilih Pos'}
          </button>
          <button
            type="button"
            onClick={() => setFreeExplore((v) => !v)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-sm font-bold border transition cursor-pointer ${
              freeExplore
                ? 'bg-[#2F6BFF] text-white border-[#2F6BFF]'
                : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)]'
            }`}
          >
            {freeExplore ? 'Mode Jelajah Bebas: Aktif' : 'Buka Semua Pos (Jelajah Bebas)'}
          </button>
        </div>
      </div>

      {/* Filter Bab */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => onSelectBab('ALL')}
          className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition ${
            selectedBab === 'ALL'
              ? 'bg-[#FF7A1A] text-white'
              : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
          }`}
        >
          Semua (9 Bab)
        </button>
        {BABS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelectBab(b.id)}
            className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition ${
              selectedBab === b.id
                ? 'text-white'
                : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
            }`}
            style={selectedBab === b.id ? { backgroundColor: b.warnaHex } : undefined}
          >
            {b.id}. {b.nama}
          </button>
        ))}
      </div>

      {/* Adventure Path Cards */}
      <div className="space-y-6">
        {visibleBabs.map((bab) => (
          <section
            key={bab.id}
            className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: bab.warnaSoft }}
              >
                <ChapterIcon babId={bab.id} color={bab.warnaHex} size={28} />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                  Bab {bab.id}: {bab.nama} · <span style={{ color: bab.warnaHex }}>{bab.pulau}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{bab.deskripsi}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {bab.subBabIds.map((sid, idx) => {
                const sub = SUBBAB_MAP[sid];
                const sp = getSubBabProgress(progress, sid);
                const prevSid = idx > 0 ? bab.subBabIds[idx - 1] : null;
                const prevDone = prevSid ? getSubBabProgress(progress, prevSid).tahapSelesai.length >= 3 : true;
                const isDone = sp.tahapSelesai.length >= 5;
                const isUnlocked = freeExplore || idx === 0 || prevDone || sp.tahapSelesai.length > 0;
                const isRecommended = guidedMode && sid === recommendedSid;

                return (
                  <button
                    key={sid}
                    type="button"
                    onClick={() => onOpenSubBab(sid)}
                    className={`text-left rounded-2xl border p-4 transition flex flex-col justify-between gap-3 cursor-pointer ${
                      isRecommended
                        ? 'border-[#FF7A1A] ring-2 ring-[#FF7A1A]/50 bg-[#FF7A1A]/8'
                        : isUnlocked
                          ? 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] hover:border-[#2F6BFF]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-num text-xs font-bold" style={{ color: bab.warnaHex }}>
                          {sid} · Soal #{sub.soalKuis.join(', #')}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold ${
                            isRecommended
                              ? 'text-[#FF7A1A]'
                              : isDone
                                ? 'text-[#16A36E]'
                                : isUnlocked
                                  ? 'text-[#2F6BFF]'
                                  : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {isRecommended ? (
                            <>
                              <Play className="w-3.5 h-3.5" /> Pencet untuk mulai
                            </>
                          ) : isDone ? (
                            <>
                              <Check className="w-4 h-4" /> Selesai
                            </>
                          ) : isUnlocked ? (
                            <>
                              <Play className="w-3.5 h-3.5" /> Siap
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" /> Terbuka bebas
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-bold text-[var(--text-primary)] mt-1.5">
                        {sub.judul}
                      </h3>
                      {sub.opsionalDiAtasSMP && (
                        <p className="text-xs font-semibold text-[#D97706] mt-1">
                          {sub.opsionalDiAtasSMP}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-hairline)]">
                      <div className="flex items-center gap-1" aria-label={`${sp.bintang} dari 3 bintang`}>
                        {[1, 2, 3].map((n) => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${
                              n <= sp.bintang
                                ? 'fill-[#FFBE2E] text-[#FFBE2E]'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono-num text-[var(--text-secondary)]">
                        {sp.tahapSelesai.length}/6 tahap
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
