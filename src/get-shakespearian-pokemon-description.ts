import { Either } from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'

import { flow, pipe } from 'fp-ts/lib/function'
import { GetPokemonSpeciesByName } from './apis/pokemon-api/pokemon-species'
import { GetShakespearianTranslation } from './apis/shakespearian-translator'
import { ApiError } from './error'

type Dependencies = {
  getPokemonSpeciesByName: GetPokemonSpeciesByName
  getShakespearianTranslation: GetShakespearianTranslation
}

type GetShakespearianPokemonDescription = ({
  getPokemonSpeciesByName,
  getShakespearianTranslation,
}: Dependencies) => (pokemonName: string) => Promise<Either<ApiError, string>>

export const getShakespearianPokemonDescription: GetShakespearianPokemonDescription = ({
  getPokemonSpeciesByName,
  getShakespearianTranslation,
}) => async (pokemonName) => {
  const getDescription = pipe(
    getPokemonSpeciesByName(pokemonName),
    TE.chain(flow(({ flavorText }) => flavorText, getShakespearianTranslation))
  )

  return await getDescription()
}
