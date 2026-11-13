import {
  buildHintsForLevel,
  buildOptionsFromValues,
  fmtId,
  pick,
  runSafeGenerator,
  type SubBabGeneratorFn,
} from './genHelpers';

export const GENERATORS_E_I: Record<'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6' | 'F1' | 'F2' | 'F3' | 'F4' | 'G1' | 'G2' | 'G3' | 'G4' | 'H1' | 'I1', SubBabGeneratorFn> = {
  E1: (level, seed) =>
    runSafeGenerator('E1', level, seed, (rng) => {
      if (level === 3) {
        const r = pick([16, 20, 24, 36, 40], rng);
        const rNew = r / 4;
        const built = buildOptionsFromValues(
          `${fmtId(rNew)} Ω`,
          [`${fmtId(r / 2)} Ω`, `${fmtId(r)} Ω`, `${fmtId(r * 2)} Ω`, `${fmtId(r / 8)} Ω`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Seutas kawat penghantar homogen memiliki hambatan ${r} Ω. Kawat tersebut dipotong menjadi dua bagian sama panjang lalu kedua potongannya disusun secara paralel. Berapa hambatan pengganti susunan paralel tersebut?`,
          ...built,
          petunjuk: [],
          langkah: [
            `1. Ketika dipotong dua sama panjang, hambatan tiap potongan menjadi ${r}/2 = ${fmtId(r / 2)} Ω.`,
            `2. Dua hambatan ${fmtId(r / 2)} Ω disusun paralel: R_total = ${fmtId(r / 2)} / 2 = ${fmtId(rNew)} Ω.`,
          ],
          kesalahanUmum: 'Lupa membagi dua dulu saat kawat dipotong atau menjumlahkan secara seri.',
        };
      }
      const n = pick([2, 3, 4], rng);
      const rEach = pick([12, 24, 30, 40, 60], rng);
      const isParallel = level === 1 ? true : pick([true, false], rng);
      const rTotal = isParallel ? rEach / n : rEach * n;
      const V = isParallel ? rTotal * pick([2, 2.5, 3], rng) : pick([24, 36, 48], rng);
      const I = Number((V / rTotal).toFixed(2));
      const wrongR = isParallel ? rEach * n : rEach / n;
      const wrongI = Number((V / wrongR).toFixed(2));
      const built = buildOptionsFromValues(
        `${fmtId(I)} A`,
        [
          `${fmtId(wrongI)} A`,
          `${fmtId(V / rEach)} A`,
          `${fmtId(rTotal)} A`,
          `${fmtId(I * 2)} A`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebanyak ${n} buah hambatan identik masing-masing bernilai ${rEach} Ω dirangkai secara ${isParallel ? 'paralel' : 'seri'} dan dihubungkan ke sumber tegangan ${fmtId(V)} V. Berapa kuat arus listrik total rangkaian?`,
        ...built,
        petunjuk: buildHintsForLevel(level, [`Hitung R_total untuk susunan ${isParallel ? 'paralel (R/n)' : 'seri (n·R)'}, lalu I = V / R_total.`]),
        langkah: [
          `1. Hambatan pengganti ${isParallel ? `paralel: R_p = ${rEach}/${n}` : `seri: R_s = ${n} × ${rEach}`} = ${fmtId(rTotal)} Ω.`,
          `2. Kuat arus total: I = V / R_total = ${fmtId(V)} / ${fmtId(rTotal)} = ${fmtId(I)} A.`,
        ],
        kesalahanUmum: 'Menukar rumus hambatan seri dengan rumus hambatan paralel.',
      };
    }),

  E2: (level, seed) =>
    runSafeGenerator('E2', level, seed, (rng) => {
      const shrink = level === 2 ? false : true;
      const distRatio = pick([2, 3], rng);
      const f1 = shrink ? pick([2, 3, 4, 5], rng) : distRatio * distRatio * pick([1, 2, 3], rng);
      const qMult = pick([2, 3, 4], rng);
      const distFactor = shrink ? distRatio * distRatio : 1 / (distRatio * distRatio);
      const f2 = Number((f1 * qMult * distFactor).toFixed(2));
      const wrongLinear = Number((f1 * qMult * (shrink ? distRatio : 1 / distRatio)).toFixed(2));
      const built = buildOptionsFromValues(
        `${fmtId(f2)} N`,
        [
          `${fmtId(wrongLinear)} N`,
          `${fmtId(f1 * qMult)} N`,
          `${fmtId(f2 * 2)} N`,
          `${fmtId(f2 + 3)} N`,
          `${fmtId(f1)} N`,
          `${fmtId(f2 + 7)} N`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: shrink
          ? `Dua muatan listrik saling menolak dengan gaya ${f1} N. Jika hasil kali besar kedua muatan dijadikan ${qMult} kali semula dan jarak keduanya diperkecil menjadi 1/${distRatio} kali jarak semula, berapa gaya tolak barunya?`
          : `Dua muatan listrik mengalami gaya tarik ${f1} N. Jika salah satu muatan dijadikan ${qMult} kali semula dan jarak keduanya dijauhkan menjadi ${distRatio} kali jarak semula, berapa gaya tarik barunya?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gaya Coulomb berbanding terbalik dengan kuadrat jarak: F ∝ q₁q₂/r².']),
        langkah: [
          `1. Faktor muatan = ${qMult} kali.`,
          shrink
            ? `2. Jarak menjadi 1/${distRatio} kali → faktor jarak = (${distRatio})² = ${distRatio * distRatio} kali.`
            : `2. Jarak menjadi ${distRatio} kali → faktor jarak = 1/(${distRatio})² = 1/${distRatio * distRatio} kali.`,
          `3. Gaya baru F₂ = ${f1} × ${qMult} × ${shrink ? distRatio * distRatio : `1/${distRatio * distRatio}`} = ${fmtId(f2)} N.`,
        ],
        kesalahanUmum: 'Menganggap perubahan jarak memengaruhi gaya secara linear tanpa dikuadratkan.',
      };
    }),

  E3: (level, seed) =>
    runSafeGenerator('E3', level, seed, (rng) => {
      if (level === 2 || level === 3) {
        const kasus = pick(
          [
            {
              arahArus: 'ke atas (vertikal)',
              tanya: 'dilihat dari atas',
              ans: 'Berlawanan arah jarum jam',
              d: ['Searah jarum jam', 'Menuju ke arah kawat', 'Sejajar dengan arah arus ke atas', 'Keluar menjauhi kawat secara lurus'],
            },
            {
              arahArus: 'ke bawah (vertikal)',
              tanya: 'dilihat dari atas',
              ans: 'Searah jarum jam',
              d: ['Berlawanan arah jarum jam', 'Menuju ke arah kawat', 'Sejajar dengan arah arus ke bawah', 'Mendatar dari kiri ke kanan saja'],
            },
          ],
          rng
        );
        const built = buildOptionsFromValues(kasus.ans, kasus.d, rng);
        if (!built) return null;
        return {
          pertanyaan: `Seutas kawat lurus vertikal dialiri arus listrik searah ${kasus.arahArus}. Menggunakan kaidah tangan kanan, bagaimana arah garis medan magnet di sekeliling kawat jika ${kasus.tanya}?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Ibu jari tangan kanan = arah arus I, lipatan 4 jari = arah medan B.']),
          langkah: [
            `1. Arahkan ibu jari tangan kanan ${kasus.arahArus}.`,
            `2. Lipatan keempat jari tangan kanan menunjukkan arah melingkar ${kasus.ans.toLowerCase()} ketika ${kasus.tanya}.`,
          ],
          kesalahanUmum: 'Memakai tangan kiri atau mengira garis medan tidak melingkar.',
        };
      }
      const built = buildOptionsFromValues(
        'Memperbanyak lilitan, memperbesar arus, dan memberi inti besi lunak',
        [
          'Mengurangi lilitan dan mengganti inti besi dengan plastik',
          'Memperkecil arus listrik dan memperpanjang kabel sumber',
          'Menggunakan inti kayu kering agar tidak panas',
          'Memutus sebagian lilitan agar hambatan berkurang',
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: 'Cara manakah yang paling tepat untuk memperkuat medan magnet sebuah elektromagnet?',
        ...built,
        petunjuk: buildHintsForLevel(level, ['Ingat 3 faktor penguat elektromagnet: lilitan, arus, dan inti besi.']),
        langkah: [
          '1. Medan magnet kumparan sebanding dengan kuat arus dan jumlah lilitan.',
          '2. Penambahan inti besi lunak memusatkan garis gaya magnet sehingga makin kuat.',
        ],
        kesalahanUmum: 'Mengira bahan non-feromagnetik seperti kayu/plastik memperkuat magnet.',
      };
    }),

  E4: (level, seed) =>
    runSafeGenerator('E4', level, seed, (rng) => {
      if (level === 1) {
        const fOrig = pick([8, 10, 12, 16, 20], rng);
        const exp = pick([-4, -3], rng);
        const fNew = fOrig / 2;
        const built = buildOptionsFromValues(
          `${fNew} × 10^(${exp}) N`,
          [
            `${fOrig} × 10^(${exp}) N`,
            `${fOrig * 2} × 10^(${exp}) N`,
            `${fNew} × 10^(${exp - 1}) N`,
            `${fNew} × 10^(${exp + 1}) N`,
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Kawat lurus berarus dalam medan magnet homogen mengalami gaya Lorentz sebesar ${fOrig} × 10^(${exp}) N. Jika panjang kawat di dalam medan magnet dipotong menjadi setengahnya (B dan I tetap), berapa gaya Lorentz sekarang?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['F = B · I · L sehingga F sebanding langsung dengan panjang kawat L.']),
          langkah: [
            '1. Pada rumus F = B · I · L, jika B dan I tetap maka F ∝ L.',
            `2. Karena L menjadi setengahnya, F = ½ × ${fOrig} × 10^(${exp}) = ${fNew} × 10^(${exp}) N.`,
          ],
          kesalahanUmum: 'Salah menulis pangkat 10⁻⁴ atau 10⁻³.',
        };
      }
      const B = pick([0.2, 0.4, 0.5, 0.8], rng);
      const I = pick([2, 3, 5], rng);
      const Lcm = level === 3 ? pick([25, 50, 80], rng) : pick([100, 200], rng);
      const Lm = Lcm / 100;
      const F = Number((B * I * Lm).toFixed(2));
      const built = buildOptionsFromValues(
        `${fmtId(F)} N`,
        [
          `${fmtId(B * I * Lcm)} N`,
          `${fmtId(F * 10)} N`,
          `${fmtId(F / 10)} N`,
          `${fmtId(F + 1)} N`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Kawat sepanjang ${Lcm} cm dialiri arus ${I} A berada tegak lurus dalam medan magnet homogen ${fmtId(B)} T. Berapa besar gaya Lorentz yang dialami kawat?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Ubah panjang kawat cm ke meter terlebih dahulu, lalu F = B·I·L.']),
        langkah: [
          `1. Konversi L = ${Lcm} cm = ${fmtId(Lm)} m.`,
          `2. F = B · I · L = ${fmtId(B)} × ${I} × ${fmtId(Lm)} = ${fmtId(F)} N.`,
        ],
        kesalahanUmum: 'Lupa mengubah panjang kawat dari cm ke meter.',
      };
    }),

  E5: (level, seed) =>
    runSafeGenerator('E5', level, seed, (rng) => {
      const ratios = [
        { ns: 5, np: 3, mult: 25 }, // 75 -> 125
        { ns: 3, np: 2, mult: 50 }, // 100 -> 150
        { ns: 4, np: 1, mult: 50 }, // 50 -> 200
        { ns: 1, np: 4, mult: 55 }, // 220 -> 55
        { ns: 2, np: 5, mult: 40 }, // 160 -> 80
      ];
      const r = pick(ratios, rng);
      const vp = r.np * r.mult;
      const vs = r.ns * r.mult;
      const jenis = vs > vp ? 'step-up' : 'step-down';
      const ans = `${r.ns} : ${r.np} (${jenis})`;
      const wrongFlip = `${r.np} : ${r.ns} (${jenis})`;
      const wrongType = `${r.ns} : ${r.np} (${vs > vp ? 'step-down' : 'step-up'})`;
      const built = buildOptionsFromValues(
        ans,
        [
          wrongFlip,
          wrongType,
          `${r.ns + 1} : ${r.np} (${jenis})`,
          `${r.np} : ${r.ns + 1} (${jenis})`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebuah transformator ideal memiliki tegangan primer ${vp} V dan menghasilkan tegangan sekunder ${vs} V. Berapa perbandingan lilitan sekunder terhadap primer (N_s : N_p) serta jenis trafonya?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gunakan N_s : N_p = V_s : V_p.', 'Tegangan naik = step-up, tegangan turun = step-down.']),
        langkah: [
          `1. Karena V_s (${vs} V) ${vs > vp ? '>' : '<'} V_p (${vp} V), trafo ini jenis ${jenis}.`,
          `2. N_s : N_p = V_s : V_p = ${vs} : ${vp} = ${r.ns} : ${r.np}.`,
        ],
        kesalahanUmum: 'Membalik urutan perbandingan menjadi N_p : N_s.',
      };
    }),

  E6: (level, seed) =>
    runSafeGenerator('E6', level, seed, (rng) => {
      // Choose L (mH) and C (pF) so L*C is a clean power of 10^-12
      const combos = [
        { lMh: 25, cPf: 40, sqrtLC_us: 1 },   // 25e-3 * 40e-12 = 1e-12 -> sqrt = 1 us -> lam = 1884 m
        { lMh: 10, cPf: 10, sqrtLC_us: 0.316 }, // skip non-exact
        { lMh: 25, cPf: 160, sqrtLC_us: 2 },  // 4e-12 -> sqrt = 2 us -> lam = 3768 m
        { lMh: 10, cPf: 90, sqrtLC_us: 0.948 }, // skip
        { lMh: 40, cPf: 100, sqrtLC_us: 2 },  // 4e-12 -> 2 us
        { lMh: 90, cPf: 100, sqrtLC_us: 3 },  // 9e-12 -> 3 us -> lam = 5652 m
        { lMh: 16, cPf: 25, sqrtLC_us: 0.63 }, // skip
      ].filter((x) => Number.isInteger(x.sqrtLC_us));
      const c = pick(combos, rng);
      const lam = Math.round(2 * 3.14 * 300 * c.sqrtLC_us);
      const built = buildOptionsFromValues(
        `${fmtId(lam)} m`,
        [
          `${fmtId(lam * 1000)} m`,
          `${fmtId(lam / 10)} m`,
          `${fmtId(Math.round(lam / 2))} m`,
          `${fmtId(lam * 2)} m`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebuah rangkaian pemancar radio LC memakai induktor L = ${c.lMh} mH dan kapasitor C = ${c.cPf} pF (π = 3,14; c = 3 × 10⁸ m/s). Berapa panjang gelombang radio yang dipancarkan?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['1 mH = 10⁻³ H dan 1 pF = 10⁻¹² F.', 'Gunakan λ = 2π·c·√(LC).']),
        langkah: [
          `1. Konversi SI: L = ${c.lMh} × 10⁻³ H dan C = ${c.cPf} × 10⁻¹² F.`,
          `2. √(LC) = ${c.sqrtLC_us} × 10⁻⁶ s.`,
          `3. λ = 2 × 3,14 × (3 × 10⁸) × (${c.sqrtLC_us} × 10⁻⁶) = ${fmtId(lam)} m.`,
        ],
        kesalahanUmum: 'Salah mengonversi awalan piko (10⁻¹²) dengan mikro (10⁻⁶).',
        catatanKhusus: 'Materi tantangan di atas level SMP. Lihat catatan Soal 12 di Bagian 7.',
      };
    }),

  F1: (level, seed) =>
    runSafeGenerator('F1', level, seed, (rng) => {
      if (level === 2) {
        const lb = pick([50, 80, 100], rng);
        const lk = pick([150, 200, 250], rng);
        const F = pick([120, 160, 200, 240], rng);
        const W = (F * lk) / lb;
        if (!Number.isInteger(W)) return null;
        const built = buildOptionsFromValues(
          `${fmtId(W)} N`,
          [
            `${fmtId((F * lb) / lk)} N`,
            `${fmtId(F + lk)} N`,
            `${fmtId(W / 2)} N`,
            `${fmtId(W * 2)} N`,
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah pengungkit memiliki lengan beban ${lb} cm dan lengan kuasa ${lk} cm. Jika gaya kuasa yang diberikan sebesar ${F} N, berapa berat beban maksimal yang dapat diangkat?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Gunakan W · l_b = F · l_k (satuan cm di kedua sisi langsung saling coret).']),
          langkah: [
            `1. W · ${lb} = ${F} · ${lk}.`,
            `2. W = (${F} × ${lk}) / ${lb} = ${fmtId(W)} N.`,
          ],
          kesalahanUmum: 'Menukar posisi lengan beban dan lengan kuasa.',
        };
      }
      const F = pick([40, 50, 60, 80], rng);
      const lk = pick([3, 4, 5, 6], rng);
      const lb = pick([0.8, 1.2, 1.5, 2], rng);
      const W = Math.round((F * lk) / lb);
      if (Math.abs((W * lb) - (F * lk)) > 1e-6) return null;
      const built = buildOptionsFromValues(
        `${fmtId(lb)} m`,
        [
          `${fmtId((W * lk) / F)} m`,
          `${fmtId(lk - lb)} m`,
          `${fmtId(lb * 2)} m`,
          `${fmtId(lb / 2)} m`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Beban seberat ${W} N diangkat menggunakan tuas dengan gaya kuasa ${F} N dan panjang lengan kuasa ${lk} m. Berapa panjang lengan bebannya?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['W · l_b = F · l_k → l_b = (F · l_k) / W.']),
        langkah: [
          `1. ${W} · l_b = ${F} · ${lk} = ${F * lk}.`,
          `2. l_b = ${F * lk} / ${W} = ${fmtId(lb)} m.`,
        ],
        kesalahanUmum: 'Menukar lengan beban dan lengan kuasa.',
      };
    }),

  F2: (level, seed) =>
    runSafeGenerator('F2', level, seed, (rng) => {
      if (level === 1) {
        const tali = pick([2, 3, 4, 5], rng);
        const F = pick([150, 200, 250, 300], rng);
        const W = tali * F;
        const built = buildOptionsFromValues(
          `${fmtId(F)} N`,
          [`${fmtId(W)} N`, `${fmtId(W / (tali + 1))} N`, `${fmtId(F * 2)} N`, `${fmtId(W - tali * 50)} N`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah sistem katrol (takal) menopang beban ${W} N dengan ${tali} penggal tali penopang beban. Berapa gaya tarik minimal yang diperlukan?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['KM katrol = jumlah tali penopang beban, maka F = W / KM.']),
          langkah: [
            `1. Jumlah tali penopang = ${tali} → KM = ${tali}.`,
            `2. F = ${W} / ${tali} = ${fmtId(F)} N.`,
          ],
          kesalahanUmum: 'Salah menghitung tali penopang atau menyamakan gaya dengan beban.',
        };
      }
      const kmTuas = pick([3, 4, 5], rng);
      const lb = pick([0.3, 0.4, 0.5], rng);
      const lk = Number((lb * kmTuas).toFixed(2));
      const F = pick([150, 200, 225, 250], rng);
      const W = F * kmTuas;
      const s = pick([1.2, 1.5, 2], rng);
      const usaha = Number((F * s).toFixed(1));
      const built = buildOptionsFromValues(
        `${fmtId(F)} N dan ${fmtId(usaha)} J`,
        [
          `${fmtId(W)} N dan ${fmtId(W * s)} J`,
          `${fmtId(F)} N dan ${fmtId(usaha * 2)} J`,
          `${fmtId(F * 2)} N dan ${fmtId(usaha)} J`,
          `${fmtId(F / 2)} N dan ${fmtId(usaha / 2)} J`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Beban ${W} N diangkat menggunakan tuas (l_b = ${fmtId(lb)} m, l_k = ${fmtId(lk)} m) yang ujung kuasanya ditarik melalui katrol tetap sejauh ${fmtId(s)} m. Berapa gaya kuasa dan usaha yang dilakukan?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Kerjakan tuas dulu (F = W·l_b/l_k), katrol tetap KM=1, lalu Usaha = F·s.']),
        langkah: [
          `1. KM tuas = ${fmtId(lk)}/${fmtId(lb)} = ${kmTuas}, sehingga F = ${W}/${kmTuas} = ${fmtId(F)} N (katrol tetap tidak mengubah besar F).`,
          `2. Usaha = F · s = ${fmtId(F)} × ${fmtId(s)} = ${fmtId(usaha)} J.`,
        ],
        kesalahanUmum: 'Mengalikan gaya dengan keuntungan mekanis saat menghitung usaha.',
      };
    }),

  F3: (level, seed) =>
    runSafeGenerator('F3', level, seed, (rng) => {
      const h = pick([3, 4, 6, 8], rng);
      const s = h + pick([2, 4, 6], rng);
      const Funit = pick([200, 400, 500], rng);
      const W = s * Funit;
      const F = h * Funit;
      const built = buildOptionsFromValues(
        `${fmtId(F)} N`,
        [
          `${fmtId((W * s) / h)} N`,
          `${fmtId(W)} N`,
          `${fmtId(F / 2)} N`,
          `${fmtId(F + 500)} N`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan:
          level === 3
            ? `Sebuah peti seberat ${fmtId(W)} N dinaikkan ke atas panggung setinggi ${h} m menggunakan papan bidang miring licin sepanjang ${s} m (lebar papan 1,2 m). Berapa gaya dorong sejajar bidang miring yang dibutuhkan?`
            : `Beban seberat ${fmtId(W)} N didorong ke atas bidang miring licin sepanjang ${s} m hingga mencapai ketinggian ${h} m. Berapa gaya dorong yang diperlukan?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gunakan F = W · (h / s).']),
        langkah: [
          `1. Pastikan h = ${h} m dan panjang miring s = ${s} m.`,
          `2. F = ${fmtId(W)} × (${h} / ${s}) = ${fmtId(F)} N.`,
        ],
        kesalahanUmum: 'Membalik pecahan menjadi s/h sehingga gaya dorong lebih besar daripada berat beban.',
      };
    }),

  F4: (level, seed) =>
    runSafeGenerator('F4', level, seed, (rng) => {
      const z1 = pick([12, 15, 20, 24], rng);
      const z2 = pick([30, 36, 40, 48], rng);
      if (z1 === z2) return null;
      const k = pick([2, 3, 4, 5], rng);
      const n2 = z1 * k;
      const n1 = z2 * k;
      const built = buildOptionsFromValues(
        `${n2} putaran/menit berlawanan arah`,
        [
          `${n2} putaran/menit searah`,
          `${Math.round((n1 * z2) / z1)} putaran/menit berlawanan arah`,
          `${n1} putaran/menit berlawanan arah`,
          `${n2 + 10} putaran/menit searah`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Roda gigi A memiliki ${z1} gigi dan berputar ${n1} putaran/menit searah jarum jam. Roda A bersinggungan langsung dengan roda gigi B yang memiliki ${z2} gigi. Berapa kecepatan dan arah putar roda B?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Gunakan n₁ · z₁ = n₂ · z₂, dan dua roda bersinggungan selalu berlawanan arah.']),
        langkah: [
          `1. n_B = (n_A × z_A) / z_B = (${n1} × ${z1}) / ${z2} = ${n2} putaran/menit.`,
          '2. Karena bersinggungan langsung, arah roda B berlawanan arah jarum jam.',
        ],
        kesalahanUmum: 'Mengira roda bergigi lebih banyak berputar lebih cepat atau arahnya searah.',
      };
    }),

  G1: (level, seed) =>
    runSafeGenerator('G1', level, seed, (rng) => {
      const isPurnama = pick([true, false], rng);
      const ans = isPurnama
        ? 'Pasang purnama karena gaya tarik Bulan dan Matahari segaris dan saling menambah'
        : 'Pasang perbani karena posisi Matahari–Bumi–Bulan siku-siku dan tarikannya saling mengurangi';
      const built = buildOptionsFromValues(
        ans,
        [
          isPurnama
            ? 'Pasang perbani karena tarikan Bulan dan Matahari saling mengurangi'
            : 'Pasang purnama karena tarikan Bulan dan Matahari saling menambah',
          'Air laut menjadi tenang sempurna tanpa pasang maupun surut',
          'Terjadi gerhana cincin akibat bayangan atmosfer laut',
          'Gelombang pasang hanya dipengaruhi oleh tiupan angin muson',
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: isPurnama
          ? 'Perhatikan konfigurasi Matahari, Bumi, dan Bulan yang terletak segaris pada fase bulan baru atau purnama. Fenomena pasang surut apakah yang terjadi?'
          : 'Ketika Bulan berada pada fase kuartal (posisi Matahari–Bumi–Bulan membentuk sudut 90°), fenomena pasang surut apakah yang terjadi?',
        diagram: {
          jenis: 'pasang_surut',
          judul: isPurnama ? 'Posisi Segaris (0° / 180°)' : 'Posisi Siku-Siku (90°)',
          fasePasang: isPurnama ? 'purnama' : 'perbani',
        },
        ...built,
        petunjuk: buildHintsForLevel(level, ['Segaris = gaya saling menambah (purnama); siku-siku = saling mengurangi (perbani).']),
        langkah: [
          isPurnama
            ? '1. Matahari, Bumi, dan Bulan terletak satu garis lurus.'
            : '1. Garis Matahari–Bumi tegak lurus (90°) terhadap garis Bumi–Bulan.',
          `2. Kesimpulan: ${ans}.`,
        ],
        kesalahanUmum: 'Menukar posisi pasang purnama (segaris) dan pasang perbani (siku-siku).',
      };
    }),

  G2: (level, seed) =>
    runSafeGenerator('G2', level, seed, (rng) => {
      const lon1 = pick([90, 105, 110, 120], rng);
      const diffDeg = level === 3 ? pick([30, 45, 60], rng) : pick([12, 15, 18, 24], rng);
      const lon2 = lon1 + diffDeg;
      const diffMin = diffDeg * 4;
      const startHour = level === 3 ? pick([22, 23], rng) : pick([7, 8, 9, 10], rng);
      const startMin = pick([10, 12, 20], rng);
      const totalMin = startHour * 60 + startMin + diffMin;
      const nextDay = totalMin >= 24 * 60;
      const normMin = totalMin % (24 * 60);
      const endH = Math.floor(normMin / 60);
      const endM = normMin % 60;
      const pad = (x: number) => String(x).padStart(2, '0');
      const ans = `${pad(endH)}.${pad(endM)}${nextDay ? ' (hari berikutnya)' : ''}`;
      const backMin = ((startHour * 60 + startMin - diffMin) + 24 * 60) % (24 * 60);
      const wrongBack = `${pad(Math.floor(backMin / 60))}.${pad(backMin % 60)}`;
      const built = buildOptionsFromValues(
        ans,
        [
          wrongBack,
          `${pad((startHour + Math.floor(diffDeg / 15)) % 24)}.${pad(startMin)}`,
          `${pad(endH)}.${pad((endM + 15) % 60)}${nextDay ? ' (hari berikutnya)' : ''}`,
          `${pad((endH + 1) % 24)}.${pad(endM)}`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Jika di kota P (${lon1}°BT) menunjukkan pukul ${pad(startHour)}.${pad(startMin)}, pukul berapakah di kota Q yang terletak pada ${lon2}°BT?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Setiap 1° bujur berselisih 4 menit; wilayah lebih timur waktunya lebih awal.']),
        langkah: [
          `1. Selisih bujur Δλ = ${lon2}° − ${lon1}° = ${diffDeg}°.`,
          `2. Selisih waktu = ${diffDeg} × 4 menit = ${diffMin} menit (${Math.floor(diffMin / 60)} jam ${diffMin % 60} menit).`,
          `3. Karena ${lon2}°BT di sebelah timur, tambahkan ke ${pad(startHour)}.${pad(startMin)} → ${ans}.`,
        ],
        kesalahanUmum: 'Mengurangi waktu saat ke arah timur atau lupa mengganti hari saat melewati pukul 24.00.',
      };
    }),

  G3: (level, seed) =>
    runSafeGenerator('G3', level, seed, (rng) => {
      const items = [
        { q: 'Batuan kecil luar angkasa yang masih melayang di ruang hampa sebelum memasuki atmosfer Bumi disebut...', ans: 'Meteoroid', d: ['Meteor', 'Meteorit', 'Komet', 'Satelit alami'] },
        { q: 'Fenomena kilatan cahaya ("bintang jatuh") akibat batuan luar angkasa bergesekan dan terbakar di atmosfer Bumi disebut...', ans: 'Meteor', d: ['Meteoroid', 'Meteorit', 'Asteroid', 'Komet'] },
        { q: 'Sisa batuan luar angkasa yang tidak habis terbakar di atmosfer hingga berhasil menyentuh permukaan tanah disebut...', ans: 'Meteorit', d: ['Meteor', 'Meteoroid', 'Komet', 'Planet kerdil'] },
        { q: 'Benda langit kecil tersusun atas es, debu, dan gas beku yang membentuk ekor selalu menjauhi Matahari saat mendekatinya disebut...', ans: 'Komet', d: ['Asteroid', 'Meteoroid', 'Meteorit', 'Bulan'] },
        { q: 'Benda langit berbatu dan logam yang banyak mengorbit di sabuk antara planet Mars dan Jupiter disebut...', ans: 'Asteroid', d: ['Komet', 'Meteor', 'Meteorit', 'Nebula'] },
      ];
      const item = pick(items, rng);
      const built = buildOptionsFromValues(item.ans, item.d, rng);
      if (!built) return null;
      return {
        pertanyaan: item.q,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Bedakan lokasi: meteoroid (angkasa), meteor (atmosfer), meteorit (tanah).']),
        langkah: [
          `1. Perhatikan ciri utama pada soal: "${item.q}"`,
          `2. Istilah yang tepat adalah ${item.ans}.`,
        ],
        kesalahanUmum: 'Tertukar antara meteoroid, meteor, dan meteorit.',
      };
    }),

  G4: (level, seed) =>
    runSafeGenerator('G4', level, seed, (rng) => {
      if (level === 3) {
        const built = buildOptionsFromValues(
          '≈ 2 × 10³⁰ kg',
          ['≈ 2 × 10²⁴ kg', '≈ 6 × 10²⁴ kg', '≈ 2 × 10³³ kg', '≈ 2 × 10²⁰ kg'],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: 'Dengan menggunakan jari-jari orbit Bumi mengelilingi Matahari r ≈ 1,5 × 10¹¹ m, periode T ≈ 3,15 × 10⁷ s, dan G ≈ 6,67 × 10⁻¹¹ N·m²/kg² pada rumus M = 4π²r³/(G·T²), berapakah perkiraan massa Matahari?',
          ...built,
          petunjuk: [],
          langkah: [
            '1. Hitung pembilang: 4 × (3,14)² × (1,5 × 10¹¹)³ ≈ 39,48 × 3,375 × 10³³ ≈ 1,33 × 10³⁵.',
            '2. Hitung penyebut: 6,67 × 10⁻¹¹ × (3,15 × 10⁷)² ≈ 6,67 × 9,92 × 10³ ≈ 6,62 × 10⁴.',
            '3. M ≈ (1,33 × 10³⁵) / (6,62 × 10⁴) ≈ 2 × 10³⁰ kg.',
          ],
          kesalahanUmum: 'Lupa memangkatkan tiga nilai r atau memangkatkan dua nilai T.',
          catatanKhusus: 'Soal olimpiade lanjutan (di atas level SMP).',
        };
      }
      if (level === 2) {
        const built = buildOptionsFromValues(
          'Gravitasi Bulan (±1/6 Bumi) terlalu lemah untuk menahan molekul gas agar tidak lepas ke antariksa',
          [
            'Bulan tidak memiliki lautan sehingga tidak terbentuk awan sama sekali',
            'Suhu permukaan Bulan terlalu dingin sehingga seluruh gas membeku menjadi batu',
            'Bulan tidak berotasi pada porosnya sehingga udara tidak berputar',
            'Jarak Bulan terlalu dekat dengan Matahari sehingga atmosfernya habis terbakar',
          ],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: 'Mengapa Bulan hampir tidak memiliki selimut atmosfer seperti Bumi?',
          ...built,
          petunjuk: buildHintsForLevel(level, ['Kaitkan dengan kecilnya percepatan gravitasi Bulan (±1/6 Bumi).']),
          langkah: [
            '1. Massa Bulan jauh lebih kecil sehingga gravitasinya hanya sekitar 1/6 gravitasi Bumi.',
            '2. Gaya tarik gravitasi yang lemah tidak mampu menahan molekul-molekul gas ringan sehingga lepas ke ruang angkasa.',
          ],
          kesalahanUmum: 'Mengira tidak adanya atmosfer disebabkan tidak adanya air atau rotasi.',
        };
      }
      const m = pick([6, 12, 18, 24, 30], rng);
      const wBulan = (m * 10) / 6;
      const built = buildOptionsFromValues(
        `Massa ${m} kg, berat ${fmtId(wBulan)} N`,
        [
          `Massa ${m / 6} kg, berat ${fmtId(wBulan)} N`,
          `Massa ${m} kg, berat ${m * 10} N`,
          `Massa ${m / 6} kg, berat ${m * 10} N`,
          `Massa ${m * 6} kg, berat ${fmtId(wBulan)} N`,
        ],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Sebuah peralatan sains bermassa ${m} kg di Bumi (g = 10 m/s²) dibawa ke Bulan (g_Bulan = 1/6 g_Bumi). Berapakah massa dan berat peralatan tersebut di Bulan?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Massa tetap sama, berat = m · g_Bulan.']),
        langkah: [
          `1. Massa benda selalu tetap di mana pun berada, yaitu ${m} kg.`,
          `2. Berat di Bulan = ${m} × (10 / 6) = ${fmtId(wBulan)} N.`,
        ],
        kesalahanUmum: 'Ikut membagi 6 nilai massa benda.',
      };
    }),

  H1: (level, seed) =>
    runSafeGenerator('H1', level, seed, (rng) => {
      if (level === 1) {
        const M = pick([4, 5, 6], rng);
        const fob = M * pick([10, 12, 15], rng);
        const fok = fob / M;
        const dBintang = fob + fok;
        const built = buildOptionsFromValues(
          `${dBintang} cm`,
          [`${fob - fok} cm`, `${fob + 4 * fok} cm`, `${fob} cm`, `${dBintang + 10} cm`],
          rng
        );
        if (!built) return null;
        return {
          pertanyaan: `Sebuah teropong bintang digunakan dengan mata tak berakomodasi memiliki lensa objektif dengan jarak fokus ${fob} cm dan menghasilkan perbesaran ${M} kali. Berapa panjang teropong bintang tersebut?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Cari f_ok = f_ob / M, lalu panjang teropong bintang d = f_ob + f_ok.']),
          langkah: [
            `1. f_ok = f_ob / M = ${fob} / ${M} = ${fok} cm.`,
            `2. Panjang teropong bintang d = ${fob} + ${fok} = ${dBintang} cm.`,
          ],
          kesalahanUmum: 'Menambahkan 4f_p pada teropong bintang (4f_p hanya untuk teropong bumi).',
        };
      }
      const M = pick([4, 5], rng);
      const fp = pick([5, 10], rng);
      const fok1 = pick([10, 12], rng);
      const fok2 = fok1 + 5;
      const fob1 = M * fok1;
      const fob2 = M * fok2;
      const d1 = fob1 + 4 * fp + fok1;
      const d2 = fob2 + 4 * fp + fok2;
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const g = gcd(d1, d2);
      const ans = `${d1 / g} : ${d2 / g}`;
      const wrongNo4 = `${fob1 + fp + fok1} : ${fob2 + fp + fok2}`;
      const built = buildOptionsFromValues(
        ans,
        [`${d2 / g} : ${d1 / g}`, wrongNo4, `${fob1} : ${fob2}`, `${d1 / g + 1} : ${d2 / g}`],
        rng
      );
      if (!built) return null;
      return {
        pertanyaan: `Dua teropong bumi A dan B sama-sama bekerja pada perbesaran ${M} kali (mata tak berakomodasi) dan memakai lensa pembalik berjarak fokus ${fp} cm. Jika f_ob(A) = ${fob1} cm dan f_ob(B) = ${fob2} cm, berapa perbandingan panjang teropong A dan B (d_A : d_B)?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Teropong bumi: d = f_ob + 4f_p + f_ok.']),
        langkah: [
          `1. f_ok(A) = ${fob1}/${M} = ${fok1} cm, f_ok(B) = ${fob2}/${M} = ${fok2} cm.`,
          `2. d_A = ${fob1} + 4(${fp}) + ${fok1} = ${d1} cm; d_B = ${fob2} + 4(${fp}) + ${fok2} = ${d2} cm.`,
          `3. Perbandingan d_A : d_B = ${d1} : ${d2} = ${ans}.`,
        ],
        kesalahanUmum: 'Lupa mengalikan 4 pada f_p di rumus teropong bumi.',
      };
    }),

  I1: (level, seed) =>
    runSafeGenerator('I1', level, seed, (rng) => {
      if (level === 2) {
        // Tambah/kurang: desimal paling sedikit
        const sets = [
          { a: '12,45', b: '3,2', sumRaw: '15,65', ans: '15,6', decMin: 1, d: ['15,65', '15,70', '16', '15,650'] },
          { a: '24,18', b: '1,4', sumRaw: '25,58', ans: '25,6', decMin: 1, d: ['25,58', '26', '25,5', '25,580'] },
          { a: '8,325', b: '2,12', sumRaw: '10,445', ans: '10,44', decMin: 2, d: ['10,445', '10,4', '10', '10,450'] },
        ];
        const s = pick(sets, rng);
        const built = buildOptionsFromValues(`${s.ans} cm`, s.d.map((x) => `${x} cm`), rng);
        if (!built) return null;
        return {
          pertanyaan: `Hasil pengukuran dua pita berturut-turut ${s.a} cm dan ${s.b} cm. Jika keduanya dijumlahkan menurut aturan angka penting, berapa hasilnya?`,
          ...built,
          petunjuk: buildHintsForLevel(level, ['Untuk penjumlahan/pengurangan, perhatikan jumlah angka di belakang koma paling sedikit.']),
          langkah: [
            `1. Jumlahkan biasa: ${s.a} + ${s.b} = ${s.sumRaw} cm.`,
            `2. Jumlah desimal paling sedikit adalah ${s.decMin} angka di belakang koma, sehingga dibulatkan menjadi ${s.ans} cm.`,
          ],
          kesalahanUmum: 'Memakai aturan jumlah angka penting (aturan perkalian) pada soal penjumlahan.',
        };
      }
      // Perkalian tidak ambigu: 3 AP x 2 AP -> 2 AP
      const sets = [
        { p: '12,5', l: '3,2', raw: '40,00', ans: '40', ap: 2, d: ['40,0', '40,00', '4', '40,2'] },
        { p: '14,5', l: '2,2', raw: '31,90', ans: '32', ap: 2, d: ['31,9', '31,90', '30', '31'] },
        { p: '11,5', l: '2,4', raw: '27,60', ans: '28', ap: 2, d: ['27,6', '27,60', '27', '30'] },
        { p: '15,2', l: '2,5', raw: '38,00', ans: '38', ap: 2, d: ['38,0', '38,00', '40', '38,5'] },
      ];
      const s = pick(sets, rng);
      const built = buildOptionsFromValues(`${s.ans} cm²`, s.d.map((x) => `${x} cm²`), rng);
      if (!built) return null;
      return {
        pertanyaan: `Sebuah pelat persegi panjang diukur memiliki panjang ${s.p} cm (3 angka penting) dan lebar ${s.l} cm (2 angka penting). Berapakah luas pelat tersebut menurut aturan angka penting?`,
        ...built,
        petunjuk: buildHintsForLevel(level, ['Pada perkalian, hasil akhir memiliki jumlah angka penting paling sedikit (2 AP).']),
        langkah: [
          `1. Hitung luas biasa: ${s.p} × ${s.l} = ${s.raw} cm².`,
          `2. Karena faktor tersedikit memiliki ${s.ap} angka penting, bulatkan menjadi ${s.ans} cm² (tepat 2 angka penting).`,
        ],
        kesalahanUmum: 'Menggunakan jumlah desimal paling sedikit (aturan penjumlahan) pada operasi perkalian.',
      };
    }),
};
