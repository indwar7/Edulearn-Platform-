import { usePageCss } from '../lib/usePageCss';
import TakeTestMarkup from './markup/TakeTestMarkup';
import css from '../styles/pages/take-test.css?inline';

/**
 * TakeTest — renders take-test.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function TakeTest() {
  usePageCss(css);
  return <TakeTestMarkup />;
}
