import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'

import * as TE from 'fp-ts/lib/TaskEither'

import got from 'got'
import { ApiError, internalError } from '../../error'
import {
  ShakespeareanTranslationResponseSchema,
  shakespeareanTranslationResponseSchema,
} from './shakespearean-translation-response-schema'

export type GetShakespeareanTranslation = (text: string) => TE.TaskEither<ApiError, string>

const translationServiceUrl = 'https://api.funtranslations.com/translate/shakespeare.json'

export const getShakespeareanTranslation: GetShakespeareanTranslation = (text) => {
  return pipe(
    TE.tryCatch(
      () => got.get(translationServiceUrl, { searchParams: { text } }).json(),
      () => internalError(`Translation was not possible at the moment`)
    ),
    TE.chainEitherKW(
      flow(
        parseResponse,
        E.mapLeft(() => internalError(`Translation was not possible at the moment`))
      )
    ),
    TE.map(({ contents: { translated: translatedText } }) => translatedText)
  )
}

const parseResponse = (
  response: unknown
): E.Either<string, ShakespeareanTranslationResponseSchema> => {
  const parsedResponse = shakespeareanTranslationResponseSchema.safeParse(response)

  return parsedResponse.success ? E.right(parsedResponse.data) : E.left('Parsing failed')
}