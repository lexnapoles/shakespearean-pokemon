import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

import * as TE from 'fp-ts/lib/TaskEither'

import got from 'got'
import { InternalError, internalError } from '../../error'
import {
  ShakespearianTranslationResponseSchema,
  shakespearianTranslationResponseSchema,
} from './shakespearianTranslationResponseSchema'

export type GetShakespearianTranslation = (text: string) => TE.TaskEither<InternalError, string>

const translationServiceUrl = 'https://api.funtranslations.com/translate/shakespeare.json'

export const getShakespearianTranslation: GetShakespearianTranslation = (text) => {
  return pipe(
    TE.tryCatch(
      () => got.get(translationServiceUrl, { searchParams: { text } }).json(),
      (error) => `Translation was not possible at the moment: ${(error as Error).message}`
    ),
    TE.chainEitherKW(parseResponse),
    TE.bimap(
      (error) => internalError(error),
      ({ contents: { translated: translatedText } }) => translatedText
    )
  )
}

const parseResponse = (
  response: unknown
): E.Either<string, ShakespearianTranslationResponseSchema> => {
  const parsedResponse = shakespearianTranslationResponseSchema.safeParse(response)

  return parsedResponse.success ? E.right(parsedResponse.data) : E.left('Parsing failed')
}
