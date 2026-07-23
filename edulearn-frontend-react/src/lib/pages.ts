/**
 * Page ids are the static site's filenames minus ".html". They stay the
 * canonical identifier because the access matrix in role-guard.js was keyed by
 * them, and AuthContext's ACCESS is a direct port — keeping the ids identical
 * means the policy can be compared line-for-line against the original.
 *
 * This map is the one place that translates a page id to its SPA route.
 */
export const ROUTE_BY_PAGE: Record<string, string> = {
  index: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  learn: '/learn',
  lesson: '/lesson',
  videos: '/videos',
  mocktest: '/mocktest',
  'take-test': '/take-test',
  'create-test': '/create-test',
  challenge: '/challenge',
  pal: '/pal',
  live: '/live',
  upload: '/upload',
  admin: '/admin',
};

/** Public pages: never guarded, even when logged out (PUBLIC in role-guard.js). */
export const PUBLIC_PAGES = ['index', 'login', 'signup'];

/**
 * Which page a path belongs to. Routes with params (/lesson/:chapterId,
 * /take-test/:attemptId) match on their first segment.
 */
export function pageFromPath(pathname: string): string {
  if (pathname === '/') return 'index';
  const first = '/' + (pathname.split('/').filter(Boolean)[0] ?? '');
  for (const [page, route] of Object.entries(ROUTE_BY_PAGE)) {
    if (route === pathname || route === first) return page;
  }
  return 'index';
}
