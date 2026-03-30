import { type Context, createContext } from 'react';

export interface ColorSchemesContextValue {
  colorScheme: undefined | 'light' | 'dark';
  onColorSchemeToggle(): void;
}

export const ColorSchemesContext: Context<ColorSchemesContextValue> =
  createContext<ColorSchemesContextValue>({
    colorScheme: undefined,
    onColorSchemeToggle: () => {},
  });

ColorSchemesContext.displayName = 'ColorSchemesContext';
