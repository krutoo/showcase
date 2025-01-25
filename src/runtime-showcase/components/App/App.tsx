import { useContext } from 'react';
import { MenuItem } from '../Menu';
import { StoryViewer } from '../StoryViewer';
import { useMatchMedia } from '@krutoo/utils/react';
import { useLocation, useNavigate } from '../../shared/router';
import { MenuModal } from '../MenuModal';
import { Layout, Header, Main, Aside } from '../Layout';
import { Logo } from '../Logo';
import { HeaderLinks } from '../HeaderLinks';
import {
  ShowcaseContext,
  useCurrentStory,
  useMainMenu,
  useMenuItems,
} from '../../context/showcase';
import styles from './App.m.css';
import { StoryPlaceholder } from '../StoryPlaceholder';
import { Menu } from '../Menu/Menu';

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
                } else if (data.type === 'story') {
                  event.preventDefault();
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
