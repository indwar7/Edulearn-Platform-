import { usePageCss } from '../lib/usePageCss';
import UploadMarkup from './markup/UploadMarkup';
import css from '../styles/pages/upload.css?inline';

/**
 * Upload — renders upload.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Upload() {
  usePageCss(css);
  return <UploadMarkup />;
}
