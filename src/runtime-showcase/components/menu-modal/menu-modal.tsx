import { useLocation, useNavigate } from '../../shared/router';
import { CrossSVG } from '../../icons';
import { Menu, MenuItem, MenuItemTitle } from '../menu';
import { type ReactNode, useContext, useEffect, useState } from 'react';
import { ShowcaseContext, useMenuItems, useStorySearchResult } from '../../context/showcase';
import { Input } from '../input';
import styles from './menu-modal.m.css';

export interface MenuModalProps {
  open?: boolean;
  onClose?: VoidFunction;
}

export function MenuModal({ open, onClose }: MenuModalProps): ReactNode {
  const location = useLocation();
  const navigate = useNavigate();

  const { processedProps } = useContext(ShowcaseContext);
  const { headerLinks, defineStoryUrl } = processedProps;
  const [search, setSearch] = useState('');
  const searchResultItems = useStorySearchResult(search);
  const menuItems = useMenuItems();

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <CrossSVG className={styles.close} onClick={() => onClose?.()} />
      </div>
      <div className={styles.body}>
        {headerLinks?.map((item, index) => (
          <MenuItem key={index}>
            <MenuItemTitle href={item.href} target='_blank'>
              {item.name}
            </MenuItemTitle>
          </MenuItem>
        ))}

        {processedProps.storySearch && (
          <div className={styles.search}>
            <Input
              className={styles.searchField}
              type='search'
              placeholder='Search...'
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>
        )}

        {!processedProps.storySearch && <hr className={styles.hr} />}

        {search.length === 0 && (
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
              return !!data.story && data.story?.pathname === location.pathname;
            }}
            isInteractive={data => {
              return !!data.story && !data.story.meta?.menuHidden;
            }}
            onItemClick={(event, data) => {
              if (data.type === 'story' && !data.menuHidden) {
                event.preventDefault();
                navigate(data.story.pathname);
                onClose?.();
                return;
              }

              if (data.type === 'group' && data.story && !data.story.meta?.menuHidden) {
                event.preventDefault();
                navigate(data.story.pathname);
                return;
              }

              if (data.type === 'story') {
                event.preventDefault();
                return;
              }
            }}
          />
        )}

        {search.length > 0 && (
          <div className={styles.menu}>
            <Menu
              items={searchResultItems}
              getTitle={data => {
                return data.meta?.title || data.meta?.category;
              }}
              getHref={data => {
                // @todo use some util from router module
                return `?path=${data.pathname}`;
              }}
              isActive={data => {
                return data.pathname === location.pathname;
              }}
              onItemClick={(event, data) => {
                event.preventDefault();
                navigate(data.pathname);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
