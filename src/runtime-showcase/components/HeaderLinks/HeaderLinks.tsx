import { type ReactNode, useContext } from 'react';
import { ShowcaseContext } from '../../context/showcase';
import { Link } from '../Link';
import { useMatchMedia } from '@krutoo/utils/react';
import { BurgerMenuSVG } from '../../icons';
import { ThemeToggle } from '../ThemeToggle';
import styles from './HeaderLinks.m.css';

export function HeaderButtons(): ReactNode {
  const { processedProps, toggleMenu: toggleMenuModal } = useContext(ShowcaseContext);
  const { headerLinks, themes: themesEnabled } = processedProps;
  const mobile = useMatchMedia('(max-width: 960px)');

  return (
    <div className={styles.root}>
      {themesEnabled && <ThemeToggle />}

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
