import fs from 'node:fs/promises';
import path from 'node:path';
import type { Configuration } from '@rspack/core';
import * as utils from '@krutoo/utils/rspack';
import {
  defineStories,
  emitStoriesEntrypoint,
  type EmitStoriesEntrypointConfig,
} from '@krutoo/showcase/build';
import packageJson from './package.json' with { type: 'json' };
import dotenv from 'dotenv';

if (process.env.NODE_ENV) {
  dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });
}

await fs.rm('./dist', { recursive: true, force: true });
await fs.rm('./temp', { recursive: true, force: true });

const isProd = process.env.NODE_ENV === 'production';

const storiesConfig: EmitStoriesEntrypointConfig = {
  filename: './.generated/found-stories.js',
  storiesGlob: './docs/**/*.story.{tsx,mdx}',
  storiesRootDir: './docs',
  rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
};

await emitStoriesEntrypoint(storiesConfig);

const config: Configuration[] = [
  {
    name: 'server',
    target: 'node',
    entry: {
      index: './src/server.tsx',
    },
    output: {
      path: path.resolve(import.meta.dirname, 'temp/server'),
      filename: '[name].js',
      publicPath: process.env.PUBLIC_PATH ?? '/',
    },
    devtool: isProd ? false : undefined,
    externals: Object.fromEntries(
      Object.entries(packageJson.dependencies).map(([key]) => [key, key]),
    ),
    externalsPresets: {
      node: true,
    },
    resolve: {
      alias: {
        '#found-stories$': path.resolve(import.meta.dirname, storiesConfig.filename),
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
      utils.pluginCSS({ extract: false }),
      utils.pluginPublicFiles(),
      utils.pluginRawImport(),
      utils.pluginImportMetaEnv(['PUBLIC_PATH', 'TEMPLATES_DIR']),
      utils.pluginExec({ script: 'node temp/server/index.js' }),
    ],
    experiments: {
      outputModule: true,
    },
    devServer: {
      static: false,
      hot: false,
      liveReload: true,
      historyApiFallback: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },
  },
  {
    name: 'client',
    dependencies: ['server'],
    entry: {
      showcase: './src/showcase.tsx',
      sandbox: './src/sandbox.tsx',
    },
    output: {
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      publicPath: process.env.PUBLIC_PATH ?? '/',
    },
    devtool: isProd ? false : undefined,
    resolve: {
      alias: {
        '#found-stories$': path.resolve(import.meta.dirname, storiesConfig.filename),
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
      utils.pluginImportMetaEnv(['PUBLIC_PATH', 'TEMPLATES_DIR']),
      utils.pluginHTML({
        template: path.join(process.env.TEMPLATES_DIR!, '_default.html'),
        filename: 'sandbox.html',
        chunks: ['sandbox'],
      }),
      utils.pluginHTML({
        template: path.join(process.env.TEMPLATES_DIR!, '_default.html'),
        filename: 'index.html',
        chunks: ['showcase'],
      }),
      ...(await defineStories(storiesConfig)).map(story =>
        utils.pluginHTML({
          template: path.join(process.env.TEMPLATES_DIR!, `.${story.storyPathname}.html`),
          filename: `.${story.storyPathname}/index.html`,
          chunks: ['showcase'],
        }),
      ),
    ],
    experiments: {
      outputModule: true,
    },
  },
];

export default config;
