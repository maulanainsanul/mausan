import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserSettings } from '../types/physics';

export interface UseSpeechGuideReturn {
  voices: SpeechSynthesisVoice[];
  hasIndonesianVoice: boolean;
  activeVoiceLabel: string;
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  activeSentenceIndex: number;
  sentences: string[];
  mouthOpen: boolean;
  speak: (fullText: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  replay: (fullText: string) => void;
}

const MALE_VOICE_RE = /ardi|andika|bima|rizky|bagus|dimas|male|pria|laki|boy|david|daniel/i;
const FEMALE_VOICE_RE = /damayanti|gadis|siti|female|wanita|perempuan|girl|zira|samantha/i;

export function pickPreferredBoyVoice(allVoices: SpeechSynthesisVoice[]): {
  voice: SpeechSynthesisVoice | null;
  isMaleVoice: boolean;
} {
  const idVoices = allVoices.filter((v) => v.lang.toLowerCase().startsWith('id'));
  if (idVoices.length > 0) {
    const maleId = idVoices.find((v) => MALE_VOICE_RE.test(v.name));
    if (maleId) return { voice: maleId, isMaleVoice: true };
    const neutralId = idVoices.find((v) => !FEMALE_VOICE_RE.test(v.name));
    if (neutralId) return { voice: neutralId, isMaleVoice: false };
    return { voice: idVoices[0], isMaleVoice: false };
  }
  const maleAny = allVoices.find((v) => MALE_VOICE_RE.test(v.name));
  return { voice: maleAny ?? null, isMaleVoice: Boolean(maleAny) };
}

function formatTextForSpeech(sentence: string): string {
  return sentence
    .replace(/→/g, ', lalu ')
    .replace(/×/g, ' kali ')
    .replace(/÷/g, ' bagi ')
    .replace(/−/g, ' kurang ')
    .replace(/Δ/g, 'delta ')
    .replace(/°C/g, ' derajat Celsius')
    .replace(/°F/g, ' derajat Fahrenheit')
    .replace(/°R/g, ' derajat Reamur')
    .replace(/°X/g, ' derajat X')
    .replace(/Ω/g, ' ohm')
    .replace(/µ/g, ' mikro ')
    .replace(/·/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitIntoSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  const parts = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return parts ? parts.map((p) => p.trim()).filter(Boolean) : [cleaned];
}

export function useSpeechGuide(settings: UserSettings): UseSpeechGuideReturn {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);
  const [sentences, setSentences] = useState<string[]>([]);
  const [mouthOpen, setMouthOpen] = useState(false);

  const queueRef = useRef<string[]>([]);
  const idxRef = useRef(0);
  const cancelledRef = useRef(false);
  const mouthTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isSupported) return;
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      setVoices(all);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  const idVoices = useMemo(
    () => voices.filter((v) => v.lang.toLowerCase().startsWith('id')),
    [voices]
  );

  const voiceSelection = useMemo(() => {
    if (settings.voiceURI) {
      const exact = voices.find((v) => v.voiceURI === settings.voiceURI);
      if (exact) {
        return {
          voice: exact,
          isMaleVoice: MALE_VOICE_RE.test(exact.name),
          isFemaleVoice: FEMALE_VOICE_RE.test(exact.name),
        };
      }
    }
    const picked = pickPreferredBoyVoice(voices);
    return {
      voice: picked.voice,
      isMaleVoice: picked.isMaleVoice,
      isFemaleVoice: picked.voice ? FEMALE_VOICE_RE.test(picked.voice.name) : false,
    };
  }, [voices, settings.voiceURI]);

  const activeVoiceLabel = useMemo(() => {
    if (!isSupported || idVoices.length === 0) {
      return 'Bima (Anak Laki-laki · Mode Teks Aktif)';
    }
    if (voiceSelection.voice) {
      return `Bima (Anak Laki-laki · ${voiceSelection.voice.name.split(' - ')[0]})`;
    }
    return 'Bima (Anak Laki-laki · Normal)';
  }, [idVoices.length, isSupported, voiceSelection.voice]);

