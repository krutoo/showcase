import { useContext, useMemo, useState } from 'react';
import { filterValidStories } from '#runtime';
import { Link } from '../Link';
import { MenuItem } from '../Menu';
import { StoryViewer } from '../StoryViewer';
import { useMatchMedia } from '@krutoo/utils/react';
import { IoMenu } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { RouterContext, useRouter } from '../../utils/router';
import { AnyMenuNode, getMenuItems } from '../../utils/menu';
import { StoryModule } from '#core';
import styles from './App.m.css';

export interface AppProps {
  title?: string;
  logoSrc?: string;
  headerLinks?: Array<{ name: string; href: string }>;
  stories: StoryModule[];
  defineStoryUrl?: (story: StoryModule) => string;
}

function defaultDefineStoryUrl(story: StoryModule) {
  return `sandbox.html?path=${story.pathname}`;
}

export function App({
  title,
  logoSrc,
  headerLinks = [],
  stories,
  defineStoryUrl = defaultDefineStoryUrl,
}: AppProps) {
  const menuItems = useMemo(() => getMenuItems(stories), [stories]);

  const defaultPathname = useMemo(() => {
    for (const item of menuItems) {
      if (item.type === 'story') {
        return item.story.pathname;
      }
    }
    return '';
  }, []);

  const [pathname, setPathname] = useRouter({ defaultPathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useMatchMedia('(max-width: 960px)');
  const currentStory = useMemo(() => stories.find(s => s.pathname === pathname), [pathname]);

  return (
    <RouterContext.Provider value={{ pathname, redirect: setPathname }}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title} onClick={() => setPathname(defaultPathname)}>
            {logoSrc && <img className={styles.logo} src={logoSrc} alt='logo' />}
            {title}
          </div>

          <div className={styles.links}>
            {!mobile && (
              <>
                {headerLinks.map((item, index) => (
                  <Link key={index} color='white' href={item.href} target='_blank'>
                    {item.name}
                  </Link>
                ))}
              </>
            )}

            {mobile && <IoMenu className={styles['menu-icon']} onClick={() => setMenuOpen(true)} />}
          </div>
        </div>

        {!mobile && (
          <div className={styles.aside}>
            <div className={styles.menu}>
              {menuItems.map((item, index) => (
                <MenuItem
                  canToggle={false}
                  defaultOpen
                  key={index}
                  data={item}
                  isCurrent={data => data.type === 'story' && data.story.pathname === pathname}
                  onStoryClick={data => {
                    setPathname(data.story.pathname);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.main}>
          {!currentStory && <h1>404</h1>}
          {currentStory && <StoryViewer story={currentStory} defineStoryUrl={defineStoryUrl} />}
        </div>

        {mobile && (
          <ModalMenu open={menuOpen} onClose={() => setMenuOpen(false)} menuItems={menuItems} />
        )}
      </div>
    </RouterContext.Provider>
  );
}

function ModalMenu({
  open,
  onClose,
  menuItems,
  headerLinks = [],
}: {
  open?: boolean;
  onClose?: VoidFunction;
  headerLinks?: Array<{ name: string; href: string }>;
  menuItems: AnyMenuNode[];
}) {
  const { pathname, redirect } = useContext(RouterContext);

  if (!open) {
    return null;
  }

  return (
    <div className={styles['modal-menu']}>
      <div className={styles['modal-menu-header']}>
        <IoMdClose className={styles['modal-menu-close']} onClick={() => onClose?.()} />
      </div>
      <div className={styles['modal-menu-body']}>
        <div className={styles['modal-menu-links']}>
          {headerLinks.map((item, index) => (
            <Link key={index} color='white' href={item.href} target='_blank'>
              {item.name}
            </Link>
          ))}
        </div>

        <hr />

        {menuItems.map((item, index) => (
          <MenuItem
            canToggle={false}
            defaultOpen
            key={index}
            data={item}
            isCurrent={data => data.type === 'story' && data.story.pathname === pathname}
            onStoryClick={data => {
              redirect(data.story.pathname);
              onClose?.();
            }}
          />
        ))}
      </div>
    </div>
  );
}
