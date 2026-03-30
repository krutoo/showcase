import type { EmitStoriesEntrypointConfig } from './types';

/** @internal */
export function validateConfig(
  config: EmitStoriesEntrypointConfig,
): Required<EmitStoriesEntrypointConfig> {
  const {
    filename = './.generated/found-stories.js',
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

/** @internal */
export function defaultRawImport(moduleData: { importPath: string }): { importPath: string } {
  return {
    // по умолчанию такой потому что такой поддерживается в Vite, Webpack, Rspack
    // но в Webpack/Rspack почему-то не работает без начального "!"
    // поэтому даем возможность переопределить
    importPath: `${moduleData.importPath}?raw`,
  };
}

/** @internal */
export function formatPathname(pathname: string): string {
  if (pathname === '.' || pathname.startsWith('./') || pathname.startsWith('/')) {
    return pathname;
  }

  return `./${pathname}`;
}
