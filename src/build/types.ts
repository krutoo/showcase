import type { StoryMeta } from '../core/schemas.js';

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

export interface StoryModuleData {
  lang: 'js' | 'mdx';

  /** путь до файла */
  filename: string;

  /** отображаемый путь */
  pathname: string;

  /** идентификатор для импорта файла в точке входа */
  importIdentifier: string;

  /** путь для импорта файла в точке входа */
  importPath: string;

  /** JSON-файл meta-данных, соответствующий найденному story-модулю */
  metaJson?: StoryMeta;
}
