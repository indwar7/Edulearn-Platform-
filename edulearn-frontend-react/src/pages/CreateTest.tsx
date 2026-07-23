import { usePageCss } from '../lib/usePageCss';
import CreateTestMarkup from './markup/CreateTestMarkup';
import css from '../styles/pages/create-test.css?inline';

/**
 * CreateTest — renders create-test.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function CreateTest() {
  usePageCss(css);
  return <CreateTestMarkup />;
}
