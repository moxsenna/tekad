import type {
  AffiliateFormData,
  AffiliateSubmitPayload,
  AffiliateSubmitResponse,
} from '../types/affiliate';

export async function submitAffiliate(
  formData: AffiliateFormData
): Promise<AffiliateSubmitResponse | { ok: false; message: string }> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const token = import.meta.env.VITE_FORM_TOKEN;

  if (!scriptUrl) {
    return { ok: false, message: 'Konfigurasi server belum lengkap.' };
  }

  if (!token) {
    return { ok: false, message: 'Konfigurasi token belum lengkap.' };
  }

  const payload: AffiliateSubmitPayload = {
    action: 'registerAffiliate',
    token,
    nama: formData.nama.trim(),
    whatsapp: formData.whatsapp.trim(),
    kota: formData.kota.trim(),
    email: formData.email.trim(),
    profesi: formData.profesi.trim(),
    media_sosial: formData.media_sosial.trim(),
    rekening: formData.rekening.trim(),
    nama_rekening: formData.nama_rekening.trim(),
    agree_terms: formData.agree_terms,
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const result: AffiliateSubmitResponse = await response.json();
    return result;
  } catch {
    return {
      ok: false,
      message: 'Pendaftaran belum berhasil. Periksa koneksi atau coba lagi beberapa saat.',
    };
  }
}