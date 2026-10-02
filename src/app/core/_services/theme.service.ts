import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const STORAGE_KEY = 'captive-theme';
const THEME_LINK_ID = 'app-theme';
const DARK_CLASS = 'app-dark';
const THEME_FILES: Record<AppTheme, string> = {
  light: 'assets/themes/lara-light-blue/theme.css',
  dark: 'assets/themes/lara-dark-neutral/theme.css',
};

/**
 * Switches the PrimeNG theme between light and dark by swapping the stylesheet of
 * <link id="app-theme"> (see index.html / angular.json) and toggling the `app-dark` class on <html>.
 * The choice is remembered in localStorage; without one, the OS preference is used.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);

  readonly theme = signal<AppTheme>(this.initialTheme());

  constructor() {
    this.apply(this.theme());
  }

  get isDark(): boolean {
    return this.theme() === 'dark';
  }

  toggle(): void {
    this.setTheme(this.isDark ? 'light' : 'dark');
  }

  setTheme(theme: AppTheme): void {
    this.theme.set(theme);
    this.apply(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable (private mode, blocked): the theme still applies for this session
    }
  }

  private apply(theme: AppTheme): void {
    const link = this.document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    const href = THEME_FILES[theme];
    if (link && !link.href.endsWith(href)) link.href = href;
    this.document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
  }

  private initialTheme(): AppTheme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
