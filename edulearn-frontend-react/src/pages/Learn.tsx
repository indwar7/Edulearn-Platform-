import { usePageCss } from '../lib/usePageCss';
import LearnMarkup from './markup/LearnMarkup';
import css from '../styles/pages/learn.css?inline';

/**
 * Learn — renders learn.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Learn() {
  usePageCss(css);
  return <LearnMarkup />;
}
