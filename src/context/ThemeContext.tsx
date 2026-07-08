import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

// ─── Color palettes ───────────────────────────────────────────────────────────

export const darkColors = {
  isDark: true,
  bg: '#0D0F1A',
  bgGradient: ['#0D0F1A', '#0D0F1A'] as [string, string],
  surface: '#161929',
  surface2: '#1E2235',
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.05)',
  text: '#F0F2FF',
  textSub: 'rgba(240,242,255,0.55)',
  textMuted: 'rgba(240,242,255,0.35)',
  // Pill + action bar
  pill: 'rgba(255,255,255,0.05)',
  pillInactive: 'rgba(255,255,255,0.12)',
  actionBar: 'rgba(20,22,40,0.60)',
  // BlurView
  blurTint: 'dark' as const,
  blurIntensity: 5,
  overlay: 'rgba(0,0,0,0.28)',
  // Status bar
  statusBar: 'light' as const,
};

export const lightColors = {
  isDark: false,
  bg: '#F3F5FB',
  bgGradient: ['#F3F5FB', '#F3F5FB'] as [string, string],
  surface: '#FFFFFF',
  surface2: '#EAEdf5',
  border: 'rgba(0,0,0,0.07)',
  borderLight: 'rgba(0,0,0,0.04)',
  text: '#111827',
  textSub: 'rgba(17,24,39,0.50)',
  textMuted: 'rgba(17,24,39,0.30)',
  // Pill + action bar
  pill: 'rgba(0,0,0,0.04)',
  pillInactive: 'rgba(0,0,0,0.10)',
  actionBar: 'rgba(255,255,255,0.72)',
  // BlurView
  blurTint: 'light' as const,
  blurIntensity: 5,
  overlay: 'rgba(0,0,0,0.15)',
  // Status bar
  statusBar: 'dark' as const,
};

export type AppColors = typeof darkColors;

// ─── Context ──────────────────────────────────────────────────────────────────

type ThemeContextValue = {
  colors: AppColors;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  isDark: true,
  toggleTheme: () => { },
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppTheme() {
  return useContext(ThemeContext);
}
