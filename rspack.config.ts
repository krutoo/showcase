import fs from 'node:fs/promises';
import path from 'node:path';
import rspack from '@rspack/core';
import packageJson from './package.json';

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
    alias: {
      '#core$': path.resolve(import.meta.dirname, './src/core/index.ts'),
      '#runtime$': path.resolve(import.meta.dirname, './src/runtime/index.ts'),
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
        type: 'javascript/auto',
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
                localIdentName: 'shwcs_[hash:7]',
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
    //
    new rspack.CssExtractRspackPlugin({
      filename: path.resolve(process.cwd(), 'css', 'showcase-styles.css'),
    }),
  ],
  experiments: {
    css: false,
    outputModule: true,
  },
} satisfies rspack.Configuration;

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
