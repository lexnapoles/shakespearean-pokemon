import got from 'got'
import * as z from 'zod'

export type GetShakespearianTranslation = (text: string) => Promise<string>

const translationServiceUrl = 'https://api.funtranslations.com/translate/shakespeare.json'

export const getShakespearianTranslation: GetShakespearianTranslation = async (text) => {
  const response = await got.get(translationServiceUrl, { searchParams: { text } }).json()

  const parsedResponse = shakespearianTranslationResponse.safeParse(response)

  if (!parsedResponse.success) {
    return ''
  }

  const {
    data: {
      contents: { translated: translatedText },
    },
  } = parsedResponse

  return translatedText
}

const shakespearianTranslationResponse = z.object({
  success: z.object({ total: z.literal(1) }),
  contents: z.object({
    translated: z.string(),
    text: z.string(),
    translation: z.literal('shakespeare'),
  }),
})
