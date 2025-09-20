import type { ReactNode } from 'react';
import type { StoryService } from '#runtime';
import styles from './story-mdx-viewer.m.css';

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
