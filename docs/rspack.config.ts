import fs from 'node:fs/promises';
import path from 'node:path';
import type { Configuration } from '@rspack/core';
import * as utils from '@krutoo/utils/rspack';
import { emitStoriesEntrypoint } from '@krutoo/showcase/build';

const prod = process.env.NODE_ENV === 'production';

await fs.rm('./dist', { recursive: true, force: true });

await emitStoriesEntrypoint({
  filename: './.generated/found-stories.js',
  storiesGlob: './docs/**/*.story.{tsx,mdx}',
  storiesRootDir: './docs',
  rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
});

const config: Configuration = {
  entry: {
    showcase: './src/showcase.tsx',
    sandbox: './src/sandbox.tsx',
  },
  output: {
    filename: prod ? '[name].[contenthash].js' : '[name].js',
    publicPath: process.env.PUBLIC_PATH,
  },
  devtool: prod ? false : undefined,
  resolve: {
    alias: {
      '#found-stories$': path.resolve(import.meta.dirname, './.generated/found-stories.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mdx?$/,
        loader: '@mdx-js/loader',
        options: {
          providerImportSource: '@mdx-js/react',
        },
      },
    ],
  },
  plugins: [
    utils.pluginTypeScript(),
    utils.pluginCSS(),
    utils.pluginPublicFiles(),
    utils.pluginRawImport(),
    utils.pluginHTML({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['showcase'],
    }),
    utils.pluginHTML({
      template: './src/index.html',
      filename: 'sandbox.html',
      chunks: ['sandbox'],
    }),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
  devServer: {
    static: false,
    hot: false,
    liveReload: true,
  },
};

export default config;
