import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';
import { StoryMetaSchema } from '#core';
import { EntrypointTemplate } from './templates';
import type { EmitStoriesEntrypointConfig, StoryModuleData } from './types';

export async function emitStoriesEntrypoint(config: EmitStoriesEntrypointConfig) {
  const { filename, storiesGlob: pagesGlob } = config;

  await glob(pagesGlob)
    // проверяем что файлы найдены
    .then(filenames => (filenames.length > 0 ? filenames : Promise.reject('No stories found')))

    // формируем объект с данными файла
    .then(filenames => Promise.all(filenames.map(getPageDataFactory(config))))

    // формируем содержимое точки входа - импорт всех файлов
    .then(entries => EntrypointTemplate(entries, config))

    // создаем каталог для точки входа если его нет
    .then(content => fs.mkdir(path.dirname(filename), { recursive: true }).then(() => content))

    // создаем файл точки входа
    .then(content => fs.writeFile(filename, content));

  // console.log('Stories entrypoint emit: done');
}

function getPageDataFactory(config: EmitStoriesEntrypointConfig) {
  return async (filename: string, index: number): Promise<StoryModuleData> => {
    return {
      filename,
      lang: path.extname(filename).includes('md') ? 'mdx' : 'js',

      // данные для импорта модуля
      importIdentifier: `Entry${index}`,
      importPath: path.relative(path.dirname(config.filename), filename),

      // прочее (для отображения)
      pathname: `/${path
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
