import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';
import { StoryMetaSchema } from '#core';
import { EntrypointTemplate } from './templates';
import type { EmitStoriesEntrypointConfig, StoryModuleData } from './types';
import { validateConfig } from './utils';

/**
 * Searches all story-modules and emits file that exports all as array.
 * @param config
 */
export async function emitStoriesEntrypoint(config: EmitStoriesEntrypointConfig): Promise<void> {
  const validConfig = validateConfig(config);

  await glob(validConfig.storiesGlob)
    // проверяем что файлы найдены
    .then(filenames => (filenames.length > 0 ? filenames : Promise.reject('No stories found')))

    // формируем объект с данными файла
    .then(filenames => Promise.all(filenames.map(getPageDataFactory(validConfig))))

    // формируем содержимое точки входа - импорт всех файлов
    .then(entries => EntrypointTemplate({ config: validConfig, entries }))

    // создаем каталог для точки входа если его нет
    .then(content =>
      fs.mkdir(path.dirname(validConfig.filename), { recursive: true }).then(() => content),
    )

    // создаем файл точки входа
    .then(content => fs.writeFile(validConfig.filename, content));
}

function getPageDataFactory(config: Required<EmitStoriesEntrypointConfig>) {
  return async (filename: string): Promise<StoryModuleData> => {
    return {
      filename,
      lang: path.extname(filename).includes('md') ? 'mdx' : 'js',

      // прочее (для отображения)
      storyPathname: `/${path
        .relative(config.storiesRootDir, filename)
        .replace(/\.[^/.]+$/, '')
        .replace(/\.story$/, '')}`,

      // данные из JSON-файла, соответствующего найденному story-модулю
      metaJson: await fs
        .readFile(filename.replace(/\.[^/.]+$/, '.meta.json'), 'utf-8')
        .then(JSON.parse)
        .then(value => StoryMetaSchema.parse(value))
        .catch(() => undefined),
    };
  };
}
