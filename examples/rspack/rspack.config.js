import path from 'node:path';
import rspack from '@rspack/core';
import { emitStoriesEntrypoint } from '@krutoo/showcase/build';

const storiesEntrypoint = './.generated/found-stories.js';

await emitStoriesEntrypoint({
  filename: storiesEntrypoint,
  storiesGlob: './stories/**/*.story.{mdx,ts,tsx}',
  storiesRootDir: './stories/',
  rawImport: mod => ({ importPath: `!${mod.importPath}?raw` }),
});

export default {
  entry: {
    showcase: './src/showcase.tsx',
    sandbox: './src/sandbox.tsx',
  },
  output: {
    path: path.resolve(import.meta.dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '#found-stories': path.resolve(import.meta.dirname, storiesEntrypoint),
    },
  },
  module: {
    rules: [
      // modern JS & TS
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              jsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      },

      // CSS & CSS-modules
      {
        test: /\.css$/i,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.(module|m)\.css$/i,
                localIdentName: '[name]__[local]--[hash:3]',
                exportLocalsConvention: 'as-is',
                namedExport: false,
              },
            },
          },
        ],
      },

      // MDX support
      {
        test: /\.mdx?$/,
        loader: '@mdx-js/loader',
      },

      // Raw import support
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    // emit css bundle
    new rspack.CssExtractRspackPlugin({
      filename: '[name].css',
    }),

    // create html file for showcase
    new rspack.HtmlRspackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      scriptLoading: 'module',
      chunks: ['showcase'],
    }),

    // create html file for sandbox
    new rspack.HtmlRspackPlugin({
      template: './src/index.html',
      filename: 'sandbox.html',
      scriptLoading: 'module',
      chunks: ['sandbox'],
    }),

    // public folder
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: 'public',
          to: 'public',
        },
      ],
    }),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
};
