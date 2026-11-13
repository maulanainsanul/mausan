import type { HurufKunci, SoalKuis50 } from '../types/physics';
import { KUIS_50_PART_1 } from './kuis50_part1';
import { KUIS_50_PART_2 } from './kuis50_part2';

export const VERIFIED_KEYS_SECTION_7: Partial<Record<number, HurufKunci>> = {
  1: 'D', 2: 'E', 3: 'B', 4: 'C', 5: 'A', 6: 'B', 7: 'C', 8: 'B', 9: 'C', 10: 'C',
  11: 'C', 12: 'C', 13: 'B', 14: 'C', 15: 'D', 16: 'D', 17: 'D', 18: 'C', 19: 'D', 20: 'E',
  21: 'B', 22: 'A', 23: 'B', 24: 'A', 25: 'B', 26: 'C', 27: 'D', 28: 'C', 29: 'A', 30: 'C',
  31: 'E', 32: 'A', 33: 'D', 34: 'B', 35: 'C', 36: 'A', 37: 'A', 38: 'E', 39: 'B', 40: 'C',
  41: 'B', 42: 'C', 43: 'D', 44: 'A', 45: 'A', 46: 'E', 47: 'D', 48: 'A', 49: 'A', 50: 'A',
};

export const INITIAL_KUIS_50: SoalKuis50[] = [...KUIS_50_PART_1, ...KUIS_50_PART_2];
