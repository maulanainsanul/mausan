import React from 'react';
import { Cloud, HardDrive, ShieldCheck, X } from 'lucide-react';
import type { UserProgress } from '../types/physics';
import { DRIVE_PROGRESS_FILENAME, type DriveProgressRecord } from '../utils/driveSync';

export interface PendingDriveConfirmation {
  mode: 'connect_existing' | 'connect_new' | 'manual_overwrite' | 'manual_restore';
  userEmail: string;
  driveRecord: DriveProgressRecord | null;
  localProgress: UserProgress;
}

interface DriveSyncModalProps {
  pending: PendingDriveConfirmation | null;
  busy: boolean;
  onUseDriveData: () => void;
  onUploadLocalToDrive: () => void;
  onCancel: () => void;
}

function summarizeProgress(p: UserProgress): { xp: number; stars: number; kuisAnswered: number } {
  const stars = Object.values(p.subBab).reduce((acc, s) => acc + (s?.bintang ?? 0), 0);
  const kuisAnswered = Object.keys(p.kuis50Jawaban).length;
  return { xp: p.xp, stars, kuisAnswered };
}

export const DriveSyncModal: React.FC<DriveSyncModalProps> = ({
  pending,
  busy,
  onUseDriveData,
  onUploadLocalToDrive,
  onCancel,
}) => {
  if (!pending) return null;

  const localStats = summarizeProgress(pending.localProgress);
  const driveStats = pending.driveRecord ? summarizeProgress(pending.driveRecord.payload.progress) : null;

  const isExisting = pending.mode === 'connect_existing' || pending.mode === 'manual_overwrite' || pending.mode === 'manual_restore';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drive-confirm-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2F6BFF]/12 text-[#2F6BFF] flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 id="drive-confirm-title" className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {pending.mode === 'connect_new'
                  ? 'Simpan Progres ke Google Drive?'
                  : pending.mode === 'manual_restore'
                    ? 'Muat Progres dari Google Drive?'
                    : 'Konfirmasi Sinkronisasi Google Drive'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Akun: <strong>{pending.userEmail}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            aria-label="Tutup dialog"
            className="min-h-[40px] min-w-[40px] rounded-xl border border-[var(--border-hairline)] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-2xl bg-[var(--bg-surface-soft)] p-3.5 text-xs sm:text-sm text-[var(--text-primary)] space-y-1.5">
          <p className="flex items-center gap-2 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#16A36E] shrink-0" />
            File di Google Drive: <span className="font-mono-num">{DRIVE_PROGRESS_FILENAME}</span>
          </p>
          <p className="text-[var(--text-secondary)]">
            {isExisting
              ? 'File progres ditemukan di Google Drive akunmu. Pilih apakah ingin memuat data dari Drive atau menimpa file Drive dengan progres perangkat ini. Setelah disetujui, auto-save latar belakang saat kamu menutup/keluar dari web akan aktif.'
              : 'Aplikasi akan membuat 1 file khusus progres di Google Drive pribadimu dan mengaktifkan auto-save latar belakang setiap kali kamu menutup atau meninggalkan halaman web.'}
          </p>
        </div>

        {driveStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-[#2F6BFF]/35 bg-[#2F6BFF]/8 p-3.5 space-y-1">
              <p className="font-bold text-[#2F6BFF] flex items-center gap-1.5">
                <Cloud className="w-4 h-4" /> Data di Google Drive
              </p>
              <p className="font-mono-num text-[var(--text-primary)]">
                {driveStats.xp} XP · ★ {driveStats.stars} · Kuis {driveStats.kuisAnswered}/50
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Diperbarui: {new Date(pending.driveRecord!.payload.updatedAt).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-3.5 space-y-1">
              <p className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-[#FF7A1A]" /> Data di Perangkat Ini
              </p>
              <p className="font-mono-num text-[var(--text-primary)]">
                {localStats.xp} XP · ★ {localStats.stars} · Kuis {localStats.kuisAnswered}/50
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">Progres sesi aktif saat ini</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-2.5 pt-2">
          {pending.driveRecord && (
            <button
              type="button"
              disabled={busy}
              onClick={onUseDriveData}
              className="min-h-[46px] px-4 py-2 rounded-2xl bg-[#2F6BFF] text-white font-bold text-xs sm:text-sm cursor-pointer disabled:opacity-60"
            >
              {busy ? 'Memproses…' : 'Muat Data Drive & Aktifkan Auto-Save'}
            </button>
          )}

          {pending.mode !== 'manual_restore' && (
            <button
              type="button"
              disabled={busy}
              onClick={onUploadLocalToDrive}
              className="min-h-[46px] px-4 py-2 rounded-2xl bg-[#FF7A1A] text-white font-bold text-xs sm:text-sm cursor-pointer disabled:opacity-60"
            >
              {busy
                ? 'Menyimpan…'
                : pending.driveRecord
                  ? 'Timpa Drive & Aktifkan Auto-Save'
                  : 'Buat File & Aktifkan Auto-Save'}
            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="min-h-[46px] px-4 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-secondary)] font-bold text-xs sm:text-sm cursor-pointer"
          >
            Batal (Simpan Lokal Saja)
          </button>
        </div>
      </div>
    </div>
  );
};
