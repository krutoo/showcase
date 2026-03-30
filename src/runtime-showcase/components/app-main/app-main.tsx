import type { ReactNode } from 'react';
import { useCurrentStory } from '../../context/showcase';
import { Main } from '../layout';
import { StoryPlaceholder } from '../story-placeholder';
import { StoryViewer } from '../story-viewer';

export function AppMain(): ReactNode {
  const story = useCurrentStory();

  return (
    <Main fullWidth={!(!story || story?.isAsideEnabled())}>
      {story ? <StoryViewer story={story} /> : <StoryPlaceholder />}
    </Main>
  );
}
