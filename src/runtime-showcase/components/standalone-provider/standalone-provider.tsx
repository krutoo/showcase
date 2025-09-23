import { type StoryModule } from '#core';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { type AnyMenuNode, getMenuItems } from '../../utils/menu';
import { BrowserRouter, type RouterLocation } from '../../shared/router';
import { RouterContext } from '../../shared/router-react';
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

  /**
   * How to define story URL.
   * @deprecated Use `routing` instead.
   */
  defineStoryUrl?: (story: StoryModule) => string;

  routing?: {
    /** Get story pathname from location. */
    getStoryPathname: (location: RouterLocation) => string | null;

    /** Get url to story sandbox url. */
    getStorySandboxUrl: (story: StoryModule) => string;

    /** Get url to story showcase page url. */
    getStoryShowcaseUrl: (story: StoryModule) => string;
  };

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

function defaultGetStorySandboxUrl(story: StoryModule): string {
  return `sandbox.html?path=${story.pathname}`;
}

function defaultGetStoryShowcaseUrl(story: StoryModule): string {
  return `?path=${story.pathname}`;
}

function defaultGetStoryPathname(location: RouterLocation): string | null {
  return new URLSearchParams(location.search).get('path');
}

export function StandaloneProvider(props: StandaloneProviderProps): ReactNode {
  const {
    //
    children,
    stories,
    defaultStory,
    routing,
    defineStoryUrl,
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

  const defaultRouting: ShowcaseContextValue['processedProps']['routing'] = {
    getStoryPathname: defaultGetStoryPathname,
    getStoryShowcaseUrl: defaultGetStoryShowcaseUrl,
    getStorySandboxUrl: defaultGetStorySandboxUrl,
  };

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
    },

    // menu slice
    menuOpen,
    toggleMenu,

    // main page pathname
    // @todo похоже копирует defaultStory
    defaultPathname,
  };

  const router = useMemo(() => new BrowserRouter(), []);

  useEffect(() => {
    const { stories, routing } = contextValue.processedProps;
    const currentStoryPathname = routing.getStoryPathname(location);

    const navigateToDefault = () => {
      const story = stories.find(item => item.pathname === defaultPathname);

      if (story) {
        router.navigate(routing.getStoryShowcaseUrl(story));
      }
    };

    if (currentStoryPathname === null) {
      navigateToDefault();
    }

    if (currentStoryPathname === '/') {
      const story = stories.find(item => item.pathname === currentStoryPathname);

      if (!story) {
        navigateToDefault();
      }
    }

    return router.connect();
  }, []);

  return (
    <RouterContext.Provider value={router}>
      <ShowcaseContext.Provider value={contextValue}>{children}</ShowcaseContext.Provider>
    </RouterContext.Provider>
  );
}
