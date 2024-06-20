import { type StoryModule, StoryModuleSchema } from '#core';

export function filterValidStories(stories: unknown[]) {
  const invalidStories: unknown[] = [];

  const validStories = stories.reduce<StoryModule[]>((result, item) => {
    const parseResult = StoryModuleSchema.safeParse(item);

    if (parseResult.success) {
      result.push(parseResult.data);
    } else {
      invalidStories.push(item);
    }

    return result;
  }, []);

  return { validStories, invalidStories };
}
