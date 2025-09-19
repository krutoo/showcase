import type { ReactNode } from 'react';
import type { StoryService } from '#core';
import styles from './StoryMdxViewer.m.css';

export interface StoryMdxViewerProps {
  story: StoryService;
}

export function StoryMdxViewer({ story }: StoryMdxViewerProps): ReactNode {
  const fullscreen = story.isFullscreen();
  const Component = story.getComponent();

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
