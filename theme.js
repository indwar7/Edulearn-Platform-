// Theme Manager - Works across all pages
class ThemeManager {
  constructor() {
    this.storageKey = 'edulearn-theme';
    this.darkModeClass = 'dark-mode';
    this.init();
  }

  init() {
    // Apply theme before rendering to avoid flash
    this.applyStoredThemeSync();
    // Then setup event listeners
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupThemeToggleButtons());
    } else {
      this.setupThemeToggleButtons();
    }
  }

  applyStoredThemeSync() {
    const savedTheme = localStorage.getItem(this.storageKey) || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add(this.darkModeClass);
    } else {
      document.documentElement.classList.remove(this.darkModeClass);
    }
  }

  setupThemeToggleButtons() {
    // Find all theme toggle buttons
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme(button);
      });
      this.updateButtonIcon(button);
    });
  }

  toggleTheme(button) {
    const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
    
    if (isDarkMode) {
      document.documentElement.classList.remove(this.darkModeClass);
      localStorage.setItem(this.storageKey, 'light');
    } else {
      document.documentElement.classList.add(this.darkModeClass);
      localStorage.setItem(this.storageKey, 'dark');
    }

    // Update all toggle buttons on the page
    const allButtons = document.querySelectorAll('[data-theme-toggle]');
    allButtons.forEach(btn => this.updateButtonIcon(btn));
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { isDarkMode: !isDarkMode }
    }));
  }

  updateButtonIcon(button) {
    const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
    const sun = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7"/></svg>';
    const moon = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
    button.innerHTML = isDarkMode ? sun : moon;
    button.title = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
    button.setAttribute('aria-label', button.title);
  }

  isDarkMode() {
    return document.documentElement.classList.contains(this.darkModeClass);
  }

  setDarkMode(isDark) {
    if (isDark) {
      document.documentElement.classList.add(this.darkModeClass);
      localStorage.setItem(this.storageKey, 'dark');
    } else {
      document.documentElement.classList.remove(this.darkModeClass);
      localStorage.setItem(this.storageKey, 'light');
    }
    const allButtons = document.querySelectorAll('[data-theme-toggle]');
    allButtons.forEach(btn => this.updateButtonIcon(btn));
  }
}

// Initialize immediately
const themeManager = new ThemeManager();
window.themeManager = themeManager;
