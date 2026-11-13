export interface LangkahPanduanAwal {
  nomor: number;
  judul: string;
  tombolTujuan: string;
  instruksi: string;
  suara: string;
}

export const PANDUAN_ALUR_AWAL: LangkahPanduanAwal[] = [
  {
    nomor: 1,
    judul: 'Mulai dari Beranda atau Peta',
    tombolTujuan: 'Pencet tombol oranye "Lanjutkan: A1" atau tab "Peta"',
    instruksi:
      'Dari halaman Beranda, pencet tombol oranye "Lanjutkan" untuk langsung masuk ke sub-bab pertama (A1), atau pencet tab "Peta" di menu untuk memilih salah satu dari 9 bab dan 33 sub-bab fisika.',
    suara:
      'Halo teman-teman calon juara fisika! Aku Bima, pemandumu di sini. Langkah pertama untuk mulai belajar: di halaman Beranda, pencet tombol oranye bertuliskan Lanjutkan A1. Kamu juga bisa pencet tab Peta di bagian atas atau bawah layar, lalu pilih salah satu kartu sub-bab seperti A1 untuk mulai.',
  },
  {
    nomor: 2,
    judul: 'Tahap 1 & 2: Dengar Pemandu dan Tonton Video',
    tombolTujuan: 'Pencet "Putar Suara", lalu "Lanjut ke Video", lalu "Lanjut ke Rumus"',
    instruksi:
      'Di Tahap 1, pencet "Putar Suara" agar kamu tahu 3 hal penting yang harus dicatat saat menonton. Lalu pencet "Lanjut ke Video". Putar videonya, centang 3 Tugas Tonton di sebelah kanan, pencet "Sudah nonton", lalu pencet "Lanjut ke Rumus".',
    suara:
      'Langkah kedua setelah masuk sub-bab: kamu mulai di Tahap satu. Pencet tombol Putar Suara untuk mendengarkan tiga tugas tonton, lalu pencet tombol oranye Lanjut ke Video. Setelah menonton dan mencentang tiga kotak Tugas Tonton, pencet tombol Sudah nonton, lalu pencet Lanjut ke Rumus.',
  },
  {
    nomor: 3,
    judul: 'Tahap 3 & 4: Rumus, Jebakan, dan Contoh Bareng',
    tombolTujuan: 'Pencet "Lanjut ke Contoh Terpandu", lalu "Cek Langkah Ini"',
    instruksi:
      'Di Tahap 3, baca konsep inti, rumus bersatuan, dan 2 jebakan soal, lalu pencet "Lanjut ke Contoh Terpandu". Di Tahap 4, isi jawaban langkah demi langkah, pencet "Cek Langkah Ini", lalu "Langkah berikutnya" hingga tombol "Lanjut ke Latihan 3 Level" muncul.',
    suara:
      'Langkah ketiga: di Tahap tiga, pelajari rumus dan jebakan, atau pencet Dengarkan ringkasan, lalu pencet Lanjut ke Contoh Terpandu. Di Tahap empat, isi kotak jawaban kecil satu per satu, pencet Cek Langkah Ini, lalu pencet Langkah berikutnya sampai selesai dan pencet Lanjut ke Latihan tiga Level.',
  },
  {
    nomor: 4,
    judul: 'Tahap 5: Latihan 3 Level (Raih 3 Bintang)',
    tombolTujuan: 'Pilih Level 1 → 2 → 3, pilih A–E, pencet "Cek Jawaban"',
    instruksi:
      'Kerjakan mulai dari Level 1 (Meniru), lanjut Level 2 (Variasi), hingga Level 3 (Tantangan). Pilih opsi A sampai E lalu pencet "Cek Jawaban". Jawab benar minimal 2 dari 3 soal Level 3 tanpa memakai petunjuk untuk meraih 3 bintang penuh!',
    suara:
      'Langkah keempat: sekarang kamu di Tahap lima Latihan tiga Level. Mulai dari Level satu Meniru, lalu naik ke Level dua Variasi dan Level tiga Tantangan. Pilih jawaban A sampai E, lalu pencet Cek Jawaban, dan pencet Soal Berikutnya. Untuk meraih tiga bintang penuh, jawab benar minimal dua dari tiga soal Level tiga tanpa membuka petunjuk. Setelah selesai, pencet Lanjut ke Soal Olimpiade.',
  },
  {
    nomor: 5,
    judul: 'Tahap 6 & Kuis 50 Soal Olimpiade',
    tombolTujuan: 'Pencet tab "Latihan" → "Kuis 50 Soal", pilih A–E atau "Kosongkan (0)"',
    instruksi:
      'Kerjakan soal olimpiade yang cocok di Tahap 6, lalu pencet "Selesaikan Sub-bab". Untuk mengerjakan seluruh 50 soal olimpiade, buka tab "Latihan" → "Kuis 50 Soal". Kerjakan sendiri dulu (Benar +4, Salah −1, Kosong 0), lalu baca "Cara menjawab" dan "Tips soal serupa".',
    suara:
      'Langkah kelima: di Tahap enam, coba kerjakan soal olimpiade asli lalu pencet Selesaikan Sub-bab untuk kembali ke Peta. Kalau mau mengerjakan seluruh lima puluh soal ujian sekaligus, pencet tab Latihan lalu pilih Kuis lima puluh Soal. Pilih jawaban A sampai E, atau pencet tombol Kosongkan kalau masih ragu karena aturan skornya benar tambah empat, salah kurang satu, dan kosong nol. Setelah menjawab, baca pembahasan langkah demi langkah dan tips soal serupa.',
  },
  {
    nomor: 6,
    judul: 'Cek Hasil Akhir & Ulangi Soal Salah di Profil',
    tombolTujuan: 'Pencet tab "Profil" untuk melihat progres akhir',
    instruksi:
      'Setelah semua sub-bab dan Kuis 50 Soal selesai dikerjakan, buka tab "Profil". Di sana kamu bisa melihat total skor Kuis 50 Soal, grafik kekuatan 9 bab, lencana juara, dan mengulang soal yang sempat salah hingga benar semua.',
    suara:
      'Langkah keenam sampai selesai: kalau semua latihan dan lima puluh soal kuis sudah kamu kerjakan, pencet tab Profil. Di sana kamu bisa mengecek total bintang, lencana, grafik kekuatan tiap bab, dan mengulang soal yang sempat salah sampai kamu menguasai semuanya. Yuk mulai sekarang dengan menekan tombol Mulai ke A1!',
  },
];

