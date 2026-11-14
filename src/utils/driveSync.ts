import type { UserProgress, UserSettings } from '../types/physics';

export const DRIVE_PROGRESS_FILENAME = 'jagoan-fisika-progres.json';

export interface DriveProgressPayload {
  version: number;
  uid: string;
  email: string;
  displayName: string;
  updatedAt: string;
  progress: UserProgress;
  settings: UserSettings;
}

export interface DriveProgressRecord {
  fileId: string;
  modifiedTime: string;
  payload: DriveProgressPayload;
}

interface DriveFilesListResponse {
  files?: Array<{
    id: string;
    name: string;
    modifiedTime?: string;
  }>;
}

export class DriveAuthExpiredError extends Error {
  constructor(message = 'Sesi Google Drive berakhir. Masuk ulang untuk melanjutkan sinkronisasi.') {
    super(message);
    this.name = 'DriveAuthExpiredError';
  }
}

export async function findDriveProgressFile(
  accessToken: string
): Promise<{ id: string; modifiedTime: string } | null> {
  const q = encodeURIComponent(`name='${DRIVE_PROGRESS_FILENAME}' and trashed=false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&spaces=drive&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc&pageSize=5`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 401) {
    throw new DriveAuthExpiredError();
  }
  if (!res.ok) {
    throw new Error(`Gagal memeriksa Google Drive (${res.status}).`);
  }

  const data = (await res.json()) as DriveFilesListResponse;
  const first = data.files?.[0];
  if (!first?.id) return null;
  return {
    id: first.id,
    modifiedTime: first.modifiedTime ?? new Date().toISOString(),
  };
}

export async function loadProgressFromDrive(
  accessToken: string
): Promise<DriveProgressRecord | null> {
  const found = await findDriveProgressFile(accessToken);
  if (!found) return null;

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(found.id)}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (res.status === 401) {
    throw new DriveAuthExpiredError();
  }
  if (!res.ok) {
    throw new Error(`Gagal mengunduh progres dari Google Drive (${res.status}).`);
  }

  const raw = (await res.json()) as Partial<DriveProgressPayload>;
  if (!raw || typeof raw !== 'object' || !raw.progress) {
    return null;
  }

  return {
    fileId: found.id,
    modifiedTime: found.modifiedTime,
    payload: {
      version: raw.version ?? 1,
      uid: raw.uid ?? '',
      email: raw.email ?? '',
      displayName: raw.displayName ?? '',
      updatedAt: raw.updatedAt ?? found.modifiedTime,
      progress: raw.progress,
      settings: raw.settings as UserSettings,
    },
  };
}

export async function uploadProgressToDrive(
  accessToken: string,
  payload: DriveProgressPayload,
  existingFileId?: string | null,
  options?: { keepalive?: boolean }
): Promise<{ fileId: string; updatedAt: string }> {
  const jsonBody = JSON.stringify(payload);
  const keepalive = Boolean(options?.keepalive);

  let targetFileId = existingFileId ?? null;
  if (!targetFileId && !keepalive) {
    const found = await findDriveProgressFile(accessToken);
    targetFileId = found?.id ?? null;
  }

  if (targetFileId) {
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(targetFileId)}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonBody,
        keepalive,
      }
    );

    if (res.status === 401) {
      throw new DriveAuthExpiredError();
    }
    if (!res.ok) {
      throw new Error(`Gagal memperbarui file Drive (${res.status}).`);
    }

    return { fileId: targetFileId, updatedAt: payload.updatedAt };
  }

  // Create new file via multipart upload
  const boundary = 'jagoan_fisika_boundary_2026';
  const metadata = JSON.stringify({
    name: DRIVE_PROGRESS_FILENAME,
    mimeType: 'application/json',
    description: 'Data progres belajar Jagoan Fisika Olimpiade SMP',
  });

  const multipartBody =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${metadata}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${jsonBody}\r\n` +
    `--${boundary}--`;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
      keepalive,
    }
  );

  if (res.status === 401) {
    throw new DriveAuthExpiredError();
  }
  if (!res.ok) {
    throw new Error(`Gagal membuat file di Google Drive (${res.status}).`);
  }

  const created = (await res.json()) as { id?: string };
  if (!created.id) {
    throw new Error('ID file Google Drive tidak diterima.');
  }
  return { fileId: created.id, updatedAt: payload.updatedAt };
}
