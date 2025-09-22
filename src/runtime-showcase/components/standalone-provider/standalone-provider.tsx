import { type StoryModule } from '#core';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { type AnyMenuNode, getMenuItems } from '../../utils/menu';
import { QueryRouter, RouterContext } from '../../shared/router';
import { ShowcaseContext, type ShowcaseContextValue } from '../../context/showcase';
import { isObject } from '@krutoo/utils';

export interface StandaloneAppProps {
  /** Your application name. */
  title?: string;

  /** Your logo image src. */
  logoSrc?: string | { light: string; dark?: string };

  /** Links in header. */
  headerLinks?: Array<{ name: string; href: string }>;

  /** All stories you want to show. */
  stories: StoryModule[];

  /** How to define story URL. */
  defineStoryUrl?: (story: StoryModule) => string;

  /** Enables search by stories in sidebar and mobile modal menu. */
  storySearch?: boolean;

  defaultStory?: { pathname: string };

  /** Enables switch between light and dark color schemes. */
  colorSchemes?:
    | boolean
    | {
        /** Enables switch between light and dark color schemes. */
        enabled?: boolean;

        /** Element that will receive `data-color-scheme` attribute. */
        attributeTarget?: 'rootElement' | 'documentElement';

        /** Enables default styles for color schemes. */
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
    defaultStory,
    defineStoryUrl = defaultDefineStoryUrl,
  } = props;

  const [menuOpen, toggleMenu] = useState(false);

  const defaultStoryRef = useRef(defaultStory);

  const defaultPathname = useMemo(() => {
    if (defaultStoryRef.current?.pathname) {
      return defaultStoryRef.current.pathname;
    }

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
  }, [defaultStoryRef, stories]);

  const contextValue: ShowcaseContextValue = {
    processedProps: {
      ...props,
      logoSrc: isObject(props.logoSrc)
        ? {
            light: props.logoSrc.light,
            dark: props.logoSrc.dark,
          }
        : {
            light: props.logoSrc,
          },
      storySearch: !!props.storySearch,
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
