import { VERIFIED_KEYS_SECTION_7 } from '../data/kuis50';
import type { HurufKunci, SoalKuis50 } from '../types/physics';
import type { QuizKeyMismatch } from './storage';

export interface ImportQuizResult {
  importedCount: number;
  overrides: Partial<Record<number, Partial<SoalKuis50>>>;
  mismatches: QuizKeyMismatch[];
  errors: string[];
}

function normalizeKey(raw: unknown): HurufKunci | undefined {
  if (typeof raw !== 'string') return undefined;
  const k = raw.trim().toUpperCase();
  if (k === 'A' || k === 'B' || k === 'C' || k === 'D' || k === 'E') return k;
  return undefined;
}

export function parseAndValidateQuizInput(rawText: string): ImportQuizResult {
  const trimmed = rawText.trim();
  const overrides: Partial<Record<number, Partial<SoalKuis50>>> = {};
  const mismatches: QuizKeyMismatch[] = [];
  const errors: string[] = [];

  if (!trimmed) {
    return { importedCount: 0, overrides, mismatches, errors: ['Teks tempelan masih kosong.'] };
  }

  // 1. Try JSON first
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed.soal) ? parsed.soal : [parsed];
      let count = 0;
      for (const item of arr) {
        const nomor = Number(item.nomor ?? item.no ?? item.number);
        if (!Number.isInteger(nomor) || nomor < 1 || nomor > 50) continue;

        let pilihanObj: { A: string; B: string; C: string; D: string; E: string } | undefined;
        if (Array.isArray(item.pilihan) && item.pilihan.length >= 5) {
          pilihanObj = {
            A: String(item.pilihan[0]),
            B: String(item.pilihan[1]),
            C: String(item.pilihan[2]),
            D: String(item.pilihan[3]),
            E: String(item.pilihan[4]),
          };
        } else if (item.pilihan && typeof item.pilihan === 'object') {
          pilihanObj = {
            A: String(item.pilihan.A ?? item.pilihan.a ?? ''),
            B: String(item.pilihan.B ?? item.pilihan.b ?? ''),
            C: String(item.pilihan.C ?? item.pilihan.c ?? ''),
            D: String(item.pilihan.D ?? item.pilihan.d ?? ''),
            E: String(item.pilihan.E ?? item.pilihan.e ?? ''),
          };
        }

        const kunciHtml = normalizeKey(item.kunci ?? item.jawaban ?? item.answer);
        const verified = VERIFIED_KEYS_SECTION_7[nomor];
        if (kunciHtml && verified && kunciHtml !== verified) {
          mismatches.push({ nomor, kunciHtml, kunciBagian7: verified });
        }

        overrides[nomor] = {
          teksSoal: String(item.teksSoal ?? item.pertanyaan ?? item.question ?? '').trim() || undefined,
          pilihan: pilihanObj,
          kunci: kunciHtml ?? verified ?? '?',
        };
        count++;
      }
      if (count === 0) {
        errors.push('JSON terbaca tetapi tidak ditemukan nomor soal 1–50.');
      }
      return { importedCount: count, overrides, mismatches, errors };
    } catch {
      // Fallback to HTML / plain text parsing
    }
  }

  // 2. Parse HTML using DOMParser or plain-text numbered blocks
  let plainText = trimmed;
  if (/<[a-z][\s\S]*>/i.test(trimmed) && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(trimmed, 'text/html');
    const blocks = doc.querySelectorAll('[data-no], .question, .soal-item, .soal, article, li');
    if (blocks.length >= 3) {
      const lines: string[] = [];
      blocks.forEach((b) => {
        const text = (b.textContent || '').replace(/\s+/g, ' ').trim();
        const keyAttr = b.getAttribute('data-kunci') || b.getAttribute('data-answer') || '';
        lines.push(keyAttr ? `${text}\nKunci: ${keyAttr}` : text);
      });
      plainText = lines.join('\n\n');
    } else {
      plainText = doc.body.textContent || trimmed;
    }
  }

  // Split by question numbers "1." .. "50."
  const regex = /(?:^|\n)\s*(\d{1,2})\s*[.)]\s+([\s\S]*?)(?=(?:\n\s*\d{1,2}\s*[.)]\s+)|$)/g;
  let match: RegExpExecArray | null;
  let count = 0;

  while ((match = regex.exec(plainText)) !== null) {
    const nomor = Number(match[1]);
    if (!Number.isInteger(nomor) || nomor < 1 || nomor > 50) continue;
    const body = match[2].trim();

    // Extract options A-E
    const optMatch = {
      A: body.match(/(?:^|\s)A[.)]\s*([^\n]+?)(?=\s+B[.)]|\n|$)/i)?.[1]?.trim() ?? '',
      B: body.match(/(?:^|\s)B[.)]\s*([^\n]+?)(?=\s+C[.)]|\n|$)/i)?.[1]?.trim() ?? '',
      C: body.match(/(?:^|\s)C[.)]\s*([^\n]+?)(?=\s+D[.)]|\n|$)/i)?.[1]?.trim() ?? '',
      D: body.match(/(?:^|\s)D[.)]\s*([^\n]+?)(?=\s+E[.)]|\n|$)/i)?.[1]?.trim() ?? '',
      E: body.match(/(?:^|\s)E[.)]\s*([^\n]+?)(?=\s*Kunci|\n|$)/i)?.[1]?.trim() ?? '',
    };

    const keyMatch = body.match(/(?:Kunci|Jawaban)\s*[:=]\s*([A-E])/i)?.[1];
    const kunciHtml = normalizeKey(keyMatch);
    const verified = VERIFIED_KEYS_SECTION_7[nomor];
    if (kunciHtml && verified && kunciHtml !== verified) {
      mismatches.push({ nomor, kunciHtml, kunciBagian7: verified });
    }

    const stem = body.split(/\n?\s*A[.)]\s/i)[0].trim();
    const hasOptions = Boolean(optMatch.A && optMatch.B && optMatch.C && optMatch.D);

    overrides[nomor] = {
      teksSoal: stem || undefined,
      pilihan: hasOptions ? optMatch : undefined,
      kunci: kunciHtml ?? verified ?? '?',
    };
    count++;
  }

  if (count === 0) {
    errors.push('Format belum dikenali. Gunakan JSON array atau daftar bernomor (1. ... A. ... B. ... Kunci: C).');
  }

  return { importedCount: count, overrides, mismatches, errors };
}
