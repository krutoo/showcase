import { CodeBlock } from '#components/code-block/code-block';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { PathnameRouting, type Router, ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import { MDXProvider } from '@mdx-js/react';
import { withPublicPath } from '../../utils';
import foundStories from '#found-stories';
import '@krutoo/showcase/showcase.css';

const components = {
  pre: CodeBlock,
};

export function App({ router }: { router?: Router }) {
  return (
    <MDXProvider components={components}>
      <ShowcaseApp
        stories={filterValidStories(foundStories).validStories}
        title='@krutoo/showcase'
        logoSrc={{
          light: withPublicPath('public/logo.svg'),
          dark: withPublicPath('public/logo.dark.svg'),
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
        router={router}
        routing={new PathnameRouting({ publicPath: import.meta.env.PUBLIC_PATH })}
      />
    </MDXProvider>
  );
}
