import { usePageCss } from '../lib/usePageCss';
import AdminMarkup from './markup/AdminMarkup';
import css from '../styles/pages/admin.css?inline';

/**
 * Admin — renders admin.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Admin() {
  usePageCss(css);
  return <AdminMarkup />;
}
