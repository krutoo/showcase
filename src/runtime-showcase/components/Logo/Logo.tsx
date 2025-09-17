import { ReactNode, useContext } from 'react';
import { useNavigate } from '../../shared/router';
import { ShowcaseContext } from '../../context/showcase';
import styles from './Logo.m.css';

export function Logo(): ReactNode {
  const { processedProps, defaultPathname } = useContext(ShowcaseContext);
  const { logoSrc, title } = processedProps;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(defaultPathname);
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      {logoSrc && <img className={styles.logo} src={logoSrc} alt='logo' />}
      {title}
    </div>
  );
}
