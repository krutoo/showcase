import type { ReactNode } from 'react';
import { useStories } from '../../context/showcase';
import styles from './story-placeholder.m.css';

export function StoryPlaceholder(): ReactNode {
  const stories = useStories();

  return (
    <div className={styles.root}>
      {stories.length === 0 && (
        <>
          <h2 className={styles.title}>You have no stories</h2>
          <p className={styles.message}>
            Add story modules to your stories folder according guides
          </p>
        </>
      )}

      {stories.length > 0 && (
        <>
          <h2 className={styles.title}>Story not found</h2>
          <p className={styles.message}>Use menu to navigate through available stories</p>
        </>
      )}
    </div>
  );
}
