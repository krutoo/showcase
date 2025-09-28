import fs from 'node:fs/promises';
import glob from 'fast-glob';
import path from 'node:path';
import type { EmitStoriesEntrypointConfig, StoryModuleData } from './types';
import { validateConfig } from './utils';
import { StoryMetaSchema } from '#core';

export async function defineStories(
  config: Pick<EmitStoriesEntrypointConfig, 'storiesGlob'>,
): Promise<StoryModuleData[]> {
  const validConfig = validateConfig(config as any);
  const getPageData = getPageDataFactory(validConfig);

  return await glob(validConfig.storiesGlob)
    // проверяем что файлы найдены
    .then(filenames => (filenames.length > 0 ? filenames : Promise.reject('No stories found')))

    // формируем объект с данными файла
    .then(filenames => Promise.all(filenames.map(getPageData)));
}

function getPageDataFactory(config: Required<EmitStoriesEntrypointConfig>) {
  return async (filename: string): Promise<StoryModuleData> => {
    return {
      filename,

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
