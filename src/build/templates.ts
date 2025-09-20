import type { EmitStoriesEntrypointConfig, StoryModuleData } from './types';
import path from 'node:path';
import { isObject } from '@krutoo/utils';

interface StoryTemplateProps {
  config: Required<EmitStoriesEntrypointConfig>;
  story: StoryModuleData;
  index: number;
}

interface DefaultExportTemplateProps {
  config: Required<EmitStoriesEntrypointConfig>;
  entries: StoryModuleData[];
}

export function EntrypointTemplate({ config, entries }: DefaultExportTemplateProps) {
  const stories = entries.map((story, index) => ({
    config,
    story,
    index,
  }));

  return `
${stories.map(StoryImport).join('\n')}
${stories.map(StorySourceImport).join('\n')}
${stories.map(StoryExtraSourceImports).filter(Boolean).join('\n')}

${stories.map(StoryExtrasConst).join('\n')}

${DefaultExport({ config, entries })}
`.trim();
}

function StoryImport({ config, story, index }: StoryTemplateProps) {
  const importPath = path.relative(path.dirname(config.filename), story.filename);

  return `import * as Story${index} from '${importPath}';`;
}

function StorySourceImport({ config, story, index }: StoryTemplateProps) {
  const { rawImport } = config;
  const importPath = path.relative(path.dirname(config.filename), story.filename);

  return `import Story${index}Src from '${rawImport({ importPath }).importPath}';`;
}

function StoryExtraSourceImports({ config, story, index }: StoryTemplateProps) {
  const { rawImport } = config;
  const sources = story.metaJson?.parameters?.sources;

  if (!sources || !isObject(sources) || !sources.extraSources) {
    return '';
  }

  return sources.extraSources
    .map((sourcePath, sourceIndex) => {
      const importPath = path.relative(
        path.dirname(config.filename),
        path.resolve(path.dirname(story.filename), sourcePath),
      );

      return `import Story${index}ExtraSrc${sourceIndex} from '${rawImport({ importPath }).importPath}';`;
    })
    .join('\n');
}

function StoryExtrasConst({ story, index }: StoryTemplateProps) {
  const sources = story.metaJson?.parameters?.sources;

  const data = {
    lang: story.lang,
    pathname: story.storyPathname,
    metaJson: story.metaJson,
    extraSources: [] as any[],
  };

  if (isObject(sources) && sources.extraSources) {
    data.extraSources = sources.extraSources.map((sourcePath, sourceIndex) => {
      return {
        title: path.basename(sourcePath),
        source: `{{Story${index}ExtraSrc${sourceIndex}}}`,
      };
    });
  }

  const result = JSON.stringify(data, null, 2).replace(/"{{(.+)}}"/g, '$1');

  return `const Story${index}Extras = ${result};`;
}

function DefaultExport({ config, entries }: DefaultExportTemplateProps) {
  return `export default [
${entries.map((story, index) => StoryExportObject({ config, story, index })).join(',\n')}
];`;
}

function StoryExportObject({ index }: StoryTemplateProps) {
  return `{
  ...Story${index},
  ...Story${index}Extras,
  source: Story${index}Src,
}`;
}
