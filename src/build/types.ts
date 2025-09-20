import type { StoryMeta } from '#core';

/** Config for search stories and emit entrypoint file. */
export interface EmitStoriesEntrypointConfig {
  /** Entrypoint file emit destination. */
  filename: string;

  /** Root directory that contain all story modules. */
  storiesRootDir?: string;

  /** Glob-pattern to search story modules. */
  storiesGlob?: string;

  /** Template of import path for importing modules as string (raw source code). */
  rawImport?: (moduleData: { importPath: string }) => { importPath: string };
}

/** @private */
export interface StoryModuleData {
  /** язык, взятый из расширения */
  lang: 'js' | 'mdx';

  /** путь до файла */
  filename: string;

  /** отображаемый путь */
  storyPathname: string;

  /** JSON-файл meta-данных, соответствующий найденному story-модулю */
  metaJson?: StoryMeta;
}