  const clearMouthTimer = useCallback(() => {
    if (mouthTimerRef.current !== null) {
      window.clearInterval(mouthTimerRef.current);
      mouthTimerRef.current = null;
    }
    setMouthOpen(false);
  }, []);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    clearMouthTimer();
    if (isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveSentenceIndex(-1);
  }, [clearMouthTimer, isSupported]);

  const speakSentenceAt = useCallback(
    (index: number) => {
      if (cancelledRef.current || index >= queueRef.current.length) {
        clearMouthTimer();
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveSentenceIndex(-1);
        return;
      }

      idxRef.current = index;
      setActiveSentenceIndex(index);
      const sentence = queueRef.current[index];

      // Subtitle-only fallback if muted or speechSynthesis unavailable
      if (settings.bisukanSuara || !isSupported) {
        const approxMs = Math.max(1800, Math.round((sentence.length * 55) / settings.kecepatanSuara));
        mouthTimerRef.current = window.setInterval(() => {
          setMouthOpen((prev) => !prev);
        }, 180);
        window.setTimeout(() => {
          if (!cancelledRef.current && idxRef.current === index) {
            clearMouthTimer();
            speakSentenceAt(index + 1);
          }
        }, approxMs);
        return;
      }

      const utter = new SpeechSynthesisUtterance(formatTextForSpeech(sentence));
      utter.lang = 'id-ID';
      utter.rate = settings.kecepatanSuara;
      // Calibrate natural teenage boy tone (normal pitch)
      utter.pitch = voiceSelection.isMaleVoice ? 1.06 : voiceSelection.isFemaleVoice ? 0.88 : 0.96;
      if (voiceSelection.voice) utter.voice = voiceSelection.voice;

      utter.onboundary = () => {
        setMouthOpen((prev) => !prev);
      };
      utter.onstart = () => {
        clearMouthTimer();
        mouthTimerRef.current = window.setInterval(() => {
          setMouthOpen((prev) => !prev);
        }, 190);
      };
      utter.onend = () => {
        clearMouthTimer();
        if (!cancelledRef.current) {
          speakSentenceAt(index + 1);
        }
      };
      utter.onerror = () => {
        clearMouthTimer();
        if (!cancelledRef.current) {
          speakSentenceAt(index + 1);
        }
      };

      try {
        window.speechSynthesis.speak(utter);
      } catch {
        clearMouthTimer();
        setIsSpeaking(false);
      }
    },
    [clearMouthTimer, isSupported, settings.bisukanSuara, settings.kecepatanSuara, voiceSelection]
  );

  const speak = useCallback(
    (fullText: string) => {
      stop();
      const parts = splitIntoSentences(fullText);
      if (parts.length === 0) return;
      cancelledRef.current = false;
      queueRef.current = parts;
      setSentences(parts);
      setIsSpeaking(true);
      setIsPaused(false);
      window.setTimeout(() => {
        if (!cancelledRef.current) {
          speakSentenceAt(0);
        }
      }, 30);
    },
    [speakSentenceAt, stop]
  );

  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    try {
      window.speechSynthesis.pause();
    } catch {
      // Ignore
    }
    clearMouthTimer();
    setIsPaused(true);
  }, [clearMouthTimer, isSpeaking, isSupported]);

  const resume = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    try {
      window.speechSynthesis.resume();
    } catch {
      // Ignore
    }
    setIsPaused(false);
    mouthTimerRef.current = window.setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 190);
  }, [isSpeaking, isSupported]);

  const replay = useCallback(
    (fullText: string) => {
      speak(fullText);
    },
    [speak]
  );

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      clearMouthTimer();
      if (isSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore
        }
      }
    };
  }, [clearMouthTimer, isSupported]);

  return {
    voices: idVoices.length > 0 ? idVoices : voices,
    hasIndonesianVoice: idVoices.length > 0,
    activeVoiceLabel,
    isSupported,
    isSpeaking,
    isPaused,
    activeSentenceIndex,
    sentences,
    mouthOpen,
    speak,
    pause,
    resume,
    stop,
    replay,
  };
}
