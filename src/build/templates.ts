import type { EmitStoriesEntrypointConfig, StoryModuleData } from './types';
import path from 'node:path';

export function EntrypointTemplate(
  entries: StoryModuleData[],
  config: EmitStoriesEntrypointConfig,
) {
  return `
${entries.map(ImportStoryTemplate).join('\n')}

${entries.map(item => ImportStorySourceTemplate(item, config)).join('\n')}

${entries
  .map(item => ImportStoryExtraSourcesTemplate(item, config))
  .filter(Boolean)
  .join('\n')}

${entries.map(StoryExtrasTemplate).join('\n')}

export default [
${entries.map(StoriesArrayItemTemplate).join('\n')}
];
`;
}

export function ImportStoryTemplate(entry: StoryModuleData) {
  return `import * as ${entry.importIdentifier} from '${entry.importPath}';`;
}

export function ImportStorySourceTemplate(
  entry: StoryModuleData,
  { rawImport = defaultRawImport }: EmitStoriesEntrypointConfig,
) {
  const { importPath } = rawImport(entry);

  return `import ${entry.importIdentifier}Source from '${importPath}';`;
}

export function ImportStoryExtraSourcesTemplate(
  entry: StoryModuleData,
  { rawImport = defaultRawImport, ...config }: EmitStoriesEntrypointConfig,
) {
  if (
    typeof entry.metaJson?.parameters?.sources === 'object' &&
    entry.metaJson?.parameters?.sources !== null &&
    entry.metaJson?.parameters?.sources.extraSources.length > 0
  ) {
    return `
${entry.metaJson?.parameters?.sources.extraSources
  .map((item, index) => {
    const { importPath } = rawImport({
      importPath: path.relative(
        path.dirname(config.filename),
        path.resolve(path.dirname(entry.filename), item),
      ),
    });

    return `import ${entry.importIdentifier}ExtraSource${index} from '${importPath}';`;
  })
  .join('\n')}
`;
  }

  return '';
}

export function StoryExtrasTemplate(entry: StoryModuleData) {
  let extraSources: Array<{ title: string; sourceIdentifier: string }> = [];

  if (
    typeof entry.metaJson?.parameters?.sources === 'object' &&
    entry.metaJson?.parameters?.sources !== null &&
    entry.metaJson?.parameters?.sources.extraSources.length > 0
  ) {
    extraSources = entry.metaJson.parameters.sources.extraSources.map((item, index) => ({
      sourceIdentifier: `${entry.importIdentifier}ExtraSource${index}`,
      title: path.basename(item),
    }));
  }

  const extras = {
    lang: entry.lang,
    pathname: entry.pathname,
    metaJson: entry.metaJson,
  };

  return `const ${entry.importIdentifier}Extras = ${JSON.stringify(extras, null, 2)};
${entry.importIdentifier}Extras.extraSources = [${extraSources
    .map(item => `{ title: "${item.title}", source: ${item.sourceIdentifier} }`)
    .join(', ')}]
`;
}

function StoriesArrayItemTemplate(entry: StoryModuleData) {
  return `
{
  ...${entry.importIdentifier},
  ...${entry.importIdentifier}Extras,
  source: ${entry.importIdentifier}Source
},
`.trim();
}

function defaultRawImport(moduleData: { importPath: string }): { importPath: string } {
  return {
    // по умолчанию такой потому что такой поддерживается в Vite, Webpack, Rspack
    // но в Rspack почему-то не работает без начального "!"
    // поэтому даем возможность переопределить
    importPath: `${moduleData.importPath}?raw`,
  };
}
