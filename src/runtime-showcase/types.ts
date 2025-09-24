import type { StoryModule } from '#core';
import type { Router, RouterLocation } from './shared/router';

/** Routing interface to define story urls. */
export interface ShowcaseRouting {
  /** Get story pathname from location. */
  getStoryPathname: (location: RouterLocation) => string | null;

  /** Get url to story sandbox url. */
  getStorySandboxUrl: (story: StoryModule) => string;

  /** Get url to story showcase page url. */
  getStoryShowcaseUrl: (story: StoryModule) => string;
}

export interface StandaloneAppConfig {
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

  /** Router implementation. */
  router?: Router;

  /** Routing interface to define story urls. */
  routing?: ShowcaseRouting;

  /** Enables search by stories in sidebar and mobile modal menu. */
  storySearch?: boolean; // @todo rename to just search?

  /** Story that would be shown when there is no pathname in location on start. */
  defaultStory?: {
    /** Story pathname. */
    pathname: string;
  };

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
