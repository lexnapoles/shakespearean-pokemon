import { Either, isLeft } from 'fp-ts/lib/Either'
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
  const pokemonSpecies = await getPokemonSpeciesByName(pokemonName)

  if (isLeft(pokemonSpecies)) {
    return pokemonSpecies
  }

  const {
    right: { flavorText },
  } = pokemonSpecies

  const shakespearianTranslation = await getShakespearianTranslation(flavorText.trim())

  return shakespearianTranslation
}
