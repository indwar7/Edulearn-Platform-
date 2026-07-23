import { useParams } from 'react-router-dom';
import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import LessonMarkup from './markup/LessonMarkup';
import css from '../styles/pages/lesson.css?inline';
import script from './scripts/lesson.js';

/**
 * Lesson — lesson.html's real stylesheet, markup and script.
 *
 * The chapter arrived as `lesson.html?ch=<id>` and the script still reads it
 * from location.search. The SPA carries it as a path param, so the query
 * string is rebuilt for the script; without it the page falls back to the
 * generic "This lesson" title and the video lookup never resolves.
 */
export default function Lesson() {
  const { chapterId } = useParams<{ chapterId: string }>();
  usePageCss(css);
  usePageScript(script, chapterId ? `?ch=${encodeURIComponent(chapterId)}` : '');
  return <LessonMarkup />;
}
