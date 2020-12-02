import { Either, left, right } from 'fp-ts/lib/Either'
import { isNone } from 'fp-ts/lib/Option'
import { GetPokemonSpeciesByName } from './apis/pokemon-api/pokemon-species'
import { GetShakespearianTranslation } from './apis/shakespearian-translator'
import { notFoundError, ApiError } from './error'

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
  const pokemonSpecies = await getPokemonSpeciesByName(pokemonName)

  if (isNone(pokemonSpecies)) {
    return left(notFoundError('No pokemon found'))
  }

  const {
    value: { flavorText },
  } = pokemonSpecies

  const shakespearianTranslation = await getShakespearianTranslation(flavorText)

  return right(shakespearianTranslation)
}
