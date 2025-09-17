import { StoryModule } from '#core';
import { Context, createContext, useContext, useMemo } from 'react';
import { AnyMenuNode, getMenuItems } from '../utils/menu';
import { useLocation } from '../shared/router';

export interface ShowcaseContextValue {
  processedProps: {
    title?: string;
    logoSrc?: string;
    headerLinks?: Array<{ name: string; href: string }>;
    stories: StoryModule[];
    defineStoryUrl: (story: StoryModule) => string;
    storySearch: boolean;
    themes: {
      enabled: boolean;
      attributeTarget: 'rootElement' | 'documentElement';
      defaults: boolean;
    };
  };

  menuOpen: boolean;
  toggleMenu(open: boolean): void;

  defaultPathname: string;
}

export const ShowcaseContext: Context<ShowcaseContextValue> = createContext<ShowcaseContextValue>({
  processedProps: {
    stories: [],
    defineStoryUrl: () => '/',
    storySearch: false,
    themes: {
      enabled: false,
      attributeTarget: 'rootElement',
      defaults: true,
    },
  },
  menuOpen: false,
  toggleMenu() {},

  defaultPathname: '',
});

ShowcaseContext.displayName = 'ShowcaseContext';

export function useStories(): StoryModule[] {
  const { processedProps } = useContext(ShowcaseContext);
  const { stories } = processedProps;

  return stories;
}

export function useCurrentStory(): StoryModule | undefined {
  const location = useLocation();

  const { processedProps } = useContext(ShowcaseContext);
  const { stories } = processedProps;

  return useMemo(
    () => stories.find(item => item.pathname === location.pathname),
    [stories, location.pathname],
  );
}

export function useMenuItems(): AnyMenuNode[] {
  const { processedProps } = useContext(ShowcaseContext);
  const { stories } = processedProps;

  return useMemo(() => getMenuItems(stories), [stories]);
}

export function useMainMenu(): [boolean, (open: boolean) => void] {
  const { menuOpen, toggleMenu } = useContext(ShowcaseContext);

  return useMemo(() => [menuOpen, toggleMenu], [menuOpen, toggleMenu]);
}

export function useStorySearchResult(query: string): StoryModule[] {
  const { processedProps } = useContext(ShowcaseContext);
  const { stories } = processedProps;

  return useMemo(() => {
    if (!query) {
      return stories;
    }

    return stories.filter(
      ({ meta }) =>
        !meta?.menuHidden &&
        (meta?.title?.toLowerCase().includes(query.toLowerCase()) ||
          meta?.category?.toLowerCase().includes(query.toLowerCase())),
    );
  }, [query, stories]);
}
