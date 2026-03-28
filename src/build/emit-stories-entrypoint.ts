import fs from 'node:fs/promises';
import path from 'node:path';
import { defineStories } from './define-stories';
import { EntrypointTemplate } from './templates';
import type { EmitStoriesEntrypointConfig } from './types';
import { validateConfig } from './utils';

/**
 * Searches all story-modules and emits file that exports all as array.
 * @param config Config.
 */
export async function emitStoriesEntrypoint(config: EmitStoriesEntrypointConfig): Promise<void> {
  const validConfig = validateConfig(config);

  await defineStories(config)
    // формируем содержимое точки входа - импорт всех файлов
    .then(entries => EntrypointTemplate({ config: validConfig, entries }))

    // создаем каталог для точки входа если его нет
    .then(content =>
      fs.mkdir(path.dirname(validConfig.filename), { recursive: true }).then(() => content),
    )

    // создаем файл точки входа
    .then(content => fs.writeFile(validConfig.filename, content));
}
