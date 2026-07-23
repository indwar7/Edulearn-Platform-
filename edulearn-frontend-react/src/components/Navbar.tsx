import { Link } from 'react-router-dom';
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

/**
 * Only these pages loaded role-guard.js, and its nav cosmetics — hiding the
 * "Start free" CTA, repointing the brand at the dashboard, hiding links the
 * role cannot open — ran nowhere else. videos.html and the teacher tools show
 * the signed-out CTA even to a signed-in user for exactly this reason, so the
 * cosmetics are applied per page rather than globally.
 */
const GUARDED = new Set(['dashboard', 'learn', 'lesson', 'mocktest', 'challenge', 'pal', 'live']);

/**
 * Which nav item each page marked `is-current`.
 *
 * Six pages are not themselves in the nav and highlighted their parent
 * section instead — a lesson is part of Learn, creating a test is part of
 * Tests, and the teacher tools sit under Dashboard. Deriving this from the
 * route alone leaves those pages with no highlight at all, which is what the
 * pixel diff caught on upload, admin, videos, lesson and create-test.
 */
const CURRENT_NAV: Record<string, string> = {
  dashboard: 'dashboard',
  learn: 'learn',
  lesson: 'learn',
  videos: 'learn',
  mocktest: 'mocktest',
  'take-test': 'mocktest',
  'create-test': 'mocktest',
  challenge: 'challenge',
  pal: 'pal',
  live: 'live',
  upload: 'dashboard',
  admin: 'dashboard',
  // index deliberately absent: the landing page highlights nothing.
};

export default function Navbar({ page }: { page: string }) {
  const { loggedIn, role } = useAuth();

  const guarded = GUARDED.has(page);
  const currentNav = CURRENT_NAV[page];
  // role-guard.js rewrote the brand href to the dashboard once signed in, so
  // clicking it never bounces an authenticated user out to the landing page.
  const brandHref = loggedIn && guarded ? '/dashboard' : '/';

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
            .filter((l) => !guarded || !loggedIn || roleAllows(role, l.page))
            .map((l) => {
              const to = ROUTE_BY_PAGE[l.page];
              return (
                <Link
                  key={l.page}
                  className={`nav__link${l.page === currentNav ? ' is-current' : ''}`}
                  to={to}
                  data-i18n={l.i18n}
                >
                  {l.label}
                </Link>
              );
            })}
        </div>

        <div className="nav__right">
          {/*
            #backLink lives here, not in the page body. The lesson bootstrap
            reads it by id and points it at the chapter's subject listing; when
            it went missing before, `back.href = ...` threw and aborted the
            bootstrap before LESSON.cls/.subject/.slug were set, silently
            killing the video lookup gated on them. It must render before the
            CTA, as it did in lesson.html.
          */}
          {page === 'lesson' && (
            <a className="btn-back" id="backLink" href="learn.html">← Back</a>
          )}

          {/* "Start free" points at the login screen, so role-guard.js hid it
              once signed in rather than bouncing the user back there — but
              only on the pages that loaded it. */}
          {!(loggedIn && guarded) && (
            <Link className="btn-primary" to="/login" data-i18n="nav_cta">
              Start free
            </Link>
          )}

          {/* PAL's sidebar toggle also sat inside .nav__right. */}
          {page === 'pal' && (
            <button className="menu-btn" id="menuBtn" type="button" aria-label="Toggle sidebar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
