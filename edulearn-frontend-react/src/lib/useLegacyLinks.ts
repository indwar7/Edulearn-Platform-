import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_BY_PAGE } from './pages';

/**
 * Route legacy "<page>.html" links through the SPA router.
 *
 * The ported markup is a faithful copy of the static pages, so it is still
 * full of href="learn.html" — and features-panel.js builds its links the same
 * way at runtime. Rewriting every one of them would mean diverging from the
 * original markup in thousands of places (and re-diverging on every
 * regeneration), so instead a single delegated listener translates them on
 * click. Anything it does not recognise is left alone and behaves as a normal
 * link.
 */
export function useLegacyLinks(): void {
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Let the browser handle modified clicks (new tab, download, etc.).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest?.('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref || anchor.hasAttribute('download') || anchor.getAttribute('target') === '_blank') return;

      // Resolve against the current location so relative hrefs work, then bail
      // on anything pointing off-site.
      let url: URL;
      try { url = new URL(rawHref, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;

      const file = url.pathname.split('/').pop() || '';
      if (!file.endsWith('.html')) return;

      const page = file.slice(0, -'.html'.length);
      const route = ROUTE_BY_PAGE[page];
      if (!route) return;

      // lesson.html?ch=c6-sci-food carried its target in the query string; the
      // SPA takes it as a path param instead.
      let to = route;
      if (page === 'lesson') {
        const chapter = url.searchParams.get('ch') || url.searchParams.get('chapter');
        if (chapter) to = `/lesson/${encodeURIComponent(chapter)}`;
      } else if (url.search) {
        to = route + url.search;
      }
      if (url.hash) to += url.hash;

      e.preventDefault();
      navigate(to);
    }

    // api.ts's requireAuth() has no router access, so it asks for navigation
    // by dispatching this instead of assigning to window.location.
    function onNavigate(e: Event) {
      const detail = (e as CustomEvent<{ to: string; replace?: boolean }>).detail;
      if (detail?.to) navigate(detail.to, { replace: !!detail.replace });
    }

    document.addEventListener('click', onClick);
    window.addEventListener('edulearn:navigate', onNavigate);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('edulearn:navigate', onNavigate);
    };
  }, [navigate]);
}
