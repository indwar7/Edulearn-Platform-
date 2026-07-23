import { usePageCss } from '../lib/usePageCss';
import VideosMarkup from './markup/VideosMarkup';
import css from '../styles/pages/videos.css?inline';

/**
 * Videos — renders videos.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Videos() {
  usePageCss(css);
  return <VideosMarkup />;
}
