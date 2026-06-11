export type AppRoute = 'webinar' | 'affiliate' | 'v2' | 'bonus-checklist';
export type LpVariant = 'main' | 'v2';

export function getAppRoute(pathname: string = window.location.pathname): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/affiliate') {
    return 'affiliate';
  }

  if (normalized === '/v2') {
    return 'v2';
  }

  if (normalized === '/bonus/checklist') {
    return 'bonus-checklist';
  }

  return 'webinar';
}

export function getLpVariant(pathname: string = window.location.pathname): LpVariant {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized === '/v2' ? 'v2' : 'main';
}