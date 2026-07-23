import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'edulearn-theme';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const el = document.documentElement;
    if (isDark) {
      el.classList.add('dark-mode');
    } else {
      el.classList.remove('dark-mode');
    }
    try { localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(d => !d), []);

  return { isDark, toggle, setIsDark };
}
