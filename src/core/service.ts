import type { ComponentType } from 'react';
import type { StoryModule } from './schemas';

export class StoryService {
  data: StoryModule;

  constructor(data: StoryModule) {
    this.data = data;
  }

  getTitle(): string | undefined {
    return this.data.meta?.title ?? this.data.metaJson?.title;
  }

  getDefaultBackground() {
    return (
      this.data.meta?.parameters?.backgrounds?.default ??
      this.data.metaJson?.parameters?.backgrounds?.default
    );
  }

  getLayout() {
    return this.data.meta?.parameters?.layout ?? this.data.metaJson?.parameters?.layout ?? 'padded';
  }

  isAsideEnabled(): boolean {
    return (
      this.data.meta?.parameters?.asideEnabled ??
      this.data.metaJson?.parameters?.asideEnabled ??
      true
    );
  }

  isSourcesEnabled(): boolean {
    return (
      Boolean(this.data?.meta?.parameters?.sources) ||
      Boolean(this.data?.metaJson?.parameters?.sources) ||
      this.data.lang === 'js'
    );
  }

  isFullscreen(): boolean {
    return (
      this.data.meta?.parameters?.layout === 'fullscreen' ||
      this.data.metaJson?.parameters?.layout === 'fullscreen'
    );
  }

  getComponent(): ComponentType<{}> {
    return this.data.default as ComponentType<{}>;
  }
}
