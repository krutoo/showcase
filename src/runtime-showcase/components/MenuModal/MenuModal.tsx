import { useLocation, useNavigate } from '../../shared/router';
import { IoMdClose } from 'react-icons/io';
import { Menu, MenuItem, MenuItemTitle } from '../Menu/Menu';
import { useContext } from 'react';
import { ShowcaseContext, useMenuItems } from '../../context/showcase';
import styles from './MenuModal.m.css';

export interface MenuModalProps {
  open?: boolean;
  onClose?: VoidFunction;
}

export function MenuModal({ open, onClose }: MenuModalProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { processedProps } = useContext(ShowcaseContext);
  const { headerLinks, defineStoryUrl } = processedProps;

  const menuItems = useMenuItems();

  if (!open) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <IoMdClose className={styles.close} onClick={() => onClose?.()} />
      </div>
      <div className={styles.body}>
        {headerLinks?.map((item, index) => (
          <MenuItem key={index}>
            <MenuItemTitle href={item.href} target='_blank'>
              {item.name}
            </MenuItemTitle>
          </MenuItem>
        ))}

        <hr className={styles.hr} />

        <Menu
          items={menuItems}
          getTitle={data => data.title}
          getChildItems={data => (data.type === 'group' ? data.items : [])}
          getHref={data => {
            if (data.type !== 'story') {
              return undefined;
            }

            return defineStoryUrl(data.story);
          }}
          isActive={data => {
            if (data.type !== 'story') {
              return false;
            }

            return data.story.pathname === location.pathname;
          }}
          onItemClick={(event, data) => {
            if (data.type === 'story' && location.pathname !== data.story.pathname) {
              event.preventDefault();
              navigate(data.story.pathname);
              onClose?.();
            } else if (data.type === 'story') {
              event.preventDefault();
            }
          }}
        />
      </div>
    </div>
  );
}
