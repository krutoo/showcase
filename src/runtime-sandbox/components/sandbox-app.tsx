import { type ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { type StoryModule } from '#core';
import { StoryService } from '#runtime';

export interface SandboxAppProps {
  stories: StoryModule[];
  defineStoryPathname?: () => string;
}

export function SandboxApp({
  stories,
  defineStoryPathname = defaultDefinePathname,
}: SandboxAppProps): ReactNode {
  const [pathname, setPathname] = useState<string | null>(null);

  const currentStory = useMemo(() => {
    const story = stories.find(s => s.pathname === pathname);

    if (!story) {
      return null;
    }

    return new StoryService(story);
  }, [stories, pathname]);

  const defineStoryPathnameRef = useRef(defineStoryPathname);

  // определяем pathname текущего story-модуля
  useLayoutEffect(() => {
    setPathname(defineStoryPathnameRef.current());
  }, []);

  // меняем title страницы
  useLayoutEffect(() => {
    const storyTitle = currentStory?.getTitle();

    if (storyTitle) {
      document.title = storyTitle;
    }
  }, [currentStory]);

  // применяем параметры фона
  useLayoutEffect(() => {
    const background = currentStory?.getDefaultBackground();

    if (typeof background === 'string') {
      document.documentElement.style.setProperty('background', background);
    }
  }, [currentStory]);

  // применяем параметры раскладки
  useLayoutEffect(() => {
    const layout = currentStory?.getLayout();

    if (layout === 'padded') {
      document.body.style.setProperty('padding', '16px');
    }

    if (layout === 'fullscreen') {
      document.body.style.setProperty('padding', '0');
    }
  }, [currentStory]);

  const Component = currentStory?.getComponent();

  if (!Component) {
    return null;
  }

  return <Component />;
}

function defaultDefinePathname(): string {
  return new URL(window.location.href).searchParams.get('path') ?? '';
}
