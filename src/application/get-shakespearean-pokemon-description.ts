import { Either } from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { flow, pipe } from 'fp-ts/lib/function'
import { GetPokemonSpeciesByName } from '../apis/pokemon-api/pokemon-species'
import { GetShakespeareanTranslation } from '../apis/shakespearean-translator'
import { ApiError } from '../common-types'

type Dependencies = {
  getPokemonSpeciesByName: GetPokemonSpeciesByName
  getShakespeareanTranslation: GetShakespeareanTranslation
}

type GetShakespeareanPokemonDescription = ({
  getPokemonSpeciesByName,
  getShakespeareanTranslation,
}: Dependencies) => (pokemonName: string) => Promise<Either<ApiError, string>>

export const getShakespeareanPokemonDescription: GetShakespeareanPokemonDescription = ({
  getPokemonSpeciesByName,
  getShakespeareanTranslation,
}) => async (pokemonName) => {
  const getDescription = pipe(
    getPokemonSpeciesByName(pokemonName),
    TE.chain(flow(({ flavorText }) => flavorText, getShakespeareanTranslation))
  )

  return await getDescription()
}
