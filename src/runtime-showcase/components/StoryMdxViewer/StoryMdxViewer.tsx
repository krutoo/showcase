import type { StoryModule } from '#core';
import classNames from 'classnames';
import styles from './StoryMdxViewer.m.css';

export interface StoryMdxViewerProps {
  story: StoryModule;
}

export function StoryMdxViewer({ story }: StoryMdxViewerProps) {
  const Component: any = story.default;

  const rootClassName = classNames(
    styles.mdx,
    story.metaJson?.parameters?.layout !== 'fullscreen' && styles.layout,
  );

  return (
    <div data-kind='MdxViewer' className={rootClassName}>
      <Component />
    </div>
  );
}
