import fs from 'node:fs/promises';
import path from 'node:path';
import { type Configuration } from '@rspack/core';
import * as utils from '@krutoo/utils/rspack';
import packageJson from './package.json' with { type: 'json' };

async function emitCssModuleExports(data: {
  exports: Array<{ name: string; value: string }>;
  resourcePath: string;
}) {
  const targetFilename = path.join('dist', path.relative('./src', `${data.resourcePath}.js`));

  await fs.mkdir(path.dirname(targetFilename), { recursive: true });

  const content = JSON.stringify(
    Object.fromEntries(data.exports.map(item => [item.name, item.value])),
    null,
    2,
  );

  await fs.writeFile(targetFilename, `export default ${content};`);
}

const config: Configuration = {
  entry: {
    bundle: './src/runtime-showcase/index.ts',
  },
  output: {
    path: path.resolve(import.meta.dirname, 'temp'),
    filename: '[name].js',
    clean: true,
  },
  mode: 'development',
  devtool: false,
  externals: Object.fromEntries(
    Object.entries(packageJson.dependencies).map(([key]) => [key, key]),
  ),
  plugins: [
    utils.pluginTypeScript(),
    utils.pluginCSS({
      extract: {
        filename: '../css/showcase.css',
      },
      cssModules: {
        auto: /\.(module|m)\.css$/i,
        localIdentName: 'showcase__[local]--[hash:4]',
        exportLocalsConvention: 'as-is',
        namedExport: false,
        getJSON: emitCssModuleExports,
      },
    }),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
};

export default config;
