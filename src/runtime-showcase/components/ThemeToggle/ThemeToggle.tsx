import { useContext } from 'react';
import { ThemeContext } from '../../context/theme';
import { RiSunLine, RiMoonLine } from 'react-icons/ri';
import styles from './ThemeToggle.m.css';

export function ThemeToggle() {
  const { theme, onThemeToggle } = useContext(ThemeContext);

  const handleClick = () => {
    onThemeToggle();
  };

  return (
    <button className={styles.root} onClick={handleClick} aria-label='Toggle dark mode'>
      {theme === 'light' && <RiSunLine className={styles.icon} />}
      {theme === 'dark' && <RiMoonLine className={styles.icon} />}
    </button>
  );
}
