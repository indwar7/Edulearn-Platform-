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
    button.textContent = isDarkMode ? '☀️' : '🌙';
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
