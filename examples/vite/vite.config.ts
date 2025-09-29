import path from 'node:path';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import { emitStoriesEntrypoint } from '@krutoo/showcase/build';
import { defineConfig } from 'vite';

const storiesConfig = {
  filename: './.generated/found-stories.js',
  storiesGlob: './stories/**/*.story.{mdx,tsx}',
  storiesRootDir: './stories/',
};

await emitStoriesEntrypoint(storiesConfig);

export default defineConfig({
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
      '#found-stories': path.resolve(process.cwd(), storiesConfig.filename),
    },
  },
  plugins: [react(), mdx()],

  // @todo not working, see https://github.com/vitejs/vite/discussions/15632
  assetsInclude: ['**/*.mdx'],
});
