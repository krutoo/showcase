import { type ReactNode, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { type StoryModule } from '#core';
import { ComponentRegistryContext } from '../../context/component-registry';
import { Plate, PlateBody, PlateHeader } from '../plate';
import styles from './story-sources.m.css';

export interface StorySourcesProps {
  story: StoryModule;
  className?: string;
}

export function StorySources({ story, className }: StorySourcesProps): ReactNode {
  const { CodeBlock } = useContext(ComponentRegistryContext);

  const [sourceIndex, setSourceIndex] = useState(-1);
  const [source, setSource] = useState(story.source);

  const lang = sourceIndex === -1 ? story.ext : story.extraSources[sourceIndex]?.ext;

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
        <CodeBlock lang={lang}>{source}</CodeBlock>
      </PlateBody>
    </Plate>
  );
}
