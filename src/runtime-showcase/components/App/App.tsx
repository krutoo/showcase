import { useContext } from 'react';
import { useMatchMedia } from '@krutoo/utils/react';
import { useLocation, useNavigate } from '../../shared/router';
import { StoryViewer } from '../StoryViewer';
import { MenuModal } from '../MenuModal';
import { Layout, Header, Main, Aside } from '../Layout';
import { Logo } from '../Logo';
import { HeaderLinks } from '../HeaderLinks';
import { StoryPlaceholder } from '../StoryPlaceholder';
import { Menu } from '../Menu/Menu';
import {
  ShowcaseContext,
  useCurrentStory,
  useMainMenu,
  useMenuItems,
} from '../../context/showcase';
import styles from './App.m.css';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const { processedProps } = useContext(ShowcaseContext);
  const { defineStoryUrl } = processedProps;

  const [menuOpen, setMenuOpen] = useMainMenu();
  const menuItems = useMenuItems();
  const mobile = useMatchMedia('(max-width: 960px)');
  const currentStory = useCurrentStory();

  return (
    <Layout>
      <Header>
        <Logo />
        <HeaderLinks />
      </Header>

      {!mobile && (
        <Aside>
          <div className={styles.menu}>
            <Menu
              items={menuItems}
              getTitle={data => data.title}
              getChildItems={data => (data.type === 'group' ? data.items : [])}
              getHref={data => {
                if (data.type !== 'story') {
                  return undefined;
                }

                // @todo use some util from router module
                return `?path=${data.story.pathname}`;
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
        </Aside>
      )}

      <Main>
        {!currentStory && <StoryPlaceholder />}
        {currentStory && <StoryViewer story={currentStory} defineStoryUrl={defineStoryUrl} />}
      </Main>

      {mobile && <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />}
    </Layout>
  );
}
