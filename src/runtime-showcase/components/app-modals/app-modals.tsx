import { useContext } from 'react';
import { useMatchMedia } from '@krutoo/utils/react';
import { ShowcaseContext } from '../../context/showcase';
import { MenuModal } from '../menu-modal';

export function AppModals() {
  const { menuOpen, toggleMenu } = useContext(ShowcaseContext);
  const mobile = useMatchMedia('(max-width: 960px)');

  if (!mobile) {
    return null;
  }

  return <MenuModal open={menuOpen} onClose={() => toggleMenu(false)} />;
}
