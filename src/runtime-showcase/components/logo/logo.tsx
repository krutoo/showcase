import { type ReactNode, useContext } from 'react';
import { useNavigate } from '../../shared/router';
import { ShowcaseContext } from '../../context/showcase';
import { ColorSchemesContext } from '../../context/color-schemes';
import styles from './logo.m.css';

export function Logo(): ReactNode {
  const { processedProps, defaultPathname } = useContext(ShowcaseContext);
  const { logoSrc, title } = processedProps;
  const navigate = useNavigate();
  const { colorScheme } = useContext(ColorSchemesContext);
  const src = colorScheme === 'dark' ? (logoSrc?.dark ?? logoSrc?.light) : logoSrc?.light;

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
