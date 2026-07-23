import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuroraDefs from './components/AuroraDefs';
import ProtectedRoute from './components/ProtectedRoute';
import { useLegacyLinks } from './lib/useLegacyLinks';
import { usePageChrome } from './lib/usePageChrome';
import { pageFromPath } from './lib/pages';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Pal from './pages/Pal';
import Challenge from './pages/Challenge';
import MockTest from './pages/MockTest';
import TakeTest from './pages/TakeTest';
import CreateTest from './pages/CreateTest';
import Live from './pages/Live';
import Videos from './pages/Videos';
import Upload from './pages/Upload';
import Admin from './pages/Admin';

/**
 * login.html and signup.html are the only pages with no shared nav — they own
 * the full viewport as an .auth-shell. Rendering the nav there would also trip
 * vivid.css's `:not(:has(.auth-shell))` guard into styling a surface it
 * deliberately excludes.
 */
const CHROMELESS = ['/login', '/signup'];

export default function App() {
  const { pathname } = useLocation();
  const chromeless = CHROMELESS.includes(pathname);
  const page = pageFromPath(pathname);

  // The ported markup still links to "learn.html" etc., exactly as the static
  // pages did; this turns those into in-app navigations.
  useLegacyLinks();

  // Only load the shared assets this route's original page loaded.
  usePageChrome(page);

  return (
    <>
      {/* No wrapper class here on purpose. The active page's own stylesheet
          owns body/background, exactly as it did on the static site. */}
      {/* The account menu is account-menu.js, loaded in index.html exactly as
          the static pages loaded it, and gated per route by usePageChrome. */}
      {!chromeless && <Navbar page={page} />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/*
          Only these seven loaded role-guard.js, so only these get the hard
          redirect it performed. The remaining pages deliberately did not:
          upload, create-test and admin are teacher/admin tools that gate
          themselves in-page (a student sees "You must be logged in as a
          teacher"), and videos / take-test were never guarded at all.
          Guarding them here would bounce users the static site let through.
        */}
        <Route path="/dashboard" element={<ProtectedRoute page="dashboard"><Dashboard /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute page="learn"><Learn /></ProtectedRoute>} />
        <Route path="/lesson/:chapterId" element={<ProtectedRoute page="lesson"><Lesson /></ProtectedRoute>} />
        <Route path="/pal" element={<ProtectedRoute page="pal"><Pal /></ProtectedRoute>} />
        <Route path="/challenge" element={<ProtectedRoute page="challenge"><Challenge /></ProtectedRoute>} />
        <Route path="/mocktest" element={<ProtectedRoute page="mocktest"><MockTest /></ProtectedRoute>} />
        <Route path="/live" element={<ProtectedRoute page="live"><Live /></ProtectedRoute>} />

        {/* Unguarded, matching the originals — each self-gates where needed. */}
        <Route path="/take-test/:attemptId" element={<TakeTest />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Defines url(#auroraGrad), which the brand mark fills itself with. */}
      <AuroraDefs />
    </>
  );
}
