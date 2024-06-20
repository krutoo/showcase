import { z } from 'zod';

export type StoryMeta = z.infer<typeof StoryMetaSchema>;

export type StoryModule = z.infer<typeof StoryModuleSchema>;

/**
 * Схема объекта мета-данных story-модуля.
 */
export const StoryMetaSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  parameters: z
    .object({
      layout: z.enum(['padded', 'fullscreen']).optional(),
      backgrounds: z.object({ default: z.string() }).optional(),
      sources: z
        .union([
          z.boolean(),
          z.object({
            extraSources: z.array(z.string()),
          }),
        ])
        .optional(),
    })
    .optional(),
});

/**
 * Схема для дальнейшего отсеивания невалидных story-модулей.
 */
export const StoryModuleSchema = z.object({
  /** React-компонент с примером (`export default ...`). */
  default: z.function(),

  /** Мета-данные из модуля (`export { meta: {} }`). */
  meta: StoryMetaSchema.optional(),

  /** Мета-данные из соответствующего json-файла. */
  metaJson: StoryMetaSchema.optional(),

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
