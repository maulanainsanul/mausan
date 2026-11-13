# Jagoan Fisika — Belajar Olimpiade Fisika SMP dengan Pemandu Suara

Aplikasi web **mobile-first** berkonsep **Laboratorium Petualang** untuk siswa SMP (12–15 tahun) dan guru pembina Olimpiade Fisika. Dilengkapi maskot pemandu suara orisinal **Volta** (Web Speech API `id-ID` + subtitle tersorot), 9 bab (33 sub-bab lengkap), embed YouTube aman dengan deteksi video mati & cadangan, rumus KaTeX bersatuan, contoh terpandu interaktif, 33 generator soal parametrik 3 level, Kuis Olimpiade 50 Soal + modul Impor Kuis, serta siap dipasang sebagai PWA maupun dibungkus menjadi APK Android.

## Fitur Utama

1. **Alur Belajar 6 Tahap per Sub-bab**:
   - **Tahap 1 — Dengarkan Pemandu**: Volta membacakan pengantar & 3 Tugas Tonton dengan subtitle tersorot per kalimat.
   - **Tahap 2 — Tonton Video**: Lazy-load YouTube `youtube-nocookie.com` IFrame API, pilihan video utama/cadangan, deteksi error otomatis, Catatan Cepat, dan centang Tugas Tonton.
   - **Tahap 3 — Rumus & Jebakan**: Konsep inti (maks 3 poin), rumus KaTeX berlabel satuan, langkah baku, dan 2 jebakan umum.
   - **Tahap 4 — Kita Kerjakan Bareng**: Contoh terpandu langkah demi langkah dengan isian wajib anak di tiap langkah.
   - **Tahap 5 — Latihan Soal Mirip (3 Level)**: Dihasilkan deterministik oleh 33 generator parametrik (*Meniru*, *Variasi*, *Tantangan*) lengkap dengan tombol *Lihat cara yang sama seperti di video* dan sistem bintang 0–3.
   - **Tahap 6 — Tantangan Soal Olimpiade Asli**: Soal terpetakan dari Kuis 50 Soal lengkap dengan pembahasan langkah dan tips soal serupa.
2. **Mode Kurator Tersembunyi**: Ketuk logo **Jagoan Fisika** sebanyak **5 kali** dalam 3 detik untuk membuka daftar periksa video (ubah status layak/mati/kurang cocok, isi `mulaiDetik`/`selesaiDetik`, jadikan utama, lihat perbedaan kunci impor, dan **Ekspor JSON**).
3. **Impor Kuis HTML / JSON**: Tempelkan file HTML atau JSON kuis 50 soal Anda di menu **Latihan → Kuis 50 Soal → Impor Kuis**. Kunci dibandingkan otomatis dengan daftar terverifikasi Bagian 7 tanpa menimpa peringatan guru.

## Instalasi & Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Pengujian Generator & Build

- **Uji 33 generator soal (500× per generator = 16.500 soal) + konversi suhu/satuan**:
  ```bash
  npm run test:soal
  ```
- **Pemeriksaan tipe TypeScript**:
  ```bash
  npm run lint
  ```
- **Build produksi PWA**:
  ```bash
  npm run build
  ```

## Panduan Mengubah Menjadi APK Android

> **Catatan Penting**: Layanan YouTube embed membutuhkan koneksi internet aktif. Pastikan izin `INTERNET` aktif di `AndroidManifest.xml` dan setelan WebView Android mengizinkan `playsinline` (`setMediaPlaybackRequiresUserGesture(false)` jika diperlukan).

### Jalur 1 (Paling Mudah): PWABuilder
1. Jalankan `npm run build` lalu deploy folder `dist/` ke hosting HTTPS (misalnya Firebase Hosting, Netlify, atau Vercel).
2. Buka [https://www.pwabuilder.com/](https://www.pwabuilder.com/) dan masukkan URL aplikasi HTTPS Anda.
3. Pilih **Package for Stores → Android → Generate Package**.
4. Unduh paket APK/AAB dan tanda tangani menggunakan keystore Anda (atau gunakan keystore yang dihasilkan PWABuilder).

### Jalur 2: Capacitor
File `capacitor.config.ts` sudah disiapkan di root proyek (`appId: "id.jagoanfisika.app"`, `webDir: "dist"`).
1. Pasang paket Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```
2. Build aplikasi web dan sinkronkan ke proyek Android:
   ```bash
   npm run build
   npx cap add android
   npx cap sync android
   ```
3. Buka proyek Android di Android Studio:
   ```bash
   npx cap open android
   ```
4. Pastikan di `android/app/src/main/AndroidManifest.xml` terdapat:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```
5. Di Android Studio pilih **Build → Generate Signed Bundle / APK → APK** untuk menghasilkan file `.apk` siap pasang.

## Daftar Hal yang Masih Perlu Diperiksa Guru

1. **Verifikasi Video YouTube (Mode Kurator — ketuk logo 5 kali)**:
   - Seluruh ID video di `src/data/videos.ts` dipilih dari hasil pencarian YouTube tanggal 13 November 2026 dan belum dibuka satu per satu. Periksa kelayakan isi, isi kolom `mulaiDetik`/`selesaiDetik` bila perlu, lalu ekspor JSON.
   - Sub-bab **B6 (Hukum Charles)** belum memiliki kandidat video yang meyakinkan; aplikasi menampilkan kartu *Video sedang dicari* + tautan pencarian YouTube.
   - Video **G4 (`pWRsFLQ6KQ4`)** berformat YouTube Shorts dan ditampilkan sebagai tautan langsung bila penyematan tidak didukung.
   - Video **E6** dan **G4 soal 46** ditandai berada di atas level SMP standar.
2. **Tiga Soal Bertanda "Cek soal asli"**:
   - **Soal 12 (LC)**: dengan 40 µF dan 25 mH hasil hitung ≈ 1.884.000 m; pilihan C (1.884 m) cocok bila kapasitornya 40 pF.
   - **Soal 20 (Angka Penting)**: aturan 3 AP memberi 187 cm²; kunci E (187,2) dipilih sebagai pilihan terdekat.
   - **Soal 50 (Resonansi Tabung)**: pada λ = 80 cm, resonansi terjadi di 20, 60, 100 cm (bukan 30 cm); kunci A cocok bila kolom udaranya 60 cm.
3. **Impor File HTML Kuis 50 Soal**:
   - Karena teks lengkap 50 soal HTML belum dilampirkan, silakan tempel isi file HTML atau JSON kuis melalui menu **Latihan → Kuis 50 Soal → Impor Kuis** (terutama untuk melengkapi kunci soal nomor 1–11 yang masih bertanda `?`).