export const PANDUAN_LENGKAP_SUARA = PANDUAN_ALUR_AWAL.map((s) => s.suara).join(' ');

export const ATURAN_SKOR_KUIS = {
  benar: 4,
  salah: -1,
  kosong: 0,
  ringkasan: 'Aturan skor di kuis: jawaban benar +4, jawaban salah −1, tidak dijawab 0.',
};

export const TIPS_JITU_OLIMPIADE: Array<{ no: number; judul: string; isi: string }> = [
  {
    no: 1,
    judul: 'Baca soal dengan tenang',
    isi: 'Garis bawahi apa yang ditanyakan dan data penting. Banyak jawaban salah bukan karena rumusnya lupa, tetapi karena salah membaca soal.',
  },
  {
    no: 2,
    judul: 'Tulis “diketahui” dan “ditanya”',
    isi: 'Cuma butuh 10 detik, tapi membuat pikiranmu lebih rapi dan mengurangi salah hitung.',
  },
  {
    no: 3,
    judul: 'Samakan satuan dulu',
    isi: 'Ubah cm ke m, gram ke kg, celsius ke kelvin (kalau soalnya tentang gas), dan perhatikan awalan seperti mili, mikro, dan piko. Satuan yang salah adalah jebakan nomor satu.',
  },
  {
    no: 4,
    judul: 'Buat sketsa kecil',
    isi: 'Gambar pipa, tuas, rangkaian, atau grafik. Banyak soal terasa mudah setelah digambar.',
  },
  {
    no: 5,
    judul: 'Perkirakan jawaban kasar dulu',
    isi: 'Bulatkan angka lalu hitung cepat. Pilihan yang jauh dari perkiraanmu bisa langsung dicoret.',
  },
  {
    no: 6,
    judul: 'Waspadai data pengecoh',
    isi: 'Kadang soal memberi informasi yang tidak dipakai (misalnya soal tali nomor 15). Pilih hanya data yang dibutuhkan.',
  },
  {
    no: 7,
    judul: 'Pecah soal panjang menjadi tahap-tahap',
    isi: 'Contohnya soal gaya dan gesekan (nomor 16) atau soal campuran es dan air (nomor 49). Selesaikan satu tahap, lalu lanjut ke tahap berikutnya.',
  },
  {
    no: 8,
    judul: 'Atur strategi skor',
    isi: 'Karena salah dikurangi 1 dan benar ditambah 4, menebak asal-asalan tidak untung. Tetapi kalau kamu bisa mencoret minimal 1 pilihan yang pasti salah, menebak mulai menguntungkan. Kalau sama sekali tidak tahu, lebih aman dikosongkan.',
  },
  {
    no: 9,
    judul: 'Kerjakan yang mudah dulu',
    isi: 'Tandai soal yang sulit, lalu kembali ke sana setelah semua soal mudah selesai. Jangan menghabiskan waktu terlalu lama di satu soal.',
  },
  {
    no: 10,
    judul: 'Cek akhir jawabanmu',
    isi: 'Apakah satuannya sudah benar? Apakah angkanya masuk akal? (Contoh: lebar lembah tidak mungkin 0,5 meter.)',
  },
];

