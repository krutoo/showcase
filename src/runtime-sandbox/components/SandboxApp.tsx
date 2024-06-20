import { type ElementType, useLayoutEffect, useMemo, useState } from 'react';
import { type StoryModule } from '#core';

export interface SandboxAppProps {
  stories: StoryModule[];
  defineStoryPathname?: () => string;
}

export function SandboxApp({
  stories,
  defineStoryPathname = defaultDefinePathname,
}: SandboxAppProps) {
  const [pathname, setPathname] = useState<string | null>(null);
  const currentStory = useMemo(() => stories.find(s => s.pathname === pathname), [pathname]);

  // определяем pathname текущего story-модуля
  useLayoutEffect(() => {
    setPathname(defineStoryPathname());
  }, []);

  // меняем title страницы
  useLayoutEffect(() => {
    if (currentStory?.meta?.title) {
      document.title = currentStory.meta.title;
    }
  }, [currentStory]);

  // применяем параметры фона
  useLayoutEffect(() => {
    const backgrounds = getMetaParameter('backgrounds', currentStory?.meta);

    if (typeof backgrounds?.default === 'string') {
      document.documentElement.style.setProperty('background', `${backgrounds.default}`);
    }
  }, [currentStory]);

  // применяем параметры раскладки
  useLayoutEffect(() => {
    const layout = getMetaParameter('layout', currentStory?.meta) ?? 'padded';

    if (layout === 'padded') {
      document.body.style.setProperty('padding', '16px');
    }

    if (layout === 'fullscreen') {
      document.body.style.setProperty('padding', '0');
    }
  }, [currentStory]);

  const Component = currentStory?.default as ElementType;

  if (!Component) {
    return null;
  }

  return <Component />;
}

function defaultDefinePathname(): string {
  return new URL(window.location.href).searchParams.get('path') ?? '';
}

function getMetaParameter(key: string, meta: any): any {
  return meta?.parameters?.[key];
}
