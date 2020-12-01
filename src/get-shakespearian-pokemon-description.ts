import { GetPokemonSpeciesByName, PokemonSpecies } from './pokemon-species'

type GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName: GetPokemonSpeciesByName
) => (pokemonName: string) => Promise<PokemonSpecies>

export const getShakespearianPokemonDescription: GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName
) => async (pokemonName) => {
  const pokemonSpecies = await getPokemonSpeciesByName(pokemonName)

  return pokemonSpecies
}
