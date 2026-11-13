import type { SoalKuis50 } from '../types/physics';

export const KUIS_50_PART_2: SoalKuis50[] = [
  {
    nomor: 26,
    subBabId: 'G4',
    judulSingkat: 'Mengapa Bulan Tidak Punya Atmosfer',
    teksSoal:
      'Mengapa Bulan tidak memiliki lapisan atmosfer seperti halnya Bumi?',
    pilihan: {
      A: 'Karena di Bulan tidak terdapat unsur kimia pembentuk udara',
      B: 'Karena letak Bulan berada sangat jauh dari sumber energi Matahari',
      C: 'Karena gravitasi Bulan terlalu lemah menahan molekul gas',
      D: 'Karena gravitasi permukaan Bulan yang sangat kuat menyerap udara',
      E: 'Karena paparan radiasi sinar Matahari yang terlalu intensif',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Gravitasi Bulan hanya sekitar seperenam gravitasi Bumi.',
      'Molekul gas selalu bergerak cepat. Karena gravitasi Bulan lemah, molekul-molekul itu mudah lepas ke antariksa.',
      'Jadi alasan yang benar adalah gravitasi Bulan terlalu lemah untuk menahan gas (pilihan C).',
    ],
    tipsSerupa:
      'Waspadai pilihan yang berbunyi “gravitasi sangat kuat”. Gravitasi Bulan itu kecil, bukan besar. Pola yang sama berlaku untuk planet lain: planet besar dan berat (seperti Jupiter) mampu menahan atmosfer tebal, benda kecil seperti Bulan tidak.',
  },
  {
    nomor: 27,
    subBabId: 'E2',
    judulSingkat: 'Gaya Tolak Dua Muatan (Hukum Coulomb)',
    teksSoal:
      'Muatan +3q berjarak 10 cm dari +2q dengan gaya tolak 2 N. Jika muatan diubah menjadi +1q dan +12q serta jarak didekatkan jadi 5 cm, gaya tolaknya menjadi...',
    pilihan: {
      A: '2 N',
      B: '4 N',
      C: '8 N',
      D: '16 N',
      E: '32 N',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Gaya listrik sebanding dengan hasil kali muatan, dan berbanding terbalik dengan kuadrat jarak.',
      'Hasil kali muatan awal: 3 × 2 = 6. Setelah diubah: 1 × 12 = 12. Jadi gaya menjadi 2 kali.',
      'Jarak dari 10 cm menjadi 5 cm (setengahnya). Karena jarak dikuadratkan, gaya menjadi 4 kali.',
      'Gaya akhir = 2 N × 2 × 4 = 16 N (pilihan D).',
    ],
    tipsSerupa:
      'Kerjakan soal seperti ini dengan cara “menjadi berapa kali”, tidak perlu menghitung konstanta k. Ingat: jarak setengah berarti gaya 4 kali (bukan 2 kali), karena jaraknya dikuadratkan.',
  },
  {
    nomor: 28,
    subBabId: 'G3',
    judulSingkat: 'Komet, Meteorit, Meteor, dan Meteoroid',
    teksSoal:
      'Urutkan ciri benda langit: (1) Sampai tanah, (2) Guratan cahaya di atmosfer, (3) Batuan/logam antariksa, (4) Es & gas menguap berekor. Urutan untuk Komet, Meteorit, Meteor, Meteoroid adalah...',
    pilihan: {
      A: '1, 2, 3, 4',
      B: '3, 1, 2, 4',
      C: '4, 1, 2, 3',
      D: '2, 4, 1, 3',
      E: '4, 3, 2, 1',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Cocokkan satu per satu: Komet = es dan gas yang menguap lalu berekor (nomor 4).',
      'Meteorit = benda yang sampai ke tanah (nomor 1).',
      'Meteor = guratan cahaya di atmosfer, sering disebut bintang jatuh (nomor 2).',
      'Meteoroid = batuan atau logam di antariksa (nomor 3).',
      'Urutan untuk Komet, Meteorit, Meteor, Meteoroid adalah 4, 1, 2, 3 (pilihan C).',
    ],
    tipsSerupa:
      'Trik mengingat: Meteoroid melayang di antariksa, Meteor menyala di langit, Meteorit mendarat di tanah. Kamu tinggal ingat urutan tempatnya: luar angkasa, langit, tanah.',
  },
  {
    nomor: 29,
    subBabId: 'C4',
    judulSingkat: 'Dongkrak Hidrolik (Hukum Pascal)',
    teksSoal:
      'Sistem hidrolik tertutup: d₂ = 6 cm dan F₂ = 9 × F₁. Pernyataan yang benar tentang diameter d₁ dan tekanan adalah...',
    pilihan: {
      A: 'Diameter d₁ = 2 cm dan Tekanan pada kedua piston sama',
      B: 'Diameter d₁ = 3 cm dan Tekanan P₁ lebih besar dari P₂',
      C: 'Diameter d₁ = 2 cm dan Tekanan P₁ lebih besar dari P₂',
      D: 'Diameter d₁ = 3 cm dan Tekanan pada kedua piston sama',
      E: 'Diameter d₁ = 4 cm dan Tekanan P₁ lebih kecil dari P₂',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Hukum Pascal: tekanan pada kedua piston sama besar, jadi pernyataan “tekanan sama” sudah pasti benar.',
      'Karena tekanan sama, F₁ ÷ A₁ = F₂ ÷ A₂. Gaya F₂ = 9 × F₁, jadi luas A₂ = 9 × A₁.',
      'Luas lingkaran sebanding dengan diameter yang dikuadratkan. Luas 9 kali berarti diameter 3 kali (karena akar 9 = 3).',
      'Maka d₁ = 6 ÷ 3 = 2 cm. Jawabannya pilihan A.',
    ],
    tipsSerupa:
      'Gaya 9 kali berarti diameter 3 kali, bukan 9 kali. Jangan langsung membagi 6 dengan 9. Ingat luas lingkaran bergantung pada diameter kuadrat.',
  },
  {
    nomor: 30,
    subBabId: 'B5',
    judulSingkat: 'Rumah yang Sejuk',
    teksSoal:
      'Langkah renovasi rumah agar ruangan dalam bersuhu dingin berdasarkan konsep Asas Black dan radiasi termal adalah...',
    pilihan: {
      A: 'Menggunakan cat dinding rumah berwarna hitam gelap',
      B: 'Menggunakan cat dinding rumah berwarna biru gelap',
      C: 'Menggunakan cat dinding rumah berwarna putih terang',
      D: 'Menggunakan jendela kaca tanpa pemantul sinar matahari',
      E: 'Memperbanyak ruangan tertutup rapat tanpa ventilasi',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Panas dari Matahari sampai ke dinding lewat radiasi (pancaran).',
      'Warna gelap menyerap banyak panas radiasi, sedangkan warna terang atau putih memantulkannya.',
      'Agar ruangan dalam sejuk, cat dinding dengan warna putih terang (pilihan C).',
    ],
    tipsSerupa:
      'Pikirkan baju: baju putih lebih sejuk dipakai saat siang yang terik daripada baju hitam. Benda gelap dan kasar adalah penyerap serta pemancar radiasi yang baik. Benda putih dan mengkilap adalah pemantul yang baik.',
  },
  {
    nomor: 31,
    subBabId: 'G2',
    judulSingkat: 'Selisih Waktu Antar Kota',
    teksSoal:
      'Kota A (105°BT) menunjukkan pukul 09.12. Pada saat yang sama, Kota B (123°BT) menunjukkan pukul...',
    pilihan: {
      A: '10.12',
      B: '09.58',
      C: '10.32',
      D: '09.42',
      E: '10.24',
    },
    kunci: 'E',
    kunciTerverifikasi: 'E',
    pembahasanLangkah: [
      'Beda bujur = 123° − 105° = 18°.',
      'Setiap 1° bujur sama dengan 4 menit. Jadi 18 × 4 = 72 menit = 1 jam 12 menit.',
      'Kota B berada di sebelah timur Kota A, jadi waktunya lebih maju: 09.12 + 1 jam 12 menit = 10.24 (pilihan E).',
    ],
    tipsSerupa:
      'Ingat: timur lebih cepat (Matahari terbit lebih dulu), barat lebih lambat. Bumi berputar 360° dalam 24 jam, jadi 15° per jam, atau 1° per 4 menit. Jangan lupa mengubah menit menjadi jam dan menit.',
  },
  {
    nomor: 32,
    subBabId: 'E4',
    judulSingkat: 'Gaya Lorentz pada Kawat',
    teksSoal:
      'Kawat berarus 5 A melewati medan magnet 8 × 10⁻⁵ Tesla menghasilkan gaya Lorentz 10 × 10⁻⁴ N. Jika kawat dipotong setengahnya, gaya Lorentz menjadi...',
    pilihan: {
      A: '5,0 × 10⁻⁴ N',
      B: '5,4 × 10⁻⁴ N',
      C: '3,88 × 10⁻³ N',
      D: '2,6 × 10⁻³ N',
      E: '1,8 × 10⁻⁴ N',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Rumus gaya Lorentz: F = B × I × L. Medan magnet (B) dan arus (I) tidak berubah, hanya panjang kawat (L) yang berubah.',
      'Kawat dipotong setengahnya, jadi L menjadi setengah. Maka gaya juga menjadi setengah.',
      'F baru = 10 × 10⁻⁴ ÷ 2 = 5 × 10⁻⁴ N (pilihan A).',
    ],
    tipsSerupa:
      'Kalau hanya satu besaran yang berubah, cukup lihat hubungannya. Gaya sebanding dengan panjang kawat, jadi panjang setengah berarti gaya setengah. Perhatikan pangkat: 10 × 10⁻⁴ sama dengan 1 × 10⁻³.',
  },
  {
    nomor: 33,
    subBabId: 'D3',
    judulSingkat: 'Fathometer Mencari Puing Pesawat',
    teksSoal:
      'Alat fathometer menerima pantulan gelombang 5 detik setelah dikirim (v = 1400 m/s). Kedalaman puing pesawat adalah...',
    pilihan: {
      A: '2.000 m',
      B: '2.500 m',
      C: '3.000 m',
      D: '3.500 m',
      E: '4.000 m',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Gelombang pergi ke dasar laut dan kembali lagi, jadi 5 detik adalah waktu pergi-pulang.',
      'Kedalaman = v × t ÷ 2 = 1.400 × 5 ÷ 2 = 3.500 m (pilihan D).',
    ],
    tipsSerupa:
      'Sama seperti sonar dan gema: jarak = cepat rambat × waktu ÷ 2. Cara cepat: 1.400 × 5 = 7.000, lalu dibagi 2.',
  },
  {
    nomor: 34,
    subBabId: 'C4',
    judulSingkat: 'Mesin Hidrolik Pengangkat Mobil',
    teksSoal:
      'Rino menekan pengisap A untuk mengangkat mobil di pengisap B, tetapi gaya F tidak cukup. Langkah pertama yang harus dilakukan Rino adalah...',
    pilihan: {
      A: 'Memperbesar diameter dari penampang pengisap A',
      B: 'Memperkecil diameter dari penampang pengisap A',
      C: 'Mengubah bentuk geometris dari penampang pengisap A',
      D: 'Menambah massa pemberat pada penampang pengisap A',
      E: 'Menambah panjang penampang pada mesin hidrolik B',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Pada hidrolik, gaya output = gaya input × (luas pengisap B ÷ luas pengisap A).',
      'Agar gaya F yang kecil bisa mengangkat mobil, perbandingan luas B terhadap A harus lebih besar.',
      'Caranya: memperkecil diameter pengisap A (pilihan B), sehingga luas A mengecil dan hasil bagi menjadi besar.',
    ],
    tipsSerupa:
      'Pengisap input dibuat kecil, pengisap output dibuat besar. Dengan begitu gaya kecil bisa mengangkat beban berat. Memang menambah pemberat juga menambah gaya, tetapi soal ini menanyakan langkah yang berkaitan dengan rancangan alat menurut konsep hukum Pascal, yaitu mengubah ukuran penampang.',
  },
  {
    nomor: 35,
    subBabId: 'F2',
    judulSingkat: 'Tuas Digabung dengan Katrol Tetap',
    teksSoal:
      'Tuas angkat peti 900 N (L_kuasa = 1,2 m, L_beban = 0,3 m) diteruskan ke katrol tetap. Gaya tangan operator dan usahanya jika bergerak 1,5 m adalah...',
    pilihan: {
      A: '169 N dan 326,4 Joule',
      B: '179 N dan 326,4 Joule',
      C: '225 N dan 337,5 Joule',
      D: '225 N dan 467,2 Joule',
      E: '337 N dan 467,2 Joule',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Gaya pada tuas: F = beban × (lengan beban ÷ lengan kuasa) = 900 × (0,3 ÷ 1,2) = 225 N.',
      'Katrol tetap tidak mengubah besar gaya (KM = 1), hanya mengubah arah. Jadi gaya tangan operator tetap 225 N.',
      'Usaha = gaya × jarak = 225 × 1,5 = 337,5 J (pilihan C).',
    ],
    tipsSerupa:
      'Kalau ada dua alat digabung, selesaikan satu per satu. Katrol tetap hanya mengubah arah gaya, bukan besarnya. Usaha selalu gaya dikali jarak, dengan jarak yang sesuai dengan gaya itu.',
  },
  {
    nomor: 36,
    subBabId: 'B6',
    judulSingkat: 'Gas Dipanaskan pada Tekanan Tetap',
    teksSoal:
      'Gas 1,5 m³ suhu 13°C ditingkatkan ke 87°C pada tekanan tetap (isobarik). Volume gas baru adalah...',
    pilihan: {
      A: '1,88 m³',
      B: '1,98 m³',
      C: '2,88 m³',
      D: '2,98 m³',
      E: '2,78 m³',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Suhu harus diubah ke kelvin: T₁ = 13 + 273 = 286 K dan T₂ = 87 + 273 = 360 K.',
      'Pada tekanan tetap berlaku V₁ ÷ T₁ = V₂ ÷ T₂. Jadi V₂ = 1,5 × (360 ÷ 286) ≈ 1,89 m³ (pembulatan potong 1,888 → 1,88 m³).',
      'Pilihan terdekat adalah 1,88 m³ (pilihan A).',
    ],
    tipsSerupa:
      'Hukum Charles: volume sebanding dengan suhu dalam kelvin. Jangan pernah memakai celsius langsung pada rumus gas. Perkiraan cepat: suhu naik sekitar 1,26 kali, jadi 1,5 × 1,26 ≈ 1,89. Kalau hasil hitunganmu dan pilihan beda tipis, pilih yang paling dekat.',
  },
  {
    nomor: 37,
    subBabId: 'B5',
    judulSingkat: 'Asap dalam Kotak Kaca',
    teksSoal:
      'Asap kertas terbakar dimasukkan lewat pipa B di kotak kaca, lalu asap keluar lewat pipa A dan C. Peristiwa ini menunjukkan perpindahan kalor secara...',
    gambarDeskripsi:
      'Kotak kaca dengan tiga pipa di atasnya (A, B, C). Asap dimasukkan lewat pipa B dan keluar lewat pipa A dan C.',
    gambarSpec: {
      jenis: 'kotak_asap',
      judul: 'Kotak Kaca Percobaan Aliran Asap (Pipa A, B, C)',
    },
    pilihan: {
      A: 'Perpindahan kalor secara Konveksi alami',
      B: 'Perpindahan kalor secara Konduksi molekuler',
      C: 'Perpindahan kalor secara Induksi medan termal',
      D: 'Perpindahan kalor secara Radiasi gelombang',
      E: 'Perpindahan kalor secara Distribusi spasial',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Perhatikan: asap (zat) ikut bergerak bersama udara panas.',
      'Perpindahan kalor yang disertai perpindahan zat disebut konveksi. Konduksi terjadi lewat zat padat tanpa zatnya berpindah, dan radiasi terjadi tanpa zat perantara.',
      'Jadi jawabannya konveksi (pilihan A).',
    ],
    tipsSerupa:
      'Tanyakan: “apakah zat atau partikelnya ikut bergerak?” Kalau ya, itu konveksi (terjadi pada zat cair dan gas). Contoh: angin laut, air mendidih, asap naik.',
  },
  {
    nomor: 38,
    subBabId: 'G3',
    judulSingkat: 'Asteroid dan Komet',
    teksSoal: 'Perbedaan utama antara Asteroid dan Komet terletak pada...',
    pilihan: {
      A: 'Asteroid berukuran lebih besar dibandingkan komet',
      B: 'Komet ber-orbit melingkar, sedangkan asteroid ber-orbit elips',
      C: 'Asteroid berukuran jauh lebih kecil dibandingkan komet',
      D: 'Komet berada di sabuk komet, asteroid di sabuk asteroid',
      E: 'Asteroid dari batuan/logam, komet dari es/debu menguap',
    },
    kunci: 'E',
    kunciTerverifikasi: 'E',
    pembahasanLangkah: [
      'Asteroid tersusun dari batuan atau logam padat.',
      'Komet tersusun dari es, debu, dan gas beku yang menguap ketika dekat Matahari, sehingga muncul ekor.',
      'Perbedaan utama ada pada bahan penyusunnya (pilihan E). Ukuran dan bentuk orbit bukan pembeda utama, karena keduanya mengikuti orbit elips.',
    ],
    tipsSerupa:
      'Ingat julukan “komet = bola salju kotor” dan “asteroid = batu angkasa”. Kalau ada pilihan tentang ukuran atau bentuk orbit, periksa lagi karena biasanya itu bukan pembeda yang paling pokok.',
  },
  {
    nomor: 39,
    subBabId: 'B2',
    judulSingkat: 'Kawat Besi dan Kuningan Dipanaskan',
    teksSoal:
      'Kawat Besi dan Kuningan panjang 200 m dipanaskan dari 20°C ke 30°C. Logam manakah yang memuai paling panjang?',
    pilihan: {
      A: 'Besi memuai lebih panjang dengan panjang 200,028 m',
      B: 'Kuningan memuai lebih panjang karena α kuningan > besi',
      C: 'Besi memuai lebih panjang karena massa jenisnya besar',
      D: 'Kedua kawat bertambah panjang secara identik dan sama',
      E: 'Kuningan memuai lebih panjang dengan panjang 200,010 m',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Rumus pemuaian: ΔL = panjang awal × α × ΔT. Panjang awal (200 m) dan kenaikan suhu (10°C) sama, jadi yang membedakan hanya koefisien muai α.',
      'α kuningan (19 × 10⁻⁶) lebih besar daripada α besi (12 × 10⁻⁶). Jadi kuningan memuai lebih panjang.',
      'Cek: besi bertambah 200 × 12 × 10⁻⁶ × 10 = 0,024 m, kuningan bertambah 0,038 m (menjadi 200,038 m).',
      'Jawabannya pilihan B (karena α kuningan lebih besar).',
    ],
    tipsSerupa:
      'Bandingkan hanya besaran yang berbeda. Hati-hati dengan angka di dalam pilihan jawaban: pilihan E menulis “kuningan memuai lebih panjang” (benar) tetapi angka 200,010 m salah. Jangan tergoda pilihan yang separuh benar.',
  },
  {
    nomor: 40,
    subBabId: 'H1',
    judulSingkat: 'Teropong Bintang dan Teropong Bumi',
    teksSoal:
      'Teropong bintang dan bumi perbesaran M = 4 kali. Fokus objektif f_ob1 = 60 cm dan f_ob2 = 40 cm, fokus pembalik f_p = 10 cm. Perbandingan panjang teropong bintang dan bumi adalah...',
    pilihan: {
      A: '2 : 3',
      B: '3 : 2',
      C: '5 : 6',
      D: '6 : 5',
      E: '12 : 15',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Teropong bintang: perbesaran M = f objektif ÷ f okuler, sehingga f okuler = 60 ÷ 4 = 15 cm. Panjang teropong = 60 + 15 = 75 cm.',
      'Teropong bumi: f okuler = 40 ÷ 4 = 10 cm. Teropong bumi punya lensa pembalik, sehingga panjangnya = f objektif + 4 × f pembalik + f okuler = 40 + 40 + 10 = 90 cm.',
      'Perbandingan 75 : 90. Bagi keduanya dengan 15 menjadi 5 : 6 (pilihan C).',
    ],
    tipsSerupa:
      'Teropong bumi lebih panjang karena ada lensa pembalik (tambahan 4 × f pembalik). Hafalkan tiga rumus panjang teropong. Setelah mendapat perbandingan, sederhanakan dengan membagi kedua angka dengan bilangan yang sama.',
  },
  {
    nomor: 41,
    subBabId: 'A1',
    judulSingkat: 'Bola Menggelinding di Bidang Miring',
    teksSoal:
      'Bola pejal bermassa M menggelinding tanpa selip turun di bidang miring. Percepatan linier bola dipengaruhi oleh...',
    gambarDeskripsi:
      'Segitiga bidang miring dengan sebuah bola pejal berada di permukaan miringnya.',
    gambarSpec: {
      jenis: 'bidang_miring',
      judul: 'Bola Pejal Menggelinding di Bidang Miring',
      bendaBidang: 'bola',
    },
    pilihan: {
      A: 'Hanya nilai percepatan gravitasi bumi g di tempat tersebut',
      B: 'Momen inersia bola pejal (k = 2/5) dan sudut kemiringan',
      C: 'Hanya nilai massa total dari bola pejal M',
      D: 'Nilai kecepatan angin di area sekitar lintasan',
      E: 'Luas permukaan luar dari bola pejal tersebut',
    },
    kunci: 'B',
    kunciTerverifikasi: 'B',
    pembahasanLangkah: [
      'Bola menggelinding berarti sebagian energinya dipakai untuk berputar, sehingga lebih lambat daripada benda yang meluncur.',
      'Rumus percepatannya: a = (g × sin θ) ÷ (1 + k). Di sini k adalah konstanta bentuk (untuk bola pejal k = 2/5) dan θ adalah sudut kemiringan.',
      'Massa bola M ada di atas dan di bawah rumus, sehingga saling menghilangkan. Massa tidak berpengaruh.',
      'Percepatan dipengaruhi oleh bentuk bola (k) dan sudut kemiringan, yaitu pilihan B.',
    ],
    tipsSerupa:
      'Seperti Galileo: percepatan benda menggelinding tidak bergantung pada massa maupun ukuran, hanya pada bentuk dan sudut kemiringan. Bola pejal menggelinding lebih cepat daripada bola berongga. Pilihan yang hanya menyebut g saja kurang lengkap, karena sudut ikut berpengaruh.',
  },
  {
    nomor: 42,
    subBabId: 'A2',
    judulSingkat: 'Joni Menyusul Dava',
    teksSoal:
      'Joni berlari kelajuan 3,60 m/s berada 4 meter di belakang Dava (3,40 m/s). Waktu yang diperlukan Joni untuk menyusul Dava adalah...',
    pilihan: {
      A: '15 sekon',
      B: '10 sekon',
      C: '20 sekon',
      D: '5 sekon',
      E: '25 sekon',
    },
    kunci: 'C',
    kunciTerverifikasi: 'C',
    pembahasanLangkah: [
      'Joni berlari 3,60 m/s dan Dava 3,40 m/s, searah. Setiap detik Joni mendekat sejauh selisihnya: 3,60 − 3,40 = 0,20 m.',
      'Jarak yang harus dikejar = 4 m.',
      'Waktu = jarak ÷ selisih kecepatan = 4 ÷ 0,20 = 20 sekon (pilihan C).',
    ],
    tipsSerupa:
      'Kecepatan relatif: kalau searah, kurangkan kecepatannya. Kalau berlawanan arah, jumlahkan. Cek jawabanmu: 0,20 × 20 = 4 meter, pas dengan jarak awal.',
  },
  {
    nomor: 43,
    subBabId: 'E3',
    judulSingkat: 'Memperkuat Medan Magnet Kawat Berarus',
    teksSoal:
      'Medan magnet yang dihasilkan oleh kawat penghantar berarus listrik dapat diperkuat dengan cara...',
    pilihan: {
      A: 'Mengurangi panjang total kawat penghantar listrik',
      B: 'Mengurangi kuat arus listrik yang mengalir pada kawat',
      C: 'Menggunakan kawat penghantar berdiameter lebih kecil',
      D: 'Menggulung kawat menjadi kumparan dengan banyak lilitan',
      E: 'Menjauhkan kawat penghantar dari objek bermagnetik',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Medan magnet dari kawat lurus itu lemah. Kalau kawat digulung menjadi kumparan, medan magnet dari tiap lilitan saling menumpuk.',
      'Semakin banyak lilitan, medan magnet semakin kuat.',
      'Jawabannya menggulung kawat menjadi kumparan dengan banyak lilitan (pilihan D).',
    ],
    tipsSerupa:
      'Tiga cara membuat elektromagnet lebih kuat: perbanyak lilitan, perbesar arus, dan beri inti besi. Menurunkan arus justru melemahkan magnet.',
  },
  {
    nomor: 44,
    subBabId: 'C2',
    judulSingkat: 'Manometer Raksa',
    teksSoal:
      'Raksa dalam bejana & pipa kaca: permukaan raksa di pipa lebih rendah. Jika P_luar = 0,8 atm, langkah pertama Oca untuk mencari tekanan udara dalam pipa adalah...',
    pilihan: {
      A: 'Menyetarakan satuan tekanan udara dari atm ke cmHg',
      B: 'Membuat perbandingan ukuran diameter bejana dengan pipa',
      C: 'Membuat perbandingan massa jenis raksa dengan udara',
      D: 'Mengukur total massa raksa di dalam bejana terbuka',
      E: 'Mengabaikan tekanan atmosfer udara luar lingkungan',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Tekanan udara luar tertulis dalam atm (0,8 atm), sedangkan tinggi raksa nanti dalam cmHg. Satuannya berbeda, jadi tidak bisa langsung dijumlahkan.',
      'Karena itu langkah pertama adalah menyamakan satuan: 1 atm = 76 cmHg, sehingga 0,8 atm = 60,8 cmHg.',
      'Baru setelah itu tekanan dalam pipa bisa dicari dengan menambah atau mengurangi tinggi raksa. Jawabannya pilihan A.',
    ],
    tipsSerupa:
      'Selalu samakan satuan dulu sebelum menghitung. Konversi penting: 1 atm = 76 cmHg = 760 mmHg ≈ 100.000 Pa.',
  },
  {
    nomor: 45,
    subBabId: 'C3',
    judulSingkat: 'Percobaan Barometer Torricelli',
    teksSoal:
      'Langkah penting Agus dalam eksperimen barometer Torricelli untuk mengukur tekanan atmosfer gunung adalah...',
    pilihan: {
      A: 'Mengisi penuh tabung dengan raksa, menutup ujungnya dengan jari, lalu membalikkan ke bejana raksa',
      B: 'Mengisi tabung kaca hingga separuh bagian volume sebelum dibalikkan',
      C: 'Meniup tabung kaca sampai steril sebelum diisi dengan cairan raksa',
      D: 'Menimbang massa tabung kaca kosong sebelum diisi cairan raksa',
      E: 'Membiarkan tabung kaca terbuka di kedua ujungnya tanpa ditudungi',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Langkah yang benar: (1) isi tabung kaca penuh dengan raksa, (2) tutup ujung tabung dengan jari, (3) balikkan tabung ke dalam bejana berisi raksa, (4) lepaskan jari.',
      'Raksa akan turun sedikit dan meninggalkan ruang hampa di bagian atas tabung. Tinggi kolom raksa menunjukkan tekanan atmosfer (sekitar 76 cm di permukaan laut).',
      'Jawabannya pilihan A.',
    ],
    tipsSerupa:
      'Kata kunci: tabung harus penuh dulu, tertutup, lalu dibalik. Kalau tabung hanya terisi separuh, udara di dalamnya akan mengganggu hasil. Di gunung, kolom raksa lebih rendah karena tekanan udara lebih kecil.',
  },
  {
    nomor: 46,
    subBabId: 'G4',
    judulSingkat: 'Menimbang Massa Matahari',
    teksSoal:
      'Bumi mengelilingi Matahari (r = 1,5 × 10⁸ km, T = 365 hari). Hitung massa Matahari!',
    pilihan: {
      A: '1,5 × 10²⁷ kg',
      B: '3,0 × 10²⁷ kg',
      C: '5,0 × 10²⁸ kg',
      D: '3,2 × 10²⁹ kg',
      E: '2,0 × 10³⁰ kg',
    },
    kunci: 'E',
    kunciTerverifikasi: 'E',
    pembahasanLangkah: [
      'Ubah satuan: jarak r = 1,5 × 10⁸ km = 1,5 × 10¹¹ m. Periode T = 365 × 86.400 s ≈ 3,15 × 10⁷ s.',
      'Pakai rumus M = 4 × π² × r³ ÷ (G × T²), dengan G = 6,67 × 10⁻¹¹.',
      'Bagian atas: r³ = 3,375 × 10³³; 4π² ≈ 39,5; hasilnya ≈ 1,33 × 10³⁵.',
      'Bagian bawah: G × T² ≈ 6,67 × 10⁻¹¹ × 9,94 × 10¹⁴ ≈ 6,63 × 10⁴.',
      'M ≈ 1,33 × 10³⁵ ÷ 6,63 × 10⁴ ≈ 2,0 × 10³⁰ kg (pilihan E).',
    ],
    tipsSerupa:
      'Pada soal dengan angka sangat besar, perhatikan dulu pangkat sepuluhnya. Pilihan jawaban di sini beda pangkat jauh, jadi perkiraan kasar sudah cukup. Massa Matahari sekitar 2 × 10³⁰ kg dan massa Bumi sekitar 6 × 10²⁴ kg adalah angka yang bagus untuk dihafal.',
  },
  {
    nomor: 47,
    subBabId: 'E5',
    judulSingkat: 'Transformator',
    teksSoal:
      'Transformator menghasilkan Tegangan Primer = 75 Volt dan Tegangan Sekunder = 125 Volt. Perbandingan jumlah lilitan sekunder : primer adalah...',
    pilihan: {
      A: '2 : 3',
      B: '3 : 2',
      C: '3 : 5',
      D: '5 : 3',
      E: '5 : 2',
    },
    kunci: 'D',
    kunciTerverifikasi: 'D',
    pembahasanLangkah: [
      'Rumus trafo: Ns ÷ Np = Vs ÷ Vp.',
      'Masukkan angka: Ns ÷ Np = 125 ÷ 75 = 5 ÷ 3.',
      'Soal meminta perbandingan sekunder : primer = 5 : 3 (pilihan D).',
    ],
    tipsSerupa:
      'Baca urutan yang diminta: “sekunder : primer”. Jangan sampai terbalik. Kalau tegangan sekunder lebih besar dari primer, itu trafo penaik tegangan (step-up), dan lilitan sekunder lebih banyak.',
  },
  {
    nomor: 48,
    subBabId: 'F3',
    judulSingkat: 'Bidang Miring Licin',
    teksSoal:
      'Balok berat 5000 N di bidang miring licin panjang 10 m tinggi 8 m. Tentukan gaya F penahan sejajar bidang miring agar balok tidak turun!',
    gambarDeskripsi:
      'Segitiga bidang miring dengan balok di atasnya. Panjang bidang miring 10 m dan tingginya 8 m.',
    gambarSpec: {
      jenis: 'bidang_miring',
      judul: 'Balok 5000 N pada Bidang Miring Licin (10 m × 8 m)',
      panjangBidang: 10,
      tinggiBidang: 8,
      beratBenda: 5000,
      bendaBidang: 'balok',
    },
    pilihan: {
      A: '4000 N',
      B: '4500 N',
      C: '5000 N',
      D: '5500 N',
      E: '6000 N',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Pada bidang miring licin, gaya penahan sejajar bidang: F = W × (tinggi ÷ panjang).',
      'F = 5.000 × (8 ÷ 10) = 4.000 N (pilihan A).',
    ],
    tipsSerupa:
      'Semakin landai bidang miringnya, semakin kecil gaya yang dibutuhkan (tapi lintasannya lebih panjang). Ingat prinsip usaha sama: F × panjang = W × tinggi.',
  },
  {
    nomor: 49,
    subBabId: 'B4',
    judulSingkat: 'Campuran Air dan Es (Asas Black)',
    teksSoal:
      'X gram air 30°C dicampur Y gram es -10°C. Setelah diaduk 50% es melebur (Suhu campuran = 0°C). Rasio X : Y adalah...',
    pilihan: {
      A: '3 : 2',
      B: '2 : 1',
      C: '1 : 1',
      D: '1 : 2',
      E: '2 : 3',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Asas Black: kalor yang dilepas air = kalor yang diterima es.',
      'Air X gram turun dari 30°C ke 0°C: kalor lepas = X × 1 × 30 = 30X.',
      'Es Y gram menerima kalor dua kali: naik dari −10°C ke 0°C (kalor jenis es 0,5): Y × 0,5 × 10 = 5Y. Lalu separuh es melebur: 0,5 × Y × 80 = 40Y. Total kalor terima = 45Y.',
      'Samakan: 30X = 45Y, jadi X : Y = 45 : 30 = 3 : 2 (pilihan A).',
    ],
    tipsSerupa:
      'Kerjakan es tahap demi tahap: naikkan suhu dulu, baru melebur. Hafalkan angka penting: kalor jenis air 1 kal/g°C, es 0,5 kal/g°C, dan kalor lebur es 80 kal/g. Kalau hanya sebagian es yang melebur, suhu akhir pasti 0°C.',
  },
  {
    nomor: 50,
    subBabId: 'D2',
    judulSingkat: 'Resonansi pada Tabung',
    teksSoal:
      'Tabung silinder panjang udara 30 cm di atas air. Garpu tala f = 425 Hz, cepat rambat v = 340 m/s. Apakah terjadi resonansi?',
    gambarDeskripsi:
      'Tabung silinder berisi air di bagian bawah, dengan kolom udara di atas air. Garpu tala digetarkan di mulut tabung.',
    gambarSpec: {
      jenis: 'tabung_resonansi',
      judul: 'Tabung Kolom Udara di Atas Air & Garpu Tala (425 Hz)',
    },
    pilihan: {
      A: 'Ya, terjadi resonansi kuat pada mode ke-2 (Harmoni ke-3)',
      B: 'Ya, terjadi resonansi kuat pada mode ke-1 saja',
      C: 'Tidak terjadi resonansi dalam tabung silinder',
      D: 'Ya, terjadi resonansi kuat pada mode ke-5',
      E: 'Terjadi resonansi yang sangat lemah dalam tabung',
    },
    kunci: 'A',
    kunciTerverifikasi: 'A',
    pembahasanLangkah: [
      'Hitung panjang gelombang bunyi: λ = v ÷ f = 340 ÷ 425 = 0,8 m = 80 cm.',
      'Tabung ini tertutup di bawah (oleh air) dan terbuka di atas. Resonansi terjadi ketika panjang kolom udara = ¼λ, ¾λ, 5/4 λ, dan seterusnya (kelipatan ganjil dari ¼λ). Artinya pada 20 cm, 60 cm, 100 cm, dan seterusnya.',
      'Resonansi kedua (disebut harmonik ke-3) terjadi pada panjang ¾λ = 60 cm.',
      'Kunci kuis memilih pilihan A (resonansi pada mode ke-2 atau harmonik ke-3), yang cocok dengan panjang kolom udara 60 cm.',
    ],
    tipsSerupa:
      'Untuk pipa atau tabung tertutup satu ujung, hitung dulu ¼λ, lalu kalikan bilangan ganjil (1, 3, 5, ...). Untuk pipa terbuka kedua ujung, pakai kelipatan ½λ. Selalu cek apakah panjang yang diberikan benar-benar cocok dengan pola itu.',
    perluCekSoalAsli: true,
    catatanCekAsli:
      'Di soal tertulis panjang kolom udara 30 cm. Dengan angka itu, 30 cm bukan salah satu dari 20, 60, 100 cm, sehingga sebenarnya tidak terjadi resonansi (jawabannya akan jadi pilihan C). Pilihan A cocok kalau panjang kolomnya 60 cm. Kemungkinan angka di soal salah ketik. Mohon dicek ke soal asli sebelum dipakai untuk menilai.',
  },
];
