import type { AffiliateErrorResponse } from '../types/affiliate';

export interface LookupAffiliateByCodeSuccess {
  ok: true;
  ref_code: string;
  affiliate_name: string;
}

export type LookupAffiliateByCodeResponse =
  | LookupAffiliateByCodeSuccess
  | AffiliateErrorResponse;

export async function lookupAffiliateByCode(
  refCode: string
): Promise<LookupAffiliateByCodeResponse | { ok: false; message: string }> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const token = import.meta.env.VITE_FORM_TOKEN;

  if (!scriptUrl) {
    return { ok: false, message: 'Konfigurasi server belum lengkap.' };
  }

  if (!token) {
    return { ok: false, message: 'Konfigurasi token belum lengkap.' };
  }

  const payload = {
    action: 'lookupAffiliateByCode' as const,
    token,
    ref_code: refCode,
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const result: LookupAffiliateByCodeResponse = await response.json();
    return result;
  } catch {
    return { ok: false, message: 'Lookup referral belum berhasil.' };
  }
}