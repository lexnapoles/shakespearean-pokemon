type FlavorText = {
  flavorText: string
  language: string
}

export type PokemonSpecies = {
  id: number
  name: string
  flavorText: FlavorText
}

type GetPokemonSpeciesByName = (pokemonName: string) => Promise<PokemonSpecies>

type GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName: GetPokemonSpeciesByName
) => (pokemonName: string) => Promise<PokemonSpecies>

export const getShakespearianPokemonDescription: GetShakespearianPokemonDescription = (
  getPokemonSpeciesByName
) => async (pokemonName) => {
  const pokemonSpecies = await getPokemonSpeciesByName(pokemonName)

  return pokemonSpecies
}
