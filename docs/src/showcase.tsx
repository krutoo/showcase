import { createRoot } from 'react-dom/client';
import foundStories from '#found-stories';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import { MDXProvider } from '@mdx-js/react';
import { CodeBlock } from '#components/code-block/code-block.tsx';
import '@krutoo/showcase/showcase.css';
import './reset.css';
import './showcase.css';

const components = {
  pre: CodeBlock,
};

createRoot(document.getElementById('root')!).render(
  <MDXProvider components={components}>
    <ShowcaseApp
      stories={filterValidStories(foundStories).validStories}
      title='@krutoo/showcase'
      logoSrc={{
        light: 'public/logo.svg',
        dark: 'public/logo.dark.svg',
      }}
      storySearch
      colorSchemes={{
        enabled: true,
        attributeTarget: 'documentElement',
      }}
      defaultStory={{
        pathname: '/main',
      }}
      headerLinks={[
        {
          name: 'GitHub',
          href: 'https://github.com/krutoo/showcase',
        },
        {
          name: 'NPM',
          href: 'https://www.npmjs.com/package/@krutoo/showcase',
        },
      ]}
    />
  </MDXProvider>,
);
