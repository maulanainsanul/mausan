import type { LevelLatihan, SoalMirip, SubBabId } from '../types/physics';

/** Deterministic PRNG (Mulberry32) */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffleWithRng<T>(arr: readonly T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Format number in Indonesian style (comma decimal, max 2 decimals by default) */
export function fmtId(n: number, maxDec = 2): string {
  if (!Number.isFinite(n)) throw new Error(`Invalid number: ${n}`);
  const rounded = Number(n.toFixed(maxDec));
  const finalVal = Object.is(rounded, -0) ? 0 : rounded;
  return finalVal.toLocaleString('id-ID', {
    maximumFractionDigits: maxDec,
    minimumFractionDigits: 0,
  });
}

/** Unit & temperature conversion utilities (tested explicitly in unit tests) */
export function celciusToKelvin(c: number): number {
  return c + 273;
}
export function kelvinToCelcius(k: number): number {
  return k - 273;
}
export function celciusToFahrenheit(c: number): number {
  return (9 / 5) * c + 32;
}
export function celciusToReamur(c: number): number {
  return (4 / 5) * c;
}
export function customScaleToCelcius(x: number, x0: number, x100: number): number {
  return ((x - x0) / (x100 - x0)) * 100;
}
export function atmToCmHg(atm: number): number {
  return Number((atm * 76).toFixed(2));
}
export function cm2ToM2(cm2: number): number {
  return cm2 * 1e-4;
}

export function buildOptionsFromValues(
  correctLabel: string,
  distractorCandidates: string[],
  rng: () => number
): { pilihan: [string, string, string, string, string]; indeksBenar: number } | null {
  const seen = new Set<string>([correctLabel.trim()]);
  const uniqueDistractors: string[] = [];
  for (const cand of distractorCandidates) {
    const clean = cand.trim();
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      uniqueDistractors.push(clean);
      if (uniqueDistractors.length === 4) break;
    }
  }
  if (uniqueDistractors.length < 4) return null;
  const all = shuffleWithRng([correctLabel, ...uniqueDistractors], rng);
  const indeksBenar = all.indexOf(correctLabel);
  if (indeksBenar < 0 || all.length !== 5) return null;
  return {
    pilihan: all as [string, string, string, string, string],
    indeksBenar,
  };
}

export function levelLabelOf(level: LevelLatihan): 'Meniru' | 'Variasi' | 'Tantangan' {
  if (level === 1) return 'Meniru';
  if (level === 2) return 'Variasi';
  return 'Tantangan';
}

export function buildHintsForLevel(level: LevelLatihan, hints: string[]): string[] {
  if (level === 1) return hints;
  if (level === 2) return hints.slice(0, 1);
  return [];
}

export type SubBabGeneratorFn = (level: LevelLatihan, seed: number) => SoalMirip;

export function makeNumericFallback(base: number, unit: string, maxDec = 2): string[] {
  const offsets = [0.5, 1.5, 2, 0.25, 3, 0.75, 4, 1.25];
  return offsets.map((mult) => {
    const val = base === 0 ? mult : Number((base * mult).toFixed(maxDec));
    return `${fmtId(val, maxDec)}${unit ? ' ' + unit : ''}`;
  });
}

export function verifySoalValidity(s: SoalMirip): void {
  if (s.pilihan.length !== 5) throw new Error(`${s.subBabId}: pilihan length != 5`);
  const uniq = new Set(s.pilihan);
  if (uniq.size !== 5) throw new Error(`${s.subBabId}: duplicate pilihan: ${s.pilihan.join(' | ')}`);
  if (s.indeksBenar < 0 || s.indeksBenar > 4) throw new Error(`${s.subBabId}: invalid indeksBenar`);
  if (/NaN|Infinity|undefined/.test(s.pertanyaan + s.pilihan.join('') + s.langkah.join(''))) {
    throw new Error(`${s.subBabId}: NaN/Infinity/undefined detected`);
  }
}

export function runSafeGenerator(
  subBabId: SubBabId,
  level: LevelLatihan,
  seed: number,
  attemptFn: (rng: () => number, attempt: number) => Omit<SoalMirip, 'uid' | 'subBabId' | 'level' | 'levelLabel'> | null
): SoalMirip {
  for (let attempt = 0; attempt < 40; attempt++) {
    const rng = createRng(seed + attempt * 7919);
    const res = attemptFn(rng, attempt);
    if (res) {
      const full: SoalMirip = {
        uid: `${subBabId}-L${level}-${seed}`,
        subBabId,
        level,
        levelLabel: levelLabelOf(level),
        ...res,
      };
      verifySoalValidity(full);
      return full;
    }
  }
  throw new Error(`Generator ${subBabId} level ${level} failed to produce 5 unique options`);
}
