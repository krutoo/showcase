import * as z from 'zod/mini';

export type StoryMeta = z.infer<typeof StoryMetaSchema>;

export type StoryModule = z.infer<typeof StoryModuleSchema>;

/**
 * Схема объекта мета-данных story-модуля.
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
 * Схема для дальнейшего отсеивания невалидных story-модулей.
 */
export const StoryModuleSchema = z.object({
  /** React-компонент с примером (`export default ...`). */
  default: z.function(),

  /** Мета-данные из модуля (`export { meta: {} }`). */
  meta: z.optional(StoryMetaSchema),

  /** Мета-данные из соответствующего json-файла. */
  metaJson: z.optional(StoryMetaSchema),

  /** В каком формате модуль. */
  lang: z.enum(['js', 'mdx']),

  /** Путь для роутинга (на основе пути до файла story-модуля). */
  pathname: z.string(),

  /** Исходный код модуля. */
  source: z.string(),

  /** Дополнительные исходники (на основе json-файла с мета-данными). */
  extraSources: z.array(
    z.object({
      title: z.string(),
      source: z.string(),
    }),
  ),
});
