import { createContext } from 'react';

export interface ColorSchemesContextValue {
  colorScheme: undefined | 'light' | 'dark';
  onColorSchemeToggle(): void;
}

export const ColorSchemesContext = createContext<ColorSchemesContextValue>({
  colorScheme: undefined,
  onColorSchemeToggle: () => {},
});
