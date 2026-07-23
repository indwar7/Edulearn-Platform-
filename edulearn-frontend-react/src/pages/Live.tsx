import { usePageCss } from '../lib/usePageCss';
import LiveMarkup from './markup/LiveMarkup';
import css from '../styles/pages/live.css?inline';

/**
 * Live — renders live.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Live() {
  usePageCss(css);
  return <LiveMarkup />;
}
