import * as z from 'zod'

export type ShakespeareanTranslationResponseSchema = z.infer<
  typeof shakespeareanTranslationResponseSchema
>

export const shakespeareanTranslationResponseSchema = z.object({
  success: z.object({ total: z.literal(1) }),
  contents: z.object({
    translated: z.string(),
    text: z.string(),
    translation: z.literal('shakespeare'),
  }),
})
