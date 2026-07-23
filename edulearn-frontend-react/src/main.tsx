import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { installEduApiGlobal } from './lib/eduApiGlobal';
import App from './App';

// No global CSS import here. index.html loads theme.css and vivid.css as real
// <link> tags in a deliberate order, and each route swaps its own stylesheet
// into the <style id="page-css"> slot between them. A CSS import from JS would
// be appended after vivid.css and outrank the theme.

// features-panel.js (loaded from index.html, verbatim from the static site)
// reads window.EduAPI to show real progress.
installEduApiGlobal();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
