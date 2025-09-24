import { createRoot } from 'react-dom/client';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import foundStories from '#found-stories';
import './reset.css';
import '@krutoo/showcase/showcase.css';

const { validStories } = filterValidStories(foundStories);

createRoot(document.querySelector('#root')!).render(
  <ShowcaseApp
    stories={validStories}
    title='Rspack example'
    logoSrc='public/rspack-logo.svg'
    storySearch
    colorSchemes={{ enabled: true }}
    headerLinks={[
      {
        name: 'GitHub',
        href: 'https://github.com/krutoo/showcase/tree/main/examples/rspack',
      },
    ]}
  />,
);
