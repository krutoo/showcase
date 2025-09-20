import { type StoryModule, StoryService } from '#core';
import { type Context, createContext, useContext, useMemo } from 'react';
import { type AnyMenuNode, getMenuItems } from '../utils/menu';
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

export function useCurrentStory(): StoryService | undefined {
  const location = useLocation();

  const { processedProps } = useContext(ShowcaseContext);
  const { stories } = processedProps;

  return useMemo(() => {
    const story = stories.find(item => item.pathname === location.pathname);

    if (!story) {
      return undefined;
    }

    return new StoryService(story);
  }, [stories, location.pathname]);
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

  const items = useMemo(() => {
    return stories.map(data => new StoryService(data));
  }, [stories]);

  return useMemo(() => {
    if (!query) {
      return stories;
    }

    const result: StoryModule[] = [];

    for (const item of items) {
      if (
        !item.isMenuItemHidden() &&
        (item.getTitle()?.toLowerCase().includes(query.toLowerCase()) ||
          item.getCategory()?.toLowerCase().includes(query.toLowerCase()))
      ) {
        result.push(item.data);
      }
    }

    return result;
  }, [query, stories, items]);
}
