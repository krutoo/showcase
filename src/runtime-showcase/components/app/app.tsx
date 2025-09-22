import { type ReactNode, useContext, useEffect, useState } from 'react';
import { useMatchMedia, useStorageItem } from '@krutoo/utils/react';
import { useLocation, useNavigate } from '../../shared/router';
import { StoryViewer } from '../story-viewer';
import { MenuModal } from '../menu-modal';
import { Layout, Header, Main, Aside } from '../layout';
import { Logo } from '../logo';
import { HeaderLinks } from '../header-links';
import { StoryPlaceholder } from '../story-placeholder';
import { Menu } from '../menu';
import { Input } from '../input';
import {
  ShowcaseContext,
  useCurrentStory,
  useMainMenu,
  useMenuItems,
  useStorySearchResult,
} from '../../context/showcase';
import { ColorSchemesContext } from '../../context/color-schemes';
import classNames from 'classnames';
import styles from './app.m.css';

export function App(): ReactNode {
  const navigate = useNavigate();
  const location = useLocation();

  const { processedProps } = useContext(ShowcaseContext);
  const { defineStoryUrl } = processedProps;

  const [menuOpen, setMenuOpen] = useMainMenu();
  const menuItems = useMenuItems();
  const mobile = useMatchMedia('(max-width: 960px)');
  const currentStory = useCurrentStory();

  const [search, setSearch] = useState('');
  const searchResult = useStorySearchResult(search);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const colorSchemeContext = {
    colorScheme,
    onColorSchemeToggle: toggleColorScheme,
  };

  return (
    <ColorSchemesContext.Provider value={colorSchemeContext}>
      <Layout
        className={classNames(
          styles.root,
          processedProps.colorSchemes.defaults && styles[`default-color-scheme-${colorScheme}`],
        )}
        data-color-scheme={
          processedProps.colorSchemes.enabled &&
          processedProps.colorSchemes.attributeTarget === 'rootElement'
            ? colorScheme
            : undefined
        }
      >
        <Header>
          <Logo />
          <HeaderLinks />
        </Header>

        {!mobile && (!currentStory || currentStory?.isAsideEnabled()) && (
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
                  items={searchResult}
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

        <Main fullWidth={!(!currentStory || currentStory?.isAsideEnabled())}>
          {!currentStory && <StoryPlaceholder />}
          {currentStory && <StoryViewer story={currentStory} defineStoryUrl={defineStoryUrl} />}
        </Main>

        {mobile && <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />}
      </Layout>
    </ColorSchemesContext.Provider>
  );
}

function useColorScheme() {
  const { processedProps } = useContext(ShowcaseContext);

  const isDefaultDark = useMatchMedia('(prefers-color-scheme: dark)');
  const defaultScheme = processedProps.colorSchemes.enabled && isDefaultDark ? 'dark' : 'light';

  const [savedScheme, setSavedScheme] = useStorageItem('showcase:color-scheme', {
    storage: localStorage,
  });

  const scheme = savedScheme ?? defaultScheme;

  useEffect(() => {
    if (processedProps.colorSchemes.attributeTarget !== 'documentElement') {
      return;
    }

    if (scheme && processedProps.colorSchemes.enabled) {
      document.documentElement.setAttribute('data-color-scheme', scheme);
      document.documentElement.classList.add(styles[`default-color-scheme-${scheme}`]);
    }

    return () => {
      document.documentElement.removeAttribute('data-color-scheme');
      document.documentElement.classList.remove(styles[`default-color-scheme-${scheme}`]);
    };
  }, [processedProps.colorSchemes, scheme]);

  return {
    colorScheme: scheme as 'light' | 'dark',
    toggleColorScheme: () => {
      setSavedScheme(scheme === 'dark' ? 'light' : 'dark');
    },
  };
}
