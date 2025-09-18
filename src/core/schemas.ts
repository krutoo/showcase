import * as z from 'zod/mini';

export type StoryMeta = z.infer<typeof StoryMetaSchema>;

export type StoryModule = z.infer<typeof StoryModuleSchema>;

/**
 * Схема объекта мета-данных story-модуля.
 */
export const StoryMetaSchema = z.object({
  title: z.optional(z.string()),
  category: z.optional(z.string()),
  menuPriority: z.optional(z.int()),
  menuHidden: z.optional(z.boolean()),
  parameters: z.optional(
    z.object({
      layout: z.optional(z.enum(['padded', 'fullscreen'])),
      backgrounds: z.optional(z.object({ default: z.string() })),
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
