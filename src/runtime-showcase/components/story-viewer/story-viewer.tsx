import { type ReactNode, useContext, useState } from 'react';
import type { StoryService } from '#runtime';
import { Link } from '../link';
import { Plate, PlateBody, PlateHeader } from '../plate';
import { StorySources } from '../story-sources';
import { StoryMdxViewer } from '../story-mdx-viewer';
import { ShowcaseContext } from '../../context/showcase';
import classNames from 'classnames';
import styles from './story-viewer.m.css';

export interface StoryViewerProps {
  story: StoryService;
}

export function StoryViewer({ story }: StoryViewerProps): ReactNode {
  const { config } = useContext(ShowcaseContext);
  const { routing } = config;
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const sandboxUrl = routing.getStorySandboxUrl(story.data);

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
            <Link href={sandboxUrl} target='_blank'>
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
            src={sandboxUrl}
          />
        </PlateBody>
      </Plate>

      {story && story.isSourcesEnabled() && sourcesOpen && (
        <StorySources className={styles.storySources} story={story.data} />
      )}
    </div>
  );
}
