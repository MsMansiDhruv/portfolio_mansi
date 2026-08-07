/**
 * Theme Provider & Utilities
 * Manages light/dark mode and provides theme tokens to the entire app
 */

'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { themeTokens } from '../foundation/tokens';

const ThemeContext = createContext(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a DSv2ThemeProvider');
  }
  return ctx;
}

/**
 * DSv2ThemeProvider
 * - Manages light/dark theme state
 * - Persists preference to localStorage
 * - Syncs with system preference
 */
export function DSv2ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  syncSystemTheme = true,
}) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Resolve 'system' to actual theme
  const resolvedTheme = useMemo(() => {
    if (theme === 'light' || theme === 'dark') return theme;
    if (typeof window === 'undefined' || !mounted) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, [theme, mounted]);

  // Initialize from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('ds-v2-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [resolvedTheme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system' || !mounted || !syncSystemTheme) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      // Force re-render to pick up new system preference
      setThemeState('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme, mounted, syncSystemTheme]);

  const setTheme = (next) => {
    setThemeState(next);
    try {
      localStorage.setItem('ds-v2-theme', next);
    } catch {
      // ignore
    }
  };

  const context = {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    tokens: resolvedTheme === 'dark' ? themeTokens.dark : themeTokens.light,
  };

  return (
    <ThemeContext.Provider value={context}>
      <div data-theme={resolvedTheme}>{children}</div>
    </ThemeContext.Provider>
  );
}

/**
 * Helper to get color value for current theme
 */
export function useThemeColor(lightColor, darkColor) {
  const { isDark } = useTheme();
  return isDark ? darkColor : lightColor;
}

/**
 * Helper to get token value
 */
export function useThemeToken(tokenKey) {
  const { tokens } = useTheme();
  return tokens[tokenKey];
}
