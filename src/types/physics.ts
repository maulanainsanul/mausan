export type BabId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';

export type SubBabId =
  | 'A1' | 'A2' | 'A3'
  | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6'
  | 'C1' | 'C2' | 'C3' | 'C4' | 'C5'
  | 'D1' | 'D2' | 'D3'
  | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6'
  | 'F1' | 'F2' | 'F3' | 'F4'
  | 'G1' | 'G2' | 'G3' | 'G4'
  | 'H1'
  | 'I1';

export type PeranVideo = 'utama' | 'cadangan' | 'pendukung';
export type LevelVideo = 'SMP' | 'SMA' | 'EN';
export type StatusKuratorVideo = 'belum_diperiksa' | 'layak' | 'mati' | 'kurang_cocok';

export interface VideoRef {
  id: string;
  peran: PeranVideo;
  level: LevelVideo;
  catatan?: string;
  mulaiDetik?: number;
  selesaiDetik?: number;
  isShortLinkOnly?: boolean;
}

export interface BonusVideoRef {
  id: string;
  tipe: 'video' | 'playlist';
  deskripsi: string;
}

export interface CuratorVideoMeta {
  status: StatusKuratorVideo;
  mulaiDetik?: number;
  selesaiDetik?: number;
  catatan?: string;
  judulTerdeteksi?: string;
  kanalTerdeteksi?: string;
  diprioritaskan?: boolean;
}

export interface BabInfo {
  id: BabId;
  nama: string;
  pulau: string;
  deskripsi: string;
  warnaHex: string;
  warnaSoft: string;
  subBabIds: SubBabId[];
}

export interface RumusItem {
  label: string;
  latex: string;
  satuan: string;
}

export interface LangkahContohTerpandu {
  instruksi: string;
  pertanyaanKecil: string;
  tipeInput: 'angka' | 'pilihan';
  pilihan?: string[];
  jawabanBenar: string;
  toleransiAngka?: number;
  petunjukSalah: string;
  penjelasanLangkah: string;
}

export interface ContohTerpandu {
  judul: string;
  soal: string;
  diagram?: DiagramSpec;
  langkah: LangkahContohTerpandu[];
  kesimpulan: string;
}

export interface DiagramSpec {
  jenis:
    | 'grafik_st'
    | 'grafik_vt'
    | 'grafik_kalor'
    | 'pasang_surut'
    | 'tiga_grafik_s1'
    | 'grafik_kalor_abcd'
    | 'empat_katrol'
    | 'kotak_asap'
    | 'bidang_miring'
    | 'tabung_resonansi';
  judul?: string;
  points?: Array<{ x: number; y: number }>;
  xLabel?: string;
  yLabel?: string;
  fasePasang?: 'purnama' | 'perbani';
  panjangBidang?: number;
  tinggiBidang?: number;
  beratBenda?: number;
  bendaBidang?: 'bola' | 'balok';
}

export interface SubBabData {
  id: SubBabId;
  babId: BabId;
  judul: string;
  soalKuis: number[];
  opsionalDiAtasSMP?: string;
  konsepInti: string[];
  rumus: RumusItem[];
  langkahBaku: string[];
  jebakan: string[];
  contohTerpandu: ContohTerpandu;
}

export interface NarasiSubBab {
  subBabId: SubBabId;
  sapaan: string;
  tujuan: string;
  tugasTonton: [string, string, string];
  penyemangat: string;
  saatBenar: [string, string, string, string];
  saatSalah: [string, string, string, string];
}

export type LevelLatihan = 1 | 2 | 3;

export interface SoalMirip {
  uid: string;
  subBabId: SubBabId;
  level: LevelLatihan;
  levelLabel: 'Meniru' | 'Variasi' | 'Tantangan';
  pertanyaan: string;
  diagram?: DiagramSpec;
  pilihan: [string, string, string, string, string];
  indeksBenar: number;
  petunjuk: string[];
  langkah: string[];
  kesalahanUmum: string;
  catatanKhusus?: string;
}

export type HurufKunci = 'A' | 'B' | 'C' | 'D' | 'E' | '?';

export interface SoalKuis50 {
  nomor: number;
  subBabId: SubBabId;
  judulSingkat: string;
  teksSoal?: string;
  gambarDeskripsi?: string;
  gambarSpec?: DiagramSpec;
  pilihan?: { A: string; B: string; C: string; D: string; E: string };
  kunci: HurufKunci;
  kunciTerverifikasi?: HurufKunci;
  pembahasanLangkah: string[];
  tipsSerupa: string;
  perluCekSoalAsli?: boolean;
  catatanCekAsli?: string;
}

export interface SubBabProgress {
  tahapSelesai: number[]; // 1..6
  bintang: 0 | 1 | 2 | 3;
  catatanCepat: string;
  tugasTontonCentang: [boolean, boolean, boolean];
  sudahNonton: boolean;
  skorLevel3Terbaik: number;
}

export interface WrongAttempt {
  id: string;
  sumber: 'latihan' | 'kuis50' | 'tantangan5m';
  subBabId: SubBabId;
  pertanyaan: string;
  jawabanUser: string;
  jawabanBenar: string;
  langkah: string[];
  timestamp: number;
}

export interface UserProgress {
  xp: number;
  streakHarian: number;
  tanggalAktifTerakhir: string; // YYYY-MM-DD
  subBab: Partial<Record<SubBabId, SubBabProgress>>;
  kuis50Jawaban: Partial<Record<number, { dipilih: string; benar: boolean }>>;
  lencana: string[];
  soalSalah: WrongAttempt[];
  lastVisitedSubBab?: SubBabId;
  dailyPlanDone: {
    video: boolean;
    latihan3: boolean;
    ulangSalah: boolean;
    tanggal: string;
  };
}

export type TextScale = 'sm' | 'md' | 'lg';

export type SpeechSpeed = 0.85 | 1.0 | 1.15;

export interface UserSettings {
  kecepatanSuara: SpeechSpeed;
  voiceURI: string;
  bisukanSuara: boolean;
  efekSuara: boolean;
  ukuranTeks: TextScale;
  modeGelap: boolean;
}
