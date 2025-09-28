import { type ReactNode, useContext } from 'react';
import { ShowcaseContext } from '../../context/showcase';
import { ColorSchemesContext } from '../../context/color-schemes';
import { Link } from '../link';
import { RoutingContext } from '../../context/routing';
import styles from './logo.m.css';

export function Logo(): ReactNode {
  const { pathnameToUrl } = useContext(RoutingContext);
  const { colorScheme } = useContext(ColorSchemesContext);
  const { config } = useContext(ShowcaseContext);
  const { logoSrc, title, defaultStory } = config;
  const src = colorScheme === 'dark' ? (logoSrc?.dark ?? logoSrc?.light) : logoSrc?.light;

  return (
    <Link className={styles.root} href={pathnameToUrl(defaultStory.pathname)}>
      {src && <img className={styles.logo} alt='logo' src={src} />}
      {title}
    </Link>
  );
}
