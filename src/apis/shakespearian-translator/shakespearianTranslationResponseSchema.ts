import * as z from 'zod'

export type ShakespearianTranslationResponseSchema = z.infer<
  typeof shakespearianTranslationResponseSchema
>

export const shakespearianTranslationResponseSchema = z.object({
  success: z.object({ total: z.literal(1) }),
  contents: z.object({
    translated: z.string(),
    text: z.string(),
    translation: z.literal('shakespeare'),
  }),
})
