import React, { useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  Award,
  CheckCircle2,
  Cloud,
  DownloadCloud,
  Flame,
  LogOut,
  RotateCcw,
  Settings,
  Star,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { BABS } from '../data/babs';
import { SUBBAB_MAP } from '../data/subbab';
import type { UseSpeechGuideReturn } from '../hooks/useSpeechGuide';
import type { TextScale, UserProgress, UserSettings } from '../types/physics';
import { DRIVE_PROGRESS_FILENAME } from '../utils/driveSync';
import { computeEarnedBadges, getSubBabProgress } from '../utils/storage';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { MathText } from '../components/MathText';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { VoltaMascot } from '../components/VoltaMascot';

interface ProfilePageProps {
  progress: UserProgress;
  settings: UserSettings;
  speech: UseSpeechGuideReturn;
  authUser: User | null;
  needsDriveReauth: boolean;
  isLoggingIn: boolean;
  driveSyncAuthorized: boolean;
  driveStatus: 'idle' | 'syncing' | 'saved' | 'error' | 'offline';
  driveLastSavedAt: string | null;
  driveError: string;
  onGoogleSignIn: () => void;
  onGoogleLogout: () => void;
  onManualSaveDrive: () => void;
  onManualLoadDrive: () => void;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
  onClearWrongAttempt: (id: string) => void;
  onResetProgress: () => void;
}

const ALL_BADGE_DESCS: Record<string, string> = {
  'Langkah Pertama': 'Meraih 50 XP pertama di laboratorium',
  'Pemburu Satuan': 'Menguasai sub-bab Pengukuran / Tekanan padat',
  'Raja Tuas': 'Meraih minimal 2 bintang di sub-bab Tuas (F1)',
  'Ahli Grafik': 'Meraih minimal 2 bintang di Grafik Gerak (A1)',
  'Penjaga Kalor': 'Meraih minimal 2 bintang di Asas Black (B4)',
  'Kapten Archimedes': 'Meraih minimal 2 bintang di Archimedes (C5)',
  'Penala Resonansi': 'Meraih minimal 2 bintang di Pipa Organa (D2)',
  'Master Rangkaian': 'Meraih minimal 2 bintang di Hambatan (E1)',
  'Navigator Waktu': 'Meraih minimal 2 bintang di Selisih Waktu (G2)',
  'Bintang Laboratorium': 'Mengumpulkan 15+ bintang atau 5+ sub-bab tuntas',
  'Konsisten 3 Hari': 'Menjaga streak belajar minimal 3 hari',
  'Penantang Olimpiade': 'Menjawab 10+ soal di Kuis Olimpiade 50 Soal',
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  progress,
  settings,
  speech,
  authUser,
  needsDriveReauth,
  isLoggingIn,
  driveSyncAuthorized,
  driveStatus,
  driveLastSavedAt,
  driveError,
  onGoogleSignIn,
  onGoogleLogout,
  onManualSaveDrive,
  onManualLoadDrive,
  onUpdateSettings,
  onClearWrongAttempt,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [expandedWrongId, setExpandedWrongId] = useState<string | null>(null);

  const earnedBadges = useMemo(() => computeEarnedBadges(progress), [progress]);
  const totalStars = useMemo(
    () => Object.values(progress.subBab).reduce((acc, s) => acc + (s?.bintang ?? 0), 0),
    [progress.subBab]
  );

  const quizScore = useMemo(() => {
    const vals = Object.values(progress.kuis50Jawaban);
    let benar = 0;
    let salah = 0;
    for (const v of vals) {
      if (!v) continue;
      if (v.benar) benar++;
      else salah++;
    }
    return { benar, salah, kosong: 50 - vals.length, skor: benar * 4 - salah };
  }, [progress.kuis50Jawaban]);

  return (
    <div className="space-y-7">
      {/* Akun Google & Sinkronisasi Google Drive */}
      <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {authUser?.photoURL ? (
              <img
                src={authUser.photoURL}
                alt={authUser.displayName ?? 'Akun Google'}
                className="w-12 h-12 rounded-full shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#2F6BFF]/12 text-[#2F6BFF] flex items-center justify-center shrink-0">
                <Cloud className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)] truncate">
                {authUser ? `Akun Google: ${authUser.displayName ?? 'Siswa'}` : 'Masuk Akun Google & Auto-Save Drive'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">
                {authUser
                  ? `${authUser.email} · File: ${DRIVE_PROGRESS_FILENAME}`
                  : 'Masuk dengan Google agar progres tiap siswa tersimpan otomatis di Google Drive pribadi masing-masing.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!authUser ? (
              <GoogleSignInButton
                disabled={isLoggingIn}
                onClick={onGoogleSignIn}
                label={isLoggingIn ? 'Menghubungkan…' : 'Sign in with Google'}
              />
            ) : needsDriveReauth ? (
              <GoogleSignInButton
                disabled={isLoggingIn}
                onClick={onGoogleSignIn}
                label={isLoggingIn ? 'Menghubungkan…' : 'Hubungkan Ulang Drive'}
              />
            ) : null}

            {authUser && (
              <button
                type="button"
                onClick={onGoogleLogout}
                className="min-h-[44px] px-4 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs sm:text-sm font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            )}
          </div>
        </div>

        {authUser && !needsDriveReauth && (
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-bold text-[var(--text-primary)]">
                Status Auto-Save Saat Keluar/Tutup Web:{' '}
                <span className={driveSyncAuthorized ? 'text-[#16A36E]' : 'text-[#D97706]'}>
                  {driveStatus === 'syncing'
                    ? 'Mengunggah ke Google Drive…'
                    : driveSyncAuthorized
                      ? 'Aktif (Auto-upload latar belakang saat web ditutup/berpindah tab)'
                      : 'Menunggu konfirmasi penyimpanan Drive'}
                </span>
              </p>
              {driveLastSavedAt && (
                <p className="text-xs text-[var(--text-secondary)]">
                  Terakhir tersimpan di Drive: {new Date(driveLastSavedAt).toLocaleString('id-ID')}
                </p>
              )}
              {driveError && <p className="text-xs font-semibold text-[#E5484D]">{driveError}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={driveStatus === 'syncing'}
                onClick={onManualSaveDrive}
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#2F6BFF] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <UploadCloud className="w-4 h-4" />
                Simpan ke Drive
              </button>
              <button
                type="button"
                disabled={driveStatus === 'syncing'}
                onClick={onManualLoadDrive}
                className="min-h-[44px] px-4 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <DownloadCloud className="w-4 h-4 text-[#16A36E]" />
                Muat dari Drive
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Header Summary */}
      <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-2.5">
              <VoltaMascot expression="bangga" size={68} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                Profil Ilmuwan &amp; Progres
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Pantau bintang, lencana, skor kuis 50 soal, kekuatan tiap bab, serta atur suara &amp; tampilan aplikasi.
              </p>
            </div>
          </div>
          <PWAInstallButton />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-center">
            <p className="text-xs font-bold text-[var(--text-secondary)]">Total Bintang</p>
            <p className="font-mono-num text-xl sm:text-2xl font-bold text-[#FFBE2E] mt-1 inline-flex items-center gap-1">
              <Star className="w-5 h-5 fill-[#FFBE2E]" /> {totalStars}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-center">
            <p className="text-xs font-bold text-[var(--text-secondary)]">Poin XP</p>
            <p className="font-mono-num text-xl sm:text-2xl font-bold text-[#2F6BFF] mt-1">
              {progress.xp}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-center">
            <p className="text-xs font-bold text-[var(--text-secondary)]">Streak Harian</p>
            <p className="font-mono-num text-xl sm:text-2xl font-bold text-[#FF7A1A] mt-1 inline-flex items-center gap-1">
              <Flame className="w-5 h-5" /> {progress.streakHarian}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-center">
            <p className="text-xs font-bold text-[var(--text-secondary)]">Skor Kuis 50</p>
            <p className="font-mono-num text-xl sm:text-2xl font-bold text-[#16A36E] mt-1">
              {quizScore.skor}
            </p>
            <p className="text-[11px] font-mono-num text-[var(--text-secondary)]">
              +{quizScore.benar * 4} / -{quizScore.salah} ({quizScore.kosong} kosong)
            </p>
          </div>
        </div>
      </section>

      {/* Grafik Kekuatan per Bab */}
      <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4">
          Grafik Kekuatan Per Bab
        </h2>
        <div className="space-y-3">
          {BABS.map((bab) => {
            const maxStars = bab.subBabIds.length * 3;
            const stars = bab.subBabIds.reduce(
              (acc, sid) => acc + getSubBabProgress(progress, sid).bintang,
              0
            );
            const pct = Math.round((stars / maxStars) * 100);
            return (
              <div key={bab.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-[var(--text-primary)]">
                    {bab.id}. {bab.nama}
                  </span>
                  <span className="font-mono-num text-[var(--text-secondary)]">
                    ★ {stars}/{maxStars} ({pct}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-[var(--bg-surface-soft)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: bab.warnaHex }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lencana */}
      <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#FF7A1A]" />
          Lencana ({earnedBadges.length}/{Object.keys(ALL_BADGE_DESCS).length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(ALL_BADGE_DESCS).map(([name, desc]) => {
            const unlocked = earnedBadges.includes(name);
            return (
              <div
                key={name}
                className={`rounded-2xl border p-3.5 ${
                  unlocked
                    ? 'border-[#16A36E]/40 bg-[#16A36E]/10'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] opacity-60'
                }`}
              >
                <p className="font-display text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  {unlocked && <CheckCircle2 className="w-4 h-4 text-[#16A36E]" />}
                  {name}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ulangi Soal Salah */}
      <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1">
          Ulangi Soal Salah ({progress.soalSalah.length})
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4">
          Soal yang sempat keliru saat latihan otomatis dikumpulkan di sini agar bisa dipelajari ulang.
        </p>

        {progress.soalSalah.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] rounded-2xl bg-[var(--bg-surface-soft)] p-4">
            Belum ada catatan soal salah. Terus berlatih!
          </p>
        ) : (
          <div className="space-y-3">
            {progress.soalSalah.map((w) => {
              const open = expandedWrongId === w.id;
              return (
                <div
                  key={w.id}
                  className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#E5484D]">
                        {w.subBabId} · {SUBBAB_MAP[w.subBabId]?.judul}
                      </p>
                      <p className="text-sm text-[var(--text-primary)] mt-1">
                        <MathText text={w.pertanyaan} />
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onClearWrongAttempt(w.id)}
                      className="min-h-[40px] px-3 rounded-xl border border-[#16A36E]/40 text-xs font-bold text-[#16A36E] cursor-pointer shrink-0"
                    >
                      Sudah Paham
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Jawabanmu: <span className="text-[#E5484D] font-semibold">{w.jawabanUser}</span> · Jawaban benar:{' '}
                    <span className="text-[#16A36E] font-bold">{w.jawabanBenar}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setExpandedWrongId(open ? null : w.id)}
                    className="text-xs font-bold text-[#2F6BFF] cursor-pointer"
                  >
                    {open ? 'Sembunyikan langkah' : 'Lihat langkah penyelesaian'}
                  </button>
                  {open && (
                    <div className="pt-2 space-y-1 text-xs sm:text-sm text-[var(--text-primary)]">
                      {w.langkah.map((st, idx) => (
                        <p key={idx}><MathText text={st} /></p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Pengaturan */}
      <section className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2F6BFF]" />
          Pengaturan Aplikasi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kecepatan Suara */}
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4">
            <p className="text-sm font-bold text-[var(--text-primary)] mb-2">Kecepatan Suara Pemandu Bima</p>
            <div className="flex gap-2">
              {([
                { spd: 0.85 as const, label: '0.85x Pelan' },
                { spd: 1.0 as const, label: '1.0x Normal' },
                { spd: 1.15 as const, label: '1.15x Cepat' },
              ]).map((item) => (
                <button
                  key={item.spd}
                  type="button"
                  onClick={() => onUpdateSettings({ kecepatanSuara: item.spd })}
                  className={`min-h-[44px] flex-1 rounded-xl text-xs sm:text-sm font-mono-num font-bold cursor-pointer ${
                    settings.kecepatanSuara === item.spd
                      ? 'bg-[#2F6BFF] text-white'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Suara */}
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4">
            <label className="block">
              <span className="text-sm font-bold text-[var(--text-primary)] block mb-2">
                Pilih Suara Perangkat (Default: Anak Laki-laki Normal)
              </span>
              <select
                value={settings.voiceURI}
                onChange={(e) => onUpdateSettings({ voiceURI: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 text-sm"
              >
                <option value="">Otomatis (Pemandu Laki-laki · Bahasa Indonesia)</option>
                {speech.voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Ukuran Teks */}
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4">
            <p className="text-sm font-bold text-[var(--text-primary)] mb-2">Ukuran Teks (Aksesibilitas)</p>
            <div className="flex gap-2">
              {([
                { id: 'sm' as TextScale, label: 'Kecil (14px)' },
                { id: 'md' as TextScale, label: 'Sedang (16px)' },
                { id: 'lg' as TextScale, label: 'Besar (18px)' },
              ]).map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ukuranTeks: sz.id })}
                  className={`min-h-[44px] flex-1 rounded-xl text-xs font-bold cursor-pointer ${
                    settings.ukuranTeks === sz.id
                      ? 'bg-[#FF7A1A] text-white'
                      : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)]'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Gelap & Efek Suara */}
          <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-4 space-y-3">
            <label className="flex items-center justify-between gap-3 cursor-pointer min-h-[40px]">
              <span className="text-sm font-bold text-[var(--text-primary)]">Mode Gelap (Biru Malam)</span>
              <input
                type="checkbox"
                checked={settings.modeGelap}
                onChange={(e) => onUpdateSettings({ modeGelap: e.target.checked })}
                className="w-5 h-5 accent-[#2F6BFF]"
              />
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer min-h-[40px]">
              <span className="text-sm font-bold text-[var(--text-primary)]">Efek Suara Lembut (Benar/Salah)</span>
              <input
                type="checkbox"
                checked={settings.efekSuara}
                onChange={(e) => onUpdateSettings({ efekSuara: e.target.checked })}
                className="w-5 h-5 accent-[#2F6BFF]"
              />
            </label>
          </div>
        </div>

        {/* Reset Progres */}
        <div className="pt-2 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[44px] px-4 py-2 rounded-2xl border border-[#E5484D]/40 text-[#E5484D] text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Reset Progres Belajar
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#E5484D]">Yakin hapus semua bintang dan XP?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#E5484D] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Ya, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
