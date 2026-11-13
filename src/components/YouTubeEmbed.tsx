import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertTriangle, ExternalLink, Play, VideoOff, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import type { CuratorVideoMeta, VideoRef } from '../types/physics';

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          host?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  getVideoData?: () => { title?: string; author?: string; video_id?: string };
  destroy?: () => void;
}

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<void>((resolve, reject) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => reject(new Error('Gagal memuat YouTube IFrame API'));
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

interface YouTubeEmbedProps {
  video: VideoRef;
  backupVideo?: VideoRef;
  curatorMeta?: CuratorVideoMeta;
  onSelectBackup?: (video: VideoRef) => void;
  onVideoPlay?: () => void;
  onMetaDetected?: (videoId: string, patch: Partial<CuratorVideoMeta>) => void;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  video,
  backupVideo,
  curatorMeta,
  onSelectBackup,
  onVideoPlay,
  onMetaDetected,
}) => {
  const isOnline = useOnlineStatus();
  const containerId = useId().replace(/:/g, '_');
  const [loaded, setLoaded] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [embedError, setEmbedError] = useState<number | null>(null);
  const [metaTitle, setMetaTitle] = useState<string>(curatorMeta?.judulTerdeteksi || '');
  const [metaAuthor, setMetaAuthor] = useState<string>(curatorMeta?.kanalTerdeteksi || '');
  const playerRef = useRef<YTPlayerInstance | null>(null);

  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const mulai = curatorMeta?.mulaiDetik ?? video.mulaiDetik;
  const selesai = curatorMeta?.selesaiDetik ?? video.selesaiDetik;

  useEffect(() => {
    setLoaded(false);
    setEmbedError(null);
    setThumbFailed(false);
    setMetaTitle(curatorMeta?.judulTerdeteksi || '');
    setMetaAuthor(curatorMeta?.kanalTerdeteksi || '');
    return () => {
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
      }
      playerRef.current = null;
    };
  }, [video.id, curatorMeta?.judulTerdeteksi, curatorMeta?.kanalTerdeteksi]);

  useEffect(() => {
    if (!loaded || !isOnline || video.isShortLinkOnly) return;
    let active = true;

    loadYouTubeIframeAPI()
      .then(() => {
        if (!active || !window.YT?.Player) return;
        const playerVars: Record<string, string | number> = {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        };
        if (typeof mulai === 'number' && mulai > 0) playerVars.start = mulai;
        if (typeof selesai === 'number' && selesai > 0) playerVars.end = selesai;

        playerRef.current = new window.YT.Player(`yt-slot-${containerId}`, {
          videoId: video.id,
          host: 'https://www.youtube-nocookie.com',
          playerVars,
          events: {
            onReady: (ev) => {
              if (!active) return;
              const info = ev.target.getVideoData?.();
              const title = info?.title?.trim() || '';
              const author = info?.author?.trim() || '';
              if (title) setMetaTitle(title);
              if (author) setMetaAuthor(author);
              if (title || author) {
                onMetaDetected?.(video.id, {
                  judulTerdeteksi: title || undefined,
                  kanalTerdeteksi: author || undefined,
                });
              }
            },
            onStateChange: (ev) => {
              // 1 = PLAYING
              if (ev.data === 1) {
                onVideoPlay?.();
              }
            },
            onError: (ev) => {
              if (!active) return;
              const code = Number(ev.data);
              setEmbedError(code);
              if ([2, 5, 100, 101, 150].includes(code)) {
                onMetaDetected?.(video.id, { status: 'mati' });
              }
            },
          },
        });
      })
      .catch(() => {
        if (active) setEmbedError(5);
      });

    return () => {
      active = false;
    };
  }, [loaded, isOnline, video.id, video.isShortLinkOnly, containerId, mulai, selesai, onMetaDetected, onVideoPlay]);

  return (
    <div className="rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
      {/* 16:9 Stage */}
      <div className="relative aspect-video w-full bg-[#0F172A] text-white flex items-center justify-center">
        {!isOnline ? (
          <div className="p-6 text-center max-w-md">
            <WifiOff className="w-10 h-10 mx-auto mb-3 text-[#FFBE2E]" />
            <p className="font-display text-lg font-semibold">Kamu Sedang Offline</p>
            <p className="text-sm text-slate-300 mt-1">
              Butuh internet untuk menonton video; materi tulis &amp; latihan tetap bisa dipakai.
            </p>
          </div>
        ) : video.isShortLinkOnly ? (
          <div className="p-6 text-center max-w-md">
            <p className="font-display text-lg font-semibold mb-2">Video YouTube Shorts</p>
            <p className="text-sm text-slate-300 mb-4">
              Video ini berformat Shorts. Buka langsung di YouTube jika tidak bisa diputar di halaman ini.
            </p>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Buka di YouTube
            </a>
          </div>
        ) : embedError !== null ? (
          <div className="p-6 text-center max-w-md">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-[#FFBE2E]" />
            <p className="font-display text-lg font-semibold">Video ini tidak bisa diputar di sini</p>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Kode galat YouTube: {embedError}. Pemilik video mungkin menonaktifkan penyematan atau video tidak tersedia.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#FF7A1A] text-white font-bold text-sm inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Tonton di YouTube
              </a>
              {backupVideo && onSelectBackup && (
                <button
                  type="button"
                  onClick={() => onSelectBackup(backupVideo)}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#2F6BFF] text-white font-bold text-sm cursor-pointer"
                >
                  Coba Video Cadangan
                </button>
              )}
            </div>
          </div>
        ) : !loaded ? (
          <button
            type="button"
            onClick={() => {
              onVideoPlay?.();
              setLoaded(true);
            }}
            className="group relative w-full h-full flex items-center justify-center cursor-pointer"
            aria-label={`Putar video ${metaTitle || video.id}`}
          >
            {!thumbFailed ? (
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={`Pratinjau video ${video.id}`}
                referrerPolicy="no-referrer"
                onError={() => setThumbFailed(true)}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <VideoOff className="w-12 h-12" />
                <span className="text-xs">Pratinjau gambar tidak tersedia</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute flex flex-col items-center gap-2">
              <span className="w-16 h-16 rounded-full bg-[#FF7A1A] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                <Play className="w-7 h-7 fill-white ml-0.5" />
              </span>
              <span className="text-xs font-bold bg-black/70 px-3 py-1 rounded-full">
                Ketuk untuk Memuat &amp; Memutar Video
              </span>
            </div>
          </button>
        ) : (
          <div id={`yt-slot-${containerId}`} className="w-full h-full" />
        )}
      </div>

      {/* Honest metadata bar (never fabricated) */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--border-hairline)]">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
            {loaded && !metaTitle
              ? 'Memuat judul…'
              : metaTitle || `Video YouTube (${video.id}) — belum diperiksa`}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {metaAuthor ? `Kanal: ${metaAuthor}` : 'Kanal: dimuat saat video diputar'}
            {' · '}
            <span>Peran: {video.peran}</span>
            {' · '}
            <span>Level: {video.level}</span>
            {video.catatan ? ` · ${video.catatan}` : ''}
          </p>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-3.5 py-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface-soft)] text-xs font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5 shrink-0 hover:opacity-90"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Buka di YouTube
        </a>
      </div>
    </div>
  );
};
