import { Either, left, right } from 'fp-ts/lib/Either'
import got from 'got'
import { InternalError, internalError } from '../../error'
import { shakespearianTranslationResponseSchema } from './shakespearianTranslationResponseSchema'

export type GetShakespearianTranslation = (text: string) => Promise<Either<InternalError, string>>

const translationServiceUrl = 'https://api.funtranslations.com/translate/shakespeare.json'

export const getShakespearianTranslation: GetShakespearianTranslation = async (text) => {
  try {
    const response = await got.get(translationServiceUrl, { searchParams: { text } }).json()

    const parsedResponse = shakespearianTranslationResponseSchema.safeParse(response)

    if (!parsedResponse.success) {
      return left(internalError('Translation was not possible at the moment'))
    }

    const {
      data: {
        contents: { translated: translatedText },
      },
    } = parsedResponse

    return right(translatedText)
  } catch (e) {
    console.error(e)

    return left(internalError('Translation was not possible at the moment'))
  }
}
