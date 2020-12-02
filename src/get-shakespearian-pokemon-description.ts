import { Either, fromOption } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
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
}: Dependencies) => (pokemonName: string) => Promise<Either<ApiError, PokemonSpecies>>

export const getShakespearianPokemonDescription: GetShakespearianPokemonDescription = ({
  getPokemonSpeciesByName,
  getShakespearianTranslation,
}) => async (pokemonName) => {
  const pokemonSpecies = await getPokemonSpeciesByName(pokemonName)

  return pipe(
    pokemonSpecies,
    fromOption(() => notFoundError('No pokemon found'))
  )
}
