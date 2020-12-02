import { Either, left, right } from 'fp-ts/lib/Either'
import { isNone } from 'fp-ts/lib/Option'
import { notFoundError, ApiError } from './error'
import { GetPokemonSpeciesByName, PokemonSpecies } from './pokemon-species'
import { GetShakespearianTranslation } from './shakespearian-translator'

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
    value: {
      flavorText: { flavorText },
    },
  } = pokemonSpecies

  const shakespearianTranslation = await getShakespearianTranslation(flavorText)

  return right(shakespearianTranslation)
}
