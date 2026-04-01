import { type ReactNode, useContext } from 'react';
import { ComponentRegistryContext } from '../../context/component-registry';
import { Header } from '../layout';

export function AppHeader(): ReactNode {
  const { HeaderLogo, HeaderLinks } = useContext(ComponentRegistryContext);

  return (
    <Header>
      <HeaderLogo />
      <HeaderLinks />
    </Header>
  );
}
