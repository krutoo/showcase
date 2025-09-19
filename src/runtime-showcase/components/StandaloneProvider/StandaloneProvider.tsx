import { type StoryModule } from '#core';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { type AnyMenuNode, getMenuItems } from '../../utils/menu';
import { QueryRouter, RouterContext } from '../../shared/router';
import { ShowcaseContext, type ShowcaseContextValue } from '../../context/showcase';
import { isObject } from '@krutoo/utils';

export interface StandaloneAppProps {
  /** Your application name. */
  title?: string;

  /** Your application name. */
  logoSrc?: string;

  /** Links in header. */
  headerLinks?: Array<{ name: string; href: string }>;

  /** All stories you want to show. */
  stories: StoryModule[];

  /** How to define story URL. */
  defineStoryUrl?: (story: StoryModule) => string;

  /** Enables search by stories in sidebar and mobile modal menu. */
  storySearch?: boolean;

  /** Enables switch between light and dark themes. */
  themes?:
    | boolean
    | {
        /** Enables switch between light and dark themes. */
        enabled?: boolean;

        /** Element that will receive `data-theme` attribute. */
        attributeTarget?: 'rootElement' | 'documentElement';

        /** Controls default styles for themes. */
        defaults?: boolean;
      };
}

export interface StandaloneProviderProps extends StandaloneAppProps {
  children?: ReactNode;
}

function defaultDefineStoryUrl(story: StoryModule) {
  return `sandbox.html?path=${story.pathname}`;
}

export function StandaloneProvider(props: StandaloneProviderProps): ReactNode {
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
      storySearch: !!props.storySearch,
      themes: isObject(props.themes)
        ? {
            enabled: props.themes.enabled ?? true,
            attributeTarget: props.themes.attributeTarget ?? 'rootElement',
            defaults: props.themes.defaults ?? true,
          }
        : {
            enabled: !!props.themes,
            attributeTarget: 'rootElement',
            defaults: true,
          },
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
