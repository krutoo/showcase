import { useStories } from '../../context/showcase';
import styles from './StoryPlaceholder.m.css';

export function StoryPlaceholder() {
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
          <p className={styles.message}>Use menu to navigate through the available stories</p>
        </>
      )}
    </div>
  );
}
