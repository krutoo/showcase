import { type ReactNode, useContext, useState } from 'react';
import { useLocation, useMatchMedia, useNavigate } from '@krutoo/utils/react';
import {
  ShowcaseContext,
  useCurrentStory,
  useMenuItems,
  useStorySearchResult,
} from '../../context/showcase';
import { Input } from '../input';
import { Aside } from '../layout';
import { Menu } from '../menu';
import styles from './app-aside.m.css';

export function AppAside(): ReactNode {
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useContext(ShowcaseContext);
  const { routing } = config;
  const menuItems = useMenuItems();
  const mobile = useMatchMedia('(max-width: 960px)');
  const [search, setSearch] = useState('');
  const searchResult = useStorySearchResult(search);
  const currentStory = useCurrentStory();
  const enabled = currentStory?.isAsideEnabled();

  if (mobile || !enabled) {
    return null;
  }

  return (
    <Aside>
      {Boolean(config.search) && (
        <div className={styles.search}>
          <Input
            className={styles.searchInput}
            type='search'
            placeholder='Search...'
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </div>
      )}

      {search.length === 0 && (
        <div className={styles.menu}>
          <Menu
            items={menuItems}
            getTitle={data => data.title}
            getChildItems={data => (data.type === 'group' ? data.items : [])}
            getHref={data => {
              return data.story && !data.story.meta?.menuHidden
                ? routing.getStoryShowcaseUrl(data.story)
                : undefined;
            }}
            isActive={data => {
              return !!data.story && data.story.pathname === routing.getStoryPathname(location);
            }}
            isInteractive={data => {
              return !!data.story && !data.story.meta?.menuHidden;
            }}
            onItemClick={(event, data) => {
              if (data.type === 'story' && !data.menuHidden) {
                event.preventDefault();
                navigate(routing.getStoryShowcaseUrl(data.story));
                return;
              }

              if (data.type === 'group' && data.story && !data.story.meta?.menuHidden) {
                event.preventDefault();
                navigate(routing.getStoryShowcaseUrl(data.story));
                return;
              }

              if (data.type === 'story') {
                event.preventDefault();
                return;
              }
            }}
          />
        </div>
      )}

      {search.length > 0 && (
        <div className={styles.menu}>
          <Menu
            items={searchResult}
            getTitle={data => {
              return data.meta?.title || data.meta?.category || data.pathname;
            }}
            getHref={data => {
              return routing.getStoryShowcaseUrl(data);
            }}
            isActive={data => {
              return data.pathname === routing.getStoryPathname(location);
            }}
            onItemClick={(event, data) => {
              event.preventDefault();
              navigate(routing.getStoryShowcaseUrl(data));
            }}
          />
        </div>
      )}
    </Aside>
  );
}
