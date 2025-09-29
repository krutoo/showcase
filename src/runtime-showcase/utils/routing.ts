import type { StoryModule } from '#core';
import type { RouterLocation } from '../shared/router';
import type { ShowcaseRouting } from '../types';

export interface PathnameRoutingOptions {
  publicPath?: string;
}

// @todo экспортировать из пакета?
function addBasePath(base: string, path: string): string {
  // и base и path могут начинаться и заканчиваться на "/" а могут и нет
  // чтобы правильно реализовать склеивание используем URL
  // URL поддерживается в Node.js и в браузерах очень давно
  const url = new URL(path, new URL(base, 'http://stub.com'));

  return `${url.pathname}${url.hash}${url.search}`;
}

function removeBasePath(base: string, path: string): string {
  // @todo не уверен но вроде можно url.href.replace(baseUrl.href, '') но если путь "/" то не работает
  const url = new URL(path, new URL(base, 'http://stub.com'));

  return `/${url.pathname.replace(base, '').replace(/^\//, '')}`;
}

export class PathnameRouting implements ShowcaseRouting {
  publicPath?: string;

  constructor(options: PathnameRoutingOptions) {
    this.publicPath = options.publicPath;
  }

  getStoryPathname(location: RouterLocation) {
    const result = location.pathname;

    if (this.publicPath) {
      return removeBasePath(this.publicPath, result);
    }

    return result;
  }

  getStoryShowcaseUrl(story: StoryModule): string {
    const result = `.${story.pathname}`;

    if (this.publicPath) {
      return addBasePath(this.publicPath, result);
    }

    return story.pathname;
  }

  getStorySandboxUrl(story: StoryModule): string {
    const result = `./sandbox.html?path=${story.pathname}`;

    if (this.publicPath) {
      return addBasePath(this.publicPath, result);
    }

    return result;
  }
}

export class QueryRouting implements ShowcaseRouting {
  getStoryPathname(location: RouterLocation): string | null {
    return new URLSearchParams(location.search).get('path');
  }

  getStoryShowcaseUrl(story: StoryModule): string {
    return `?path=${story.pathname}`;
  }

  getStorySandboxUrl(story: StoryModule): string {
    return `sandbox.html?path=${story.pathname}`;
  }
}
