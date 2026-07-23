import { usePageCss } from '../lib/usePageCss';
import DashboardMarkup from './markup/DashboardMarkup';
import css from '../styles/pages/dashboard.css?inline';

/**
 * Dashboard — renders dashboard.html's real stylesheet and markup.
 *
 * Behaviour from the original page's <script> is not ported yet, so any
 * region it used to fill at runtime renders empty. The static structure and
 * styling are already exact.
 */
export default function Dashboard() {
  usePageCss(css);
  return <DashboardMarkup />;
}
