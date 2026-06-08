export function normalizeWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('62')) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

export function validateWhatsApp(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Nomor WhatsApp wajib diisi.';
  }

  if (!/^[\d\s+\-()]+$/.test(trimmed)) {
    return 'Nomor WhatsApp hanya boleh berisi angka.';
  }

  const normalized = normalizeWhatsApp(trimmed);

  if (normalized.length < 11) {
    return 'Nomor WhatsApp terlalu pendek. Minimal 9 digit angka.';
  }

  if (!normalized.startsWith('62')) {
    return 'Gunakan format 08, 628, atau +628.';
  }

  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) {
    return `${label} wajib diisi.`;
  }
  return null;
}