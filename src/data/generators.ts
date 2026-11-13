import type { LevelLatihan, SoalMirip, SubBabId } from '../types/physics';
import type { SubBabGeneratorFn } from './genHelpers';
import { GENERATORS_A_D } from './generatorsA_D';
import { GENERATORS_E_I } from './generatorsE_I';

export const GENERATORS: Record<SubBabId, SubBabGeneratorFn> = {
  ...GENERATORS_A_D,
  ...GENERATORS_E_I,
};

export function generateSoalMirip(subBabId: SubBabId, level: LevelLatihan, seed: number): SoalMirip {
  return GENERATORS[subBabId](level, seed);
}
