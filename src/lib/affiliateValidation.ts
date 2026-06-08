import type { AffiliateFormData } from '../types/affiliate';

export function validateAffiliateForm(data: AffiliateFormData): string | null {
  if (!data.nama.trim()) {
    return 'Nama wajib diisi.';
  }

  if (data.nama.trim().length < 2) {
    return 'Nama minimal 2 karakter.';
  }

  const whatsappError = validateAffiliateWhatsApp(data.whatsapp);
  if (whatsappError) return whatsappError;

  if (!data.kota.trim()) {
    return 'Kota wajib diisi.';
  }

  if (!data.agree_terms) {
    return 'Anda harus menyetujui syarat affiliate TEKAD.';
  }

  return null;
}

export function validateAffiliateWhatsApp(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Nomor WhatsApp wajib diisi.';
  }

  if (!/^[\d\s+\-()]+$/.test(trimmed)) {
    return 'Nomor WhatsApp hanya boleh berisi angka.';
  }

  const digits = trimmed.replace(/\D/g, '');

  if (digits.length < 10) {
    return 'Nomor WhatsApp terlalu pendek. Minimal 10 digit.';
  }

  if (digits.length > 15) {
    return 'Nomor WhatsApp terlalu panjang. Maksimal 15 digit.';
  }

  return null;
}