import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { isObject } from '@krutoo/utils';
import type { ShowcaseRouting, StandaloneAppConfig } from '../../types';
import { findFirstMenuItem, getMenuItems } from '../../utils/menu';
import { useInitial } from '../../shared/hooks';
import { BrowserRouter } from '../../shared/router';
import { RouterContext } from '../../shared/router-react';
import { ShowcaseContext, type ShowcaseContextValue } from '../../context/showcase';
import { extendRouting, RoutingContext } from '../../context/routing';
import { QueryRouting } from '../../utils/routing';

export interface StandaloneProviderProps extends StandaloneAppConfig {
  children?: ReactNode;
}

export function StandaloneProvider(props: StandaloneProviderProps): ReactNode {
  const {
    //
    children,
    stories,
    defaultStory: givenDefaultStory,
    router: givenRouter,
    routing: givenRouting,
    defineStoryUrl,
  } = props;

  const [menuOpen, toggleMenu] = useState(false);

  const router = useMemo(() => givenRouter ?? new BrowserRouter(), [givenRouter]);

  const routing = useMemo<ShowcaseRouting>(() => {
    if (defineStoryUrl) {
      const base = new QueryRouting();

      return {
        getStoryPathname: base.getStoryPathname.bind(base),
        getStoryShowcaseUrl: base.getStoryShowcaseUrl.bind(base),
        getStorySandboxUrl: defineStoryUrl,
      };
    }

    return givenRouting ?? new QueryRouting();
  }, [givenRouting, defineStoryUrl]);

  const extendedRouting = useMemo(() => {
    return extendRouting(routing, stories);
  }, [routing, stories]);

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
      routing,
      defaultStory,
    },

    // menu slice
    menuOpen,
    toggleMenu,
  };

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
      <RoutingContext.Provider value={extendedRouting}>
        <ShowcaseContext.Provider value={context}>{children}</ShowcaseContext.Provider>
      </RoutingContext.Provider>
    </RouterContext.Provider>
  );
}
