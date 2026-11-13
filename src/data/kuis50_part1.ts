import type { SoalKuis50 } from '../types/physics';

export const KUIS_50_PART_1: SoalKuis50[] = [
  {
    nomor: 1,
    subBabId: 'A1',
    judulSingkat: 'Membaca Grafik Gerak (jarak terhadap waktu)',
    teksSoal:
      'Gerak tiga buah mobil digambarkan oleh tiga grafik di bawah ini. Pernyataan yang benar tentang gerak ketiga mobil tersebut adalah...',
    gambarDeskripsi:
      'Ada tiga grafik jarak (s) terhadap waktu (t). Grafik Mobil 1 berupa garis melengkung yang makin curam, Mobil 2 berupa garis datar, dan Mobil 3 berupa garis lurus miring naik.',
    gambarSpec: {
      jenis: 'tiga_grafik_s1',
      judul: 'Tiga Grafik Jarak (s) terhadap Waktu (t) — Mobil 1, 2, dan 3',
    },
    pilihan: {
      A: 'Mobil 1 bergerak lurus berubah beraturan, mobil 2 bergerak lurus berubah beraturan, mobil 3 gerak lurus beraturan.',
      B: 'Mobil 1 bergerak lurus berubah beraturan, mobil 2 bergerak lurus beraturan, mobil 3 bergerak lurus beraturan.',
      C: 'Mobil 1 berada dalam keadaan diam, mobil 2 dalam keadaan diam, mobil 3 bergerak lurus beraturan.',
      D: 'Mobil 1 bergerak lurus berubah beraturan (GLBB), mobil 2 dalam keadaan diam, mobil 3 bergerak lurus beraturan (GLB).',
      E: 'Mobil 1 berada dalam keadaan diam, mobil 2 bergerak lurus beraturan, mobil 3 bergerak lurus berubah beraturan.',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Ingat dulu: pada grafik jarak–waktu, kemiringan garis menunjukkan kecepatan.',
      'Mobil 1: garisnya melengkung dan makin curam. Artinya kecepatannya makin lama makin besar, jadi mobil sedang dipercepat. Ini namanya GLBB (Gerak Lurus Berubah Beraturan).',
      'Mobil 2: garisnya datar. Waktu berjalan tetapi jaraknya tidak berubah, jadi mobil diam.',
      'Mobil 3: garisnya lurus miring. Kecepatannya tetap, jadi ini GLB (Gerak Lurus Beraturan).',
      'Cocokkan: Mobil 1 GLBB, Mobil 2 diam, Mobil 3 GLB. Itu ada di pilihan D.',
    ],
    tipsSerupa:
      'Pada grafik jarak–waktu, tanya dirimu: garisnya datar, lurus miring, atau melengkung? Datar = diam, lurus miring = kecepatan tetap, melengkung = kecepatan berubah. Hati-hati, kalau grafiknya kecepatan–waktu, garis datar justru berarti kecepatan tetap (GLB), bukan diam!',
  },
  {
    nomor: 2,
    subBabId: 'F4',
    judulSingkat: 'Roda Bergigi',
    teksSoal:
      'Di sebuah pabrik mainan, seorang insinyur merancang pesawat mainan dengan roda bergigi perbandingan 1:6. Ketika ditarik dengan gaya 300 Newton, berapakah gaya yang dihasilkan oleh roda bergigi tersebut?',
    pilihan: {
      A: '50 N',
      B: '100 N',
      C: '300 N',
      D: '1200 N',
      E: '1800 N',
    },
    kunci: 'E',
    kunciTerverifikasi: 'E',
    pembahasanLangkah: [
      'Soal ini menyebut perbandingan roda bergigi 1 : 6 dan gaya tarik 300 N. Pada rancangan ini, gaya yang dihasilkan diperbesar 6 kali.',
      'Hitung: gaya yang dihasilkan = 300 N × 6 = 1.800 N.',
      'Cek jebakan: kalau kamu malah membagi 300 ÷ 6, kamu akan dapat 50 N (pilihan A). Itu terjadi kalau arah perbandingannya terbalik.',
    ],
    tipsSerupa:
      'Baca kalimat soal dengan teliti untuk tahu apakah gaya diperbesar atau diperkecil. Ingat prinsip “mudah dibayar dengan jauh”: alat yang membuat gaya jadi besar biasanya membuat gerakannya jadi lambat atau pendek, karena energi tidak muncul dari nol.',
  },
  {
    nomor: 3,
    subBabId: 'D2',
    judulSingkat: 'Gelombang Bunyi di Pipa Terbuka',
    teksSoal:
      'Sebuah tabung panjang terbuka di kedua ujungnya memiliki panjang 60 cm. Di dalam tabung terdapat 3 simpangan puncak akibat gelombang. Jika kecepatan gelombang 320 m/s, berapakah frekuensi gelombang?',
    pilihan: {
      A: '400 Hz',
      B: '800 Hz',
      C: '1200 Hz',
      D: '1600 Hz',
      E: '2000 Hz',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Ubah satuan dulu: 60 cm = 0,6 m.',
      'Pipa terbuka di kedua ujungnya. Setiap perut (puncak simpangan) panjangnya setengah gelombang. Ada 3 perut, jadi 0,6 m = 3 × (setengah gelombang). Satu gelombang penuh (λ) = 2 × 0,6 ÷ 3 = 0,4 m.',
      'Frekuensi: f = v ÷ λ = 320 ÷ 0,4 = 800 Hz.',
    ],
    tipsSerupa:
      'Selalu gambar sketsa pipanya. Pipa terbuka kedua ujung: ujung-ujungnya perut. Satu perut = setengah gelombang. Dan jangan lupa mengubah cm menjadi m sebelum menghitung.',
  },
  {
    nomor: 4,
    subBabId: 'C5',
    judulSingkat: 'Bola Mengapung di Minyak',
    teksSoal:
      'Sebuah bola bermassa 101,25 gram ditaruh dalam wadah berisi minyak (massa jenis 0,9 g/cc). Bola mengapung dengan separuh bagiannya berada di bawah permukaan minyak. Berdasarkan kondisi tersebut disimpulkan bahwa...',
    pilihan: {
      A: 'Massa jenis bola = 0,50 g/cc dan volume total bola = 250 cc',
      B: 'Massa jenis bola = 0,90 g/cc dan volume total bola = 200 cc',
      C: 'Massa jenis bola = 0,45 g/cc dan volume total bola = 225 cc',
      D: 'Massa jenis bola = 0,40 g/cc dan volume total bola = 225 cc',
      E: 'Massa jenis bola = 0,60 g/cc dan volume total bola = 250 cc',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Bola mengapung dengan separuh bagiannya tercelup. Artinya massa jenis bola = ½ × massa jenis minyak = ½ × 0,9 = 0,45 g/cc.',
      'Volume total bola = massa ÷ massa jenis = 101,25 ÷ 0,45 = 225 cc.',
      'Pilihan yang cocok: massa jenis 0,45 g/cc dan volume 225 cc, yaitu C.',
    ],
    tipsSerupa:
      'Untuk benda yang mengapung: massa jenis benda = (bagian yang tercelup) × massa jenis cairan. Separuh tercelup berarti massa jenis benda setengah dari cairannya. Pilihan yang “angkanya bulat” (misalnya 0,50) sering menjadi pengecoh.',
  },
  {
    nomor: 5,
    subBabId: 'C1',
    judulSingkat: 'Tekanan Astronot di Bulan',
    teksSoal:
      'Seorang astronot bermassa 120 kg di Bulan (g = 1,6 m/s²). Berdiri dengan 2 kaki (luas kontak 0,08 m²), lalu berdiri dengan 1 kaki (luas 0,04 m²). Bandingkan tekanan yang diberikan!',
    pilihan: {
      A: 'P 2 sepatu = 2,4 kPa, P 1 sepatu = 4,8 kPa ; Rasio = 2 kali',
      B: 'P 2 sepatu = 4,8 kPa, P 1 sepatu = 2,4 kPa ; Rasio = 1/2 kali',
      C: 'P 2 sepatu = 1,2 kPa, P 1 sepatu = 2,4 kPa ; Rasio = 2 kali',
      D: 'P 2 sepatu = 2,4 kPa, P 1 sepatu = 2,4 kPa ; Rasio = 1 kali',
      E: 'P 2 sepatu = 9,6 kPa, P 1 sepatu = 4,8 kPa ; Rasio = 1/2 kali',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Hitung berat astronot di Bulan: w = m × g = 120 × 1,6 = 192 N.',
      'Berdiri dengan dua kaki: tekanan = gaya ÷ luas = 192 ÷ 0,08 = 2.400 Pa = 2,4 kPa.',
      'Berdiri dengan satu kaki: tekanan = 192 ÷ 0,04 = 4.800 Pa = 4,8 kPa.',
      'Perbandingannya: tekanan satu kaki 2 kali lebih besar daripada dua kaki. Itu pilihan A.',
    ],
    tipsSerupa:
      'Gaya sama, luas makin kecil, tekanan makin besar. Itu sebabnya pisau tajam mudah memotong. Kamu bahkan bisa menjawab tanpa menghitung: luas jadi setengah berarti tekanan jadi dua kali. Ingat juga 1 kPa = 1.000 Pa.',
  },
  {
    nomor: 6,
    subBabId: 'B1',
    judulSingkat: 'Mengubah Suhu Celsius ke Fahrenheit',
    teksSoal:
      'Suhu ruangan 26°C. Terdapat Termometer A (Fahrenheit, titik didih 212°F) dan B (Reamur, titik didih 80°R). Langkah konversi ke termometer A (Fahrenheit) adalah...',
    pilihan: {
      A: 'Menambah suhu Celsius dengan angka 273',
      B: 'Mengkali dengan 9/5 lalu menambah dengan 32',
      C: 'Mengkali suhu Celsius dengan faktor 5/9',
      D: 'Mengkali suhu Celsius dengan faktor 4/5',
      E: 'Mengurangi suhu Celsius dengan angka 273',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Skala Celsius dari titik beku sampai didih ada 100 bagian (0 sampai 100). Skala Fahrenheit ada 180 bagian (32 sampai 212).',
      'Perbandingan 180 : 100 sama dengan 9 : 5. Jadi setiap 1°C setara dengan 9/5 °F.',
      'Titik beku air di Fahrenheit adalah 32, bukan 0, jadi hasilnya harus ditambah 32.',
      'Langkahnya: kalikan 9/5 lalu tambah 32 (pilihan B). Contoh: 26°C → 26 × 9/5 = 46,8 → 46,8 + 32 = 78,8°F.',
    ],
    tipsSerupa:
      'Hafalkan tabel titik beku dan titik didih: Celsius 0 dan 100, Reamur 0 dan 80, Fahrenheit 32 dan 212, Kelvin 273 dan 373. Kelvin hanya digeser (C + 273), tidak dikali apa-apa.',
  },
  {
    nomor: 7,
    subBabId: 'E1',
    judulSingkat: 'Kawat Dipotong Lalu Dirangkai',
    teksSoal:
      'Sebatang kawat aluminium panjang L dan luas penampang A dipotong menjadi 5 bagian yang sama. Jika kelima potongan ini kemudian dirangkai, perbandingan hambatan minimum dan maksimum adalah...',
    pilihan: {
      A: '1 : 5',
      B: '1 : 10',
      C: '1 : 25',
      D: '1 : 50',
      E: '1 : 100',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Misalkan hambatan kawat utuh = R. Kawat dipotong menjadi 5 bagian sama panjang, jadi tiap potongan hambatannya r = R ÷ 5 (lebih pendek berarti hambatannya lebih kecil).',
      'Hambatan minimum: 5 potongan dirangkai paralel. Hasilnya r ÷ 5 = R ÷ 25.',
      'Hambatan maksimum: 5 potongan dirangkai seri. Hasilnya 5 × r = R.',
      'Perbandingan minimum : maksimum = (R ÷ 25) : R = 1 : 25 (pilihan C).',
    ],
    tipsSerupa:
      'Ingat dua kata kunci: seri membuat hambatan besar (dijumlahkan), paralel membuat hambatan kecil (kalau n hambatan sama, hasilnya dibagi n). Jebakan umum: lupa bahwa potongan kawat juga sudah lebih kecil hambatannya.',
  },
  {
    nomor: 8,
    subBabId: 'B3',
    judulSingkat: 'Pemanas Listrik dan Kalor',
    teksSoal:
      'Pemanas listrik mencairkan 200 gram es 0°C dalam 4 detik (Kalor lebur es = 80 kal/g). Berapa waktu yang dibutuhkan pemanas untuk memanaskan 500 gram air dari 25°C ke 75°C (c = 1 kal/g°C)?',
    pilihan: {
      A: '5,50 detik',
      B: '6,25 detik',
      C: '7,00 detik',
      D: '7,50 detik',
      E: '8,50 detik',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Tahap 1 (mencari daya pemanas): kalor untuk melebur 200 g es = 200 × 80 = 16.000 kal. Itu dicapai dalam 4 detik, jadi pemanas memberi 16.000 ÷ 4 = 4.000 kal tiap detik.',
      'Tahap 2: kalor untuk menaikkan suhu 500 g air dari 25°C ke 75°C = 500 × 1 × 50 = 25.000 kal.',
      'Waktu yang dibutuhkan = 25.000 ÷ 4.000 = 6,25 detik (pilihan B).',
    ],
    tipsSerupa:
      'Soal dua tahap: cari dulu “kecepatan kerja” alatnya (daya, yaitu kalor per detik), lalu pakai untuk tahap berikutnya. Ingat dua rumus: Q = m × L saat berubah wujud (suhu tetap), dan Q = m × c × ΔT saat suhu berubah.',
  },
  {
    nomor: 9,
    subBabId: 'B1',
    judulSingkat: 'Termometer Buatan X',
    teksSoal:
      'Termometer X memiliki titik beku -30°X dan titik didih 120°X. Jika suhu ruangan terukur 32°C, berapakah suhu pada termometer X?',
    pilihan: {
      A: '8°X',
      B: '-8°X',
      C: '18°X',
      D: '-18°X',
      E: '28°X',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Rentang termometer X: dari −30 sampai 120, jadi ada 150 bagian. Rentang Celsius ada 100 bagian.',
      'Suhu 32°C berarti 32/100 dari rentang. Di termometer X itu sama dengan 0,32 × 150 = 48 bagian di atas titik beku.',
      'Suhu X = titik beku X + 48 = −30 + 48 = 18°X (pilihan C).',
    ],
    tipsSerupa:
      'Bayangkan dua tangga dengan jumlah anak tangga berbeda. Cari posisi sebagai pecahan dari bawah ke atas, lalu terapkan pecahan itu di tangga satunya. Jangan lupa menambahkan titik bekunya, apalagi kalau nilainya negatif.',
  },
  {
    nomor: 10,
    subBabId: 'A3',
    judulSingkat: 'Balok Didorong di Lantai Licin',
    teksSoal:
      'Balok 4 kg kecepatan awal 10 m/s didorong gaya 200 N di atas lantai licin. Tentukan energi kinetik sistem ketika t = 2 detik!',
    pilihan: {
      A: '135.200 Joule',
      B: '12.100 Joule',
      C: '24.200 Joule',
      D: '50.000 Joule',
      E: '88.000 Joule',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Percepatan: a = F ÷ m = 200 ÷ 4 = 50 m/s².',
      'Kecepatan setelah 2 detik: v = kecepatan awal + a × t = 10 + 50 × 2 = 110 m/s.',
      'Energi kinetik: Ek = ½ × m × v² = ½ × 4 × 110² = 2 × 12.100 = 24.200 J (pilihan C).',
    ],
    tipsSerupa:
      'Jangan lupa menambahkan kecepatan awal. Lantai licin berarti tidak ada gesekan, jadi seluruh gaya dipakai untuk mempercepat balok. Hati-hati menghitung kuadrat: 110 × 110 = 12.100.',
  },
  {
    nomor: 11,
    subBabId: 'C5',
    judulSingkat: 'Miniatur Balon Udara',
    teksSoal:
      'Aldi membuat miniatur balon udara. Untuk memastikan miniatur balon udara tersebut dapat melayang/naik, maka Aldi perlu menaikkan...',
    pilihan: {
      A: 'Massa jenis udara di bagian luar balon',
      B: 'Luas penampang dan massa miniatur balon',
      C: 'Suhu udara dalam serta volume balon',
      D: 'Gaya gravitasi lokal dan massa balon',
      E: 'Massa total bahan pembuat balon udara',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Balon akan naik kalau gaya apung (dorongan ke atas dari udara) lebih besar daripada berat balon.',
      'Gaya apung makin besar kalau volume balon makin besar, karena balon menggeser lebih banyak udara.',
      'Udara di dalam balon yang dipanaskan akan memuai dan menjadi lebih ringan, sehingga berat balon berkurang.',
      'Jadi Aldi perlu menaikkan suhu udara di dalam dan volume balon (pilihan C).',
    ],
    tipsSerupa:
      'Untuk soal “kenapa benda naik atau melayang”, bandingkan gaya apung dengan berat. Menambah massa bahan balon justru membuat balon makin berat, jadi makin sulit naik.',
  },
  {
    nomor: 12,
    subBabId: 'E6',
    judulSingkat: 'Rangkaian LC dan Gelombang Radio',
    teksSoal:
      'Rangkaian LC terdiri dari kapasitor 40 µF dan induktor 25 mH. Berapakah panjang gelombang elektromagnetik resonansi yang dipancarkan (c = 3 × 10⁸ m/s)?',
    pilihan: {
      A: '628 m',
      B: '942 m',
      C: '1.884 m',
      D: '3.768 m',
      E: '1.968 m',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Ubah satuan dulu: C = 40 µF = 40 × 10⁻⁶ F dan L = 25 mH = 25 × 10⁻³ H.',
      'Kalikan L × C = 25 × 10⁻³ × 40 × 10⁻⁶ = 1.000 × 10⁻⁹ = 10⁻⁶. Akar dari angka itu adalah 10⁻³.',
      'Pakai rumus λ = 2 × π × c × akar(L × C). Dengan π ≈ 3,14: 2 × 3,14 × 3 × 10⁸ = 1,884 × 10⁹.',
      'Kalikan dengan 10⁻³: hasilnya 1,884 × 10⁶ m. Deretan angkanya adalah 1884, sama dengan angka pada pilihan C.',
    ],
    tipsSerupa:
      'Soal ini tingkatnya sudah di atas SMP biasa. Yang paling penting diuji adalah kemampuan mengubah awalan satuan: mili (m) = 10⁻³, mikro (µ) = 10⁻⁶, piko (p) = 10⁻¹². Salah satu pangkat saja bisa membuat jawabanmu meleset ribuan kali. Kalau hasil hitunganmu angkanya sama tapi pangkatnya beda, curigai satuan.',
    perluCekSoalAsli: true,
    catatanCekAsli:
      'Dengan satuan seperti yang tertulis di soal (40 µF, 25 mH), hasil hitungannya sebenarnya sekitar 1.884.000 m, sedangkan pilihan C tertulis 1.884 m (selisih tiga angka nol). Kalau kapasitornya 40 pF (bukan 40 µF), hasilnya pas 1.884 m. Jadi kemungkinan ada salah ketik satuan di soal. Tetap pilih C karena angkanya paling cocok, dan sebaiknya soal dicek lagi ke sumber aslinya.',
  },
  {
    nomor: 13,
    subBabId: 'D3',
    judulSingkat: 'Gema di Lembah',
    teksSoal:
      'Seorang anak di tebing meniup peluit 500 Hz dan panjang gelombang 0,68 m. Waktu pantul gema 4 detik. Lebar lembah tersebut adalah...',
    pilihan: {
      A: '340 m',
      B: '680 m',
      C: '1.020 m',
      D: '1.360 m',
      E: '2.720 m',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Cari cepat rambat bunyi: v = f × λ = 500 × 0,68 = 340 m/s.',
      'Waktu 4 detik adalah waktu bunyi pergi dan pulang (bolak-balik).',
      'Lebar lembah = v × t ÷ 2 = 340 × 4 ÷ 2 = 680 m (pilihan B).',
    ],
    tipsSerupa:
      'Pada soal gema dan sonar, jarak selalu dibagi 2, karena bunyi menempuh jarak itu dua kali (pergi dan pulang). Pilihan 1.360 m adalah jebakan kalau kamu lupa membagi 2.',
  },
  {
    nomor: 14,
    subBabId: 'D3',
    judulSingkat: 'Sonar Kapal',
    teksSoal:
      'Sonar kapal memancarkan gelombang di laut (v = 1500 m/s). Bunyi pantul diterima kembali setelah 2 detik. Kedalaman laut tersebut adalah...',
    pilihan: {
      A: '375 m',
      B: '750 m',
      C: '1.500 m',
      D: '3.000 m',
      E: '6.000 m',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Bunyi sonar pergi ke dasar laut lalu memantul kembali, jadi 2 detik adalah waktu pergi-pulang.',
      'Kedalaman = v × t ÷ 2 = 1.500 × 2 ÷ 2 = 1.500 m (pilihan C).',
    ],
    tipsSerupa:
      'Rumusnya sama dengan soal gema: jarak = cepat rambat × waktu ÷ 2. Jebakan: kalau lupa membagi 2, kamu akan memilih 3.000 m.',
  },
  {
    nomor: 15,
    subBabId: 'D1',
    judulSingkat: 'Gelombang pada Tali',
    teksSoal:
      'Seutas tali panjang 12 m digerakkan sehingga waktu 1 gelombang 0,2 detik dan cepat rambat 15 m/s. Banyak gelombang terbentuk jika simpangan 10 cm adalah...',
    pilihan: {
      A: '1 gelombang',
      B: '2 gelombang',
      C: '3 gelombang',
      D: '4 gelombang',
      E: '5 gelombang',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Satu gelombang butuh waktu 0,2 detik, artinya periode T = 0,2 s.',
      'Panjang satu gelombang: λ = v × T = 15 × 0,2 = 3 m.',
      'Banyak gelombang pada tali 12 m = 12 ÷ 3 = 4 gelombang (pilihan D).',
    ],
    tipsSerupa:
      'Keterangan “simpangan 10 cm” tidak dipakai sama sekali. Soal olimpiade sering memberi data pengecoh, jadi pilih data yang benar-benar dibutuhkan. Ingat v = λ ÷ T, sehingga λ = v × T.',
  },
  {
    nomor: 16,
    subBabId: 'A3',
    judulSingkat: 'Gaya, Gesekan, dan Balok',
    teksSoal:
      'Gaya F bekerja pada balok 5000 gram sehingga resultan gaya 20 N selama 2 detik. Saat gaya dihilangkan, balok menempuh 2,5 m lalu berhenti. Besar gaya dorong awal F adalah...',
    pilihan: {
      A: '64 N',
      B: '68 N',
      C: '74 N',
      D: '84 N',
      E: '100 N',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Ubah satuan: 5.000 gram = 5 kg.',
      'Fase 1 (didorong 2 detik): percepatan = resultan gaya ÷ massa = 20 ÷ 5 = 4 m/s². Kecepatan di akhir detik ke-2 = 4 × 2 = 8 m/s.',
      'Fase 2 (gaya dilepas): balok melambat karena gesekan dan berhenti setelah 2,5 m. Pakai v² = 2 × a × s, yaitu 64 = 2 × a × 2,5, sehingga perlambatan a = 12,8 m/s².',
      'Gaya gesek = m × a = 5 × 12,8 = 64 N.',
      'Pada fase 1, resultan = gaya dorong − gesekan, jadi 20 = F − 64. Maka F = 84 N (pilihan D).',
    ],
    tipsSerupa:
      'Pecah soal yang panjang menjadi dua fase: saat didorong, resultan = gaya − gesekan; saat gaya dilepas, hanya gesekan yang memperlambat balok. Rumus v² = 2 × a × s sangat berguna kalau waktunya tidak diketahui.',
  },
  {
    nomor: 17,
    subBabId: 'B3',
    judulSingkat: 'Grafik Pemanasan Es',
    teksSoal:
      'Es 60 gram dipanaskan dari -5°C menjadi air 80°C. Banyaknya kalor yang diperlukan khusus pada proses C ke D (pemanasan air 0°C ke 80°C) adalah...',
    gambarDeskripsi:
      'Grafik suhu terhadap kalor dengan titik A, B, C, D. A ke B: es naik suhunya sampai 0°C. B ke C: es melebur (suhu tetap). C ke D: air memanas dari 0°C sampai 80°C.',
    gambarSpec: {
      jenis: 'grafik_kalor_abcd',
      judul: 'Grafik Pemanasan Es (A → B → C → D)',
    },
    pilihan: {
      A: '125 kalori',
      B: '3.000 kalori',
      C: '4.000 kalori',
      D: '4.800 kalori',
      E: '124 kalori',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Soal hanya menanyakan bagian C ke D, yaitu air yang dipanaskan dari 0°C ke 80°C.',
      'Pakai Q = m × c × ΔT = 60 × 1 × (80 − 0) = 4.800 kalori (pilihan D).',
    ],
    tipsSerupa:
      'Potong grafik menjadi bagian-bagian. Bagian miring berarti suhu berubah (pakai m × c × ΔT). Bagian datar berarti wujud berubah (pakai m × L). Hitung hanya bagian yang ditanyakan, jangan menjumlahkan semuanya.',
  },
  {
    nomor: 18,
    subBabId: 'G1',
    judulSingkat: 'Pasang Purnama',
    teksSoal:
      'Pasang surut air laut maksimum (pasang purnama) terjadi ketika Matahari, Bumi, dan Bulan berada pada satu garis lurus. Peristiwa ini terjadi saat bulan berada pada fase...',
    gambarSpec: {
      jenis: 'pasang_surut',
      fasePasang: 'purnama',
      judul: 'Posisi Matahari – Bumi – Bulan Satu Garis Lurus (Pasang Purnama)',
    },
    pilihan: {
      A: 'Fase bulan setengah atau kuartal',
      B: 'Fase bulan sabit pertama dan akhir',
      C: 'Fase bulan baru atau bulan purnama',
      D: 'Fase bulan cembung awal atau akhir',
      E: 'Fase bulan cekung penumbra bumi',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Matahari, Bumi, dan Bulan berada dalam satu garis lurus ketika bulan baru (Bulan di antara Matahari dan Bumi) atau bulan purnama (Bumi di antara Matahari dan Bulan).',
      'Saat itu tarikan gravitasi Bulan dan Matahari searah dan saling menambah, sehingga air laut pasang paling tinggi.',
      'Jawabannya fase bulan baru atau bulan purnama (pilihan C).',
    ],
    tipsSerupa:
      'Trik mengingat: segaris berarti pasang besar (pasang purnama). Saat bulan kuartal (setengah), Bulan dan Matahari membentuk sudut siku-siku dan saling mengurangi, sehingga pasangnya kecil (pasang perbani).',
  },
  {
    nomor: 19,
    subBabId: 'F2',
    judulSingkat: 'Katrol untuk Menimba Air',
    teksSoal:
      'Empat model katrol digunakan untuk menimba air sumur. Model manakah yang membutuhkan gaya paling kecil?',
    gambarDeskripsi:
      'Empat model katrol: I katrol tetap, II katrol bergerak, III katrol ganda (2 roda), IV katrol majemuk (3 roda).',
    gambarSpec: {
      jenis: 'empat_katrol',
      judul: 'Empat Model Katrol Penimba Air (Model I – IV)',
    },
    pilihan: {
      A: 'Model I (Tetap)',
      B: 'Model II (Bergerak)',
      C: 'Model III (Ganda)',
      D: 'Model IV (Katrol Majemuk)',
      E: 'Semua model sama besar',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Gaya paling kecil dibutuhkan oleh sistem dengan keuntungan mekanis (KM) paling besar.',
      'KM katrol sama dengan jumlah tali yang menopang beban. Katrol tetap KM = 1, katrol bergerak KM = 2, dan sistem dengan banyak katrol memiliki KM lebih besar lagi.',
      'Model IV (katrol majemuk) punya katrol dan tali paling banyak, jadi KM terbesar dan gaya paling kecil (pilihan D).',
    ],
    tipsSerupa:
      'Hitung jumlah tali yang menopang beban. Semakin banyak, semakin ringan menariknya. Tapi ingat harganya: tali yang harus kamu tarik jadi lebih panjang, sehingga usahanya tetap sama.',
  },
  {
    nomor: 20,
    subBabId: 'I1',
    judulSingkat: 'Angka Penting pada Perkalian',
    teksSoal:
      'Hasil pengukuran tempat pensil memiliki panjang 22,63 cm dan lebar 8,27 cm. Berapakah luas tempat pensil menurut aturan angka penting?',
    pilihan: {
      A: '98,1801 cm²',
      B: '98,180 cm²',
      C: '98,18 cm²',
      D: '98,19 cm²',
      E: '187,2 cm²',
    },
    kunci: 'E',
    kunciTerverifikasi: 'E',
    pembahasanLangkah: [
      'Hitung banyak angka penting (AP): 22,63 punya 4 AP, dan 8,27 punya 3 AP.',
      'Kalikan: 22,63 × 8,27 = 187,1501.',
      'Aturan perkalian: hasilnya memakai angka penting paling sedikit, yaitu 3 AP. Jadi hasilnya sekitar 187 cm².',
      'Pilihan A sampai D (sekitar 98) jelas salah. Satu-satunya pilihan yang nilainya sekitar 187 adalah E (187,2).',
    ],
    tipsSerupa:
      'Perkalian dan pembagian: banyak angka penting hasil = banyak angka penting paling sedikit. Penjumlahan dan pengurangan: banyak angka di belakang koma hasil = yang paling sedikit. Perkiraan cepat membantu: 22 × 8 ≈ 180, jadi pilihan yang sekitar 98 langsung bisa dicoret.',
    perluCekSoalAsli: true,
    catatanCekAsli:
      'Kalau aturan 3 angka penting dipakai dengan ketat, hasilnya 187 cm², bukan 187,2 (yang punya 4 angka penting). Karena pilihan yang nilainya mendekati hanya E, kunci kuis memilih E. Sebaiknya angka pilihan E dicek lagi ke soal aslinya.',
  },
  {
    nomor: 21,
    subBabId: 'F1',
    judulSingkat: 'Tuas (Kesetimbangan)',
    teksSoal:
      'Sebuah tuas digunakan untuk mengangkat beban seberat 250 kg dengan gaya 60 kg. Jika panjang lengan kuasa 5 meter, panjang lengan beban adalah...',
    pilihan: {
      A: '1,0 meter',
      B: '1,2 meter',
      C: '1,4 meter',
      D: '1,6 meter',
      E: '2,0 meter',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Rumus tuas: beban × lengan beban = gaya × lengan kuasa.',
      'Masukkan angka: 250 × Lb = 60 × 5. Jadi Lb = 300 ÷ 250 = 1,2 m (pilihan B).',
    ],
    tipsSerupa:
      'Kalau kedua sisi memakai satuan yang sama (di sini sama-sama kg), satuannya boleh langsung dipakai tanpa diubah. Lengan kuasa yang panjang membuat gaya yang dibutuhkan kecil.',
  },
  {
    nomor: 22,
    subBabId: 'B2',
    judulSingkat: 'Pemuaian Kawat Platina',
    teksSoal:
      'Kawat platina panjang L bertambah panjang ΔL saat dipanaskan ΔT = 50°C. Jika kawat panjang 2L dipanaskan dari 277 K ke 327 K, pertambahan panjangnya menjadi...',
    pilihan: {
      A: '2 ΔL',
      B: '3 ΔL',
      C: '4 ΔL',
      D: '5 ΔL',
      E: 'ΔL',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Selisih suhu: 327 K − 277 K = 50 K. Selisih 50 K sama besar dengan selisih 50°C, jadi kenaikan suhunya sama dengan kondisi awal.',
      'Rumus pemuaian: ΔL = panjang awal × α × ΔT. Bahan dan ΔT sama, tetapi panjang awalnya menjadi 2 kali.',
      'Maka pertambahan panjangnya juga 2 kali: 2 ΔL (pilihan A).',
    ],
    tipsSerupa:
      'Untuk selisih suhu, kelvin dan celsius sama besarnya (yang berbeda hanya titik awalnya, 273). Kalau soal membandingkan dua keadaan, kerjakan dengan perbandingan saja: tidak perlu menghitung angka α.',
  },
  {
    nomor: 23,
    subBabId: 'F1',
    judulSingkat: 'Tuas Ahmad dan Budi',
    teksSoal:
      'Ahmad dan Budi mengangkat beban dengan tuas. Lengan beban 100 cm, lengan kuasa 200 cm, dan gaya 200 N. Berapa berat beban yang dapat diangkat?',
    pilihan: {
      A: '4000 N',
      B: '400 N',
      C: '40 N',
      D: '500 N',
      E: '50 N',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Rumus tuas: beban × lengan beban = gaya × lengan kuasa.',
      'W × 100 = 200 × 200, jadi W = 40.000 ÷ 100 = 400 N (pilihan B).',
    ],
    tipsSerupa:
      'Lengan kuasa 2 kali lengan beban berarti beban yang terangkat 2 kali gaya. Perbandingan lengan dalam cm boleh langsung dipakai tanpa mengubah ke meter. Pilihan yang terlalu ekstrem (seperti 4000 N) biasanya salah hitung koma atau nol.',
  },
  {
    nomor: 24,
    subBabId: 'D2',
    judulSingkat: 'Pipa Organa Dipendekkan',
    teksSoal:
      'Pipa organa menghasilkan nada dasar C. Jika pipa tersebut dipendekkan setengahnya, nada yang dihasilkan menjadi...',
    pilihan: {
      A: 'Nada C satu oktaf lebih tinggi dari nada dasar',
      B: 'Nada C setengah oktaf lebih tinggi dari nada dasar',
      C: 'Nada C satu oktaf lebih rendah dari nada dasar',
      D: 'Nada C setengah oktaf lebih rendah dari nada dasar',
      E: 'Nada C seperempat oktaf lebih rendah dari nada dasar',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Frekuensi nada berbanding terbalik dengan panjang pipa. Pipa lebih pendek menghasilkan nada lebih tinggi.',
      'Panjang pipa menjadi setengah, jadi frekuensi menjadi 2 kali lipat.',
      'Frekuensi 2 kali lipat disebut naik satu oktaf. Nadanya tetap C, tetapi lebih tinggi satu oktaf (pilihan A).',
    ],
    tipsSerupa:
      'Satu oktaf berarti perbandingan frekuensi 2 : 1. Bayangkan seruling kecil (piccolo) yang bunyinya tinggi dibandingkan seruling panjang yang bunyinya rendah.',
  },
  {
    nomor: 25,
    subBabId: 'E1',
    judulSingkat: 'Empat Hambatan 40 Ω',
    teksSoal:
      'Empat hambatan masing-masing 40 Ω dihubungkan ke sumber 25 Volt. Kuat arus total terbesar dan terkecil yang mungkin terjadi berturut-turut adalah...',
    pilihan: {
      A: '25 A dan 16 A',
      B: '2,5 A dan 0,16 A',
      C: '2,5 A dan 1,6 A',
      D: '0,25 A dan 0,16 A',
      E: '1,25 A dan 0,25 A',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Arus terbesar terjadi ketika hambatan total paling kecil, yaitu empat hambatan dirangkai paralel: 40 ÷ 4 = 10 Ω. Arusnya I = V ÷ R = 25 ÷ 10 = 2,5 A.',
      'Arus terkecil terjadi ketika hambatan total paling besar, yaitu dirangkai seri: 4 × 40 = 160 Ω. Arusnya 25 ÷ 160 ≈ 0,16 A.',
      'Urutannya terbesar dan terkecil: 2,5 A dan 0,16 A (pilihan B).',
    ],
    tipsSerupa:
      'Hukum Ohm: I = V ÷ R. Hambatan kecil membuat arus besar, hambatan besar membuat arus kecil. Kesalahan umum: terbalik antara seri dan paralel. Ingat, paralel itu “banyak jalan”, jadi arus mengalir lebih mudah.',
  },
];
