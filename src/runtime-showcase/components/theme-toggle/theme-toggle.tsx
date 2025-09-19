import { useContext } from 'react';
import { ThemeContext } from '../../context/theme';
import { SunSVG, MoonSVG } from '../../icons';
import styles from './theme-toggle.m.css';

export function ThemeToggle() {
  const { theme, onThemeToggle } = useContext(ThemeContext);

  const handleClick = () => {
    onThemeToggle();
  };

  return (
    <button className={styles.root} onClick={handleClick} aria-label='Toggle dark mode'>
      {theme === 'light' && <SunSVG className={styles.icon} />}
      {theme === 'dark' && <MoonSVG className={styles.icon} />}
    </button>
  );
}
