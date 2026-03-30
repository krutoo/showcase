import { type ReactNode, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { ColorSchemesContext } from '../../context/color-schemes';
import { ComponentRegistryContext } from '../../context/component-registry';
import { ShowcaseContext } from '../../context/showcase';
import { Layout } from '../layout';
import { useColorSchemeState } from './use-color-scheme-state';
import styles from './app.m.css';

export function App(): ReactNode {
  const { config } = useContext(ShowcaseContext);
  const { Header, Aside, Main, Modals } = useContext(ComponentRegistryContext);
  const { colorScheme, toggleColorScheme } = useColorSchemeState({
    classes: {
      dark: styles[`default-color-scheme-dark`],
      light: styles[`default-color-scheme-light`],
    },
  });

  const rootClassName = classNames(
    styles.root,
    config.colorSchemes.defaults && styles[`default-color-scheme-${colorScheme}`],
  );

  const dataColorScheme =
    config.colorSchemes.enabled && config.colorSchemes.attributeTarget === 'rootElement'
      ? colorScheme
      : undefined;

  const colorSchemeContext = useMemo(
    () => ({
      colorScheme,
      onColorSchemeToggle: toggleColorScheme,
    }),
    [colorScheme, toggleColorScheme],
  );

  return (
    <ColorSchemesContext.Provider value={colorSchemeContext}>
      <Layout className={rootClassName} data-color-scheme={dataColorScheme}>
        <Header />
        <Aside />
        <Main />
      </Layout>
      <Modals />
    </ColorSchemesContext.Provider>
  );
}
