import type { AffiliateDisplayData, StoredAffiliateProfile } from '../types/affiliate';

export const AFFILIATE_PROFILE_KEY = 'tekad_affiliate_profile';

export function isValidStoredProfile(
  profile: StoredAffiliateProfile | null | undefined
): profile is StoredAffiliateProfile {
  if (!profile) return false;
  return Boolean(profile.kode_ref?.trim() && profile.link_ref?.trim() && profile.caption?.trim());
}

export function loadAffiliateProfile(): StoredAffiliateProfile | null {
  try {
    const raw = localStorage.getItem(AFFILIATE_PROFILE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredAffiliateProfile;
    if (!isValidStoredProfile(parsed)) {
      clearAffiliateProfile();
      return null;
    }

    return {
      kode_ref: parsed.kode_ref.trim(),
      link_ref: parsed.link_ref.trim(),
      caption: parsed.caption.trim(),
      nama: parsed.nama?.trim() || '',
      saved_at: parsed.saved_at || new Date().toISOString(),
    };
  } catch {
    clearAffiliateProfile();
    return null;
  }
}

export function saveAffiliateProfile(data: AffiliateDisplayData): void {
  const profile: StoredAffiliateProfile = {
    kode_ref: data.kode_ref.trim(),
    link_ref: data.link_ref.trim(),
    caption: data.caption.trim(),
    nama: data.nama?.trim() || '',
    saved_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(AFFILIATE_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable
  }
}

export function clearAffiliateProfile(): void {
  try {
    localStorage.removeItem(AFFILIATE_PROFILE_KEY);
  } catch {
    // ignore
  }
}

export function storedProfileToDisplay(
  profile: StoredAffiliateProfile
): AffiliateDisplayData {
  return {
    kode_ref: profile.kode_ref,
    link_ref: profile.link_ref,
    caption: profile.caption,
    nama: profile.nama || undefined,
  };
}