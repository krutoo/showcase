import { type Context, createContext, useContext, useMemo } from 'react';
import type { StoryModule } from '#core';
import { type AnyMenuNode, getMenuItems } from '../utils/menu';
import type { ShowcaseRouting } from '../types';
import { StoryService } from '#runtime';
import { useLocation } from '../shared/router-react';

export interface ShowcaseContextValue {
  /** Config, this is processed props given to ShowcaseApp. */
  config: {
    title?: string;
    logoSrc?: { light?: string; dark?: string };
    headerLinks?: Array<{ name: string; href: string }>;
    stories: StoryModule[];
    defaultStory: {
      pathname: string;
    };
    routing: ShowcaseRouting;
    search: boolean;
    colorSchemes: {
      enabled: boolean;
      attributeTarget: 'rootElement' | 'documentElement';
      defaults: boolean;
    };
  };

  /** Menu open state. */
  menuOpen: boolean;

  /** Toggle menu state. */
  toggleMenu(open: boolean): void;
}

/** Context that available inside ShowcaseApp. */
export const ShowcaseContext: Context<ShowcaseContextValue> = createContext<ShowcaseContextValue>({
  config: {
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
    defaultStory: {
      pathname: '/',
    },
  },
  menuOpen: false,
  toggleMenu() {},
});

ShowcaseContext.displayName = 'ShowcaseContext';

export function useStories(): StoryModule[] {
  const { config } = useContext(ShowcaseContext);
  const { stories } = config;

  return stories;
}

export function useCurrentStory(): StoryService | undefined {
  const location = useLocation() as any;

  const { config } = useContext(ShowcaseContext);
  const { stories, routing } = config;

  return useMemo(() => {
    const targetPathname = routing.getStoryPathname(location);

    const story = stories.find(item => item.pathname === targetPathname);

    if (!story) {
      return undefined;
    }

    return new StoryService(story);
  }, [stories, location, routing]);
}

export function useMenuItems(): AnyMenuNode[] {
  const { config } = useContext(ShowcaseContext);
  const { stories } = config;

  return useMemo(() => getMenuItems(stories), [stories]);
}

export function useMainMenu(): [boolean, (open: boolean) => void] {
  const { menuOpen, toggleMenu } = useContext(ShowcaseContext);

  return useMemo(() => [menuOpen, toggleMenu], [menuOpen, toggleMenu]);
}

export function useStorySearchResult(query: string): StoryModule[] {
  const { config } = useContext(ShowcaseContext);
  const { stories } = config;

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
