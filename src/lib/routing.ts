export type AppRoute = 'webinar' | 'affiliate';

export function getAppRoute(pathname: string = window.location.pathname): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/affiliate') {
    return 'affiliate';
  }

  return 'webinar';
}