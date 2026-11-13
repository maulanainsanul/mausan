import React, { useState } from 'react';
import { AlertTriangle, Check, Copy, Download, ExternalLink, X } from 'lucide-react';
import { SUBBAB_LIST } from '../data/subbab';
import { VIDEOS } from '../data/videos';
import type { CuratorVideoMeta, StatusKuratorVideo } from '../types/physics';
import type { QuizKeyMismatch } from '../utils/storage';

interface CuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  curatorMeta: Record<string, CuratorVideoMeta>;
  mismatches: QuizKeyMismatch[];
  onUpdateCuratorMeta: (videoId: string, patch: Partial<CuratorVideoMeta>) => void;
}

export const CuratorModal: React.FC<CuratorModalProps> = ({
  isOpen,
  onClose,
  curatorMeta,
  mismatches,
  onUpdateCuratorMeta,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterSub, setFilterSub] = useState<string>('ALL');

  if (!isOpen) return null;

  const exportPayload = Object.fromEntries(
    SUBBAB_LIST.map((s) => [
      s.id,
      (VIDEOS[s.id] ?? []).map((v) => {
        const m = curatorMeta[v.id];
        return {
          ...v,
          peran: m?.diprioritaskan ? 'utama' : v.peran,
          mulaiDetik: m?.mulaiDetik ?? v.mulaiDetik,
          selesaiDetik: m?.selesaiDetik ?? v.selesaiDetik,
          catatan: m?.catatan ?? v.catatan,
          statusKurator: m?.status ?? 'belum_diperiksa',
          judulTerdeteksi: m?.judulTerdeteksi,
          kanalTerdeteksi: m?.kanalTerdeteksi,
        };
      }),
    ])
  );

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback download
      handleDownloadJson();
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'videos-kurator-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shownSubBabs = filterSub === 'ALL' ? SUBBAB_LIST : SUBBAB_LIST.filter((s) => s.id === filterSub);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Mode Kurator Video"
    >
      <div className="w-full max-w-5xl max-h-[90vh] rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Mode Kurator Guru (Daftar Periksa Video)
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Status awal jujur: video dipilih dari pencarian YouTube 13 November 2026; judul &amp; kanal asli dimuat saat video diputar. Video bertanda &ldquo;mati&rdquo; atau &ldquo;kurang cocok&rdquo; otomatis disembunyikan dari murid.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#2F6BFF] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'JSON Tersalin' : 'Salin Ekspor JSON'}
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Unduh JSON
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Mode Kurator"
              className="min-h-[44px] min-w-[44px] rounded-xl border border-[var(--border-hairline)] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {mismatches.length > 0 && (
            <div className="rounded-2xl border border-[#E5484D]/40 bg-[#E5484D]/10 p-4 space-y-1">
              <p className="text-sm font-bold text-[#E5484D] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Peringatan Perbedaan Kunci Hasil Impor HTML vs Bagian 7:
              </p>
              <ul className="text-xs space-y-1 text-[var(--text-primary)]">
                {mismatches.map((m) => (
                  <li key={m.nomor}>
                    Soal #{m.nomor}: HTML impor = <strong>{m.kunciHtml}</strong>, sedangkan Bagian 7 ={' '}
                    <strong>{m.kunciBagian7}</strong>. Tidak ditimpa diam-diam.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-[var(--text-secondary)]">
              Filter Sub-bab:
              <select
                value={filterSub}
                onChange={(e) => setFilterSub(e.target.value)}
                className="ml-2 min-h-[40px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] px-3 text-xs font-semibold text-[var(--text-primary)]"
              >
                <option value="ALL">Semua 33 Sub-bab</option>
                {SUBBAB_LIST.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} — {s.judul}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {shownSubBabs.map((s) => {
            const vids = VIDEOS[s.id] ?? [];
            return (
              <div
                key={s.id}
                className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                    {s.id} — {s.judul}
                  </h3>
                  <span className="text-xs font-mono-num text-[var(--text-secondary)]">
                    {vids.length} video
                  </span>
                </div>

                {vids.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Belum ada kandidat video (B6 sedang dicari).
                  </p>
                ) : (
                  <div className="space-y-3">
                    {vids.map((v) => {
                      const m = curatorMeta[v.id] ?? { status: 'belum_diperiksa' as StatusKuratorVideo };
                      return (
                        <div
                          key={v.id}
                          className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                        >
                          <div className="md:col-span-3 flex items-center gap-3">
                            <img
                              src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                              alt={v.id}
                              referrerPolicy="no-referrer"
                              className="w-24 aspect-video object-cover rounded-xl bg-slate-900 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-mono-num font-bold truncate">{v.id}</p>
                              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                                {m.judulTerdeteksi || 'Belum diperiksa judul'}
                              </p>
                              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                                {m.kanalTerdeteksi || `${v.peran} · ${v.level}`}
                              </p>
                              <a
                                href={`https://www.youtube.com/watch?v=${v.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-[#2F6BFF] inline-flex items-center gap-1 mt-0.5"
                              >
                                Cek YouTube <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                            <select
                              value={m.status}
                              onChange={(e) =>
                                onUpdateCuratorMeta(v.id, { status: e.target.value as StatusKuratorVideo })
                              }
                              aria-label={`Status video ${v.id}`}
                              className="min-h-[40px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] px-2.5 text-xs font-semibold"
                            >
                              <option value="belum_diperiksa">Belum diperiksa</option>
                              <option value="layak">Layak</option>
                              <option value="mati">Mati (disembunyikan)</option>
                              <option value="kurang_cocok">Kurang cocok (disembunyikan)</option>
                            </select>

                            <input
                              type="number"
                              min={0}
                              placeholder="Mulai (detik)"
                              value={m.mulaiDetik ?? ''}
                              onChange={(e) =>
                                onUpdateCuratorMeta(v.id, {
                                  mulaiDetik: e.target.value === '' ? undefined : Number(e.target.value),
                                })
                              }
                              className="min-h-[40px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] px-2.5 text-xs font-mono-num"
                            />

                            <input
                              type="number"
                              min={0}
                              placeholder="Selesai (detik)"
                              value={m.selesaiDetik ?? ''}
                              onChange={(e) =>
                                onUpdateCuratorMeta(v.id, {
                                  selesaiDetik: e.target.value === '' ? undefined : Number(e.target.value),
                                })
                              }
                              className="min-h-[40px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] px-2.5 text-xs font-mono-num"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                onUpdateCuratorMeta(v.id, { diprioritaskan: !m.diprioritaskan })
                              }
                              className={`min-h-[40px] px-3 rounded-xl text-xs font-bold cursor-pointer ${
                                m.diprioritaskan
                                  ? 'bg-[#16A36E] text-white'
                                  : 'border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)]'
                              }`}
                            >
                              {m.diprioritaskan ? 'Utama (Dipilih)' : 'Jadikan utama'}
                            </button>

                            <input
                              type="text"
                              placeholder="Catatan kurator…"
                              value={m.catatan ?? v.catatan ?? ''}
                              onChange={(e) => onUpdateCuratorMeta(v.id, { catatan: e.target.value })}
                              className="sm:col-span-4 min-h-[38px] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] px-3 text-xs"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
