import type { SubBabData, SubBabId } from '../types/physics';
import { SUBBAB_A_D } from './subbabA_D';
import { SUBBAB_E_I } from './subbabE_I';

export const SUBBAB_LIST: SubBabData[] = [...SUBBAB_A_D, ...SUBBAB_E_I];

export const SUBBAB_MAP: Record<SubBabId, SubBabData> = Object.fromEntries(
  SUBBAB_LIST.map((item) => [item.id, item])
) as Record<SubBabId, SubBabData>;
