import type { BonusVideoRef, SubBabId, VideoRef } from '../types/physics';

/**
 * Status verifikasi: Video dipilih dari hasil pencarian YouTube pada 13 November 2026.
 * Judul dan kanal diambil saat runtime lewat YouTube IFrame API (getVideoData()).
 * Jangan mengarang judul, kanal, atau timestamp.
 */
export const VIDEOS: Record<SubBabId, VideoRef[]> = {
  A1: [
    { id: 'NqtMG00Vxoo', peran: 'utama', level: 'SMP' },
    { id: 'ukMw0kp8TA4', peran: 'utama', level: 'SMP', catatan: 'Fokus grafik GLBB' },
    { id: 'aXIpU79Evlo', peran: 'cadangan', level: 'SMP' },
  ],
  A2: [
    { id: 'f-49x4gX478', peran: 'utama', level: 'SMA', catatan: 'Dua benda berhadapan' },
    { id: '0V_UtoX3X5w', peran: 'cadangan', level: 'SMA' },
    { id: 'phDEe5L55Vw', peran: 'cadangan', level: 'SMA' },
    { id: '8DdVByiWZmw', peran: 'pendukung', level: 'SMA', catatan: 'Berpapasan' },
  ],
  A3: [
    { id: 'ePn9o-t25_M', peran: 'utama', level: 'SMP', catatan: 'Hukum Newton & gesek, Fisika Kelas 8' },
    { id: 'g8zSuIjH3FY', peran: 'cadangan', level: 'SMP', catatan: 'Newton 1-2-3' },
    { id: 'LRXN3CL6Z-8', peran: 'pendukung', level: 'SMA', catatan: 'Balok & gaya gesek' },
    { id: '7LBOPEFKWbI', peran: 'pendukung', level: 'SMP', catatan: 'Energi' },
    { id: 'CDmpeEIJvvQ', peran: 'pendukung', level: 'SMP', catatan: 'Energi' },
  ],
  B1: [
    { id: 'UmTJ_0BNN9M', peran: 'utama', level: 'SMP' },
    { id: '_hPpptHKfb8', peran: 'cadangan', level: 'SMP' },
    { id: '0pOcLG7BGII', peran: 'utama', level: 'SMP', catatan: 'Termometer X dan Y' },
  ],
  B2: [
    { id: 'JZEbUjHXAH8', peran: 'utama', level: 'SMP' },
    { id: 'r8U9KrVfU9w', peran: 'cadangan', level: 'SMP' },
    { id: '9ByblmJ24M4', peran: 'pendukung', level: 'SMP' },
    { id: 'EEc14XzoHug', peran: 'pendukung', level: 'SMP', catatan: 'Bimetal' },
  ],
  B3: [
    { id: 'MLbem0WLTrQ', peran: 'utama', level: 'SMP' },
    { id: '_he_1eEuVMk', peran: 'utama', level: 'SMP', catatan: 'Grafik perubahan wujud' },
    { id: 'tgFDsdV5xyA', peran: 'cadangan', level: 'SMP' },
    { id: '5708VCUtnRk', peran: 'pendukung', level: 'SMA', catatan: 'Es -5°C ke air 100°C' },
  ],
  B4: [
    { id: 'hbRsyhyilvA', peran: 'utama', level: 'SMP' },
    { id: 'aYJaXqdQB_M', peran: 'cadangan', level: 'SMP' },
    { id: 'v1nOfMffc5k', peran: 'pendukung', level: 'SMP' },
  ],
  B5: [
    { id: 'hdTMtuklR48', peran: 'utama', level: 'SMP' },
    { id: 'r-79D7cH_2g', peran: 'cadangan', level: 'SMP' },
  ],
  B6: [],
  C1: [
    { id: '81ARF7bofXA', peran: 'utama', level: 'SMP' },
    { id: '6o6mGjRehAk', peran: 'cadangan', level: 'SMP' },
    { id: '4jVa6rx6XOI', peran: 'pendukung', level: 'SMP', catatan: 'Massa vs berat' },
    { id: 'UM7vwMUVrSA', peran: 'pendukung', level: 'SMP', catatan: 'Berat di Bumi dan Bulan' },
  ],
  C2: [
    { id: 'MCx4x8qGmkc', peran: 'utama', level: 'SMP' },
    { id: '9QR9H5bMUDU', peran: 'cadangan', level: 'SMP' },
    { id: 'gS_Ngu1rKWM', peran: 'cadangan', level: 'SMP' },
    { id: 'TpfMfklVU7k', peran: 'pendukung', level: 'SMA', catatan: 'Pipa U' },
  ],
  C3: [
    { id: 'LY9oKbPpNSo', peran: 'utama', level: 'SMP', catatan: 'Tekanan 8: gas, barometer, manometer' },
    { id: '64gbQRo1K_4', peran: 'cadangan', level: 'SMP', catatan: 'Part 10 Tekanan' },
    { id: 'InWiqovr8Fg', peran: 'pendukung', level: 'SMP' },
  ],
  C4: [
    { id: 'tew3souNdho', peran: 'utama', level: 'SMP' },
    { id: 'wm1ZYvj4tiw', peran: 'cadangan', level: 'SMP' },
    { id: 'YC3FbwVU0-o', peran: 'pendukung', level: 'SMP' },
  ],
  C5: [
    { id: '7iB38ZAvcbI', peran: 'utama', level: 'SMP' },
    { id: 'trGJaXwn-RM', peran: 'cadangan', level: 'SMP' },
    { id: 'e_5PJ_u4pD8', peran: 'pendukung', level: 'SMP' },
    { id: 'Br8S4cs1Rwk', peran: 'pendukung', level: 'SMP' },
    { id: 'ANk_PKsAIjI', peran: 'pendukung', level: 'SMA', catatan: 'Balon udara, untuk soal 11' },
  ],
  D1: [
    { id: 'uTxInQRmhRU', peran: 'utama', level: 'SMP' },
    { id: 'jYehJEGBf78', peran: 'cadangan', level: 'SMP' },
  ],
  D2: [
    { id: 'wWxOZ8endXE', peran: 'utama', level: 'SMA', catatan: 'Pipa organa terbuka/tertutup' },
    { id: '035utNT7D6I', peran: 'cadangan', level: 'SMA' },
    { id: 'We2b9deSapg', peran: 'pendukung', level: 'SMA', catatan: 'Pipa tertutup' },
    { id: 'cRnRyDrO9K8', peran: 'utama', level: 'SMA', catatan: 'Resonansi garpu tala & kolom udara, untuk soal 50' },
    { id: '3eHSXBS1P4g', peran: 'pendukung', level: 'SMP', catatan: 'Soal UNBK garpu tala & tabung' },
    { id: '2HYoU7RlEK8', peran: 'pendukung', level: 'SMP', catatan: 'Panjang kolom udara' },
  ],
  D3: [
    { id: 'jeGJvOH8ivc', peran: 'utama', level: 'SMP' },
    { id: 'GIZSsDpTfIs', peran: 'cadangan', level: 'SMP' },
    { id: 'l3U502RTOvM', peran: 'pendukung', level: 'SMP' },
  ],
  E1: [
    { id: 'uoyzzJ7DfhA', peran: 'utama', level: 'SMP' },
    { id: 'GBQEcXIXePI', peran: 'cadangan', level: 'SMP' },
    { id: 'cCH0SAK-_to', peran: 'pendukung', level: 'SMP' },
    { id: 'ULtIeprLEJs', peran: 'utama', level: 'SMP', catatan: 'Hambatan jenis, panjang, luas penampang' },
    { id: 'K1uWAj68vo4', peran: 'pendukung', level: 'SMP' },
  ],
  E2: [
    { id: '25vRnzCT9MU', peran: 'utama', level: 'SMP', catatan: 'Soal UN SMP gaya tolak' },
    { id: 'JZNFwsugY0k', peran: 'cadangan', level: 'SMA' },
  ],
  E3: [
    { id: 'zvOAOzxsqSw', peran: 'utama', level: 'SMP', catatan: 'Kemagnetan 3: medan magnet kawat berarus' },
    { id: 'w5h2N9Atk34', peran: 'pendukung', level: 'SMA' },
    { id: '6ba8Nm-gR6M', peran: 'pendukung', level: 'SMP' },
  ],
  E4: [
    { id: 'gmFr48Hotbc', peran: 'utama', level: 'SMP' },
    { id: 'bR-AB03HMAs', peran: 'cadangan', level: 'SMP', catatan: 'Kaidah tangan kanan kelas 9' },
    { id: 'oatz1lzGIf0', peran: 'pendukung', level: 'SMP', catatan: 'Induksi magnet & gaya Lorentz' },
    { id: 'iPDMtNhxvxs', peran: 'pendukung', level: 'SMA' },
  ],
  E5: [
    { id: 'RdhEDWK0Zlg', peran: 'utama', level: 'SMP' },
    { id: 'AU4zFQj4y0I', peran: 'cadangan', level: 'SMP' },
    { id: 'pzzJlPfCxhg', peran: 'pendukung', level: 'SMP' },
  ],
  E6: [
    { id: '-Uel-bTc57A', peran: 'utama', level: 'EN', catatan: 'Di atas level SMP — opsional (turunan frekuensi resonansi LC)' },
    { id: 'r72f0ZZusT0', peran: 'cadangan', level: 'EN', catatan: 'Di atas level SMP — opsional' },
  ],
  F1: [
    { id: 'dO_M8bpQfaA', peran: 'utama', level: 'SMP' },
    { id: 'U_DKPIwMmiU', peran: 'cadangan', level: 'SMP' },
    { id: 'kBzjLsKPUwQ', peran: 'pendukung', level: 'SMP' },
    { id: '42mpB0nL-0Q', peran: 'pendukung', level: 'SMP' },
  ],
  F2: [
    { id: 'eT3zrMassBU', peran: 'utama', level: 'SMP' },
    { id: 'CxftAOqdQLI', peran: 'cadangan', level: 'SMP' },
    { id: 'ptXgsSMk0Rw', peran: 'pendukung', level: 'SMP' },
    { id: '8v0A8kVut-M', peran: 'pendukung', level: 'SMP' },
  ],
  F3: [
    { id: 'O3iS5UkVbI8', peran: 'utama', level: 'SMP' },
    { id: '6whArrNK6mg', peran: 'cadangan', level: 'SMP' },
    { id: 't3SgGGOoKtU', peran: 'pendukung', level: 'SMP' },
  ],
  F4: [
    { id: 'qp-wF_PQS4Y', peran: 'utama', level: 'SMP' },
    { id: 'SVNy6M55kzg', peran: 'cadangan', level: 'SMP' },
  ],
  G1: [
    { id: 'QjzEQMkoR4o', peran: 'utama', level: 'SMP' },
    { id: '0t6uJClylx8', peran: 'cadangan', level: 'SMP' },
  ],
  G2: [
    { id: 'cbJlMa5FeYo', peran: 'utama', level: 'SMP' },
    { id: 'cnik0ilORtk', peran: 'pendukung', level: 'SMA', catatan: 'Soal KSN Geografi' },
  ],
  G3: [
    { id: 'H7LodTz9uQU', peran: 'utama', level: 'SMP' },
    { id: 'fppYMuMbHcM', peran: 'cadangan', level: 'SMP' },
    { id: 'oydGIaJfcv0', peran: 'pendukung', level: 'SMP' },
    { id: '91GuCPIJzfc', peran: 'pendukung', level: 'SMP' },
  ],
  G4: [
    { id: '4jVa6rx6XOI', peran: 'pendukung', level: 'SMP', catatan: 'Massa vs berat' },
    {
      id: 'pWRsFLQ6KQ4',
      peran: 'pendukung',
      level: 'SMP',
      catatan: 'YouTube Shorts: alasan Bulan tanpa atmosfer',
      isShortLinkOnly: true,
    },
    {
      id: 'tRwzgFJDWI8',
      peran: 'pendukung',
      level: 'SMA',
      catatan: 'Soal 46 di atas level SMP (periode planet & massa pusat)',
    },
  ],
  H1: [
    { id: 'IOEcOm8E8a8', peran: 'utama', level: 'SMP' },
    { id: 'DJCVIh5ymB4', peran: 'cadangan', level: 'SMP' },
    { id: 'WwGR8qmK4aM', peran: 'pendukung', level: 'SMP' },
    { id: 'EMN676WehRo', peran: 'pendukung', level: 'SMP' },
  ],
  I1: [
    { id: 'YVvw-mSlg1c', peran: 'utama', level: 'SMP' },
    { id: 'UFVkXAtPcT8', peran: 'cadangan', level: 'SMP' },
    { id: 'CgUdOy7-INA', peran: 'pendukung', level: 'SMP' },
    { id: 'Ioim5NtFywU', peran: 'pendukung', level: 'SMP' },
  ],
};

export const BONUS_OSN_VIDEOS: BonusVideoRef[] = [
  {
    id: 'i1ESzWKk-8o',
    tipe: 'video',
    deskripsi: 'Pembahasan soal OSN IPA SMP Kab/Kota 2025 bagian fisika',
  },
  {
    id: 'INg9QdAlNHk',
    tipe: 'video',
    deskripsi: 'OSN Kota/Kab IPA SMP 2024',
  },
  {
    id: 'TIv0v0IzWsU',
    tipe: 'video',
    deskripsi: 'Persiapan OSN IPA SMP',
  },
  {
    id: 'PL0TfKsBp9U9jAxMg7euy_V8L5dOjky7dj',
    tipe: 'playlist',
    deskripsi: 'Playlist Olimpiade Fisika SMP, pembahasan lengkap',
  },
];

export const B6_SEARCH_URL =
  'https://www.youtube.com/results?search_query=hukum+Charles+pemuaian+gas+tekanan+tetap';
