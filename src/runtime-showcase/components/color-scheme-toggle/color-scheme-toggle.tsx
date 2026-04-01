import { type ReactNode, useContext } from 'react';
import { ColorSchemesContext } from '../../context/color-schemes';
import { MoonSVG, SunSVG } from '../../icons';
import styles from './color-scheme-toggle.m.css';

export function ColorSchemeToggle(): ReactNode {
  const { colorScheme, onColorSchemeToggle } = useContext(ColorSchemesContext);

  const handleClick = () => {
    onColorSchemeToggle();
  };

  return (
    <button className={styles.root} onClick={handleClick} aria-label='Toggle dark mode'>
      {colorScheme === 'light' && <SunSVG className={styles.icon} />}
      {colorScheme === 'dark' && <MoonSVG className={styles.icon} />}
    </button>
  );
}
