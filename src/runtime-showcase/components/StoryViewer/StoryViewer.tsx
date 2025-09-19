import { type StoryModule, StoryService } from '#core';
import { type ReactNode, useState } from 'react';
import { Link } from '../Link';
import { Plate, PlateBody, PlateHeader } from '../Plate';
import { StorySources } from '../StorySources';
import { StoryMdxViewer } from '../StoryMdxViewer';
import classNames from 'classnames';
import styles from './StoryViewer.m.css';

export interface StoryViewerProps {
  story: StoryService;
  defineStoryUrl: (story: StoryModule) => string;
}

export function StoryViewer({ story, defineStoryUrl }: StoryViewerProps): ReactNode {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const storyUrl = defineStoryUrl(story.data);

  if (story.data.lang === 'mdx') {
    return <StoryMdxViewer story={story} />;
  }

  return (
    <div className={styles.root}>
      <Plate
        className={classNames(
          styles.main,
          sourcesOpen && story.isSourcesEnabled() && styles.detailed,
        )}
      >
        <PlateHeader>
          <div className={styles.controls}>
            <Link href={storyUrl} target='_blank'>
              Open in new tab
            </Link>

            {story.isSourcesEnabled() && (
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
            key={story.data.pathname}
            className={styles.iframe}
            src={storyUrl}
          />
        </PlateBody>
      </Plate>

      {story && story.isSourcesEnabled() && sourcesOpen && (
        <StorySources className={styles.codeBlock} story={story.data} />
      )}
    </div>
  );
}
