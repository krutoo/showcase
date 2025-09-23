import { type ReactNode, useContext } from 'react';
import { useNavigate } from '../../shared/router-react';
import { ShowcaseContext } from '../../context/showcase';
import { ColorSchemesContext } from '../../context/color-schemes';
import styles from './logo.m.css';

export function Logo(): ReactNode {
  const { processedProps, defaultPathname } = useContext(ShowcaseContext);
  const { logoSrc, title, routing } = processedProps;
  const navigate = useNavigate();
  const { colorScheme } = useContext(ColorSchemesContext);
  const src = colorScheme === 'dark' ? (logoSrc?.dark ?? logoSrc?.light) : logoSrc?.light;

  const handleClick = () => {
    const story = processedProps.stories.find(item => item.pathname === defaultPathname);

    if (!story) {
      return;
    }

    navigate(routing.getStoryShowcaseUrl(story));
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      {src && <img className={styles.logo} src={src} alt='logo' />}
      {title}
    </div>
  );
}
