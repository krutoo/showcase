import { type StoryModule, StoryModuleSchema } from '#core';

export function filterValidStories(stories: unknown[]) {
  const validStories: StoryModule[] = [];
  const invalidStories: unknown[] = [];

  for (const item of stories) {
    const parseResult = StoryModuleSchema.safeParse(item);

    if (parseResult.success) {
      validStories.push(parseResult.data);
    } else {
      invalidStories.push(item);
    }
  }

  return { validStories, invalidStories };
}
