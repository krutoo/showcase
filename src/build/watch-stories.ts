import chokidar from 'chokidar';
import { emitStoriesEntrypoint } from './emit-stories-entrypoint';
import { debounce } from '#core';
import { EmitStoriesEntrypointConfig } from './types';

export function watchStories(config: EmitStoriesEntrypointConfig) {
  const emitEntrypoint = async () => {
    await emitStoriesEntrypoint(config);
  };

  const onWatcherEvent = debounce(emitEntrypoint, 1000);

  const watcher = chokidar.watch(config.storiesGlob, {
    persistent: true,
  });

  watcher.on('add', onWatcherEvent);
  watcher.on('unlink', onWatcherEvent);
}
