import { useContext } from 'react';
import { ShowcaseContext } from '../../context/showcase';
import { Link } from '../Link';
import { useMatchMedia } from '@krutoo/utils/react';
import { IoMenu } from 'react-icons/io5';
import styles from './HeaderLinks.m.css';

export function HeaderLinks() {
  const { processedProps, toggleMenu: toggleMenuModal } = useContext(ShowcaseContext);
  const { headerLinks } = processedProps;
  const mobile = useMatchMedia('(max-width: 960px)');

  return (
    <div className={styles.root}>
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
        <IoMenu role='button' className={styles.menuIcon} onClick={() => toggleMenuModal(true)} />
      )}
    </div>
  );
}
