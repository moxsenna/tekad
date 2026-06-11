import type { LpVariant } from './routing';
import { WEBINAR_THEME } from './webinarCopy';

export const META_PIXEL_ID = '1735894211091001';

export type CtaLocation = 'hero' | 'sticky' | 'roadmap' | 'final' | 'header';

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  push?: FbqFunction;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

let initialized = false;
let scriptInjected = false;
const trackedLandingKeys = new Set<string>();

function safeFbq(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.fbq?.(...args);
  } catch {
    // Pixel unavailable — never break the app
  }
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function initMetaPixel(pixelId: string = META_PIXEL_ID): void {
  if (typeof window === 'undefined' || initialized) return;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, args as [unknown, ...unknown[]]);
      } else {
        fbq.queue?.push(args);
      }
    } as FbqFunction;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
  }

  if (!scriptInjected) {
    scriptInjected = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  }

  safeFbq('init', pixelId);
  initialized = true;
}

export function trackPageView(params?: Record<string, unknown>): void {
  safeFbq('track', 'PageView', params);
}

export function trackViewContent(params?: Record<string, unknown>): void {
  safeFbq('track', 'ViewContent', params);
}

export function trackAddToCart(params?: Record<string, unknown>): void {
  safeFbq('track', 'AddToCart', params);
}

export function trackAddPaymentInfo(params?: Record<string, unknown>): void {
  safeFbq('track', 'AddPaymentInfo', params);
}

export function trackLead(params?: Record<string, unknown>): void {
  safeFbq('track', 'Lead', params);
}

export function trackCustom(eventName: string, params?: Record<string, unknown>): void {
  safeFbq('trackCustom', eventName, params);
}

export function trackLandingPageView(lpVariant: LpVariant): void {
  const key = `${lpVariant}:${window.location.pathname}`;
  if (trackedLandingKeys.has(key)) return;
  trackedLandingKeys.add(key);

  trackPageView();
  trackViewContent({
    content_name:
      lpVariant === 'v2'
        ? `TEKAD Webinar V2 FSP - ${WEBINAR_THEME}`
        : `TEKAD Webinar Main - ${WEBINAR_THEME}`,
    content_category: 'webinar',
    lp_variant: lpVariant,
  });
}

export function trackWebinarFormOpen(lpVariant: LpVariant, ctaLocation?: CtaLocation): void {
  trackAddToCart({
    lp_variant: lpVariant,
    ...(ctaLocation ? { cta_location: ctaLocation } : {}),
  });
  trackCustom('WebinarFormOpen', {
    lp_variant: lpVariant,
    ...(ctaLocation ? { cta_location: ctaLocation } : {}),
  });
}

export function trackWebinarFormStart(lpVariant: LpVariant): void {
  trackCustom('WebinarFormStart', { lp_variant: lpVariant });
}

export function trackWebinarFormStep(
  lpVariant: LpVariant,
  stepIndex: number,
  stepName: string
): void {
  trackCustom('WebinarFormStep', {
    lp_variant: lpVariant,
    step_index: stepIndex,
    step_name: stepName,
  });
}

export function trackWebinarFormReview(lpVariant: LpVariant): void {
  trackAddPaymentInfo({ lp_variant: lpVariant });
  trackCustom('WebinarFormReview', { lp_variant: lpVariant });
}

export function trackWebinarRegistrationSuccess(
  lpVariant: LpVariant,
  tracking: { utm_source: string; utm_medium: string; utm_campaign: string }
): void {
  trackLead({
    content_name: `TEKAD Webinar Registration - ${WEBINAR_THEME}`,
    content_category: 'webinar',
    lp_variant: lpVariant,
  });
  trackCustom('WebinarRegistrationSuccess', {
    lp_variant: lpVariant,
    utm_source: tracking.utm_source || undefined,
    utm_medium: tracking.utm_medium || undefined,
    utm_campaign: tracking.utm_campaign || undefined,
  });
}

export function trackWebinarWhatsAppRedirect(lpVariant: LpVariant): void {
  trackCustom('WebinarWhatsAppRedirect', { lp_variant: lpVariant });
}

export type OpenFormFn = (location: CtaLocation) => void;