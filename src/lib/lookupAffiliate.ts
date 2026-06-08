import type { AffiliateLookupResponse } from '../types/affiliate';

export async function lookupAffiliate(
  whatsapp: string
): Promise<AffiliateLookupResponse | { ok: false; message: string }> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const token = import.meta.env.VITE_FORM_TOKEN;

  if (!scriptUrl) {
    return { ok: false, message: 'Konfigurasi server belum lengkap.' };
  }

  if (!token) {
    return { ok: false, message: 'Konfigurasi token belum lengkap.' };
  }

  const payload = {
    action: 'lookupAffiliate' as const,
    token,
    whatsapp: whatsapp.trim(),
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const result: AffiliateLookupResponse = await response.json();
    return result;
  } catch {
    return {
      ok: false,
      message: 'Pencarian belum berhasil. Periksa koneksi atau coba lagi beberapa saat.',
    };
  }
}