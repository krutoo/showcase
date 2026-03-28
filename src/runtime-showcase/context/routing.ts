import { createContext } from 'react';
import type { StoryModule } from '#core';
import type { ShowcaseRouting } from '../types';
import { QueryRouting } from '../utils/routing';

export interface ExtendedShowcaseRouting extends ShowcaseRouting {
  pathnameToUrl: (storyPathname: string) => string | undefined;
}

export function extendRouting(
  routing: ShowcaseRouting,
  stories: StoryModule[],
): ExtendedShowcaseRouting {
  return {
    getStoryPathname: routing.getStoryPathname.bind(routing),
    getStoryShowcaseUrl: routing.getStoryShowcaseUrl.bind(routing),
    getStorySandboxUrl: routing.getStorySandboxUrl.bind(routing),
    pathnameToUrl(pathname) {
      const story = stories.find(item => item.pathname === pathname);

      if (!story) {
        return undefined;
      }

      return routing.getStoryShowcaseUrl(story);
    },
  };
}

export const RoutingContext = createContext<ExtendedShowcaseRouting>(
  extendRouting(new QueryRouting(), []),
);
