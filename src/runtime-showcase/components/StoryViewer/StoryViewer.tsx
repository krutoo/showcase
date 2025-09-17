import { type StoryModule } from '#core';
import { ReactNode, useMemo, useState } from 'react';
import { Link } from '../Link';
import { Plate, PlateBody, PlateHeader } from '../Plate';
import { StorySources } from '../StorySources';
import { StoryMdxViewer } from '../StoryMdxViewer';
import classNames from 'classnames';
import styles from './StoryViewer.m.css';

export interface StoryViewerProps {
  story: StoryModule;
  defineStoryUrl: (story: StoryModule) => string;
}

export function StoryViewer({ story, defineStoryUrl }: StoryViewerProps): ReactNode {
  const sourcesEnabled = useMemo(
    () => Boolean(story?.meta?.parameters?.sources) || story.lang === 'js',
    [story],
  );

  const [sourcesOpen, setSourcesOpen] = useState(false);

  const storyUrl = defineStoryUrl(story);

  if (story.lang === 'mdx') {
    return <StoryMdxViewer story={story} />;
  }

  return (
    <div className={styles.root}>
      <Plate
        className={classNames(styles.main, sourcesOpen && sourcesEnabled && styles.detailed)}
        style={{ overflow: 'hidden' }}
      >
        <PlateHeader>
          <div className={styles.controls}>
            <Link href={storyUrl} target='_blank'>
              Open in new tab
            </Link>

            {sourcesEnabled && (
              <Link
                href='#'
                onClick={event => {
                  event.preventDefault();
                  setSourcesOpen(a => !a);
                }}
              >
                {sourcesOpen ? 'Hide source' : 'Show source'}
              </Link>
            )}
          </div>
        </PlateHeader>

        <PlateBody className={styles.body}>
          <iframe
            // ВАЖНО: key нужен чтобы iframe не вызывал popstate у родительского документа
            key={story.pathname}
            className={styles.iframe}
            src={storyUrl}
          />
        </PlateBody>
      </Plate>

      {story && sourcesEnabled && sourcesOpen && (
        <StorySources className={styles.codeBlock} story={story} />
      )}
    </div>
  );
}
