import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { isObject } from '@krutoo/utils';
import type { StoryModule } from '#core';
import type { ShowcaseRouting, StandaloneAppConfig } from '../../types';
import { type AnyMenuNode, getMenuItems } from '../../utils/menu';
import { useInitial } from '../../shared/hooks';
import { BrowserRouter, type RouterLocation } from '../../shared/router';
import { RouterContext } from '../../shared/router-react';
import { ShowcaseContext, type ShowcaseContextValue } from '../../context/showcase';

export interface StandaloneProviderProps extends StandaloneAppConfig {
  children?: ReactNode;
}

const defaultRouting: ShowcaseRouting = {
  getStorySandboxUrl(story: StoryModule): string {
    return `sandbox.html?path=${story.pathname}`;
  },

  getStoryShowcaseUrl(story: StoryModule): string {
    return `?path=${story.pathname}`;
  },

  getStoryPathname(location: RouterLocation): string | null {
    return new URLSearchParams(location.search).get('path');
  },
};

export function StandaloneProvider(props: StandaloneProviderProps): ReactNode {
  const {
    //
    children,
    stories,
    defaultStory: givenDefaultStory,
    router: givenRouter,
    routing,
    defineStoryUrl,
  } = props;

  const [menuOpen, toggleMenu] = useState(false);

  const defaultStory = useMemo(
    () =>
      givenDefaultStory ?? {
        pathname: findFirstMenuItem(getMenuItems(stories))?.pathname ?? '',
      },
    [stories, givenDefaultStory],
  );

  const context: ShowcaseContextValue = {
    config: {
      stories,
      title: props.title,
      logoSrc: isObject(props.logoSrc)
        ? {
            light: props.logoSrc.light,
            dark: props.logoSrc.dark,
          }
        : {
            light: props.logoSrc,
          },
      headerLinks: props.headerLinks ?? [],
      search: !!props.storySearch,
      colorSchemes: isObject(props.colorSchemes)
        ? {
            enabled: props.colorSchemes.enabled ?? true,
            attributeTarget: props.colorSchemes.attributeTarget ?? 'rootElement',
            defaults: props.colorSchemes.defaults ?? true,
          }
        : {
            enabled: !!props.colorSchemes,
            attributeTarget: 'rootElement',
            defaults: true,
          },
      routing: defineStoryUrl
        ? {
            ...defaultRouting,
            getStorySandboxUrl: defineStoryUrl,
          }
        : (routing ?? defaultRouting),

      defaultStory: defaultStory,
    },

    // menu slice
    menuOpen,
    toggleMenu,
  };

  const router = useMemo(() => givenRouter ?? new BrowserRouter(), [givenRouter]);
  const initialRouting = useInitial(context.config.routing);
  const initialStories = useInitial(context.config.stories);
  const initialDefaultStory = useInitial(defaultStory);

  useEffect(() => {
    const currentStoryPathname = initialRouting.getStoryPathname(location);

    const navigateToDefault = () => {
      const story = initialStories.find(item => item.pathname === initialDefaultStory.pathname);

      if (story) {
        router.navigate(initialRouting.getStoryShowcaseUrl(story));
      }
    };

    if (currentStoryPathname === null) {
      navigateToDefault();
    }

    if (currentStoryPathname === '/') {
      const story = initialStories.find(item => item.pathname === currentStoryPathname);

      if (!story) {
        navigateToDefault();
      }
    }

    return router.connect();
  }, [
    router,

    // stable:
    initialStories,
    initialRouting,
    initialDefaultStory,
  ]);

  return (
    <RouterContext.Provider value={router}>
      <ShowcaseContext.Provider value={context}>{children}</ShowcaseContext.Provider>
    </RouterContext.Provider>
  );
}

function findFirstMenuItem(items: AnyMenuNode[]): StoryModule | undefined {
  for (const item of items) {
    if (item.type === 'story') {
      return item.story;
    } else {
      return findFirstMenuItem(item.items);
    }
  }
}
