export const DIRECT_REFERRAL = 'DIRECT';
const STORAGE_KEY = 'tekad_ref_code';
const MAX_REF_LENGTH = 40;

export function sanitizeRefCode(value: string | null | undefined): string {
  if (value == null || value === '') {
    return DIRECT_REFERRAL;
  }

  const sanitized = String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, MAX_REF_LENGTH);

  return sanitized || DIRECT_REFERRAL;
}

export function isDirectReferral(refCode: string): boolean {
  return refCode === DIRECT_REFERRAL;
}

export function getStoredReferral(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const code = sanitizeRefCode(stored);
      if (!isDirectReferral(code)) {
        return code;
      }
    }
  } catch {
    // localStorage unavailable (private mode, etc.)
  }

  return DIRECT_REFERRAL;
}

export function captureReferralFromUrl(search?: string): string {
  const params = new URLSearchParams(search ?? window.location.search);
  const refParam = params.get('ref');

  if (refParam !== null && refParam !== '') {
    const code = sanitizeRefCode(refParam);

    if (!isDirectReferral(code)) {
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore storage errors
      }
      return code;
    }
  }

  return getStoredReferral();
}

export function getEffectiveReferral(search?: string): string {
  return captureReferralFromUrl(search);
}