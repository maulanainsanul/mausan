import React from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import { VoltaMascot } from './VoltaMascot';

interface ReadyCheckScreenProps {
  status: 'asking' | 'not_ready';
  speech: UseSpeechGuideReturn;
  onSelectReady: () => void;
  onSelectNotReady: () => void;
}

export const ReadyCheckScreen: React.FC<ReadyCheckScreenProps> = ({
  status,
  speech,
  onSelectReady,
  onSelectNotReady,
}) => {
  const isNotReady = status === 'not_ready';

  return (
    <section
      aria-label="Pertanyaan kesiapan belajar"
      className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-6"
    >
      <div className="w-full max-w-3xl rounded-[32px] border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="rounded-3xl bg-[var(--bg-surface-soft)] p-4 shrink-0">
            <VoltaMascot
              expression={isNotReady ? 'berpikir' : 'menyemangati'}
              speaking={speech.isSpeaking && !speech.isPaused}
              mouthOpen={speech.mouthOpen}
              size={96}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-[#2F6BFF]">
              Jagoan Fisika · Persiapan Olimpiade SMP
            </p>

            <h1 className="font-display text-2xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2 text-balance leading-tight">
              {isNotReady
                ? 'Tenang, siapkan dirimu dulu ya!'
                : 'Apakah kamu sudah siap menjadi juara?'}
            </h1>

            {!isNotReady ? (
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-3 leading-relaxed">
                Pilih jawabanmu terlebih dahulu untuk melanjutkan. Jika kamu memilih{' '}
                <strong className="text-[var(--text-primary)]">Sudah Siap</strong>, kamu langsung masuk ke peta belajar dan pemandu suara Bima akan mulai berbicara memandumu langkah demi langkah.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Tidak masalah kalau belum siap sekarang. Sebelum mulai, pastikan kamu sudah menyiapkan:
                </p>
                <ol className="space-y-2 text-sm text-[var(--text-primary)]">
                  <li className="rounded-2xl bg-[var(--bg-surface-soft)] px-4 py-2.5">
                    1. Buku catatan dan pulpen untuk mencatat rumus &amp; langkah penting.
                  </li>
                  <li className="rounded-2xl bg-[var(--bg-surface-soft)] px-4 py-2.5">
                    2. Fokus tenang untuk menyimak video, latihan 3 level, dan kuis 50 soal.
                  </li>
                  <li className="rounded-2xl bg-[var(--bg-surface-soft)] px-4 py-2.5">
                    3. Kalau hatimu sudah mantap, tekan tombol <strong>Sudah Siap</strong> di bawah agar pemandu Bima mulai berbicara!
                  </li>
                </ol>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onSelectReady}
                className="min-h-[50px] px-6 py-3 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm sm:text-base inline-flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isNotReady ? 'Sekarang Sudah Siap! Mulai' : 'Sudah Siap'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isNotReady && (
                <button
                  type="button"
                  onClick={onSelectNotReady}
                  className="min-h-[50px] px-6 py-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] font-bold text-sm sm:text-base inline-flex items-center gap-2 hover:border-[#2F6BFF] transition cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                  Belum
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
