type FlavorText = {
  flavorText: string
  language: string
}

export type PokemonSpecies = {
  id: number
  name: string
  flavorText: FlavorText
}

export type GetPokemonSpeciesByName = (pokemonName: string) => Promise<PokemonSpecies>
