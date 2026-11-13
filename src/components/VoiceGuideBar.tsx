import React from 'react';
import { Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import type { UserSettings } from '../types/physics';
import { VoltaMascot, type VoltaExpression } from './VoltaMascot';

interface VoiceGuideBarProps {
  speech: UseSpeechGuideReturn;
  textToRead: string;
  settings: UserSettings;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
  expression?: VoltaExpression;
  onSkip?: () => void;
  title?: string;
}

export const VoiceGuideBar: React.FC<VoiceGuideBarProps> = ({
  speech,
  textToRead,
  settings,
  onUpdateSettings,
  expression = 'senang',
  onSkip,
  title = 'Pemandu Suara Volta',
}) => {
  const sentences = speech.sentences.length > 0
    ? speech.sentences
    : textToRead
        .replace(/\s+/g, ' ')
        .trim()
        .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
        ?.map((s) => s.trim()) ?? [textToRead];

  return (
    <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-2">
            <VoltaMascot
              expression={expression}
              speaking={speech.isSpeaking && !speech.isPaused}
              mouthOpen={speech.mouthOpen}
              size={64}
            />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-[var(--text-primary)]">{title}</p>
            <p className="text-xs text-[var(--text-secondary)]">
              {!speech.isSupported
                ? 'Browser tidak mendukung suara — mode subtitle aktif'
                : !speech.hasIndonesianVoice
                  ? 'Suara bahasa Indonesia belum tersedia di perangkat — subtitle aktif'
                  : settings.bisukanSuara
                    ? 'Suara dibisukan · subtitle berjalan'
                    : speech.isSpeaking
                      ? speech.isPaused
                        ? `Dijeda · ${speech.activeVoiceLabel}`
                        : `Sedang berbicara · ${speech.activeVoiceLabel}`
                      : `Siap memandu · ${speech.activeVoiceLabel}`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {!speech.isSpeaking ? (
            <button
              type="button"
              onClick={() => speech.speak(textToRead)}
              className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2 hover:opacity-95 active:scale-[0.98] transition cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              Putar Suara
            </button>
          ) : speech.isPaused ? (
            <button
              type="button"
              onClick={speech.resume}
              className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              Lanjut
            </button>
          ) : (
            <button
              type="button"
              onClick={speech.pause}
              className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Pause className="w-4 h-4" />
              Jeda
            </button>
          )}

          <button
            type="button"
            onClick={() => speech.replay(textToRead)}
            aria-label="Ulangi suara"
            className="min-h-[48px] min-w-[48px] px-3 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] inline-flex items-center justify-center gap-1.5 text-sm font-semibold hover:opacity-90 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Ulang</span>
          </button>

          {onSkip && (
            <button
              type="button"
              onClick={() => {
                speech.stop();
                onSkip();
              }}
              aria-label="Lewati pemandu"
              className="min-h-[48px] px-3 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-90 cursor-pointer whitespace-nowrap"
            >
              <SkipForward className="w-4 h-4" />
              Lewati
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const nextMuted = !settings.bisukanSuara;
              if (nextMuted) speech.stop();
              onUpdateSettings({ bisukanSuara: nextMuted });
            }}
            aria-label={settings.bisukanSuara ? 'Nyalakan suara' : 'Bisukan suara'}
            className="min-h-[48px] min-w-[48px] px-3 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer"
          >
            {settings.bisukanSuara ? <VolumeX className="w-4 h-4 text-[#E5484D]" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-surface-soft)] border border-[var(--border-hairline)]">
            {([
              { spd: 0.85 as const, label: '0.85x' },
              { spd: 1.0 as const, label: 'Normal' },
              { spd: 1.15 as const, label: '1.15x' },
            ]).map((item) => (
              <button
                key={item.spd}
                type="button"
                onClick={() => onUpdateSettings({ kecepatanSuara: item.spd })}
                className={`min-h-[40px] px-2.5 rounded-xl text-xs font-mono-num font-bold cursor-pointer transition whitespace-nowrap ${
                  settings.kecepatanSuara === item.spd
                    ? 'bg-[#2F6BFF] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized Sentence Subtitles */}
      <div className="mt-4 rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-base leading-relaxed">
        {sentences.map((sent, idx) => {
          const active = idx === speech.activeSentenceIndex;
          return (
            <span
              key={idx}
              className={`inline transition-colors duration-150 ${
                active
                  ? 'bg-[#FF7A1A]/20 text-[var(--text-primary)] font-bold rounded px-1'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {sent}{' '}
            </span>
          );
        })}
      </div>
    </div>
  );
};
