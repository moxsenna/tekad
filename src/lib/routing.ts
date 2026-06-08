export type AppRoute = 'webinar' | 'affiliate' | 'v2';
export type LpVariant = 'main' | 'v2';

export function getAppRoute(pathname: string = window.location.pathname): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/affiliate') {
    return 'affiliate';
  }

  if (normalized === '/v2') {
    return 'v2';
  }

  return 'webinar';
}

export function getLpVariant(pathname: string = window.location.pathname): LpVariant {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized === '/v2' ? 'v2' : 'main';
}