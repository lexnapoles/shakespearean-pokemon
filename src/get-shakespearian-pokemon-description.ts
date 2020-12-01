import { Either, fromOption } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { notFoundError, ApiError } from './error'
import { GetPokemonSpeciesByName, PokemonSpecies } from './pokemon-species'

type GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName: GetPokemonSpeciesByName
) => (pokemonName: string) => Promise<Either<ApiError, PokemonSpecies>>

export const getShakespearianPokemonDescription: GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName
) => async (pokemonName) => {
  const pokemonSpecies = await getPokemonSpeciesByName(pokemonName)

  return pipe(
    pokemonSpecies,
    fromOption(() => notFoundError('No pokemon found'))
  )
}
