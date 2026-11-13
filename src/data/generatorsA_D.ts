import {
  atmToCmHg,
  buildHintsForLevel,
  buildOptionsFromValues,
  celciusToKelvin,
  cm2ToM2,
  customScaleToCelcius,
  fmtId,
  pick,
  runSafeGenerator,
  type SubBabGeneratorFn,
} from './genHelpers';

export const GENERATORS_A_D: Record<'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'D1' | 'D2' | 'D3', SubBabGeneratorFn> = {
  A1: (level, seed) =>
    runSafeGenerator('A1', level, seed, (rng) => {
      if (level === 2) {
        const scenarios = [
          {
            desc: 'Grafik jarak-waktu (s–t) berbentuk garis lurus miring ke atas dengan kemiringan tetap.',
            ans: 'Gerak lurus beraturan (GLB)',
            d: ['Benda diam tidak bergerak', 'Gerak lurus berubah beraturan dipercepat', 'Gerak melingkar beraturan', 'Gerak diperlambat sampai berhenti'],
            jenis: 'grafik_st' as const,
            pts: [{ x: 0, y: 0 }, { x: 2, y: 10 }, { x: 4, y: 20 }],
          },
          {
            desc: 'Grafik jarak-waktu (s–t) berbentuk garis mendatar sejajar sumbu waktu.',
            ans: 'Benda diam tidak bergerak',
            d: ['Gerak lurus beraturan (GLB)', 'Gerak lurus berubah beraturan dipercepat', 'Kecepatan bertambah konstan', 'Gerak bolak-balik'],
            jenis: 'grafik_st' as const,
            pts: [{ x: 0, y: 12 }, { x: 2, y: 12 }, { x: 4, y: 12 }],
          },
          {
            desc: 'Grafik kecepatan-waktu (v–t) berbentuk garis miring lurus naik dari v = 0.',
            ans: 'Gerak lurus berubah beraturan dipercepat',
            d: ['Benda diam tidak bergerak', 'Gerak lurus beraturan (GLB)', 'Gerak diperlambat konstan', 'Kecepatan selalu nol'],
            jenis: 'grafik_vt' as const,
            pts: [{ x: 0, y: 0 }, { x: 2, y: 8 }, { x: 4, y: 16 }],
          },
        ];
        const sc = pick(scenarios, rng);
        const built = buildOptionsFromValues(sc.ans, sc.d, rng);
        if (!built) return null;
        return {
          pertanyaan: `Perhatikan grafik gerak berikut: ${sc.desc} Jenis gerak apakah yang ditunjukkan grafik tersebut?`,
          diagram: {
            jenis: sc.jenis,
            judul: sc.jenis === 'grafik_st' ? 'Grafik s–t' : 'Grafik v–t',
            xLabel: 't (s)',
            yLabel: sc.jenis === 'grafik_st' ? 's (m)' : 'v (m/s)',
            points: sc.pts,
          },
          ...built,
          petunjuk: buildHintsForLevel(level, ['Perhatikan apakah sumbu vertikalnya jarak (s) atau kecepatan (v).']),
          langkah: [
            `1. Identifikasi sumbu grafik: ${sc.jenis === 'grafik_st' ? 'sumbu vertikal s (jarak)' : 'sumbu vertikal v (kecepatan)'}.`,
            `2. Amati bentuk garisnya: ${sc.desc}`,
            `3. Kesimpulan jenis gerak: ${sc.ans}.`,
          ],
          kesalahanUmum: 'Tertukar membaca bentuk garis pada grafik s–t dan grafik v–t.',
        };
      }
      if (level === 3) {
        const v0 = pick([2, 4, 6], rng);
        const a = pick([2, 3, 4], rng);
        const t = pick([4, 5, 6], rng);
        const vAkhir = v0 + a * t;
        const jarak = 0.5 * (v0 + vAkhir) * t;
        const salah1 = vAkhir * t;
        const salah2 = v0 * t;
        const salah3 = 0.5 * vAkhir * t;
        const salah4 = v0 + a * t;
        const built = buildOptionsFromValues(
          `${fmtId(jarak)} m`,
          [`${fmtId(salah1)} m`, `${fmtId(salah2)} m`, `${fmtId(salah3)} m`, `${fmtId(salah4)} m`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah kereta mainan bergerak pada lintasan lurus sesuai grafik kecepatan-waktu (v–t): pada t = 0 s kecepatannya ${v0} m/s, lalu naik beraturan hingga pada t = ${t} s kecepatannya ${vAkhir} m/s. Berapa jarak total yang ditempuh selama ${t} s?`,
          diagram: {
            jenis: 'grafik_vt',
            judul: 'Grafik Kecepatan terhadap Waktu',
            xLabel: 't (s)',
            yLabel: 'v (m/s)',
            points: [{ x: 0, y: v0 }, { x: t, y: vAkhir }],
          },
          ...built,
          petunjuk: [],
          langkah: [
            '1. Kenali grafik sebagai grafik v–t (luas di bawah garis = jarak tempuh).',
            `2. Bentuk daerahnya adalah trapesium dengan sisi sejajar v₀ = ${v0} m/s dan v_t = ${vAkhir} m/s serta tinggi t = ${t} s.`,
            `3. Hitung luas: s = ½ × (${v0} + ${vAkhir}) × ${t} = ${fmtId(jarak)} m.`,
          ],
          kesalahanUmum: 'Hanya mengalikan kecepatan akhir dengan waktu (luas persegi panjang penuh) atau lupa sisi awal v₀.',
        };
      }
      const t1 = pick([1, 2, 3], rng);
      const dt = pick([3, 4, 5], rng);
      const t2 = t1 + dt;
      const v = pick([3, 4, 5, 6, 8], rng);
      const s1 = pick([4, 6, 8, 10], rng);
      const s2 = s1 + v * dt;
      const built = buildOptionsFromValues(
        `${fmtId(v)} m/s`,
        [`${fmtId(s2 / t2)} m/s`, `${fmtId(dt / (s2 - s1))} m/s`, `${fmtId(v * 2)} m/s`, `${fmtId(s2 - s1)} m/s`],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Berdasarkan grafik jarak-waktu (s–t), benda berada di posisi s₁ = ${s1} m saat t₁ = ${t1} s, dan bergerak lurus beraturan hingga s₂ = ${s2} m saat t₂ = ${t2} s. Berapa kelajuan benda tersebut?`,
        diagram: {
          jenis: 'grafik_st',
          judul: 'Grafik Jarak terhadap Waktu',
          xLabel: 't (s)',
          yLabel: 's (m)',
          points: [{ x: t1, y: s1 }, { x: t2, y: s2 }],
        },
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gunakan dua titik pada grafik: v = (s₂ − s₁)/(t₂ − t₁).', 'Jangan membagi satu titik s₂/t₂ karena garis tidak lewat (0,0).']),
        langkah: [
          '1. Grafik yang diketahui adalah grafik s–t.',
          `2. Ambil dua titik (${t1} s, ${s1} m) dan (${t2} s, ${s2} m), hitung Δs = ${s2} − ${s1} = ${s2 - s1} m dan Δt = ${t2} − ${t1} = ${dt} s.`,
          `3. Kelajuan v = Δs / Δt = ${s2 - s1} / ${dt} = ${fmtId(v)} m/s.`,
        ],
        kesalahanUmum: 'Memakai satu titik (s₂/t₂) atau terbalik menghitung Δt/Δs.',
      };
    }),

  A2: (level, seed) =>
    runSafeGenerator('A2', level, seed, (rng) => {
      if (level === 2) {
        const v1 = pick([4, 5, 6, 7], rng);
        const v2 = pick([3, 4, 5, 6], rng);
        const t = pick([5, 6, 8, 10, 12], rng);
        const d = (v1 + v2) * t;
        const built = buildOptionsFromValues(
          `${fmtId(t)} s`,
          [`${fmtId(d / Math.max(1, Math.abs(v1 - v2)))} s`, `${fmtId(d / v1)} s`, `${fmtId(d / v2)} s`, `${fmtId(t + 4)} s`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Dua pesepeda saling berhadapan pada jarak ${d} m dan mulai melaju pada saat yang sama. Pesepeda A bergerak ke timur dengan kelajuan ${v1} m/s dan pesepeda B bergerak ke barat dengan kelajuan ${v2} m/s. Setelah berapa sekon mereka berpapasan?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Karena berlawanan arah saling mendekat, kecepatan relatifnya dijumlahkan.']),
          langkah: [
            '1. Keduanya bergerak berlawanan arah (saling mendekat).',
            `2. Hitung kecepatan relatif: v_rel = v₁ + v₂ = ${v1} + ${v2} = ${v1 + v2} m/s.`,
            `3. Waktu berpapasan: t = d / v_rel = ${d} / ${v1 + v2} = ${t} s.`,
          ],
          kesalahanUmum: 'Mengurangkan kecepatan saat benda bergerak saling mendekat atau hanya membagi dengan satu kecepatan.',
        };
      }
      const v2 = pick([2.4, 3.0, 3.4, 4.2], rng);
      const dv = pick([0.2, 0.4, 0.5, 0.8], rng);
      const v1 = Number((v2 + dv).toFixed(2));
      const t = pick([10, 15, 20, 25], rng);
      const d = Number((dv * t).toFixed(2));
      const extraWait = level === 3 ? pick([2, 3, 4], rng) : 0;
      const totalD = level === 3 ? Number((d + v2 * extraWait).toFixed(2)) : d;
      const tAns = Number((totalD / dv).toFixed(2));
      const built = buildOptionsFromValues(
        `${fmtId(tAns)} s`,
        [
          `${fmtId(totalD / (v1 + v2))} s`,
          `${fmtId(totalD / v1)} s`,
          `${fmtId(totalD / v2)} s`,
          `${fmtId(tAns + 5)} s`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Pelari A (kelajuan ${fmtId(v1)} m/s) mengejar pelari B (kelajuan ${fmtId(v2)} m/s) yang sudah berlari duluan ${extraWait} sekon dari jarak awal ${fmtId(d)} m searah. Berapa sekon sejak pelari A mulai berlari hingga tepat menyusul pelari B?`
            : `Pelari A bergerak dengan kelajuan ${fmtId(v1)} m/s mengejar pelari B yang berada ${fmtId(d)} m di depannya dan bergerak searah dengan kelajuan ${fmtId(v2)} m/s. Kapan pelari A menyusul pelari B?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Karena searah, kecepatan relatif adalah v₁ − v₂.', 'Waktu menyusul = jarak pisah / (v₁ − v₂).']),
        langkah: [
          level === 3
            ? `1. Selama ${extraWait} s awal, pelari B maju sejauh ${fmtId(v2)} × ${extraWait} = ${fmtId(v2 * extraWait)} m, sehingga jarak pisah saat A start adalah ${fmtId(totalD)} m.`
            : `1. Kedua pelari bergerak searah dengan jarak pisah d = ${fmtId(d)} m.`,
          `2. Kecepatan relatif menyusul: v_rel = ${fmtId(v1)} − ${fmtId(v2)} = ${fmtId(dv)} m/s.`,
          `3. Waktu menyusul: t = ${fmtId(totalD)} / ${fmtId(dv)} = ${fmtId(tAns)} s.`,
        ],
        kesalahanUmum: 'Menjumlahkan kecepatan saat searah atau memakai d/v₁.',
      };
    }),

  A3: (level, seed) =>
    runSafeGenerator('A3', level, seed, (rng) => {
      const m = pick([2, 4, 5], rng);
      const a1 = pick([2, 3, 4], rng);
      const fRes = m * a1;
      const t1 = pick([2, 3], rng);
      const v = a1 * t1;
      const a2 = pick([4, 8, 10], rng);
      const s = Number(((v * v) / (2 * a2)).toFixed(2));
      const fGesek = m * a2;
      const fDorong = fRes + fGesek;
      const useGram = level === 3;
      const massaText = useGram ? `${m * 1000} gram` : `${m} kg`;
      const built = buildOptionsFromValues(
        `${fmtId(fDorong)} N`,
        [
          `${fmtId(fRes)} N`,
          `${fmtId(fGesek)} N`,
          `${fmtId(fDorong * 1000)} N`,
          `${fmtId(Math.abs(fGesek - fRes))} N`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan:
          level === 2
            ? `Sebuah peti bermassa ${massaText} mula-mula diam di lantai kasar, lalu didorong mendatar sehingga mendapat resultan gaya ${fRes} N selama ${t1} s. Ketika dorongan dilepas, peti meluncur dan berhenti setelah menempuh jarak ${fmtId(s)} m. Berapa gaya dorong yang diberikan?`
            : `Balok bermassa ${massaText} mula-mula diam mengalami resultan gaya ${fRes} N selama ${t1} s. Setelah itu gaya dorong dilepas dan balok berhenti setelah menempuh jarak ${fmtId(s)} m akibat gesekan. Berapa besar gaya dorong semula?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Ubah massa ke kg jika masih dalam gram.', 'Hitung kecepatan akhir fase 1 (v = (ΣF/m)·t), lalu perlambatan fase 2 (a′ = v²/2s).']),
        langkah: [
          `1. Pastikan satuan SI: m = ${m} kg.`,
          `2. Fase didorong: a = ΣF/m = ${fRes}/${m} = ${a1} m/s², maka v = ${a1} × ${t1} = ${v} m/s.`,
          `3. Fase dilepas: a′ = v²/(2s) = ${v * v}/(2 × ${fmtId(s)}) = ${a2} m/s², sehingga gaya gesek = m·a′ = ${m} × ${a2} = ${fGesek} N.`,
          `4. Gaya dorong F = ΣF + gaya gesek = ${fRes} + ${fGesek} = ${fDorong} N.`,
        ],
        kesalahanUmum: 'Lupa mengonversi gram ke kg atau mengira gaya dorong = resultan gaya saja.',
      };
    }),

  B1: (level, seed) =>
    runSafeGenerator('B1', level, seed, (rng) => {
      if (level === 2) {
        const c = pick([15, 20, 25, 30, 35, 40, 45, 50], rng);
        const f = (9 / 5) * c + 32;
        const r = (4 / 5) * c;
        const k = celciusToKelvin(c);
        const built = buildOptionsFromValues(
          `${fmtId(f)} °F`,
          [`${fmtId((9 / 5) * c)} °F`, `${fmtId(r)} °F`, `${fmtId(k)} °F`, `${fmtId(c + 32)} °F`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah ruang pendingin laboratorium bersuhu ${c} °C. Jika diukur menggunakan termometer Fahrenheit, angka berapa yang ditunjukkan?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Gunakan rumus F = (9/5)·C + 32.']),
          langkah: [
            `1. Catat suhu Celcius: C = ${c} °C.`,
            `2. Kalikan dengan 9/5: (9/5) × ${c} = ${fmtId((9 / 5) * c)}.`,
            `3. Tambahkan titik beku Fahrenheit (32): ${fmtId((9 / 5) * c)} + 32 = ${fmtId(f)} °F.`,
          ],
          kesalahanUmum: 'Lupa menambahkan 32 setelah mengalikan 9/5.',
        };
      }
      const x0 = pick([10, 15, 20, 25, 30], rng);
      const span = pick([80, 100, 120, 150], rng);
      const x100 = x0 + span;
      const frac = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8], rng);
      const xVal = x0 + span * frac;
      const cAns = customScaleToCelcius(xVal, x0, x100);
      const kAns = celciusToKelvin(cAns);
      const targetVal = level === 3 ? kAns : cAns;
      const unit = level === 3 ? 'K' : '°C';
      const built = buildOptionsFromValues(
        `${fmtId(targetVal)} ${unit}`,
        [
          `${fmtId((xVal / x100) * 100 + (level === 3 ? 273 : 0))} ${unit}`,
          `${fmtId(xVal + (level === 3 ? 273 : 0))} ${unit}`,
          `${fmtId(targetVal + 15)} ${unit}`,
          `${fmtId(Math.max(1, targetVal - 10))} ${unit}`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebuah termometer buatan X menetapkan titik tetap bawah ${x0}°X dan titik tetap atas ${x100}°X. Jika termometer X mengukur suhu benda sebesar ${fmtId(xVal)}°X, berapa suhu benda tersebut dalam skala ${level === 3 ? 'Kelvin (K)' : 'Celcius (°C)'}?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Kurangi dulu angka terbaca dengan titik beku X₀.', 'Bandingkan (X − X₀)/(X₁₀₀ − X₀) = C/100.']),
        langkah: [
          `1. Rentang skala X = ${x100} − ${x0} = ${span}.`,
          `2. Perbandingan: (${fmtId(xVal)} − ${x0}) / ${span} = ${fmtId(frac)} = C / 100 → C = ${fmtId(cAns)} °C.`,
          level === 3 ? `3. Konversi ke Kelvin: K = ${fmtId(cAns)} + 273 = ${fmtId(kAns)} K.` : `3. Jadi suhunya ${fmtId(cAns)} °C.`,
        ],
        kesalahanUmum: 'Lupa mengurangi titik beku X₀ sebelum membandingkan atau lupa mengubah ke Kelvin.',
      };
    }),

  B2: (level, seed) =>
    runSafeGenerator('B2', level, seed, (rng) => {
      const L0 = pick([100, 150, 200, 250], rng);
      const alphaCoeff = pick([12, 17, 19, 24], rng); // x 10^-6 /C
      const dT = level === 3 ? pick([10, 20, 25], rng) : pick([10, 20, 30, 40], rng);
      const dL = Number((L0 * alphaCoeff * 1e-6 * dT).toFixed(4));
      if (level === 2) {
        const mult = pick([2, 3], rng);
        const ans = `${mult} kali semula`;
        const built = buildOptionsFromValues(
          ans,
          ['Tetap sama', `${mult * mult} kali semula`, `1/${mult} kali semula`, `${mult + 1} kali semula`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Dua batang logam dari bahan yang sama dipanaskan dengan kenaikan suhu yang sama. Jika batang kedua memiliki panjang awal ${mult} kali panjang batang pertama (namun massa jenisnya sama), bagaimana pertambahan panjang batang kedua dibandingkan batang pertama?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Lihat rumus ΔL = L₀ · α · ΔT: ΔL sebanding lurus dengan L₀.']),
          langkah: [
            '1. Gunakan rumus pertambahan panjang ΔL = L₀ · α · ΔT.',
            `2. Karena bahan sama (α sama) dan ΔT sama, maka ΔL sebanding langsung dengan L₀.`,
            `3. Karena L₀ menjadi ${mult} kali, maka ΔL menjadi ${mult} kali semula.`,
          ],
          kesalahanUmum: 'Mengira massa jenis memengaruhi ΔL atau mengkuadratkan kelipatannya.',
        };
      }
      const tAwal = 20;
      const tAkhir = tAwal + dT;
      const built = buildOptionsFromValues(
        `${fmtId(dL, 4)} m`,
        [
          `${fmtId(dL * 10, 4)} m`,
          `${fmtId(dL / 10, 4)} m`,
          `${fmtId(L0 * alphaCoeff * 1e-6 * tAkhir, 4)} m`,
          `${fmtId(dL * 2, 4)} m`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Kabel logam sepanjang ${L0} m (α = ${alphaCoeff} × 10⁻⁶ /°C) mengalami kenaikan suhu sebesar ${dT} K dari suhu awal ${tAwal}°C. Berapa pertambahan panjang kabel tersebut?`
            : `Sebuah kawat logam sepanjang ${L0} m dengan koefisien muai panjang ${alphaCoeff} × 10⁻⁶ /°C dipanaskan hingga suhunya naik ${dT}°C. Berapa pertambahan panjang kawat tersebut?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gunakan ΔL = L₀ · α · ΔT.', 'Ingat selisih 1 K sama dengan selisih 1°C.']),
        langkah: [
          `1. Catat L₀ = ${L0} m, α = ${alphaCoeff} × 10⁻⁶ /°C, dan ΔT = ${dT} (${level === 3 ? 'selisih K = selisih °C' : '°C'}).`,
          `2. Hitung ΔL = ${L0} × ${alphaCoeff} × 10⁻⁶ × ${dT} = ${fmtId(dL, 4)} m.`,
        ],
        kesalahanUmum: 'Salah posisi koma desimal pada pangkat 10⁻⁶ atau menambahkan 273 ke nilai ΔT.',
      };
    }),

  B3: (level, seed) =>
    runSafeGenerator('B3', level, seed, (rng) => {
      const m = pick([40, 50, 60, 80, 100], rng);
      if (level === 2) {
        const qLebur = m * 80;
        const qEs = m * 0.5 * 10;
        const built = buildOptionsFromValues(
          `${fmtId(qLebur)} kal`,
          [`${fmtId(qEs)} kal`, `${fmtId(qLebur + qEs)} kal`, `${fmtId(m * 100)} kal`, `${fmtId(qLebur / 2)} kal`, `${fmtId(qLebur * 2)} kal`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebanyak ${m} gram es tepat bersuhu 0°C dileburkan seluruhnya menjadi air bersuhu 0°C pada bagian datar grafik pemanasan (kalor lebur es L = 80 kal/g). Berapa kalor yang diserap hanya pada bagian datar tersebut?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Bagian datar adalah perubahan wujud: gunakan Q = m · L.']),
          langkah: [
            '1. Pada bagian datar grafik tidak terjadi kenaikan suhu, hanya peleburan wujud.',
            `2. Gunakan Q = m · L = ${m} g × 80 kal/g = ${fmtId(qLebur)} kal.`,
          ],
          kesalahanUmum: 'Menjumlahkan segmen lain atau mengalikan dengan ΔT.',
        };
      }
      const tAwal = level === 3 ? pick([-10, -20], rng) : 0;
      const tAkhir = pick([50, 60, 80, 100], rng);
      const q1 = tAwal < 0 ? m * 0.5 * Math.abs(tAwal) : 0;
      const q2 = tAwal < 0 ? m * 80 : 0;
      const q3 = m * 1 * tAkhir;
      const totalQ = q1 + q2 + q3;
      const distractors =
        level === 3
          ? [
              `${fmtId(q3)} kal`,
              `${fmtId(totalQ + 1000)} kal`,
              `${fmtId(m * 0.5 * (tAkhir - tAwal))} kal`,
              `${fmtId(q2 + q3)} kal`,
            ]
          : [
              `${fmtId(totalQ + m * 80)} kal`,
              `${fmtId(totalQ + 1000)} kal`,
              `${fmtId(totalQ / 2)} kal`,
              `${fmtId(totalQ * 2)} kal`,
              `${fmtId(totalQ + 500)} kal`,
            ];
      const built = buildOptionsFromValues(`${fmtId(totalQ)} kal`, distractors, rng);
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Sebanyak ${m} gram es bersuhu ${tAwal}°C dipanaskan hingga seluruhnya menjadi air bersuhu ${tAkhir}°C (c_es = 0,5 kal/g°C, L = 80 kal/g, c_air = 1 kal/g°C). Berapa total kalor yang diperlukan?`
            : `Sebanyak ${m} gram air bersuhu 0°C dipanaskan hingga bersuhu ${tAkhir}°C (kalor jenis air = 1 kal/g°C). Berapa kalor yang dibutuhkan?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gunakan Q = m · c · ΔT untuk menaikkan suhu.', 'Pastikan satuan gram cocok dengan kal/g°C.']),
        langkah:
          level === 3
            ? [
                `1. Naikkan suhu es (${tAwal}°C → 0°C): Q₁ = ${m} × 0,5 × ${Math.abs(tAwal)} = ${fmtId(q1)} kal.`,
                `2. Leburkan es pada 0°C: Q₂ = ${m} × 80 = ${fmtId(q2)} kal.`,
                `3. Naikkan suhu air (0°C → ${tAkhir}°C): Q₃ = ${m} × 1 × ${tAkhir} = ${fmtId(q3)} kal.`,
                `4. Total kalor Q = ${fmtId(q1)} + ${fmtId(q2)} + ${fmtId(q3)} = ${fmtId(totalQ)} kal.`,
              ]
            : [
                `1. Wujud tetap air cair sehingga hanya memakai Q = m · c · ΔT.`,
                `2. Q = ${m} × 1 × ${tAkhir} = ${fmtId(totalQ)} kal.`,
              ],
        kesalahanUmum: 'Melupakan tahap peleburan es atau keliru memakai kalor jenis es untuk air.',
      };
    }),

  B4: (level, seed) =>
    runSafeGenerator('B4', level, seed, (rng) => {
      const tAir = pick([20, 30, 40, 50], rng);
      const tEs = pick([-10, -20], rng);
      const pct = pick([25, 50, 75], rng);
      // X * 1 * tAir = Y * (0.5 * |tEs| + (pct/100)*80)
      const qPerGramEs = 0.5 * Math.abs(tEs) + (pct / 100) * 80;
      if (level === 2) {
        const yMass = pick([40, 80, 100], rng);
        const xMass = (yMass * qPerGramEs) / tAir;
        if (!Number.isInteger(xMass)) return null;
        const built = buildOptionsFromValues(
          `${fmtId(xMass)} g`,
          [
            `${fmtId((yMass * (pct / 100) * 80) / tAir)} g`,
            `${fmtId(yMass)} g`,
            `${fmtId(xMass + 20)} g`,
            `${fmtId(Math.max(5, xMass - 15))} g`,
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Air bersuhu ${tAir}°C dicampur dengan ${yMass} gram es bersuhu ${tEs}°C sehingga saat setimbang tepat ${pct}% es melebur pada suhu akhir 0°C (c_air = 1, c_es = 0,5, L = 80 kal/g). Berapa massa air hangat yang dicampurkan?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Hitung kalor serap es = kalor naik suhu ke 0°C + kalor lebur sebagian.']),
          langkah: [
            `1. Kalor serap es = (${yMass} × 0,5 × ${Math.abs(tEs)}) + (${pct / 100} × ${yMass} × 80) = ${fmtId(yMass * qPerGramEs)} kal.`,
            `2. Kalor lepas air = m_air × 1 × ${tAir}.`,
            `3. Samakan Q_lepas = Q_terima → m_air = ${fmtId(yMass * qPerGramEs)} / ${tAir} = ${fmtId(xMass)} g.`,
          ],
          kesalahanUmum: 'Lupa menghitung kalor untuk menaikkan suhu es menuju 0°C.',
        };
      }
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const a = Math.round(qPerGramEs);
      const b = tAir;
      const g = gcd(a, b);
      const rx = a / g;
      const ry = b / g;
      const onlyMelt = Math.round((pct / 100) * 80);
      const gWrong = gcd(onlyMelt, b);
      const ans = `${rx} : ${ry}`;
      const built = buildOptionsFromValues(
        ans,
        [
          `${ry} : ${rx}`,
          `${onlyMelt / gWrong} : ${b / gWrong}`,
          `${rx + 1} : ${ry}`,
          `${rx} : ${ry + 1}`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `X gram air bersuhu ${tAir}°C dicampur dengan Y gram es bersuhu ${tEs}°C dalam wadah terisolasi. Setelah setimbang pada 0°C, tepat ${pct}% es melebur (c_air = 1, c_es = 0,5, L = 80 kal/g). Berapa perbandingan X : Y?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Tulis Q_lepas = X·1·t_air dan Q_terima = Y·c_es·|t_es| + (persen)·Y·L.', 'Suhu akhir 0°C sehingga es melebur sebagian.']),
        langkah: [
          `1. Q_lepas air = X × 1 × ${tAir} = ${tAir}X.`,
          `2. Q_terima es = Y × 0,5 × ${Math.abs(tEs)} + ${pct / 100}Y × 80 = ${fmtId(qPerGramEs)}Y.`,
          `3. ${tAir}X = ${fmtId(qPerGramEs)}Y → X : Y = ${a} : ${b} = ${ans}.`,
        ],
        kesalahanUmum: 'Lupa kalor menaikkan suhu es atau membalik perbandingan X : Y.',
      };
    }),

  B5: (level, seed) =>
    runSafeGenerator('B5', level, seed, (rng) => {
      const bankSituasi = [
        { s: 'Terjadinya angin laut pada siang hari di tepi pantai', jenis: 'Konveksi', sebab: 'Udara panas di darat naik digantikan udara sejuk dari laut.' },
        { s: 'Sendok logam terasa panas di ujung gagangnya saat mengaduk teh panas', jenis: 'Konduksi', sebab: 'Kalor merambat lewat getaran partikel logam tanpa partikel ikut berpindah.' },
        { s: 'Panas matahari sampai ke bumi menembus ruang hampa angkasa', jenis: 'Radiasi', sebab: 'Pancaran gelombang elektromagnetik tidak memerlukan zat perantara.' },
        { s: 'Asap api unggun bergerak membubung ke atas', jenis: 'Konveksi', sebab: 'Gas panas memuai sehingga massa jenisnya turun dan naik.' },
        { s: 'Rumah di daerah panas dicat berwarna putih agar bagian dalam lebih sejuk', jenis: 'Radiasi', sebab: 'Permukaan putih memantulkan sebagian besar kalor radiasi.' },
        { s: 'Baju berwarna hitam terasa lebih cepat gerah di bawah terik matahari', jenis: 'Radiasi', sebab: 'Permukaan gelap kusam menyerap radiasi kalor paling kuat.' },
        { s: 'Air di bagian bawah panci memanas lalu naik memutar saat direbus', jenis: 'Konveksi', sebab: 'Aliran partikel air membawa kalor dari bawah ke atas.' },
        { s: 'Gagang setrika dibuat dari plastik atau ebonit agar tangan tidak terbakar', jenis: 'Konduksi', sebab: 'Plastik adalah isolator yang menghambat rambatan kalor secara konduksi.' },
        { s: 'Dinding bagian dalam termos dilapisi perak mengilap', jenis: 'Radiasi', sebab: 'Lapisan mengilap memantulkan kembali radiasi kalor ke dalam termos.' },
        { s: 'Suhu ujung batang besi ikut naik setelah ujung lainnya dibakar', jenis: 'Konduksi', sebab: 'Energi kinetik getaran atom besi diteruskan ke atom sebelahnya.' },
        { s: 'Angin darat bertiup dari daratan ke laut pada malam hari', jenis: 'Konveksi', sebab: 'Udara di atas laut lebih hangat dan naik sehingga udara darat mengalir ke laut.' },
        { s: 'Pendingin ruangan (AC) dipasang di bagian atas dinding kamar', jenis: 'Konveksi', sebab: 'Udara dingin bermassa jenis lebih besar turun ke bawah sementara udara hangat naik.' },
        { s: 'Pemanas air celup diletakkan di bagian dasar ketel', jenis: 'Konveksi', sebab: 'Air yang dipanaskan di dasar naik membawa panas ke seluruh bagian.' },
        { s: 'Tubuh terasa hangat saat duduk di dekat perapian meski udara di sekitar dingin', jenis: 'Radiasi', sebab: 'Panas merambat langsung dalam bentuk gelombang inframerah.' },
        { s: 'Alas panci dibuat dari aluminium atau tembaga', jenis: 'Konduksi', sebab: 'Logam merupakan konduktor panas yang baik.' },
        { s: 'Panel pemanas surya dicat hitam kusam pada permukaannya', jenis: 'Radiasi', sebab: 'Warna hitam kusam menyerap radiasi matahari secara maksimal.' },
        { s: 'Terjadinya angin gunung dan angin lembah', jenis: 'Konveksi', sebab: 'Perbedaan suhu menyebabkan aliran massa udara.' },
        { s: 'Lantai keramik terasa lebih dingin di telapak kaki daripada karpet pada suhu ruangan sama', jenis: 'Konduksi', sebab: 'Keramik menghantarkan kalor keluar dari kaki lebih cepat daripada karpet.' },
        { s: 'Ruang hampa di antara dua dinding kaca termos mencegah kehilangan panas', jenis: 'Konduksi & Konveksi dicegah', sebab: 'Tanpa zat perantara, konduksi dan konveksi tidak dapat berlangsung.' },
        { s: 'Knalpot motor terasa panas saat disentuh setelah mesin menyala', jenis: 'Konduksi', sebab: 'Panas merambat melalui dinding logam knalpot.' },
      ];
      const item = pick(bankSituasi, rng);
      const choices = ['Konduksi', 'Konveksi', 'Radiasi', 'Konduksi & Konveksi dicegah', 'Evaporasi'];
      const distractors = choices.filter((c) => c !== item.jenis);
      const built = buildOptionsFromValues(item.jenis, distractors, rng);
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Perhatikan peristiwa berikut: "${item.s}". Mekanisme perpindahan kalor utama (atau prinsip yang dicegah) pada peristiwa tersebut adalah...`
            : `Peristiwa "${item.s}" paling tepat dijelaskan oleh konsep perpindahan kalor...`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Cek apakah partikelnya diam (konduksi), ikut bergerak (konveksi), atau tanpa medium/terkait warna (radiasi).']),
        langkah: [
          `1. Amati peristiwa: ${item.s}.`,
          `2. Analisis partikel: ${item.sebab}`,
          `3. Jadi jawabannya adalah ${item.jenis}.`,
        ],
        kesalahanUmum: 'Menukar konduksi (zat padat diam) dengan konveksi (aliran fluida) atau mengabaikan efek warna pada radiasi.',
      };
    }),

  B6: (level, seed) =>
    runSafeGenerator('B6', level, seed, (rng) => {
      const pairs = [
        { t1: 27, t2: 127, ratio: 4 / 3 }, // 300 -> 400
        { t1: 27, t2: 327, ratio: 2 },     // 300 -> 600
        { t1: -73, t2: 127, ratio: 2 },    // 200 -> 400
        { t1: 7, t2: 287, ratio: 2 },      // 280 -> 560
        { t1: 127, t2: 327, ratio: 1.5 },  // 400 -> 600
      ];
      const p = pick(pairs, rng);
      const v1 = pick([1.2, 1.5, 2.4, 3.0], rng);
      const v2 = Number((v1 * p.ratio).toFixed(2));
      const T1 = celciusToKelvin(p.t1);
      const T2 = celciusToKelvin(p.t2);
      const wrongC = p.t1 === 0 ? 9.99 : Number((v1 * (p.t2 / p.t1)).toFixed(2));
      const built = buildOptionsFromValues(
        `${fmtId(v2)} m³`,
        [
          `${fmtId(wrongC)} m³`,
          `${fmtId(v1 / p.ratio)} m³`,
          `${fmtId(v2 + 0.5)} m³`,
          `${fmtId(v1 * 3)} m³`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Sebuah balon berisi ${fmtId(v1)} m³ gas helium pada suhu ${p.t1}°C dipanaskan pada tekanan tetap hingga suhunya naik menjadi ${p.t2}°C (massa gas tetap). Berapa volume gas sekarang?`
            : `Gas bervolume ${fmtId(v1)} m³ pada suhu ${p.t1}°C dipanaskan pada tekanan tetap sampai bersuhu ${p.t2}°C. Berapa volume akhirnya?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Ubah kedua suhu °C ke Kelvin (+ 273) sebelum memakai V₁/T₁ = V₂/T₂.']),
        langkah: [
          `1. Konversi ke Kelvin: T₁ = ${p.t1} + 273 = ${T1} K, T₂ = ${p.t2} + 273 = ${T2} K.`,
          `2. Gunakan Hukum Charles V₂ = V₁ · (T₂/T₁) = ${fmtId(v1)} × (${T2}/${T1}) = ${fmtId(v2)} m³.`,
        ],
        kesalahanUmum: 'Memakai suhu dalam °C langsung tanpa mengubahnya ke Kelvin.',
      };
    }),

  C1: (level, seed) =>
    runSafeGenerator('C1', level, seed, (rng) => {
      if (level === 2) {
        const m = pick([6, 12, 18, 24], rng);
        const built = buildOptionsFromValues(
          `Massa tetap ${m} kg, berat berkurang menjadi 1/6 semula`,
          [
            `Massa menjadi ${m / 6} kg, berat tetap`,
            `Massa dan berat sama-sama menjadi 1/6 semula`,
            `Massa bertambah, berat berkurang`,
            `Massa dan berat sama-sama tetap`,
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah batu ruang angkasa bermassa ${m} kg di Bumi dibawa ke Bulan yang percepatan gravitasinya 1/6 kali gravitasi Bumi. Bagaimana keadaan massa dan berat batu di Bulan?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Massa tidak bergantung gravitasi, sedangkan berat W = m·g bergantung gravitasi.']),
          langkah: [
            `1. Massa menyatakan banyak zat sehingga tetap ${m} kg.`,
            '2. Berat W = m·g sehingga di Bulan menjadi 1/6 kali berat di Bumi.',
          ],
          kesalahanUmum: 'Menyamakan massa dengan berat sehingga mengira massa ikut berubah di Bulan.',
        };
      }
      const m = pick([2, 4, 5, 6, 8, 10], rng);
      const g = 10;
      const areaCm2 = pick([50, 100, 200, 250, 400, 500], rng);
      const areaM2 = cm2ToM2(areaCm2);
      const P = (m * g) / areaM2;
      const built = buildOptionsFromValues(
        `${fmtId(P)} Pa`,
        [
          `${fmtId((m * g) / areaCm2)} Pa`,
          `${fmtId((m * g) / (areaCm2 / 100))} Pa`,
          `${fmtId(m / areaM2)} Pa`,
          `${fmtId(P * 2)} Pa`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Sebuah kotak kayu bermassa ${m} kg dengan luas alas ${areaCm2} cm² dan tinggi 40 cm diletakkan di atas meja (g = 10 m/s²). Berapa tekanan kotak pada meja?`
            : `Sebuah benda bermassa ${m} kg menekan lantai dengan luas bidang tekan ${areaCm2} cm² (g = 10 m/s²). Berapa tekanan yang dihasilkan?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Ubah luas cm² ke m² dengan membagi 10.000.', 'Hitung gaya F = m·g, lalu P = F/A.']),
        langkah: [
          `1. Gaya tekan F = m·g = ${m} × 10 = ${m * g} N.`,
          `2. Luas bidang tekan A = ${areaCm2} cm² = ${fmtId(areaM2, 4)} m².`,
          `3. Tekanan P = F / A = ${m * g} / ${fmtId(areaM2, 4)} = ${fmtId(P)} Pa.`,
        ],
        kesalahanUmum: 'Lupa mengubah cm² ke m² atau hanya membagi 100 bukan 10.000.',
      };
    }),

  C2: (level, seed) =>
    runSafeGenerator('C2', level, seed, (rng) => {
      if (level === 1) {
        const atm = pick([0.5, 0.6, 0.75, 0.8, 0.9, 1.2], rng);
        const cmHg = atmToCmHg(atm);
        const built = buildOptionsFromValues(
          `${fmtId(cmHg)} cmHg`,
          [
            `${fmtId(atm * 100)} cmHg`,
            `${fmtId(cmHg * 10)} cmHg`,
            `${fmtId(76 / atm)} cmHg`,
            `${fmtId(cmHg + 10)} cmHg`,
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Tekanan udara di suatu tempat terbaca sebesar ${fmtId(atm)} atm. Jika dinyatakan dalam cmHg (1 atm = 76 cmHg), berapa tekanannya?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Kalikan nilai atm dengan 76 cmHg.']),
          langkah: [
            '1. Gunakan patokan 1 atm = 76 cmHg.',
            `2. P = ${fmtId(atm)} × 76 = ${fmtId(cmHg)} cmHg.`,
          ],
          kesalahanUmum: 'Mengalikan atm dengan 100 atau lupa mengonversi ke cmHg.',
        };
      }
      const pAtmCmHg = pick([74, 75, 76], rng);
      const h = pick([6, 8, 10, 12, 14], rng);
      const lebihTinggiTerbuka = level === 3 ? false : true;
      const pGas = lebihTinggiTerbuka ? pAtmCmHg + h : pAtmCmHg - h;
      const built = buildOptionsFromValues(
        `${fmtId(pGas)} cmHg`,
        [
          `${fmtId(lebihTinggiTerbuka ? pAtmCmHg - h : pAtmCmHg + h)} cmHg`,
          `${fmtId(h)} cmHg`,
          `${fmtId(pAtmCmHg)} cmHg`,
          `${fmtId(pGas + 5)} cmHg`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebuah manometer raksa terbuka dipasang pada tabung gas saat tekanan udara luar ${pAtmCmHg} cmHg. Permukaan raksa pada kaki terbuka ternyata ${h} cm lebih ${lebihTinggiTerbuka ? 'tinggi' : 'rendah'} daripada kaki yang terhubung ke tabung. Berapa tekanan gas dalam tabung?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Jika sisi terbuka lebih tinggi, P_gas = P_atm + h.']),
        langkah: [
          `1. Samakan satuan (keduanya sudah cmHg: P_atm = ${pAtmCmHg} cmHg, h = ${h} cm).`,
          `2. Karena kaki terbuka lebih ${lebihTinggiTerbuka ? 'tinggi' : 'rendah'}, ${lebihTinggiTerbuka ? 'P_gas = P_atm + h' : 'P_gas = P_atm − h'} = ${fmtId(pGas)} cmHg.`,
        ],
        kesalahanUmum: 'Terbalik menjumlahkan atau mengurangkan selisih tinggi raksa h.',
      };
    }),

  C3: (level, seed) =>
    runSafeGenerator('C3', level, seed, (rng) => {
      if (level === 1) {
        const ans = 'Isi penuh raksa → tutup ujung dengan jari → balik ke bejana raksa → lepaskan jari';
        const built = buildOptionsFromValues(
          ans,
          [
            'Balik tabung kosong → tuang raksa dari bawah → tutup jari → angkat tabung',
            'Isi setengah raksa → balik ke bejana air → biarkan udara masuk → ukur tinggi',
            'Tutup ujung terbuka → balik tabung → baru isi raksa dari ujung tertutup',
            'Panaskan tabung kosong → celupkan ke raksa → tutup kedua ujung',
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: 'Manakah urutan langkah yang benar untuk melakukan percobaan barometer Torricelli?',
          ...built,
          petunjuk: buildHintsForLevel(level, ['Tabung harus diisi penuh raksa dulu supaya tidak ada udara terjebak.']),
          langkah: [
            '1. Isi tabung kaca panjang sampai penuh dengan raksa.',
            '2. Tutup ujung terbuka rapat-rapat dengan jari.',
            '3. Balikkan ke dalam bejana berisi raksa lalu lepaskan jari.',
          ],
          kesalahanUmum: 'Membalik tabung sebelum diisi penuh sehingga masih ada udara terjebak.',
        };
      }
      const pCm = pick([68, 70, 71, 72, 73, 74], rng);
      const hApprox = (76 - pCm) * 100;
      const built = buildOptionsFromValues(
        `${fmtId(hApprox)} m`,
        [
          `${fmtId(pCm * 100)} m`,
          `${fmtId((76 - pCm) * 10)} m`,
          `${fmtId(hApprox + 200)} m`,
          `${fmtId(Math.max(50, hApprox - 150))} m`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Menggunakan pendekatan penurunan tekanan atmosfer ±1 cmHg setiap naik ±100 m dari permukaan laut (76 cmHg), berapa perkiraan ketinggian suatu tempat jika barometer raksa menunjukkan angka ${pCm} cmHg?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Hitung selisih dari 76 cmHg lalu kalikan 100 m.']),
        langkah: [
          `1. Penurunan tekanan = 76 − ${pCm} = ${76 - pCm} cmHg.`,
          `2. Perkiraan ketinggian ≈ ${76 - pCm} × 100 m = ${fmtId(hApprox)} m.`,
        ],
        kesalahanUmum: 'Mengalikan langsung angka barometer dengan 100 tanpa mengurangi dari 76 cmHg.',
      };
    }),

  C4: (level, seed) =>
    runSafeGenerator('C4', level, seed, (rng) => {
      if (level === 2) {
        const built = buildOptionsFromValues(
          'Memperkecil diameter pengisap kecil',
          [
            'Memperbesar diameter pengisap kecil',
            'Memperkecil diameter pengisap besar',
            'Mengurangi volume cairan di dalam pipa',
            'Membuat kedua diameter pengisap sama besar',
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: 'Bagaimana cara meningkatkan keuntungan mekanis sebuah dongkrak hidrolik agar beban berat dapat terangkat dengan gaya dorong yang lebih ringan?',
          ...built,
          petunjuk: buildHintsForLevel(level, ['KM = A₂/A₁ = (d₂/d₁)².']),
          langkah: [
            '1. Keuntungan mekanis hidrolik KM = (d_besar / d_kecil)².',
            '2. Agar KM makin besar, perkecil d_kecil atau perbesar d_besar.',
          ],
          kesalahanUmum: 'Mengira memperbesar pengisap dorong membuat gaya dorong makin kecil.',
        };
      }
      const multRatio = pick([2, 3, 4, 5], rng);
      const gayaRatio = multRatio * multRatio;
      const d1 = pick([2, 3, 4], rng);
      const d2 = d1 * multRatio;
      const built = buildOptionsFromValues(
        `${fmtId(d1)} cm`,
        [
          `${fmtId(d2 / gayaRatio)} cm`,
          `${fmtId(d2 * multRatio)} cm`,
          `${fmtId(d1 + 2)} cm`,
          `${fmtId(d2)} cm`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebuah pengangkat hidrolik digunakan untuk mengangkat beban F₂ = ${gayaRatio} kali gaya tekan F₁. Jika diameter pengisap besar d₂ = ${d2} cm, berapa diameter pengisap kecil d₁?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Ingat luas lingkaran sebanding dengan kuadrat diameter (A ∝ d²).']),
        langkah: [
          `1. F₂/F₁ = (d₂/d₁)² → ${gayaRatio} = (${d2}/d₁)².`,
          `2. Akarkan kedua ruas: d₂/d₁ = √${gayaRatio} = ${multRatio}.`,
          `3. d₁ = ${d2} / ${multRatio} = ${d1} cm.`,
        ],
        kesalahanUmum: 'Membagi diameter langsung dengan rasio gaya tanpa menarik akar kuadrat.',
      };
    }),

  C5: (level, seed) =>
    runSafeGenerator('C5', level, seed, (rng) => {
      if (level === 3) {
        const rhoOut = 1.3;
        const rhoIn = pick([0.8, 0.9, 1.0], rng);
        const V = pick([200, 300, 400], rng);
        const g = 10;
        const wBeban = pick([200, 300, 400], rng);
        const fNet = Number(((rhoOut - rhoIn) * g * V - wBeban).toFixed(1));
        if (fNet <= 0) return null;
        const built = buildOptionsFromValues(
          `${fmtId(fNet)} N`,
          [
            `${fmtId(rhoOut * g * V)} N`,
            `${fmtId((rhoOut - rhoIn) * g * V)} N`,
            `${fmtId(fNet + 2 * wBeban)} N`,
            `${fmtId((rhoOut + rhoIn) * g * V)} N`,
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah balon udara bervolume ${V} m³ diisi udara panas bermassa jenis ${fmtId(rhoIn)} kg/m³ di udara luar bermassa jenis ${fmtId(rhoOut)} kg/m³ (g = 10 m/s²). Jika berat kulit balon dan keranjangnya ${wBeban} N, berapa gaya angkat bersih ke atas?`,
          ...built,
          petunjuk: [],
          langkah: [
            `1. Gaya apung udara luar: F_A = ${fmtId(rhoOut)} × 10 × ${V} = ${fmtId(rhoOut * g * V)} N.`,
            `2. Berat udara panas di dalam balon: W_dalam = ${fmtId(rhoIn)} × 10 × ${V} = ${fmtId(rhoIn * g * V)} N.`,
            `3. Gaya angkat bersih = ${fmtId(rhoOut * g * V)} − ${fmtId(rhoIn * g * V)} − ${wBeban} = ${fmtId(fNet)} N.`,
          ],
          kesalahanUmum: 'Lupa mengurangi berat udara panas di dalam balon maupun berat beban keranjang.',
        };
      }
      const rhoCair = pick([800, 1000, 1200], rng);
      const fracPct = pick([40, 50, 60, 75, 80, 90], rng);
      const rhoBenda = (rhoCair * fracPct) / 100;
      const built = buildOptionsFromValues(
        `${fracPct}%`,
        [`${100 - fracPct}%`, `100%`, `${Math.round(fracPct / 2)}%`, `${Math.min(99, fracPct + 12)}%`],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebuah balok bermassa jenis ${rhoBenda} kg/m³ mengapung di dalam zat cair bermassa jenis ${rhoCair} kg/m³. Berapa persen bagian volume balok yang tercelup di bawah permukaan zat cair?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Bagian tercelup = ρ_benda / ρ_cair × 100%.']),
        langkah: [
          `1. Karena ρ_benda (${rhoBenda}) < ρ_cair (${rhoCair}), balok terapung dengan F_A = W.`,
          `2. Bagian tercelup = (${rhoBenda} / ${rhoCair}) × 100% = ${fracPct}%.`,
        ],
        kesalahanUmum: 'Menjawab bagian yang muncul di permukaan (100% − tercelup).',
      };
    }),

  D1: (level, seed) =>
    runSafeGenerator('D1', level, seed, (rng) => {
      const T = pick([0.2, 0.25, 0.4, 0.5], rng);
      const v = pick([10, 12, 15, 20], rng);
      const lam = Number((v * T).toFixed(2));
      const n = pick([3, 4, 5, 6], rng);
      const L = Number((n * lam).toFixed(2));
      const simpangan = pick([4, 6, 8], rng);
      const built = buildOptionsFromValues(
        `${n} gelombang`,
        [
          `${fmtId(L / (v / T))} gelombang`,
          `${fmtId(n * 2)} gelombang`,
          `${fmtId(n + 2)} gelombang`,
          `${fmtId(Math.max(1, n - 1))} gelombang`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Seutas tali sepanjang ${fmtId(L)} m digetarkan terus-menerus dengan periode ${fmtId(T)} s dan simpangan maksimum ${simpangan} cm sehingga gelombang merambat pada kecepatan ${v} m/s. Berapa jumlah gelombang yang terbentuk di sepanjang tali tersebut?`
            : `Gelombang merambat pada tali sepanjang ${fmtId(L)} m dengan periode ${fmtId(T)} s dan cepat rambat ${v} m/s. Berapa banyak gelombang yang terbentuk pada tali?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Hitung λ = v · T terlebih dahulu, lalu n = L / λ.']),
        langkah: [
          level === 3 ? `1. Abaikan data pengecoh simpangan ${simpangan} cm.` : '1. Catat L, T, dan v.',
          `2. Panjang satu gelombang: λ = v · T = ${v} × ${fmtId(T)} = ${fmtId(lam)} m.`,
          `3. Jumlah gelombang pada tali: n = L / λ = ${fmtId(L)} / ${fmtId(lam)} = ${n} gelombang.`,
        ],
        kesalahanUmum: 'Mengikutsertakan simpangan dalam perhitungan atau membagi v dengan T.',
      };
    }),

  D2: (level, seed) =>
    runSafeGenerator('D2', level, seed, (rng) => {
      if (level === 2) {
        const f1 = pick([200, 250, 300, 440], rng);
        const f2 = f1 * 2;
        const built = buildOptionsFromValues(
          `${f2} Hz`,
          [`${f1 / 2} Hz`, `${f1} Hz`, `${f1 * 4} Hz`, `${f1 + 100} Hz`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah pipa organa menghasilkan nada dasar berfrekuensi ${f1} Hz. Jika panjang pipa dipotong menjadi setengah panjang semula tanpa mengubah jenis pipa dan cepat rambat bunyi, berapa frekuensi nada dasarnya sekarang?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Panjang pipa setengahnya membuat frekuensi menjadi dua kali lipat.']),
          langkah: [
            '1. Frekuensi berbanding terbalik dengan panjang pipa (f ∝ 1/L).',
            `2. Jika L menjadi ½ kali, maka f₂ = 2 × ${f1} = ${f2} Hz (naik satu oktaf).`,
          ],
          kesalahanUmum: 'Mengira panjang setengah membuat frekuensi ikut menjadi setengahnya.',
        };
      }
      const pairs = [
        { f: 425, v: 340, lamCm: 80 },
        { f: 340, v: 340, lamCm: 100 },
        { f: 850, v: 340, lamCm: 40 },
        { f: 500, v: 340, lamCm: 68 },
      ];
      const p = pick(pairs, rng);
      const r1 = p.lamCm / 4;
      const r2 = (3 * p.lamCm) / 4;
      const r3 = (5 * p.lamCm) / 4;
      const built = buildOptionsFromValues(
        `${fmtId(r2)} cm`,
        [`${fmtId(p.lamCm / 2)} cm`, `${fmtId(p.lamCm)} cm`, `${fmtId(r1 + 10)} cm`, `${fmtId(r2 + 10)} cm`],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Garpu tala berfrekuensi ${p.f} Hz digetarkan di atas tabung berisi air saat cepat rambat bunyi di udara ${p.v} m/s. Pada panjang kolom udara manakah terjadi resonansi kedua (tabung tertutup di permukaan air)?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Hitung λ = v / f (ubah ke cm), lalu resonansi tertutup mengikuti pola ¼λ, ¾λ, ⁵⁄₄λ.']),
        langkah: [
          `1. λ = ${p.v} / ${p.f} = ${fmtId(p.lamCm / 100)} m = ${p.lamCm} cm.`,
          `2. Pola resonansi tabung tertutup: ¼λ = ${r1} cm, ¾λ = ${r2} cm, ⁵⁄₄λ = ${r3} cm.`,
          `3. Jadi resonansi kedua terjadi pada ${fmtId(r2)} cm.`,
        ],
        kesalahanUmum: 'Memakai pola ½λ (pipa terbuka) pada tabung resonansi tertutup.',
      };
    }),

  D3: (level, seed) =>
    runSafeGenerator('D3', level, seed, (rng) => {
      if (level === 3) {
        const f = pick([400, 500, 600], rng);
        const lam = pick([0.6, 0.68, 0.7, 0.85], rng);
        const v = Number((f * lam).toFixed(1));
        const t = pick([2, 3, 4], rng);
        const s = Number(((v * t) / 2).toFixed(1));
        const built = buildOptionsFromValues(
          `${fmtId(s)} m`,
          [`${fmtId(v * t)} m`, `${fmtId(v / t)} m`, `${fmtId(s + 100)} m`, `${fmtId(Math.max(10, s - 120))} m`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah sumber memancarkan bunyi berfrekuensi ${f} Hz dengan panjang gelombang ${fmtId(lam)} m ke arah tebing, dan gema terdengar tepat ${t} s kemudian. Berapa jarak tebing dari sumber bunyi?`,
          ...built,
          petunjuk: [],
          langkah: [
            `1. Hitung cepat rambat bunyi: v = f · λ = ${f} × ${fmtId(lam)} = ${fmtId(v)} m/s.`,
            `2. Hitung jarak tebing (selalu dibagi 2): s = (${fmtId(v)} × ${t}) / 2 = ${fmtId(s)} m.`,
          ],
          kesalahanUmum: 'Lupa membagi dua hasil kali v · t.',
        };
      }
      const v = pick([1400, 1500, 340], rng);
      const t = pick([2, 3, 4, 5, 6], rng);
      const s = (v * t) / 2;
      const built = buildOptionsFromValues(
        `${fmtId(s)} m`,
        [`${fmtId(v * t)} m`, `${fmtId(s / 2)} m`, `${fmtId(v / t)} m`, `${fmtId(s + v)} m`],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Kapal riset memancarkan gelombang sonar (v = ${fmtId(v)} m/s) ke dasar laut dan menerima pantulannya kembali setelah ${t} s. Berapa kedalaman laut di titik tersebut?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gunakan s = (v · t) / 2 karena bunyi menempuh lintasan bolak-balik.']),
        langkah: [
          `1. Catat v = ${fmtId(v)} m/s dan waktu bolak-balik t = ${t} s.`,
          `2. Kedalaman s = (${fmtId(v)} × ${t}) / 2 = ${fmtId(s)} m.`,
        ],
        kesalahanUmum: 'Lupa membagi 2 hasil perkalian v · t.',
      };
    }),
};
