import { usePageCss } from '../lib/usePageCss';
import LoginMarkup from './markup/LoginMarkup';
import css from '../styles/pages/login.css?inline';

/**
 * Login — renders login.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Login() {
  usePageCss(css);
  return <LoginMarkup />;
}
