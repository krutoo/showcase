import { type StoryModule, StoryModuleSchema } from '#core';

/**
 * Filter only valid stories from given array.
 */
export function filterValidStories(stories: unknown[]): {
  validStories: StoryModule[];
  invalidStories: unknown[];
} {
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
