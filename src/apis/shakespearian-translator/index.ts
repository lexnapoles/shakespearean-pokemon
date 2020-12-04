import got from 'got'
import { shakespearianTranslationResponseSchema } from './shakespearianTranslationResponseSchema'

export type GetShakespearianTranslation = (text: string) => Promise<string>

const translationServiceUrl = 'https://api.funtranslations.com/translate/shakespeare.json'

export const getShakespearianTranslation: GetShakespearianTranslation = async (text) => {
  const response = await got.get(translationServiceUrl, { searchParams: { text } }).json()

  const parsedResponse = shakespearianTranslationResponseSchema.safeParse(response)

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
