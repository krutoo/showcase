import { EmitStoriesEntrypointConfig } from './types';

export function validateConfig(
  config: EmitStoriesEntrypointConfig,
): Required<EmitStoriesEntrypointConfig> {
  const {
    filename,
    storiesGlob = './**/*.story.{ts,tsx,md,mdx}',
    storiesRootDir = './stories/',
    rawImport = defaultRawImport,
  } = config;

  return {
    filename,
    storiesGlob,
    storiesRootDir,
    rawImport,
  };
}

export function defaultRawImport(moduleData: { importPath: string }): { importPath: string } {
  return {
    // по умолчанию такой потому что такой поддерживается в Vite, Webpack, Rspack
    // но в Rspack почему-то не работает без начального "!"
    // поэтому даем возможность переопределить
    importPath: `${moduleData.importPath}?raw`,
  };
}
