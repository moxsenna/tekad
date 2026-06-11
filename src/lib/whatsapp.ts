import type { LeadFormData } from '../types/lead';
import { WEBINAR_THEME } from './webinarCopy';

export type WhatsAppMessageFields = Pick<
  LeadFormData,
  'nama_orang_tua' | 'status_anak' | 'kondisi_anak' | 'kota'
>;

export interface WhatsAppRedirectOptions {
  adminPhone?: string;
  legacyUrl?: string;
}

export function sanitizeWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function trimField(value: string | undefined): string {
  return value?.trim() ?? '';
}

export function buildWhatsAppMessage(formData: WhatsAppMessageFields): string {
  const nama = trimField(formData.nama_orang_tua);
  const status = trimField(formData.status_anak);
  const kondisi = trimField(formData.kondisi_anak);
  const kota = trimField(formData.kota);

  const opening = nama
    ? `Halo Admin TEKAD, saya ${nama} sudah daftar webinar.`
    : 'Halo Admin TEKAD, saya sudah daftar webinar.';

  const lines: string[] = [opening, '', `Tema webinar: ${WEBINAR_THEME}`];

  const conditionLines: string[] = [];
  if (status) conditionLines.push(`* Status: ${status}`);
  if (kondisi) conditionLines.push(`* Kondisi: ${kondisi}`);
  if (kota) conditionLines.push(`* Domisili: ${kota}`);

  if (conditionLines.length > 0) {
    lines.push('', 'Kondisi anak saya:', '', ...conditionLines);
  }

  lines.push('', 'Mohon info jadwal dan grup webinarnya.');

  return lines.join('\n');
}

function readEnv(key: 'VITE_WHATSAPP_ADMIN_PHONE' | 'VITE_WHATSAPP_REDIRECT_URL'): string {
  return import.meta.env?.[key] ?? '';
}

export function buildWhatsAppRedirectUrl(
  formData: WhatsAppMessageFields,
  options?: WhatsAppRedirectOptions
): string {
  let adminPhone = sanitizeWhatsAppPhone(
    options?.adminPhone ?? readEnv('VITE_WHATSAPP_ADMIN_PHONE')
  );

  if (adminPhone) {
    const message = buildWhatsAppMessage(formData);
    const encodedText = encodeURIComponent(message);
    return `https://api.whatsapp.com/send/?phone=${adminPhone}&text=${encodedText}&type=phone_number&app_absent=0`;
  }

  const legacyUrl = options?.legacyUrl ?? readEnv('VITE_WHATSAPP_REDIRECT_URL');
  return legacyUrl || '#';
}

export function getWhatsAppRedirectUrl(formData?: WhatsAppMessageFields): string {
  if (formData) {
    return buildWhatsAppRedirectUrl(formData);
  }

  const adminPhone = sanitizeWhatsAppPhone(readEnv('VITE_WHATSAPP_ADMIN_PHONE'));
  if (adminPhone) {
    return buildWhatsAppRedirectUrl({
      nama_orang_tua: '',
      status_anak: '',
      kondisi_anak: '',
      kota: '',
    });
  }

  const legacyUrl = readEnv('VITE_WHATSAPP_REDIRECT_URL');
  return legacyUrl || '#';
}

export function redirectToWhatsApp(formData: WhatsAppMessageFields): void {
  const url = buildWhatsAppRedirectUrl(formData);
  if (url && url !== '#') {
    window.location.href = url;
  }
}