export const CONTEKAN_RUMUS_RINGKAS: Array<{ topik: string; rumus: string }> = [
  { topik: 'Kecepatan', rumus: 'v = s ÷ t' },
  { topik: 'Gerak dipercepat (GLBB)', rumus: 'v = v₀ + a × t  dan  v² = v₀² + 2 × a × s' },
  { topik: 'Hukum Newton II', rumus: 'F = m × a' },
  { topik: 'Berat dan energi kinetik', rumus: 'w = m × g  dan  Ek = ½ × m × v²' },
  { topik: 'Tekanan zat padat', rumus: 'P = F ÷ A' },
  { topik: 'Hukum Pascal (hidrolik)', rumus: 'F₁ ÷ A₁ = F₂ ÷ A₂  (luas lingkaran ∝ diameter kuadrat)' },
  { topik: 'Benda mengapung', rumus: 'massa jenis benda = (bagian tercelup) × massa jenis cairan' },
  { topik: 'Kalor', rumus: 'Q = m × c × ΔT  dan  Q = m × L (saat berubah wujud)' },
  { topik: 'Asas Black', rumus: 'kalor yang dilepas = kalor yang diterima' },
  { topik: 'Pemuaian panjang', rumus: 'ΔL = L₀ × α × ΔT' },
  { topik: 'Gas tekanan tetap', rumus: 'V₁ ÷ T₁ = V₂ ÷ T₂  (T dalam kelvin)' },
  { topik: 'Skala suhu', rumus: 'F = 9/5 × C + 32 ; K = C + 273 ; C : R = 5 : 4' },
  { topik: 'Gelombang', rumus: 'v = f × λ ; v = λ ÷ T' },
  { topik: 'Gema dan sonar', rumus: 'jarak = v × t ÷ 2' },
  { topik: 'Pipa organa', rumus: 'terbuka: L = n × ½λ ; tertutup: L = (2n − 1) × ¼λ' },
  { topik: 'Hukum Ohm & rangkaian', rumus: 'V = I × R ; seri: R dijumlah ; paralel (n sama): R ÷ n' },
  { topik: 'Hukum Coulomb', rumus: 'F ∝ (q₁ × q₂) ÷ r²' },
  { topik: 'Gaya Lorentz', rumus: 'F = B × I × L' },
  { topik: 'Transformator', rumus: 'Ns ÷ Np = Vs ÷ Vp' },
  { topik: 'Tuas', rumus: 'beban × lengan beban = gaya × lengan kuasa' },
  { topik: 'Bidang miring', rumus: 'F = W × (tinggi ÷ panjang)' },
  { topik: 'Katrol', rumus: 'KM = jumlah tali penopang beban (katrol tetap KM = 1)' },
  { topik: 'Selisih waktu antar kota', rumus: '1° bujur = 4 menit (timur lebih cepat)' },
  { topik: 'Konversi tekanan', rumus: '1 atm = 76 cmHg = 760 mmHg ≈ 100.000 Pa' },
  { topik: 'Angka penting', rumus: 'perkalian/pembagian: ikut yang paling sedikit angka pentingnya' },
];
