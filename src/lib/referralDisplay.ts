import { sanitizeRefCode } from './referral';

export const REFERRAL_DISPLAY_KEY = 'tekad_referral_display';

export interface ReferralDisplayStorage {
  ref_code: string;
  affiliate_name: string;
  saved_at: string;
}

export function isValidReferralDisplay(
  data: ReferralDisplayStorage | null | undefined,
  refCode: string
): data is ReferralDisplayStorage {
  if (!data) return false;
  return (
    sanitizeRefCode(data.ref_code) === sanitizeRefCode(refCode) &&
    Boolean(data.affiliate_name?.trim())
  );
}

export function loadReferralDisplay(refCode: string): ReferralDisplayStorage | null {
  try {
    const raw = localStorage.getItem(REFERRAL_DISPLAY_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ReferralDisplayStorage;
    if (!isValidReferralDisplay(parsed, refCode)) {
      return null;
    }

    return {
      ref_code: sanitizeRefCode(parsed.ref_code),
      affiliate_name: parsed.affiliate_name.trim(),
      saved_at: parsed.saved_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveReferralDisplay(refCode: string, affiliateName: string): void {
  const payload: ReferralDisplayStorage = {
    ref_code: sanitizeRefCode(refCode),
    affiliate_name: affiliateName.trim(),
    saved_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(REFERRAL_DISPLAY_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
}

export function clearReferralDisplay(): void {
  try {
    localStorage.removeItem(REFERRAL_DISPLAY_KEY);
  } catch {
    // ignore
  }
}