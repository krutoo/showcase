import { useContext } from 'react';
import { ComponentRegistryContext } from '../../context/component-registry';
import { Header } from '../layout';

export function AppHeader() {
  const { HeaderLogo, HeaderLinks } = useContext(ComponentRegistryContext);

  return (
    <Header>
      <HeaderLogo />
      <HeaderLinks />
    </Header>
  );
}
