import { usePageCss } from '../lib/usePageCss';
import ChallengeMarkup from './markup/ChallengeMarkup';
import css from '../styles/pages/challenge.css?inline';

/**
 * Challenge — renders challenge.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Challenge() {
  usePageCss(css);
  return <ChallengeMarkup />;
}
