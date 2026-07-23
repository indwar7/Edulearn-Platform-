import { usePageCss } from '../lib/usePageCss';
import MockTestMarkup from './markup/MockTestMarkup';
import css from '../styles/pages/mocktest.css?inline';

/**
 * MockTest — renders mocktest.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function MockTest() {
  usePageCss(css);
  return <MockTestMarkup />;
}
