import { type ReactNode, useContext } from 'react';
import { useNavigate } from '../../shared/router';
import { ShowcaseContext } from '../../context/showcase';
import styles from './logo.m.css';
import { ThemeContext } from '../../context/theme';

export function Logo(): ReactNode {
  const { processedProps, defaultPathname } = useContext(ShowcaseContext);
  const { logoSrc, title } = processedProps;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const src = theme === 'dark' ? (logoSrc?.dark ?? logoSrc?.light) : logoSrc?.light;

  const handleClick = () => {
    navigate(defaultPathname);
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      {src && <img className={styles.logo} src={src} alt='logo' />}
      {title}
    </div>
  );
}
