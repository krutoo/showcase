import type { ElementType, ReactNode } from 'react';
import type { StoryModule } from '#core';
import styles from './StoryMdxViewer.m.css';

export interface StoryMdxViewerProps {
  story: StoryModule;
}

export function StoryMdxViewer({ story }: StoryMdxViewerProps): ReactNode {
  const fullscreen = story.metaJson?.parameters?.layout === 'fullscreen';
  const Component: ElementType = story.default as any;

  return (
    <div data-kind='MdxViewer' className={styles.mdx}>
      {fullscreen && (
        <>
          <Component />
        </>
      )}

      {!fullscreen && (
        <div className={styles.layout}>
          <Component />
        </div>
      )}
    </div>
  );
}
