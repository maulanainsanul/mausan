import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => {
          void install();
        }}
        className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-[#2F6BFF] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 hover:opacity-95 cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-4 h-4" />
        Pasang ke layar utama
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSModal(true)}
          className="min-h-[44px] px-3.5 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-[var(--text-primary)] text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Share className="w-4 h-4" />
          Pasang di iPhone/iPad
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-sm rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-display text-lg font-bold">Pasang Jagoan Fisika</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSModal(false)}
                  aria-label="Tutup panduan"
                  className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center hover:bg-[var(--bg-surface-soft)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="space-y-2 text-sm text-[var(--text-secondary)] list-decimal pl-5">
                <li>Ketuk tombol <strong>Bagikan (Share)</strong> di bilah Safari.</li>
                <li>Gulir ke bawah lalu pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</li>
                <li>Ketuk <strong>Tambah</strong> di pojok kanan atas.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="mt-5 w-full min-h-[48px] rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
