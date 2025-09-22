import { type ReactNode, useContext } from 'react';
import { ShowcaseContext } from '../../context/showcase';
import { Link } from '../link';
import { useMatchMedia } from '@krutoo/utils/react';
import { BurgerMenuSVG } from '../../icons';
import { ColorSchemeToggle } from '../color-scheme-toggle';
import styles from './header-links.m.css';

export function HeaderButtons(): ReactNode {
  const { processedProps, toggleMenu: toggleMenuModal } = useContext(ShowcaseContext);
  const { headerLinks, colorSchemes } = processedProps;
  const mobile = useMatchMedia('(max-width: 960px)');

  return (
    <div className={styles.root}>
      {colorSchemes.enabled && <ColorSchemeToggle />}

      {!mobile && (
        <>
          {headerLinks?.map((item, index) => (
            <Link key={index} href={item.href} target='_blank'>
              {item.name}
            </Link>
          ))}
        </>
      )}

      {mobile && (
        <BurgerMenuSVG
          role='button'
          className={styles.menuIcon}
          onClick={() => toggleMenuModal(true)}
        />
      )}
    </div>
  );
}
