import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageEnv } from './pageScriptEnv';

/** A lifted page script: see scripts/extract-page-js.mjs. */
export type PageScript = (env: ReturnType<typeof createPageEnv>) => void;

/**
 * Run a page's original script against its mounted markup.
 *
 * useEffect (not useLayoutEffect) so it fires after the markup is in the DOM,
 * matching the static pages where the script sat at the end of <body> and every
 * element it queries already existed.
 *
 * Errors are caught and logged rather than thrown: one page's script failing
 * should leave that page's static content on screen, not blank the whole app
 * via an unhandled render error.
 */
export function usePageScript(script: PageScript): void {
  const navigate = useNavigate();

  useEffect(() => {
    const env = createPageEnv(navigate);
    try {
      script(env);
      env.flushReady();
    } catch (err) {
      console.error('[edulearn] page script failed:', err);
    }
    return () => env.dispose();
  }, [script, navigate]);
}
