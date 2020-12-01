import { Either, fromOption } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { notFoundError, NotFoundError } from './error'
import { GetPokemonSpeciesByName, PokemonSpecies } from './pokemon-species'

type GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName: GetPokemonSpeciesByName
) => (pokemonName: string) => Promise<Either<NotFoundError, PokemonSpecies>>

export const getShakespearianPokemonDescription: GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName
) => async (pokemonName) => {
  const pokemonSpecies = await getPokemonSpeciesByName(pokemonName)

  return pipe(
    pokemonSpecies,
    fromOption(() => notFoundError('No pokemon found'))
  )
}
