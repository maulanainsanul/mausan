import assert from 'node:assert/strict';
import { BABS } from '../src/data/babs';
import { GENERATORS, generateSoalMirip } from '../src/data/generators';
import {
  atmToCmHg,
  celciusToFahrenheit,
  celciusToKelvin,
  celciusToReamur,
  cm2ToM2,
  customScaleToCelcius,
  kelvinToCelcius,
} from '../src/data/genHelpers';
import { INITIAL_KUIS_50, VERIFIED_KEYS_SECTION_7 } from '../src/data/kuis50';
import { NARASI } from '../src/data/narasi';
import { SUBBAB_LIST } from '../src/data/subbab';
import { VIDEOS } from '../src/data/videos';
import type { LevelLatihan, SubBabId } from '../src/types/physics';

function runUnitTests(): void {
  // 1. Data integrity tests across all 33 sub-babs
  assert.equal(BABS.length, 9, 'Harus ada tepat 9 bab');
  assert.equal(SUBBAB_LIST.length, 33, 'Harus ada tepat 33 sub-bab');
  assert.equal(INITIAL_KUIS_50.length, 50, 'Harus ada tepat 50 soal kuis');

  for (const sb of SUBBAB_LIST) {
    assert.ok(NARASI[sb.id], `Narasi ${sb.id} harus ada`);
    assert.ok(VIDEOS[sb.id] !== undefined, `Video entry ${sb.id} harus ada`);
    assert.ok(GENERATORS[sb.id], `Generator ${sb.id} harus ada`);
    assert.ok(sb.konsepInti.length >= 1 && sb.konsepInti.length <= 3, `${sb.id}: konsepInti 1-3 poin`);
    assert.ok(sb.rumus.length >= 1, `${sb.id}: minimal 1 rumus`);
    assert.ok(sb.langkahBaku.length >= 2, `${sb.id}: minimal 2 langkah baku`);
    assert.equal(sb.jebakan.length, 2, `${sb.id}: harus 2 jebakan`);
  }

  // Verify all 50 questions are complete and Section 7 + newly integrated keys 1..50 match
  for (let no = 1; no <= 50; no++) {
    const q = INITIAL_KUIS_50.find((x) => x.nomor === no);
    assert.ok(q, `Soal ${no} harus ada`);
    assert.ok(q.teksSoal && q.teksSoal.trim().length > 10, `Soal ${no}: teksSoal harus terisi lengkap`);
    assert.ok(q.pilihan, `Soal ${no}: pilihan A-E harus ada`);
    for (const h of ['A', 'B', 'C', 'D', 'E'] as const) {
      assert.ok(q.pilihan[h] && q.pilihan[h].trim().length > 0, `Soal ${no} pilihan ${h} tidak boleh kosong`);
    }
    assert.ok(['A', 'B', 'C', 'D', 'E'].includes(q.kunci), `Soal ${no}: kunci harus A-E`);
    assert.ok(q.pembahasanLangkah.length >= 2, `Soal ${no}: minimal 2 langkah pembahasan`);
    assert.ok(q.tipsSerupa.trim().length > 10, `Soal ${no}: tipsSerupa tidak boleh kosong`);
  }

  for (const [noStr, expectedKey] of Object.entries(VERIFIED_KEYS_SECTION_7)) {
    const no = Number(noStr);
    const q = INITIAL_KUIS_50.find((x) => x.nomor === no);
    assert.ok(q, `Soal ${no} harus ada`);
    assert.equal(q.kunci, expectedKey, `Kunci soal ${no} harus ${expectedKey}`);
  }

  // 2. Unit tests for temperature & unit conversions
  assert.equal(celciusToKelvin(0), 273);
  assert.equal(celciusToKelvin(27), 300);
  assert.equal(kelvinToCelcius(373), 100);
  assert.equal(celciusToFahrenheit(0), 32);
  assert.equal(celciusToFahrenheit(100), 212);
  assert.equal(celciusToReamur(100), 80);
  assert.equal(customScaleToCelcius(50, 20, 140), 25);
  assert.equal(atmToCmHg(1), 76);
  assert.equal(atmToCmHg(0.8), 60.8);
  assert.equal(cm2ToM2(200), 0.02);

  // 3. Stress test: run every generator 500x across levels 1, 2, 3
  const ids = Object.keys(GENERATORS) as SubBabId[];
  let totalGenerated = 0;

  for (const id of ids) {
    for (let i = 0; i < 500; i++) {
      const level = ((i % 3) + 1) as LevelLatihan;
      const soal = generateSoalMirip(id, level, 1000 + i * 37);

      assert.equal(soal.subBabId, id);
      assert.equal(soal.pilihan.length, 5, `${id} iter ${i}: harus 5 pilihan`);
      assert.ok(soal.indeksBenar >= 0 && soal.indeksBenar <= 4, `${id} iter ${i}: indeksBenar valid`);

      const uniqueSet = new Set(soal.pilihan.map((p) => p.trim()));
      assert.equal(uniqueSet.size, 5, `${id} iter ${i}: semua 5 pilihan harus unik`);

      assert.ok(soal.pertanyaan.trim().length > 10, `${id} iter ${i}: pertanyaan tidak boleh kosong`);
      assert.ok(soal.langkah.length >= 2, `${id} iter ${i}: minimal 2 langkah penyelesaian`);

      const joined = `${soal.pertanyaan} ${soal.pilihan.join(' ')} ${soal.langkah.join(' ')}`;
      assert.equal(/NaN|Infinity|undefined/.test(joined), false, `${id} iter ${i}: tidak boleh NaN/Infinity/undefined`);

      totalGenerated++;
    }
  }

  console.log(`SEMUA PENGUJIAN LULUS: ${ids.length} generator x 500 iterasi = ${totalGenerated} soal terverifikasi + konversi suhu/satuan OK.`);
}

runUnitTests();
