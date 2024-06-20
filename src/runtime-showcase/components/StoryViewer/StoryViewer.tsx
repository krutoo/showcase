import { type StoryModule } from '#core';
import { useMemo, useState } from 'react';
import { Link } from '../../components/Link';
import { Plate, PlateBody, PlateHeader } from '../../components/Plate';
import { CodeBlock } from '../../components/CodeBlock';
import classNames from 'classnames';
import styles from './StoryViewer.m.css';

export interface StoryViewerProps {
  story: StoryModule;
  defineStoryUrl: (story: StoryModule) => string;
}

export function StoryViewer({ story, defineStoryUrl }: StoryViewerProps) {
  const sourcesEnabled = useMemo(
    () => story?.meta?.parameters?.sources ?? story.lang === 'js',
    [story],
  );

  const [sourcesOpen, setSourcesOpen] = useState(false);

  if (story.lang === 'mdx') {
    return <StoryMdxViewer story={story} defineStoryUrl={defineStoryUrl} />;
  }

  const storyUrl = defineStoryUrl(story);

  return (
    <div className={styles.root}>
      <Plate
        className={classNames(styles.main, sourcesOpen && sourcesEnabled && styles.detailed)}
        style={{ overflow: 'hidden' }}
      >
        <PlateHeader>
          <div className={styles.controls}>
            <Link href={storyUrl} target='_blank'>
              В новой вкладке
            </Link>

            {sourcesEnabled && (
              <Link
                href='#'
                onClick={event => {
                  event.preventDefault();
                  setSourcesOpen(a => !a);
                }}
              >
                {sourcesOpen ? 'Скрыть код' : 'Показать код'}
              </Link>
            )}
          </div>
        </PlateHeader>

        <PlateBody style={{ display: 'flex', flexDirection: 'column' }}>
          <iframe
            // ВАЖНО: key нужен чтобы iframe не вызывал popstate у родительского документа
            key={story.pathname}
            className={styles.iframe}
            src={storyUrl}
          />
        </PlateBody>
      </Plate>

      {story && sourcesEnabled && sourcesOpen && (
        <CodeBlock className={styles.source} story={story} />
      )}
    </div>
  );
}

function StoryMdxViewer({ story }: StoryViewerProps) {
  const Component: any = story.default;

  return (
    <div
      className={classNames(
        styles.mdx,
        story.metaJson?.parameters?.layout !== 'fullscreen' && styles.layout,
      )}
    >
      <Component />
    </div>
  );
}
