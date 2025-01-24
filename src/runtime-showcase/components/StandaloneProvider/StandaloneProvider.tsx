import { StoryModule } from '#core';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AnyMenuNode, getMenuItems } from '../../utils/menu';
import { QueryRouter, RouterContext } from '../../shared/router';
import { ShowcaseContext, ShowcaseContextValue } from '../../context/showcase';

export interface StandaloneAppProps {
  title?: string;
  logoSrc?: string;
  headerLinks?: Array<{ name: string; href: string }>;
  stories: StoryModule[];
  defineStoryUrl?: (story: StoryModule) => string;
}

export interface StandaloneProviderProps extends StandaloneAppProps {
  children?: ReactNode;
}

function defaultDefineStoryUrl(story: StoryModule) {
  return `sandbox.html?path=${story.pathname}`;
}

export function StandaloneProvider(props: StandaloneProviderProps) {
  const {
    //
    children,
    stories,
    defineStoryUrl = defaultDefineStoryUrl,
  } = props;

  const [menuOpen, toggleMenu] = useState(false);

  const defaultPathname = useMemo(() => {
    const findFirstStory = (items: AnyMenuNode[]): string => {
      for (const item of items) {
        if (item.type === 'story') {
          return item.story.pathname;
        } else {
          return findFirstStory(item.items);
        }
      }

      return '';
    };

    return findFirstStory(getMenuItems(stories));
  }, [stories]);

  const contextValue: ShowcaseContextValue = {
    processedProps: {
      ...props,
      defineStoryUrl,
    },

    // menu slice
    menuOpen,
    toggleMenu,

    // main page pathname
    defaultPathname,
  };

  const router = useMemo(() => new QueryRouter(), []);

  useEffect(() => {
    const disconnect = router.connect();

    if (router.getLocation().pathname === '') {
      router.navigate(defaultPathname);
    }

    return disconnect;
  }, [router, defaultPathname]);

  return (
    <RouterContext.Provider value={router}>
      <ShowcaseContext.Provider value={contextValue}>{children}</ShowcaseContext.Provider>
    </RouterContext.Provider>
  );
}
