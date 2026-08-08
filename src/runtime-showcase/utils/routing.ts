import type { RouterLocation } from '@krutoo/utils/router';
import type { StoryModule } from '#core';
import type { ShowcaseRouting } from '../types';

export interface PathnameRoutingOptions {
  /**
   * Public path.
   * Will be used for correct routing between showcase pages.
   * By default public path is empty means your app is running on root path ("/").
   */
  publicPath?: string;

  /**
   * Path that will be used for defining story sandbox URL.
   * @default `./sandbox.html`
   */
  sandboxPathname?: string;
}

export interface QueryRoutingOptions {
  /**
   * Path that will be used for defining story sandbox URL.
   * @default `./sandbox.html`
   */
  sandboxPathname?: string;
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
  const url = new URL(path, new URL(base, 'http://stub.com'));

  return `${url.pathname.replace(base, '')}${url.hash}${url.search}`;
}

function formatStoryPathname(path: string): string {
  return `/${path.replace(/^\//, '').replace(/\/$/, '')}`;
}

export class PathnameRouting implements ShowcaseRouting {
  protected publicPath?: string;
  protected sandboxPathname: string;

  constructor(options: PathnameRoutingOptions = {}) {
    this.publicPath = options.publicPath;
    this.sandboxPathname = options.sandboxPathname ?? './sandbox.html';
  }

  getStoryPathname(location: RouterLocation): string {
    const result = `${location.pathname.replace(/\/$/, '')}/`;

    if (this.publicPath) {
      return formatStoryPathname(removeBasePath(this.publicPath, result));
    }

    return formatStoryPathname(result);
  }

  getStoryShowcaseUrl(story: StoryModule): string {
    const result = `.${story.pathname}`;

    if (this.publicPath) {
      return addBasePath(this.publicPath, result);
    }

    return story.pathname;
  }

  getStorySandboxUrl(story: StoryModule): string {
    const result = `${this.sandboxPathname}?path=${story.pathname}`;

    if (this.publicPath) {
      return addBasePath(this.publicPath, result);
    }

    return result;
  }
}

export class QueryRouting implements ShowcaseRouting {
  protected sandboxPathname: string;

  // @todo вот тут добавить "./" раньше было без
  // проверить и убедиться что все норм
  constructor(options: QueryRoutingOptions = {}) {
    this.sandboxPathname = options.sandboxPathname ?? './sandbox.html';
  }

  getStoryPathname(location: RouterLocation): string | null {
    return new URLSearchParams(location.search).get('path');
  }

  getStoryShowcaseUrl(story: StoryModule): string {
    return `?path=${story.pathname}`;
  }

  getStorySandboxUrl(story: StoryModule): string {
    return `${this.sandboxPathname}?path=${story.pathname}`;
  }
}
