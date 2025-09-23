import { type Context, createContext, useContext, useMemo } from 'react';
import type { StoryModule } from '#core';
import { StoryService } from '#runtime';
import { type AnyMenuNode, getMenuItems } from '../utils/menu';
import { useLocation } from '../shared/router-react';
import type { RouterLocation } from '../shared/router';

export interface ShowcaseContextValue {
  processedProps: {
    title?: string;
    logoSrc?: { light?: string; dark?: string };
    headerLinks?: Array<{ name: string; href: string }>;
    stories: StoryModule[];

    routing: {
      /** Get url to story sandbox url. */
      getStorySandboxUrl: (story: StoryModule) => string;

      /** Get url to story showcase page url. */
      getStoryShowcaseUrl: (story: StoryModule) => string;

      /** Get story pathname from page url */
      getStoryPathname: (location: RouterLocation) => string | null;
    };

    search: boolean;
    colorSchemes: {
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
    routing: {
      getStorySandboxUrl: () => '/',
      getStoryShowcaseUrl: () => '/',
      getStoryPathname: () => null,
    },
    search: false,
    colorSchemes: {
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
  const location = useLocation() as any;

  const { processedProps } = useContext(ShowcaseContext);
  const { stories, routing } = processedProps;

  return useMemo(() => {
    const targetPathname = routing.getStoryPathname(location);

    const story = stories.find(item => item.pathname === targetPathname);

    if (!story) {
      return undefined;
    }

    return new StoryService(story);
  }, [stories, location, routing.getStoryPathname]);
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
