import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// No global CSS import here. index.html loads theme.css and vivid.css as real
// <link> tags in a deliberate order, and each route swaps its own stylesheet
// into the <style id="page-css"> slot between them. A CSS import from JS would
// be appended after vivid.css and outrank the theme.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
