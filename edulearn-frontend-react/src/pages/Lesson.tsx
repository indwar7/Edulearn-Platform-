import { usePageCss } from '../lib/usePageCss';
import LessonMarkup from './markup/LessonMarkup';
import css from '../styles/pages/lesson.css?inline';

/**
 * Lesson — renders lesson.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Lesson() {
  usePageCss(css);
  return <LessonMarkup />;
}
