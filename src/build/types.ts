import { type StoryMeta } from '../core/schemas.js';

export interface EmitStoriesEntrypointConfig {
  /** Путь до точки входа - модуля, в котором будут импортированы все найденные story-модули. */
  filename: string;

  /** Корневая папка в которой лежат все story-модули. */
  storiesRootDir: string;

  /** Glob-паттерн для поиска story-модулей. */
  storiesGlob: string;

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
