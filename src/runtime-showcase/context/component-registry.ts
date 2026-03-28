import { createContext } from 'react';
import { AppAside } from '../components/app-aside';
import { AppHeader } from '../components/app-header';
import { AppMain } from '../components/app-main';
import { AppModals } from '../components/app-modals';
import { AppSearch } from '../components/app-search';
import { HeaderLinks } from '../components/header-links';
import { Logo } from '../components/logo';

export const DefaultComponents = {
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
export const ComponentRegistryContext = createContext(DefaultComponents);

ComponentRegistryContext.displayName = 'ComponentRegistryContext';
