import { createRoot } from 'react-dom/client';
import { CodeBlock } from '@krutoo/showcase/integrations-shiki';
import { filterValidStories } from '@krutoo/showcase/runtime';
import {
  ComponentRegistryContext,
  DefaultComponents,
  ShowcaseApp,
} from '@krutoo/showcase/runtime-showcase';
import foundStories from '#found-stories';
import './reset.css';
import '@krutoo/showcase/integrations-shiki.css';
import '@krutoo/showcase/showcase.css';

const { validStories } = filterValidStories(foundStories);

const components = {
  ...DefaultComponents,
  CodeBlock,
};

createRoot(document.querySelector('#root')!).render(
  <ComponentRegistryContext value={components}>
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
    />
  </ComponentRegistryContext>,
);
