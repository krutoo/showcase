# Showcase

Simple library for creating websites with examples of how your web oriented code works.

It is build tool agnostic alternative of Storybook.

Currently only React is supported.

MDX also supported as a story module.

## Installation

```bash
npm add @krutoo/showcase
```

## Usage

First of all you need to create your "story modules" - modules with example of usage of your library.

For example you can store all _story modules_ in `./stories/` folder of your project.

A typical _story module_ looks like this:

```jsx
// ./stories/components/button/primary.jsx
import { Button } from 'my-ui-lib/button';

// export of meta needed for creating docs page with all stories
export const meta = {
  // "title" is the name of this example
  title: 'Simple example of Button',

  // roughly speaking "category" is the path in menu in docs page
  category: 'Components/Button',
};

export default function () {
  return (
    <>
      <Button onClick={() => alert('My button works!')}>Do something</Button>
    </>
  );
}
```

Next step is creating two entrypoints - for "sandbox" and for "showcase".

#### Sandbox entrypoint

**Sandbox** is the HTML page with result of selected story module.

Create sandbox entrypoint in your project, for example in `./src/sandbox.jsx`:

```jsx
// React bootstrap code
import { createRoot } from 'react-dom/client';

// util for validate story-modules
import { filterValidStories } from '@krutoo/showcase/runtime';

// React component for showing current story
import { SandboxApp } from '@krutoo/showcase/runtime-sandbox';

// "stories entrypoint" (this is an alias, more on that later)
import foundStories from '#found-stories';

// render your current story to the root element
createRoot(document.getElementById('root')).render(
  <SandboxApp stories={filterValidStories(foundStories).validStories} />,
);
```

#### Showcase entrypoint

**Showcase** is the HTML page with UI to find and display any of your story modules.

This page contains simple menu with all grouped stories and will render selected story in `iframe`.

Create showcase entrypoint in your project, for example in `./src/showcase.jsx`:

```jsx
// React bootstrap code
import { createRoot } from 'react-dom/client';

// util for validate story-modules
import { filterValidStories } from '@krutoo/showcase/runtime';

// React component for showing documentation with all stories
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';

// "stories entrypoint" (this is an alias, more on that later)
import foundStories from '#found-stories';

// import styles bundle
import '@krutoo/showcase/runtime-showcase/styles.css';

// render documentation app to the root element
createRoot(document.getElementById('root')).render(
  <ShowcaseApp
    title='My UI Library'
    logoSrc='public/my-logo.svg'
    headerLinks={[
      {
        name: 'GitHub',
        href: 'https://github.com/my-team/my-ui-lib',
      },
      {
        name: 'Figma',
        href: 'https://www.figma.com/my-design-guides',
      },
    ]}
    stories={filterValidStories(foundStories).validStories}
  />,
);
```

Next step is configure your build tool...

## Build with Webpack/Rspack

```js
// webpack.config.js or rspack.config.js

const storiesConfig = {
  // where stories entrypoint will be emitted
  filename: './.generated/entries.js',

  // glob patter for find all story modules
  storiesGlob: './stories/**/*.story.{mdx,tsx}',

  // root dir of all story modules
  storiesRootDir: './stories/',

  // how sources of modules will be imported (it is not required for Vite by default)
  // but in Rspack it is required to disable other loaders by add leading "!"
  rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
};

// emit stories entrypoint
await emitStoriesEntrypoint(storiesConfig);

// watch for changes in stories folder to update entrypoint (optional, suitable for local development)
if (isWatchOrServe) {
  watchStories(storiesConfig);
}

export default {
  entry: {
    sandbox: 'src/sandbox.jsx',
    showcase: 'src/showcase.jsx',
  },
  resolve: {
    alias: {
      '#found-stories': path.resolve(import.meta.dirname, storiesConfig.filename),
    },
  },
  module: {
    rules: [
      // since above we set "rawImport" option we need this rule
      // details: https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
      // details: https://www.rspack.dev/guide/features/asset-module#replacing-raw-loader-with-type-assetsource
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },

      // ...your other rules
    ],
  },
  plugins: [
    // you need to emit "index.html" for showcase (for example by HtmlWebpackPlugin or HtmlRspackPlugin)
    // you also need to emit "sandbox.html" because ShowcaseApp is references it
  ],

  // ...your other config
};
```

## Build with Vite

With Vite you need to configure it like this:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { emitStoriesEntrypoint } from '@krutoo/showcase/build';

const storiesConfig = {
  filename: './.generated/entries.js',
  storiesGlob: './stories/**/*.story.{mdx,tsx}',
  storiesRootDir: './stories/',
};

export default defineConfig(async () => {
  await emitStoriesEntrypoint(storiesConfig).catch(console.error);

  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(process.cwd(), 'index.html'),
          sandbox: path.resolve(process.cwd(), 'sandbox/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '#found-stories': path.resolve(process.cwd(), '.generated/entries.js'),
      },
    },
    plugins: [react()],
  };
});
```

You also need to provide special option to `ShowcaseApp`:

```jsx
<ShowcaseApp defineStoryUrl={story => `sandbox/?path=${story.pathname}`} />
```

## To Do

- Ability of localization
- Search field of stories in menu
- unit tests & e2e tests
- working examples in repo (with Webpack, Rspack, Vite...)
- ...
