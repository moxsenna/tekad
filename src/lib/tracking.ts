import type { TrackingData } from '../types/lead';

export function captureTracking(): TrackingData {
  const params = new URLSearchParams(window.location.search);

  return {
    source: params.get('source') || 'direct',
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    page_url: window.location.href,
    user_agent: navigator.userAgent,
  };
}