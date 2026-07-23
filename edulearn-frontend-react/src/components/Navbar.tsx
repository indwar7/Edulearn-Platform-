import { Link, useLocation } from 'react-router-dom';
import { useAuth, roleAllows } from '../context/AuthContext';
import { ROUTE_BY_PAGE } from '../lib/pages';

/**
 * The shared nav, markup-identical to the static site's.
 *
 * The class names are load-bearing: vivid.css owns every visual rule here
 * (.nav / .nav__inner / .nav__links / .nav__link.is-current / .brand /
 * .brand__mark / .brand__word / .nav__right / .btn-primary) and several of
 * them use !important specifically to beat per-page nav rules. Renaming
 * anything, or styling this component locally, breaks the "nav is identical on
 * every screen" guarantee.
 *
 * Link order matches the static nav exactly.
 */
const NAV_LINKS: { page: string; label: string; i18n: string }[] = [
  { page: 'learn', label: 'Learn', i18n: 'nav_learn' },
  { page: 'live', label: 'Live', i18n: 'nav_live' },
  { page: 'challenge', label: 'Arena', i18n: 'nav_arena' },
  { page: 'mocktest', label: 'Tests', i18n: 'nav_tests' },
  { page: 'pal', label: 'PAL AI', i18n: 'nav_pal' },
  { page: 'dashboard', label: 'Dashboard', i18n: 'nav_dash' },
];

export default function Navbar() {
  const { loggedIn, role } = useAuth();
  const { pathname } = useLocation();

  // role-guard.js rewrote the brand href to the dashboard once signed in, so
  // clicking it never bounces an authenticated user out to the landing page.
  const brandHref = loggedIn ? '/dashboard' : '/';

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link className="brand" to={brandHref} aria-label="EduLearn home">
          <svg className="brand__mark" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 1.5 L14.6 9.4 L22.5 12 L14.6 14.6 L12 22.5 L9.4 14.6 L1.5 12 L9.4 9.4 Z"
              fill="url(#auroraGrad)"
            />
          </svg>
          <span className="brand__word">EduLearn</span>
        </Link>

        <div className="nav__links">
          {NAV_LINKS
            // Logged out, the static nav still rendered every link — the guard
            // only hid them for a signed-in role that may not open the page.
            .filter((l) => !loggedIn || roleAllows(role, l.page))
            .map((l) => {
              const to = ROUTE_BY_PAGE[l.page];
              return (
                <Link
                  key={l.page}
                  className={`nav__link${pathname === to ? ' is-current' : ''}`}
                  to={to}
                  data-i18n={l.i18n}
                >
                  {l.label}
                </Link>
              );
            })}
        </div>

        <div className="nav__right">
          {/* "Start free" points at the login screen, so it is hidden once
              signed in rather than bouncing the user back there. */}
          {!loggedIn && (
            <Link className="btn-primary" to="/login" data-i18n="nav_cta">
              Start free
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
