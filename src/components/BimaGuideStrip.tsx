import React from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import type { UserSettings } from '../types/physics';
import { VoltaMascot } from './VoltaMascot';

interface BimaGuideStripProps {
  speech: UseSpeechGuideReturn;
  settings: UserSettings;
  guidedMessage: string;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
  onDisableGuidedMode: () => void;
}

export const BimaGuideStrip: React.FC<BimaGuideStripProps> = ({
  speech,
  settings,
  guidedMessage,
  onUpdateSettings,
  onDisableGuidedMode,
}) => {
  return (
    <div
      role="region"
      aria-label="Pemandu Aktif Bima"
      className="mb-5 rounded-3xl border border-[#2F6BFF]/35 bg-[var(--bg-surface)] px-4 py-3.5 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-1.5 shrink-0">
            <VoltaMascot
              expression="menyemangati"
              speaking={speech.isSpeaking && !speech.isPaused}
              mouthOpen={speech.mouthOpen}
              size={48}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#2F6BFF]">
              Pemandu Aktif · {speech.activeVoiceLabel}
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5 leading-snug">
              {guidedMessage}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!speech.isSpeaking ? (
            <button
              type="button"
              onClick={() => speech.speak(guidedMessage)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#FF7A1A] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              Putar Arahan
            </button>
          ) : speech.isPaused ? (
            <button
              type="button"
              onClick={speech.resume}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#2F6BFF] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              Lanjut
            </button>
          ) : (
            <button
              type="button"
              onClick={speech.pause}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#2F6BFF] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Pause className="w-3.5 h-3.5" />
              Jeda
            </button>
          )}

          <button
            type="button"
            onClick={() => speech.replay(guidedMessage)}
            aria-label="Ulangi arahan"
            className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              const nextMuted = !settings.bisukanSuara;
              if (nextMuted) speech.stop();
              onUpdateSettings({ bisukanSuara: nextMuted });
            }}
            aria-label={settings.bisukanSuara ? 'Nyalakan suara pemandu' : 'Bisukan suara pemandu'}
            className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer"
          >
            {settings.bisukanSuara ? <VolumeX className="w-3.5 h-3.5 text-[#E5484D]" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              speech.stop();
              onDisableGuidedMode();
            }}
            aria-label="Tutup mode pemandu otomatis"
            title="Matikan mode pemandu otomatis"
            className="min-h-[40px] px-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Matikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
