import fs from 'node:fs/promises';
import path from 'node:path';
import rspack, { type Configuration } from '@rspack/core';
import packageJson from './package.json' with { type: 'json' };

export default {
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
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    tsConfig: {
      configFile: path.resolve(import.meta.dirname, './tsconfig.json'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: true,
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
      {
        test: /\.css$/i,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.(module|m)\.css$/i,
                localIdentName: 'showcase__[local]--[hash:4]',
                exportLocalsConvention: 'as-is',
                namedExport: false,
                getJSON: emitCssModuleExports,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.CssExtractRspackPlugin({
      filename: path.resolve(process.cwd(), 'css/showcase.css'),
    }),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
} satisfies Configuration;

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
