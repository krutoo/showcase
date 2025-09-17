import { createContext } from 'react';

export interface ThemeContextValue {
  theme: undefined | 'light' | 'dark';
  onThemeToggle(): void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: undefined,
  onThemeToggle: () => {},
});
