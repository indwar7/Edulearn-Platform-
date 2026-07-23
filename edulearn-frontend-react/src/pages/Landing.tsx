import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageCss } from '../lib/usePageCss';
import { useAuth } from '../context/AuthContext';
import LandingMarkup from './markup/LandingMarkup';
import css from '../styles/pages/index.css?inline';

/**
 * The public landing page (index.html).
 *
 * Its only behaviour was a head script that bounced signed-in visitors to the
 * dashboard before the body painted, so nobody who already has a session ever
 * sees the marketing page.
 */
export default function Landing() {
  usePageCss(css);
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // replace() so Back doesn't bounce the user straight back here.
    if (loggedIn) navigate('/dashboard', { replace: true });
  }, [loggedIn, navigate]);

  return <LandingMarkup />;
}
