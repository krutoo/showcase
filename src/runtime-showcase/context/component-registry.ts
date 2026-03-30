import { type ComponentType, type Context, createContext } from 'react';
import { AppAside } from '../components/app-aside';
import { AppHeader } from '../components/app-header';
import { AppMain } from '../components/app-main';
import { AppModals } from '../components/app-modals';
import { AppSearch } from '../components/app-search';
import { HeaderLinks } from '../components/header-links';
import { Logo } from '../components/logo';

export interface ShowcaseComponentMap {
  Aside: ComponentType;
  Header: ComponentType;
  HeaderLinks: ComponentType;
  HeaderLogo: ComponentType;
  Main: ComponentType;
  Modals: ComponentType;
  Search: ComponentType<{ value: string; onValueChange: (value: string) => void }>;
}

export const DefaultComponents: ShowcaseComponentMap = {
  Aside: AppAside,
  Header: AppHeader,
  HeaderLinks,
  HeaderLogo: Logo,
  Main: AppMain,
  Modals: AppModals,
  Search: AppSearch,
};

/**
 * Context for injecting UI component implementation.
 */
export const ComponentRegistryContext: Context<ShowcaseComponentMap> =
  createContext<ShowcaseComponentMap>(DefaultComponents);

ComponentRegistryContext.displayName = 'ComponentRegistryContext';
