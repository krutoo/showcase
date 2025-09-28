import * as z from 'zod/mini';

export type StoryMeta = z.infer<typeof StoryMetaSchema>;

export type StoryModule = z.infer<typeof StoryModuleSchema>;

/**
 * Schema of meta data of story module .
 */
export const StoryMetaSchema = z.object({
  /** Title, affects menu item name. */
  title: z.optional(z.string()),

  /** Story category, affects grouping of menu items. */
  category: z.optional(z.string()),

  /**
   * Affects item menu order.
   * @todo rename to menuItemPriority?
   */
  menuPriority: z.optional(z.int()),

  /**
   * For menu item of story it means that it will not be shown in menu.
   * For "Category root" it means that click will not be open it.
   * @todo rename to menuItemHidden?
   */
  menuHidden: z.optional(z.boolean()),

  /** Parameters of displaying story. */
  parameters: z.optional(
    z.object({
      /** Define layout styles of story container element (currently body). */
      layout: z.optional(z.enum(['padded', 'fullscreen'])),

      /** Is aside on desktop enabled. */
      asideEnabled: z.optional(z.boolean()),

      /** Controls background of story container element (currently body). */
      backgrounds: z.optional(z.object({ default: z.string() })),

      /** Controls displaying sources of story. */
      sources: z.optional(
        z.union([
          z.boolean(),
          z.object({
            extraSources: z.array(z.string()),
          }),
        ]),
      ),
    }),
  ),
});

/**
 * Schema of valid story module data.
 */
export const StoryModuleSchema = z.object({
  /** Render function. Value from `export default ...`. */
  default: z.function(),

  /** Meta data. Value from `export { meta: {} }`. */
  meta: z.optional(StoryMetaSchema),

  /** Meta data from json file. */
  metaJson: z.optional(StoryMetaSchema),

  /** Extension of source file. */
  ext: z.string(),

  /** Story pathname (based on file path in file system). */
  pathname: z.string(),

  /** Source code. */
  source: z.string(),

  /** Extra sources from json meta file. */
  extraSources: z.array(
    z.object({
      ext: z.string(),
      title: z.string(),
      source: z.string(),
    }),
  ),
});
