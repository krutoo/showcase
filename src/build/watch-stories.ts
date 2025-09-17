import chokidar from 'chokidar';
import { emitStoriesEntrypoint } from './emit-stories-entrypoint';
import { debounce } from '@krutoo/utils';
import { EmitStoriesEntrypointConfig } from './types';
import { validateConfig } from './utils';

/**
 * Enables watching story modules and updates entrypoint on change.
 */
export function watchStories(config: EmitStoriesEntrypointConfig): void {
  const validConfig = validateConfig(config);

  const emitEntrypoint = async () => {
    await emitStoriesEntrypoint(config);
  };

  const onWatcherEvent = debounce(emitEntrypoint, 1000);

  const watcher = chokidar.watch(validConfig.storiesRootDir, {
    persistent: true,
  });

  watcher.on('add', onWatcherEvent);
  watcher.on('unlink', onWatcherEvent);
}
