import { ReactNode, useContext, useEffect, useState } from 'react';
import { useMatchMedia, useStorageItem } from '@krutoo/utils/react';
import { useLocation, useNavigate } from '../../shared/router';
import { StoryViewer } from '../StoryViewer';
import { MenuModal } from '../MenuModal';
import { Layout, Header, Main, Aside } from '../Layout';
import { Logo } from '../Logo';
import { HeaderLinks } from '../HeaderLinks';
import { StoryPlaceholder } from '../StoryPlaceholder';
import { Menu } from '../Menu';
import { Input } from '../Input';
import {
  ShowcaseContext,
  useCurrentStory,
  useMainMenu,
  useMenuItems,
  useStorySearchResult,
} from '../../context/showcase';
import { ThemeContext } from '../../context/theme';
import classNames from 'classnames';
import styles from './App.m.css';

export function App(): ReactNode {
  const navigate = useNavigate();
  const location = useLocation();

  const { processedProps } = useContext(ShowcaseContext);
  const { defineStoryUrl } = processedProps;

  const [menuOpen, setMenuOpen] = useMainMenu();
  const menuItems = useMenuItems();
  const mobile = useMatchMedia('(max-width: 960px)');
  const currentStory = useCurrentStory();

  const isDefaultDark = useMatchMedia('(prefers-color-scheme: dark)');
  const defaultTheme = isDefaultDark ? 'dark' : 'light';

  const [savedTheme, setTheme] = useStorageItem('showcase:theme', {
    storage: localStorage,
  });

  const theme = savedTheme ?? defaultTheme;

  const [search, setSearch] = useState('');
  const searchResultItems = useStorySearchResult(search);

  const onThemeToggle = () => {
    setTheme((theme ?? defaultTheme) === 'dark' ? 'light' : 'dark');
  };

  const themeContext = {
    theme: (theme as 'light' | 'dark' | null) ?? defaultTheme,
    onThemeToggle,
  };

  useEffect(() => {
    if (processedProps.themes.attributeTarget !== 'documentElement') {
      return;
    }

    if (theme && processedProps.themes.enabled) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.add(styles[`default-theme-${theme}`]);
    }

    return () => {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove(styles[`default-theme-${theme}`]);
    };
  }, [processedProps.themes, theme]);

  return (
    <ThemeContext.Provider value={themeContext}>
      <Layout
        className={classNames(
          styles.root,
          processedProps.themes.defaults && styles[`default-theme-${theme}`],
        )}
        data-theme={
          processedProps.themes.enabled && processedProps.themes.attributeTarget === 'rootElement'
            ? theme
            : undefined
        }
      >
        <Header>
          <Logo />
          <HeaderLinks />
        </Header>

        {!mobile && (
          <Aside>
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

            {search.length === 0 && (
              <div className={styles.menu}>
                <Menu
                  items={menuItems}
                  getTitle={data => data.title}
                  getChildItems={data => (data.type === 'group' ? data.items : [])}
                  getHref={data => {
                    return data.story && !data.story.meta?.menuHidden
                      ? `?path=${data.story.pathname}` // @todo use some util from router module
                      : undefined;
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
              </div>
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
          </Aside>
        )}

        <Main>
          {!currentStory && <StoryPlaceholder />}
          {currentStory && <StoryViewer story={currentStory} defineStoryUrl={defineStoryUrl} />}
        </Main>

        {mobile && <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />}
      </Layout>
    </ThemeContext.Provider>
  );
}
