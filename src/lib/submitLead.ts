import type { LeadFormData, LeadPayload, SubmitResponse, TrackingData } from '../types/lead';
import { normalizeWhatsApp } from './validation';

export async function submitLead(
  formData: LeadFormData,
  tracking: TrackingData,
  honeypot: string
): Promise<SubmitResponse> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const token = import.meta.env.VITE_FORM_TOKEN;

  if (!scriptUrl) {
    return { success: false, message: 'Konfigurasi server belum lengkap.' };
  }

  if (!token) {
    return { success: false, message: 'Konfigurasi token belum lengkap.' };
  }

  const payload: LeadPayload = {
    token,
    submitted_at: new Date().toISOString(),
    nama_orang_tua: formData.nama_orang_tua.trim(),
    whatsapp: formData.whatsapp.trim(),
    whatsapp_normalized: normalizeWhatsApp(formData.whatsapp.trim()),
    status_anak: formData.status_anak,
    kondisi_anak: formData.kondisi_anak,
    kekhawatiran_utama: formData.kekhawatiran_utama.trim(),
    kota: formData.kota.trim(),
    bersedia_konsultasi: formData.bersedia_konsultasi,
    source: tracking.source,
    utm_source: tracking.utm_source,
    utm_medium: tracking.utm_medium,
    utm_campaign: tracking.utm_campaign,
    page_url: tracking.page_url,
    user_agent: tracking.user_agent,
    honeypot,
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const result: SubmitResponse = await response.json();
    return result;
  } catch {
    return {
      success: false,
      message: 'Maaf, pendaftaran belum berhasil terkirim. Silakan coba lagi.',
    };
  }
}