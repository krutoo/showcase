import { type StoryModule } from '#core';
import { useEffect, useState } from 'react';
import { Plate, PlateBody, PlateHeader } from '../Plate';
import { HighlighterCore, getHighlighterCore } from 'shiki/core';
import loadWasm from 'shiki/wasm';
import themeGitHubLight from 'shiki/themes/github-light.mjs';
import classNames from 'classnames';
import styles from './StorySources.m.css';

export function StorySources({
  story,
  className,
}: { story: StoryModule } & { className?: string }) {
  const [sourceIndex, setSourceIndex] = useState(-1);
  const [source, setSource] = useState(story.source);

  useEffect(() => {
    setSource(story.source);
    setSourceIndex(-1);
  }, [story]);

  return (
    <Plate className={classNames(styles.root, className)}>
      <PlateHeader>
        <div className={styles.tabs}>
          <div
            className={classNames(styles.tab, sourceIndex === -1 && styles.active)}
            onClick={() => {
              setSource(story.source);
              setSourceIndex(-1);
            }}
          >
            Source
          </div>
          {story.extraSources?.map((item, index) => (
            <div
              className={classNames(styles.tab, sourceIndex === index && styles.active)}
              key={index}
              onClick={() => {
                setSource(item.source);
                setSourceIndex(index);
              }}
            >
              {item.title}
            </div>
          ))}
        </div>
      </PlateHeader>
      <PlateBody>
        <Code
          lang={
            sourceIndex === -1
              ? 'tsx'
              : story.extraSources[sourceIndex]?.title
                  .match(/\.[0-9a-z]+$/i)?.[0]
                  ?.replace(/^\./, '')
          }
          source={source}
        />
      </PlateBody>
    </Plate>
  );
}

export function Code({ lang, source }: { lang?: string; source: string }) {
  const highlighter = useHighlighter();
  const [state, setState] = useState('');

  useEffect(() => {
    if (!highlighter) {
      return;
    }

    try {
      const html = highlighter.codeToHtml(source, {
        lang: lang ?? 'text',
        theme: 'github-light',
      });

      setState(html);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setState('<p>Error</p>');
    }
  }, [highlighter, source]);

  return <div className={styles.code} dangerouslySetInnerHTML={{ __html: state }} />;
}

function useHighlighter() {
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

  useEffect(() => {
    getHighlighterCore({
      langs: [
        //
        import('shiki/langs/mdx.mjs'),
        import('shiki/langs/tsx.mjs'),
        import('shiki/langs/scss.mjs'),
      ],
      themes: [
        //
        themeGitHubLight,
      ],
      loadWasm,
    })
      .then(setHighlighter)
      .catch(console.error);
  }, []);

  return highlighter;
}
