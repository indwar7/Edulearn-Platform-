import { usePageCss } from '../lib/usePageCss';
import PalMarkup from './markup/PalMarkup';
import css from '../styles/pages/pal.css?inline';

/**
 * Pal — renders pal.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Pal() {
  usePageCss(css);
  return <PalMarkup />;
}
